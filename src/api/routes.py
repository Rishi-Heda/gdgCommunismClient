from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any

from src.core.state_manager import (
    AppMode, 
    get_current_state, 
    set_current_state, 
    get_full_system_state
)

# --- NEW IMPORTS ---
from src.hardware.detectors import get_hardware_specs
from src.storage.local_db import get_node_history

router = APIRouter()

# --- Schemas ---
class ModeUpdateRequest(BaseModel):
    mode: AppMode

class SystemStatusResponse(BaseModel):
    app_mode: str
    engine_status: str
    active_task_id: Optional[str] = None
    
class TaskSubmissionRequest(BaseModel):
    docker_image: str
    dataset_url: str
    cpu_cores_required: float
    ram_gb_required: float

# --- Endpoints ---
@router.get("/status", response_model=SystemStatusResponse)
async def get_status():
    state_dict = get_full_system_state()
    return SystemStatusResponse(**state_dict)

@router.post("/mode")
async def update_app_mode(request: ModeUpdateRequest):
    try:
        await set_current_state(request.mode)
        return {
            "message": f"Successfully updated mode to {request.mode.value}",
            "current_state": get_full_system_state()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/tasks/submit")
async def submit_task_to_network(request: TaskSubmissionRequest):
    current_mode = get_current_state()
    if current_mode != AppMode.REQUEST:
        raise HTTPException(status_code=400, detail="Must be in 'request_compute' mode.")
    return {"message": "Task forwarded to network.", "network_task_id": "mock_id"}

# --- UPDATED DYNAMIC ENDPOINT ---
@router.get("/stats")
async def get_node_statistics():
    """
    Fetches live hardware capabilities and historical contribution data from the local disk.
    """
    try:
        hardware_specs = get_hardware_specs()
        node_history = get_node_history()
        
        return {
            "total_tasks_completed": node_history.get("tasks_completed", 0),
            "total_compute_hours_donated": node_history.get("hours_donated", 0.0),
            "credits_earned": node_history.get("credits", 0),
            "current_hardware": hardware_specs
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch stats: {str(e)}")