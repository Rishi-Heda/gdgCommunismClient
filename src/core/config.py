import os
import psutil
from pydantic_settings import BaseSettings, SettingsConfigDict
from urllib.parse import urlparse

_total_logical_cores = psutil.cpu_count(logical=True)
_safe_cpu_limit = round(_total_logical_cores * 0.75, 1)
if _safe_cpu_limit < 1.0:
    _safe_cpu_limit = 1.0

_total_ram_gb = psutil.virtual_memory().total / (1024 ** 3)
_safe_ram_gb = max(1.0, round(_total_ram_gb - 2.0, 1))


class Settings(BaseSettings):
    APP_NAME: str = "Decentralized Compute Node"
    VERSION: str = "1.0.0"

    MASTER_SERVER_URL: str = os.getenv("MASTER_SERVER_URL", "http://localhost:8000")
    LOCAL_DASHBOARD_HOST: str = os.getenv("LOCAL_DASHBOARD_HOST", "127.0.0.1")
    LOCAL_DASHBOARD_PORT: int = int(os.getenv("LOCAL_DASHBOARD_PORT", "8001"))
    NODE_UUID: str = os.getenv("NODE_UUID", "node-demo-001")
    API_KEY: str = os.getenv("API_KEY", "")
    JOB_CLIENT_API_KEY: str = os.getenv("JOB_CLIENT_API_KEY", "")
    NODE_REGISTRATION_KEY: str = os.getenv("NODE_REGISTRATION_KEY", "")
    NODE_TOKEN: str = os.getenv("NODE_TOKEN", "")
    TCP_TRANSPORT_TIMEOUT_SECONDS: int = int(os.getenv("TCP_TRANSPORT_TIMEOUT_SECONDS", "60"))
    TCP_TRANSPORT_HOST_OVERRIDE: str = os.getenv("TCP_TRANSPORT_HOST_OVERRIDE", "")
    DEFAULT_DOCKER_IMAGE: str = os.getenv("DEFAULT_DOCKER_IMAGE", "python:3.11-slim")

    IDLE_TIME_REQUIRED_SECONDS: int = 20
    MAX_IDLE_CPU_PERCENT: float = 30.0

    MAX_CPU_CORES_TO_DONATE: float = _safe_cpu_limit
    MAX_RAM_GB_TO_DONATE: str = f"{_safe_ram_gb}g"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


config = Settings()


def master_server_host() -> str:
    parsed = urlparse(config.MASTER_SERVER_URL)
    return parsed.hostname or "localhost"
