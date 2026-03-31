import asyncio
from enum import Enum
from typing import Optional, Dict, Any


class AppMode(str, Enum):
    """
    Represents the User's Intent. Controlled via the local FastAPI dashboard.
    """
    DONATE = "donate_compute"
    REQUEST = "request_compute"
    IDLE = "do_nothing"

class EngineStatus(str, Enum):
    """
    Represents the Machine's Reality. Controlled by background hardware monitors.
    """
    OFFLINE = "offline"                                         
    WAITING = "waiting_for_idle"                                                 
    READY = "ready_for_task"                                           
    COMPUTING = "computing"                                               
    ABORTING = "aborting_task"                                                        


class NodeState:
    """
    A centralized, thread-safe state store for the client node.
    """
    def __init__(self):
        self._mode: AppMode = AppMode.IDLE
        self._status: EngineStatus = EngineStatus.OFFLINE
        self._active_task_id: Optional[str] = None
        
        self._lock = asyncio.Lock()

    async def set_mode(self, new_mode: AppMode) -> None:
        async with self._lock:
            self._mode = new_mode
            if new_mode == AppMode.DONATE:
                if self._status not in [EngineStatus.COMPUTING, EngineStatus.ABORTING]:
                    self._status = EngineStatus.WAITING
            else:
                if self._status == EngineStatus.COMPUTING:
                    self._status = EngineStatus.ABORTING
                else:
                    self._status = EngineStatus.OFFLINE

    def get_mode(self) -> AppMode:
        return self._mode

    async def set_engine_status(self, new_status: EngineStatus, task_id: Optional[str] = None) -> None:
        async with self._lock:
            self._status = new_status
            if task_id is not None:
                self._active_task_id = task_id
            if new_status in [EngineStatus.OFFLINE, EngineStatus.WAITING, EngineStatus.READY]:
                self._active_task_id = None                                       

    def get_engine_status(self) -> EngineStatus:
        return self._status
        
    def get_active_task(self) -> Optional[str]:
        return self._active_task_id

    def get_full_state(self) -> Dict[str, Any]:
        """Returns a snapshot of the current state (useful for the local UI dashboard)."""
        return {
            "app_mode": self._mode.value,
            "engine_status": self._status.value,
            "active_task_id": self._active_task_id
        }


_global_state = NodeState()

def get_current_state() -> AppMode:
    return _global_state.get_mode()

def get_full_system_state() -> Dict[str, Any]:
    return _global_state.get_full_state()

async def set_current_state(mode: AppMode) -> None:
    await _global_state.set_mode(mode)

async def update_engine(status: EngineStatus, task_id: Optional[str] = None) -> None:
    await _global_state.set_engine_status(status, task_id)
