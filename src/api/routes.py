from pathlib import Path
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

router = APIRouter()


class ModeUpdateRequest(BaseModel):
    mode: AppMode


class SystemStatusResponse(BaseModel):
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
