import asyncio
from enum import Enum
from typing import Optional, Dict, Any
from src.core.config import config


# ==========================================
# 1. State Definitions
# ==========================================

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
    OFFLINE = "offline"             # AppMode is IDLE or REQUEST
    WAITING = "waiting_for_idle"    # AppMode is DONATE, but user is active on PC
    READY = "ready_for_task"        # PC is idle, polling Master Server
    COMPUTING = "computing"         # Docker container is actively running
    ABORTING = "aborting_task"      # User clicked IDLE mid-task; shutting down safely

# ==========================================
# 2. The State Manager Singleton
# ==========================================

class NodeState:
    """
    A centralized, thread-safe state store for the client node.
    """
    def __init__(self):
        self._mode: AppMode = AppMode.IDLE
        self._status: EngineStatus = EngineStatus.OFFLINE
        self._active_task_id: Optional[str] = None
        
        # Asyncio lock prevents race conditions if the UI and background 
        # threads try to change state at the exact same millisecond.
        self._lock = asyncio.Lock()

    async def set_mode(self, new_mode: AppMode) -> None:
        async with self._lock:
            self._mode = new_mode
            # Instantly update engine status based on new mode
            if new_mode == AppMode.DONATE:
                # Donation mode should immediately enter the idle detection flow.
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
                self._active_task_id = None # Clear task ID if we aren't computing

    def get_engine_status(self) -> EngineStatus:
        return self._status
        
    def get_active_task(self) -> Optional[str]:
        return self._active_task_id

    def get_full_state(self) -> Dict[str, Any]:
        """Returns a snapshot of the current state (useful for the local UI dashboard)."""
        return {
            "node_id": config.NODE_UUID,
            "app_mode": self._mode.value,
            "engine_status": self._status.value,
            "active_task_id": self._active_task_id
        }

# ==========================================
# 3. Global Instance & Helper Functions
# ==========================================

# Create a single global instance of the state
_global_state = NodeState()

# Synchronous wrappers for simple reads (matching the main.py provided earlier)
def get_current_state() -> AppMode:
    return _global_state.get_mode()

def get_full_system_state() -> Dict[str, Any]:
    return _global_state.get_full_state()

# Asynchronous wrappers for state mutations
async def set_current_state(mode: AppMode) -> None:
    await _global_state.set_mode(mode)

async def update_engine(status: EngineStatus, task_id: Optional[str] = None) -> None:
    await _global_state.set_engine_status(status, task_id)
