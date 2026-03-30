import asyncio
from pathlib import Path
from typing import Any, Dict, Optional
import zipfile

import aiofiles
import httpx

from src.core.config import config
from src.hardware.detectors import get_hardware_specs

http_client = httpx.AsyncClient(
    base_url=config.MASTER_SERVER_URL,
    timeout=30.0,
)

async def register_node() -> bool:
    """
    Called when the app starts. Registers this machine's hardware with the Master Server.
    """
    payload = {
        "node_uuid": config.NODE_UUID,
        "hardware": get_hardware_specs(),
        "max_cpu_cores": config.MAX_CPU_CORES_TO_DONATE,
        "max_ram_gb": config.MAX_RAM_GB_TO_DONATE,
    }

    try:
        response = await http_client.post("/api/nodes/register", json=payload)
        response.raise_for_status()
        print(f"Successfully registered node {config.NODE_UUID} with Master Server.")
        return True
    except httpx.RequestError as e:
        print(f"Network Error: Could not connect to Master Server -> {e}")
        return False
    except httpx.HTTPStatusError as e:
        print(f"Server rejected registration: {e.response.text}")
        return False

async def fetch_task() -> Optional[Dict[str, Any]]:
    """
    Asks the Master Server if there is any pending work in the Redis FIFO queue.
    """
    try:
        response = await http_client.get(f"/api/nodes/{config.NODE_UUID}/get_work")
        if response.status_code == 200:
            task_data = response.json()
            if task_data.get("task_id"):
                return task_data
        return None
    except Exception:
        return None

async def submit_task_result(task_id: str, zip_file_path: Path) -> bool:
    """
    Uploads the final completed output back to the Master Server.
    """
    print(f"Uploading results for task {task_id}...")
    try:
        with open(zip_file_path, "rb") as f:
            files = {"file": (zip_file_path.name, f, "application/zip")}
            response = await http_client.post(
                f"/api/tasks/{task_id}/complete",
                data={"node_uuid": config.NODE_UUID},
                files=files,
            )
            response.raise_for_status()
            print("Upload successful!")
            return True
    except Exception as e:
        print(f"Failed to upload results: {e}")
        return False

async def abort_task(task_id: str) -> None:
    """
    Called during a Graceful Disconnect. Tells the Master Server to put the
    task back into the queue because the human user returned to their PC.
    """
    try:
        payload = {"node_uuid": config.NODE_UUID, "reason": "graceful_disconnect"}
        await http_client.post(f"/api/tasks/{task_id}/abort", json=payload)
        print(f"Notified Master Server that task {task_id} was aborted.")
    except Exception as e:
        print(f"Failed to notify Master Server of abort: {e}")

async def download_dataset(dataset_url: str, destination_path: Path) -> bool:
    """
    Downloads the zipped dataset/code from the Master Server (or object storage)
    and saves it to the local workspace.
    """
    print(f"Downloading dataset from {dataset_url}...")
    try:
        async with http_client.stream("GET", dataset_url) as response:
            response.raise_for_status()
            destination_path.parent.mkdir(parents=True, exist_ok=True)
            async with aiofiles.open(destination_path, "wb") as f:
                async for chunk in response.aiter_bytes():
                    await f.write(chunk)

        if not zipfile.is_zipfile(destination_path):
            preview = destination_path.read_bytes()[:200].decode("utf-8", errors="replace")
            print(
                "Downloaded payload is not a valid zip file. "
                f"URL: {dataset_url} | Preview: {preview!r}"
            )
            destination_path.unlink(missing_ok=True)
            return False

        print("Download complete.")
        return True
    except Exception as e:
        print(f"Failed to download dataset: {e}")
        destination_path.unlink(missing_ok=True)
        return False
