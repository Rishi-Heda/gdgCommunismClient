import os
import psutil
# Notice we added SettingsConfigDict to this import!
from pydantic_settings import BaseSettings, SettingsConfigDict

# ==========================================
# Dynamic Hardware Calculations
# Evaluated once when the application starts
# ==========================================

# Calculate 75% of the host's logical CPU cores
_total_logical_cores = psutil.cpu_count(logical=True)
_safe_cpu_limit = round(_total_logical_cores * 0.75, 1)

# Ensure we always leave at least 1 core for the OS on very weak machines
if _safe_cpu_limit < 1.0:
    _safe_cpu_limit = 1.0

# Calculate safe RAM (Leave exactly 2GB for the OS background tasks)
_total_ram_gb = psutil.virtual_memory().total / (1024 ** 3)
_safe_ram_gb = max(1.0, round(_total_ram_gb - 2.0, 1))

# ==========================================
# Application Settings
# ==========================================

class Settings(BaseSettings):
    # --- Application Info ---
    APP_NAME: str = "Decentralized Compute Node"
    VERSION: str = "1.0.0"
    
    # --- Master Server Details ---
    # These can be overridden by a local .env file
    MASTER_SERVER_URL: str = os.getenv("MASTER_SERVER_URL", "http://localhost:8080")
    NODE_UUID: str = os.getenv("NODE_UUID", "node-demo-001") 
    
    # --- Idle Detection Logic ---
    IDLE_TIME_REQUIRED_SECONDS: int = 300     # Default 5 mins, override in .env
    MAX_IDLE_CPU_PERCENT: float = 30.0        # PC must be below 30% utilization to be "idle"
    
    # --- Docker Safety Limits ---
    # These variables feed directly into the Docker Python SDK
    MAX_CPU_CORES_TO_DONATE: float = _safe_cpu_limit
    MAX_RAM_GB_TO_DONATE: str = f"{_safe_ram_gb}g"

    # --- Pydantic Configuration ---
    # This replaces the old 'class Config:' block and forces it to read your .env file
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

# Instantiate a global settings object to be imported across the app
config = Settings()
