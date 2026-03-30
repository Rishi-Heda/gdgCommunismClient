import os
import psutil
from pydantic_settings import BaseSettings, SettingsConfigDict

_total_logical_cores = psutil.cpu_count(logical=True)
_safe_cpu_limit = round(_total_logical_cores * 0.75, 1)
if _safe_cpu_limit < 1.0:
    _safe_cpu_limit = 1.0

_total_ram_gb = psutil.virtual_memory().total / (1024 ** 3)
_safe_ram_gb = max(1.0, round(_total_ram_gb - 2.0, 1))


class Settings(BaseSettings):
    APP_NAME: str = "Decentralized Compute Node"
    VERSION: str = "1.0.0"

    MASTER_SERVER_URL: str = os.getenv("MASTER_SERVER_URL", "http://localhost:8080")
    NODE_UUID: str = os.getenv("NODE_UUID", "node-demo-001")
    API_KEY: str = os.getenv("API_KEY", "")
    NODE_TOKEN: str = os.getenv("NODE_TOKEN", "")
    TCP_TRANSPORT_TIMEOUT_SECONDS: int = int(os.getenv("TCP_TRANSPORT_TIMEOUT_SECONDS", "60"))

    IDLE_TIME_REQUIRED_SECONDS: int = 300
    MAX_IDLE_CPU_PERCENT: float = 30.0

    MAX_CPU_CORES_TO_DONATE: float = _safe_cpu_limit
    MAX_RAM_GB_TO_DONATE: str = f"{_safe_ram_gb}g"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


config = Settings()
