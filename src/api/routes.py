from pathlib import Path
import random
from typing import Optional

from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from pydantic import BaseModel

from src.core.state_manager import (
    AppMode,
    get_current_state,
    get_full_system_state,
    set_current_state,
)
from src.hardware.detectors import get_hardware_specs
from src.network.client import register_node, send_heartbeat, submit_job_request, trigger_scheduler
from src.storage.file_manager import ARCHIVES_DIR, setup_workspace
from src.storage.local_db import get_node_history
from src.storage.db import (
    get_users_collection,
    get_jobs_collection,
    get_system_specs_collection,
    get_node_insights_collection,
)
from src.core.config import config

router = APIRouter()


class ModeUpdateRequest(BaseModel):
    mode: AppMode


class SystemStatusResponse(BaseModel):
    node_id: str
    app_mode: str
    engine_status: str
    active_task_id: Optional[str] = None


@router.get("/status", response_model=SystemStatusResponse)
async def get_status():
    state_dict = get_full_system_state()
    return SystemStatusResponse(**state_dict)


@router.post("/mode")
async def update_app_mode(request: ModeUpdateRequest):
    try:
        await set_current_state(request.mode)
        if request.mode == AppMode.DONATE:
            await register_node()
            await send_heartbeat()
            await trigger_scheduler()
        return {
            "message": f"Successfully updated mode to {request.mode.value}",
            "current_state": get_full_system_state(),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/tasks/submit")
async def submit_task_to_network(
    cpu_cores_required: float = Form(...),
    ram_gb_required: float = Form(...),
    artifact: UploadFile = File(...),
    job_name: Optional[str] = Form(default=None),
):
    current_mode = get_current_state()
    if current_mode != AppMode.REQUEST:
        raise HTTPException(status_code=400, detail="Must be in 'request_compute' mode.")

    setup_workspace()
    upload_dir = ARCHIVES_DIR / "request_uploads"
    upload_dir.mkdir(parents=True, exist_ok=True)
    artifact_path = upload_dir / (artifact.filename or "job_artifact.zip")

    try:
        contents = await artifact.read()
        artifact_path.write_bytes(contents)

        result = await submit_job_request(
            artifact_path=artifact_path,
            cpu_cores_required=cpu_cores_required,
            ram_gb_required=ram_gb_required,
            job_name=job_name,
        )
        return {"message": "Task forwarded to network.", **result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        artifact_path.unlink(missing_ok=True)


@router.get("/stats")
async def get_node_statistics():
    try:
        hardware_specs = get_hardware_specs()
        node_history = get_node_history()

        return {
            "total_tasks_completed": node_history.get("tasks_completed", 0),
            "total_compute_hours_donated": node_history.get("hours_donated", 0.0),
            "credits_earned": node_history.get("credits", 0),
            "current_hardware": hardware_specs,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch stats: {str(e)}")


@router.get("/wealth")
async def get_wealth():
    try:
        coll = await get_users_collection()
        user = await coll.find_one({"userID": config.NODE_UUID})
        if not user:
            # Fallback if no user found in DB
            return {"hive_coins": 0.0, "mind_credits": 0.0}
        return {
            "hive_coins": user.get("hive_coins", 0.0),
            "mind_credits": user.get("mind_credits", 0.0),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/jobs")
async def list_jobs():
    try:
        coll = await get_jobs_collection()
        cursor = coll.find({}, {"_id": 0})
        jobs_list = await cursor.to_list(length=100)
        return jobs_list
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/jobs/{job_id}")
async def get_job(job_id: str):
    try:
        coll = await get_jobs_collection()
        job = await coll.find_one({"id": job_id}, {"_id": 0})
        if not job:
            raise HTTPException(status_code=404, detail="Job not found")
        return job
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/jobs")
async def create_job(job_data: dict):
    try:
        coll = await get_jobs_collection()
        # Add basic defaults
        new_job = {
            "id": f"job-{random.randint(1000, 9999)}",
            "name": job_data.get("name", "Unnamed Job"),
            "submitter": job_data.get("submitter", "anonymous"),
            "status": "PENDING",
            "assigned_node_id": None,
            "progress": 0,
            "type": job_data.get("type", "Custom"),
            "description": job_data.get("description", ""),
            "started_at": "-",
            "duration": "-",
            "cpu": 0,
            "gpu": 0,
            "ram": 0
        }
        await coll.insert_one(new_job)
        if "_id" in new_job:
            del new_job["_id"]
        return new_job
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/nodes")
async def list_nodes(limit: int = 50, skip: int = 0):
    try:
        insights_coll = await get_node_insights_collection()
        specs_coll = await get_system_specs_collection()

        # Get total count
        total_nodes = await insights_coll.count_documents({})

        # Fetch paginated insights
        insights = await insights_coll.find({}, {"_id": 0}).skip(skip).to_list(length=limit)
        
        jobs_coll = await get_jobs_collection()

        # Merge with specs and derived metrics for each node
        detailed_nodes = []
        for insight in insights:
            uid = insight.get("userID")
            spec = await specs_coll.find_one({"userID": uid}, {"_id": 0})
            
            # Count completed jobs
            jobs_completed = await jobs_coll.count_documents({"assigned_node_id": uid, "status": "COMPLETED"})
            
            # Format uptime
            active_seconds = insight.get("active_time_seconds", 0)
            hours = active_seconds // 3600
            minutes = (active_seconds % 3600) // 60
            uptime_str = f"{hours}h {minutes}m" if hours > 0 else f"{minutes}m"

            node_data = {
                "id": uid,
                "status": "ONLINE" if insight.get("utilization_percent", 0) > 0 else "OFFLINE",
                "location": insight.get("extra_metrics", {}).get("region", "Global/Edge"),
                "jobs_completed": jobs_completed,
                "reputation": f"{4.5 + (min(jobs_completed, 50) / 100):.1f}",
                "uptime": uptime_str,
                "metrics": {
                    "cpu": insight.get("cpu_utilization_percent", 0),
                    "gpu": insight.get("gpu_utilization_percent", 0),
                    "ram": insight.get("ram_utilization_percent", 0),
                },
                "specs": {
                    "cpu": spec.get("cpu", "Unknown") if spec else "Unknown",
                    "gpu": spec.get("gpu", "Unknown") if spec else "Unknown",
                    "ram": f"{spec.get('ram_gb', 0)}GB" if spec else "Unknown",
                }
            }
            detailed_nodes.append(node_data)
            
        return {
            "nodes": detailed_nodes,
            "total": total_nodes
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/activity")
async def get_activity_feed():
    # For now, return some latest events generated from DB or static
    # In a real app, this might come from an 'audit_log' collection
    return [
        {"id": 1, "text": "Network online and database connected.", "time": "Just now", "color": "green"},
        {"id": 2, "text": f"Node {config.NODE_UUID} registered successfully.", "time": "2m ago", "color": "blue"},
    ]


@router.get("/network/stats")
async def get_network_stats():
    try:
        nodes_coll = await get_node_insights_collection()
        jobs_coll = await get_jobs_collection()

        total_nodes = await nodes_coll.count_documents({})
        active_jobs = await jobs_coll.count_documents({"status": "RUNNING"})

        # Placeholder TFLOPS calculation: Average 75 GFLOPS per node
        total_tflops = round((total_nodes * 0.075), 1)

        return {
            "active_nodes": total_nodes,
            "jobs_running": active_jobs,
            "network_total_tflops": f"{total_tflops} TFLOPS"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
