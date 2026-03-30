from pydantic import BaseModel, Field
from typing import Optional
from src.core.state_manager import AppMode, EngineStatus

class ModeUpdateRequest(BaseModel):
    """Payload sent by the UI when the user clicks Donate, Request, or Stop."""
    mode: AppMode = Field(..., description="The intended mode of the application.")

class SystemStatusResponse(BaseModel):
    """Payload returned to the UI to update the visual dashboard."""
    app_mode: AppMode
    engine_status: EngineStatus
    active_task_id: Optional[str] = None

class TaskSubmissionRequest(BaseModel):
    """Payload sent when a consumer wants to submit code to the network."""
    docker_image: str = Field(..., example="pytorch/pytorch:latest")
    dataset_url: str = Field(..., example="https://minio.local/datasets/task_12.zip")
    cpu_cores_required: float = Field(..., example=2.0)
    ram_gb_required: float = Field(..., example=4.0)

class NodeStatsResponse(BaseModel):
    """Payload containing local historical statistics."""
    total_tasks_completed: int
    total_compute_hours_donated: float
    credits_earned: int
    current_hardware: dict