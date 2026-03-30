import asyncio
import hashlib
import json
import socket
import zipfile
from pathlib import Path
from typing import Any, Dict, Optional

import aiofiles
import httpx

from src.core.config import config
from src.hardware.detectors import get_hardware_specs

http_client = httpx.AsyncClient(
    base_url=config.MASTER_SERVER_URL,
    timeout=30.0,
)


def _auth_headers() -> Dict[str, str]:
    headers: Dict[str, str] = {}
    if config.API_KEY:
        headers["x-api-key"] = config.API_KEY
    if config.NODE_TOKEN:
        headers["x-node-token"] = config.NODE_TOKEN
    return headers


def _sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def _recv_exact(sock: socket.socket, size: int) -> bytes:
    chunks = []
    remaining = size
    while remaining > 0:
        chunk = sock.recv(remaining)
        if not chunk:
            raise ConnectionError("Socket closed while receiving data.")
        chunks.append(chunk)
        remaining -= len(chunk)
    return b"".join(chunks)


def _send_json_frame(sock: socket.socket, payload: Dict[str, Any]) -> None:
    body = json.dumps(payload).encode("utf-8")
    sock.sendall(len(body).to_bytes(8, "big"))
    sock.sendall(body)


def _recv_json_frame(sock: socket.socket) -> Dict[str, Any]:
    header_size = int.from_bytes(_recv_exact(sock, 8), "big")
    body = _recv_exact(sock, header_size)
    return json.loads(body.decode("utf-8"))


def _upload_zip_blocking(
    tcp_info: Dict[str, Any],
    artifact_path: Path,
    *,
    job_id: str,
    api_key: str,
) -> Dict[str, Any]:
    sha256 = _sha256_file(artifact_path)
    file_size = artifact_path.stat().st_size

    with socket.create_connection(
        (tcp_info["host"], int(tcp_info["port"])),
        timeout=config.TCP_TRANSPORT_TIMEOUT_SECONDS,
    ) as sock:
        _send_json_frame(
            sock,
            {
                "action": "upload_zip",
                "protocol_version": tcp_info.get("protocol_version", "1"),
                "api_key": api_key,
                "job_id": job_id,
                "size": file_size,
                "sha256": sha256,
            },
        )

        ack = _recv_json_frame(sock)
        if ack.get("status") not in {"ok", "ready"}:
            raise RuntimeError(f"TCP upload rejected: {ack}")

        with artifact_path.open("rb") as f:
            for chunk in iter(lambda: f.read(1024 * 1024), b""):
                sock.sendall(chunk)

        return _recv_json_frame(sock)


async def register_node() -> bool:
    payload = {
        "node_uuid": config.NODE_UUID,
        "hardware": get_hardware_specs(),
        "max_cpu_cores": config.MAX_CPU_CORES_TO_DONATE,
        "max_ram_gb": config.MAX_RAM_GB_TO_DONATE,
    }

    try:
        response = await http_client.post("/api/nodes/register", json=payload, headers=_auth_headers())
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
    try:
        response = await http_client.get(
            f"/api/nodes/{config.NODE_UUID}/get_work",
            headers=_auth_headers(),
        )
        if response.status_code == 200:
            task_data = response.json()
            if task_data.get("task_id"):
                return task_data
        return None
    except Exception:
        return None


async def discover_tcp_transport() -> Dict[str, Any]:
    response = await http_client.get("/transport/tcp", headers=_auth_headers())
    response.raise_for_status()
    tcp_info = response.json()
    required_keys = {"host", "port", "protocol_version"}
    missing = required_keys - tcp_info.keys()
    if missing:
        raise ValueError(f"TCP transport response missing fields: {sorted(missing)}")
    return tcp_info


async def submit_job_request(
    *,
    artifact_path: Path,
    cpu_cores_required: float,
    ram_gb_required: float,
    job_name: Optional[str] = None,
) -> Dict[str, Any]:
    if not artifact_path.exists():
        raise FileNotFoundError(f"Artifact not found: {artifact_path}")
    if not zipfile.is_zipfile(artifact_path):
        raise ValueError(f"Artifact must be a zip file: {artifact_path}")
    if not config.API_KEY:
        raise ValueError("API_KEY is required in .env for job submission.")

    artifact_sha256 = _sha256_file(artifact_path)
    payload = {
        "cpu_cores_required": cpu_cores_required,
        "ram_gb_required": ram_gb_required,
        "artifact_sha256": artifact_sha256,
    }
    if job_name:
        payload["job_name"] = job_name

    response = await http_client.post("/jobs/submit", json=payload, headers=_auth_headers())
    response.raise_for_status()
    job_data = response.json()
    job_id = job_data.get("job_id")
    if not job_id:
        raise ValueError(f"Job submission response missing job_id: {job_data}")

    tcp_info = await discover_tcp_transport()
    upload_result = await asyncio.to_thread(
        _upload_zip_blocking,
        tcp_info,
        artifact_path,
        job_id=job_id,
        api_key=config.API_KEY,
    )

    return {
        "job_id": job_id,
        "artifact_sha256": artifact_sha256,
        "job_submission": job_data,
        "tcp_transport": tcp_info,
        "upload_result": upload_result,
    }


async def submit_task_result(task_id: str, zip_file_path: Path) -> bool:
    print(f"Uploading results for task {task_id}...")
    try:
        with open(zip_file_path, "rb") as f:
            files = {"file": (zip_file_path.name, f, "application/zip")}
            response = await http_client.post(
                f"/api/tasks/{task_id}/complete",
                data={"node_uuid": config.NODE_UUID},
                files=files,
                headers=_auth_headers(),
            )
            response.raise_for_status()
            print("Upload successful!")
            return True
    except Exception as e:
        print(f"Failed to upload results: {e}")
        return False


async def abort_task(task_id: str) -> None:
    try:
        payload = {"node_uuid": config.NODE_UUID, "reason": "graceful_disconnect"}
        await http_client.post(
            f"/api/tasks/{task_id}/abort",
            json=payload,
            headers=_auth_headers(),
        )
        print(f"Notified Master Server that task {task_id} was aborted.")
    except Exception as e:
        print(f"Failed to notify Master Server of abort: {e}")


async def download_dataset(dataset_url: str, destination_path: Path) -> bool:
    print(f"Downloading dataset from {dataset_url}...")
    try:
        async with http_client.stream("GET", dataset_url, headers=_auth_headers()) as response:
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
