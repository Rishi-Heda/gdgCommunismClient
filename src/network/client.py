import asyncio
import hashlib
import json
import ipaddress
import socket
import zipfile
from pathlib import Path
from typing import Any, Dict, Optional

import httpx

from src.core.config import config, master_server_host
from src.hardware.detectors import get_hardware_specs
from src.storage.file_manager import INPUTS_DIR

http_client = httpx.AsyncClient(
    base_url=config.MASTER_SERVER_URL,
    timeout=30.0,
)


def _extract_node_token(payload: Any) -> Optional[str]:
    if isinstance(payload, dict):
        for key in ("auth_token", "node_token", "token"):
            value = payload.get(key)
            if isinstance(value, str) and value.strip():
                return value.strip()

        node_obj = payload.get("node")
        if isinstance(node_obj, dict):
            for key in ("auth_token", "node_token", "token"):
                value = node_obj.get(key)
                if isinstance(value, str) and value.strip():
                    return value.strip()

        data_obj = payload.get("data")
        if isinstance(data_obj, dict):
            for key in ("auth_token", "node_token", "token"):
                value = data_obj.get(key)
                if isinstance(value, str) and value.strip():
                    return value.strip()

    if isinstance(payload, list):
        for item in payload:
            token = _extract_node_token(item)
            if token:
                return token

    return None


def _extract_assignment(payload: Any) -> Optional[Dict[str, Any]]:
    if isinstance(payload, dict):
        if payload.get("assigned") is True:
            for key in ("job", "assignment", "task"):
                value = payload.get(key)
                if isinstance(value, dict):
                    return value

        for key in ("job", "assignment", "task"):
            value = payload.get(key)
            if isinstance(value, dict) and (value.get("jobID") or value.get("job_id") or value.get("task_id")):
                return value

        if payload.get("jobID") or payload.get("job_id") or payload.get("task_id"):
            return payload

    return None


def _normalize_assignment(task_data: Dict[str, Any]) -> Dict[str, Any]:
    normalized = dict(task_data)
    if "jobID" not in normalized:
        if normalized.get("job_id"):
            normalized["jobID"] = normalized["job_id"]
        elif normalized.get("task_id"):
            normalized["jobID"] = normalized["task_id"]
    return normalized


def _sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def _recv_line(sock: socket.socket) -> Dict[str, Any]:
    buffer = bytearray()
    while True:
        ch = sock.recv(1)
        if not ch:
            raise ConnectionError("Socket closed before newline-delimited JSON frame.")
        if ch == b"\n":
            break
        buffer.extend(ch)
    return json.loads(buffer.decode("utf-8"))


def _send_line(sock: socket.socket, payload: Dict[str, Any]) -> None:
    sock.sendall((json.dumps(payload) + "\n").encode("utf-8"))


def _recv_exact(sock: socket.socket, size: int) -> bytes:
    chunks = []
    remaining = size
    while remaining > 0:
        chunk = sock.recv(remaining)
        if not chunk:
            raise ConnectionError("Socket closed while receiving payload.")
        chunks.append(chunk)
        remaining -= len(chunk)
    return b"".join(chunks)


def _job_headers() -> Dict[str, str]:
    key = config.JOB_CLIENT_API_KEY or config.API_KEY
    return {"x-job-api-key": key} if key else {}


def _node_registration_headers() -> Dict[str, str]:
    if not config.NODE_REGISTRATION_KEY:
        return {}
    return {"x-node-registration-key": config.NODE_REGISTRATION_KEY}


def _node_headers() -> Dict[str, str]:
    if not config.NODE_TOKEN:
        return {}
    return {"x-node-auth-token": config.NODE_TOKEN}


async def discover_tcp_transport() -> Dict[str, Any]:
    payload: Dict[str, Any]
    try:
        response = await http_client.get("/transport/tcp", headers=_job_headers())
        response.raise_for_status()
        payload = response.json()
    except Exception:
        if not config.NODE_TOKEN:
            raise
        node_response = await http_client.get(
            f"/nodes/{config.NODE_UUID}/transport/tcp",
            headers=_node_headers(),
        )
        node_response.raise_for_status()
        payload = node_response.json()

    required = {"host", "port", "protocol_version"}
    missing = required - payload.keys()
    if missing:
        raise RuntimeError(f"Missing TCP fields from server: {sorted(missing)}")

    advertised_host = str(payload["host"]).strip()
    payload["host"] = _normalize_tcp_host(advertised_host)
    return payload


def _normalize_tcp_host(advertised_host: str) -> str:
    if config.TCP_TRANSPORT_HOST_OVERRIDE:
        return config.TCP_TRANSPORT_HOST_OVERRIDE.strip()

    fallback_host = master_server_host()
    lowered = advertised_host.lower()
    if lowered in {"0.0.0.0", "127.0.0.1", "localhost", "::1"}:
        print(
            f"TCP transport advertised unreachable host '{advertised_host}'. "
            f"Using master host '{fallback_host}' instead."
        )
        return fallback_host

    try:
        if ipaddress.ip_address(advertised_host).is_unspecified:
            print(
                f"TCP transport advertised unspecified host '{advertised_host}'. "
                f"Using master host '{fallback_host}' instead."
            )
            return fallback_host
    except ValueError:
        pass

    return advertised_host


def _upload_zip_blocking(tcp_info: Dict[str, Any], artifact_path: Path, *, job_id: str) -> Dict[str, Any]:
    api_key = config.JOB_CLIENT_API_KEY or config.API_KEY
    if not api_key:
        raise ValueError("JOB_CLIENT_API_KEY (or API_KEY) is required for upload.")

    size = artifact_path.stat().st_size
    sha256 = _sha256_file(artifact_path)

    with socket.create_connection((tcp_info["host"], int(tcp_info["port"])), timeout=config.TCP_TRANSPORT_TIMEOUT_SECONDS) as sock:
        _send_line(
            sock,
            {
                "action": "upload_zip",
                "protocol_version": tcp_info["protocol_version"],
                "api_key": api_key,
                "job_id": job_id,
                "size": size,
                "sha256": sha256,
            },
        )
        with artifact_path.open("rb") as f:
            for chunk in iter(lambda: f.read(1024 * 1024), b""):
                sock.sendall(chunk)
        result = _recv_line(sock)
        if not result.get("ok"):
            raise RuntimeError(f"Upload failed: {result}")
        return result


def _download_zip_blocking(tcp_info: Dict[str, Any], *, job_id: str, node_id: str, node_token: str, destination_zip_path: Path) -> Dict[str, Any]:
    with socket.create_connection((tcp_info["host"], int(tcp_info["port"])), timeout=config.TCP_TRANSPORT_TIMEOUT_SECONDS) as sock:
        _send_line(
            sock,
            {
                "action": "download_zip",
                "protocol_version": tcp_info["protocol_version"],
                "job_id": job_id,
                "node_id": node_id,
                "node_token": node_token,
            },
        )
        response = _recv_line(sock)
        if not response.get("ok"):
            raise RuntimeError(f"Download rejected: {response}")

        size = int(response["size"])
        payload = _recv_exact(sock, size)
        destination_zip_path.parent.mkdir(parents=True, exist_ok=True)
        destination_zip_path.write_bytes(payload)
        return response


def _upload_result_zip_blocking(
    tcp_info: Dict[str, Any],
    result_zip_path: Path,
    *,
    job_id: str,
    node_id: str,
    node_token: str,
) -> Dict[str, Any]:
    size = result_zip_path.stat().st_size
    sha256 = _sha256_file(result_zip_path)

    with socket.create_connection((tcp_info["host"], int(tcp_info["port"])), timeout=config.TCP_TRANSPORT_TIMEOUT_SECONDS) as sock:
        _send_line(
            sock,
            {
                "action": "upload_result_zip",
                "protocol_version": tcp_info["protocol_version"],
                "job_id": job_id,
                "node_id": node_id,
                "node_token": node_token,
                "size": size,
                "sha256": sha256,
                "filename": result_zip_path.name,
            },
        )
        with result_zip_path.open("rb") as f:
            for chunk in iter(lambda: f.read(1024 * 1024), b""):
                sock.sendall(chunk)

        result = _recv_line(sock)
        if not result.get("ok"):
            raise RuntimeError(f"Result upload failed: {result}")
        return result


async def register_node() -> bool:
    specs = get_hardware_specs()
    payload = {
        "userID": config.NODE_UUID,
        "system_specs": specs,
        "capabilities": {"python": True, "docker": True},
    }

    try:
        response = await http_client.post("/nodes/register", json=payload, headers=_node_registration_headers())
        response.raise_for_status()
        response_payload = response.json()
        token = _extract_node_token(response_payload)
        if token:
            config.NODE_TOKEN = token
            print(f"Updated node auth token for {config.NODE_UUID} from registration response.")
        else:
            print(
                "Registration succeeded but no auth token was found in the response. "
                "Continuing with existing NODE_TOKEN."
            )
        print(f"Successfully registered node {config.NODE_UUID}.")
        return True
    except Exception as e:
        print(f"Failed to register node: {e}")
        return False


async def send_heartbeat() -> bool:
    try:
        response = await http_client.post(f"/nodes/{config.NODE_UUID}/heartbeat", headers=_node_headers())
        response.raise_for_status()
        return True
    except Exception as e:
        detail = ""
        if hasattr(e, "response") and getattr(e, "response") is not None:
            try:
                detail = f" | body={e.response.text}"
            except Exception:
                pass
        print(f"Failed to send heartbeat: {e}{detail}")
        return False


async def fetch_assignment() -> Optional[Dict[str, Any]]:
    try:
        response = await http_client.get(f"/nodes/{config.NODE_UUID}/assignment", headers=_node_headers())
        response.raise_for_status()
        data = response.json()
        task_data = _extract_assignment(data)
        if task_data:
            normalized_task = _normalize_assignment(task_data)
            print(
                f"Server assigned job {normalized_task.get('jobID')} to node {config.NODE_UUID}. "
                f"Raw assignment payload keys: {sorted(data.keys()) if isinstance(data, dict) else type(data).__name__}"
            )
            return normalized_task
        print(f"No assignment returned for node {config.NODE_UUID}. Payload: {data}")
        return None
    except Exception as e:
        detail = ""
        if hasattr(e, "response") and getattr(e, "response") is not None:
            try:
                detail = f" | body={e.response.text}"
            except Exception:
                pass
        print(f"Failed to fetch assignment: {e}{detail}")
        return None


async def trigger_scheduler() -> Optional[Dict[str, Any]]:
    try:
        response = await http_client.post("/schedule-jobs", headers=_job_headers())
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"Failed to trigger scheduler: {e}")
        return None


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

    artifact_sha256 = _sha256_file(artifact_path)
    payload = {
        "userID": config.NODE_UUID,
        "category": "general",
        "steps": [{"file": "main.py"}],
        "requirements": {
            "cpu_cores": max(int(cpu_cores_required), 1),
            "ram_gb": max(float(ram_gb_required), 1.0),
            "disk_gb": 1,
            "capabilities": ["python", "docker"],
        },
        "artifact_sha256": artifact_sha256,
        "max_runtime_seconds": 3600,
        "max_retries": 1,
    }
    if job_name:
        payload["idempotency_key"] = f"{config.NODE_UUID}-{job_name}"

    response = await http_client.post("/jobs/submit", json=payload, headers=_job_headers())
    response.raise_for_status()
    job = response.json()
    job_id = job.get("jobID")
    if not job_id:
        raise RuntimeError(f"Job submission response missing jobID: {job}")

    tcp_info = await discover_tcp_transport()
    upload_result = await asyncio.to_thread(_upload_zip_blocking, tcp_info, artifact_path, job_id=job_id)
    await trigger_scheduler()

    return {"job_id": job_id, "job_submission": job, "tcp_transport": tcp_info, "upload_result": upload_result}


async def download_assigned_artifact(job_id: str) -> Path:
    if not config.NODE_TOKEN:
        raise RuntimeError("NODE_TOKEN missing. Register node first.")
    tcp_info = await discover_tcp_transport()
    print(f"Downloading artifact for job {job_id} from {tcp_info['host']}:{tcp_info['port']}.")
    destination = INPUTS_DIR / "dataset.zip"
    await asyncio.to_thread(
        _download_zip_blocking,
        tcp_info,
        job_id=job_id,
        node_id=config.NODE_UUID,
        node_token=config.NODE_TOKEN,
        destination_zip_path=destination,
    )
    return destination


async def upload_job_result_bundle(job_id: str, result_bundle_path: Path) -> Dict[str, Any]:
    if not config.NODE_TOKEN:
        raise RuntimeError("NODE_TOKEN missing. Register node first.")
    if not result_bundle_path.exists():
        raise FileNotFoundError(f"Result bundle not found: {result_bundle_path}")

    tcp_info = await discover_tcp_transport()
    print(f"Uploading result bundle for job {job_id} to {tcp_info['host']}:{tcp_info['port']}.")
    return await asyncio.to_thread(
        _upload_result_zip_blocking,
        tcp_info,
        result_bundle_path,
        job_id=job_id,
        node_id=config.NODE_UUID,
        node_token=config.NODE_TOKEN,
    )


async def push_job_update(job_id: str, *, status: str, progress: int = 0, logs: Optional[list[str]] = None, result: Optional[dict] = None, error: Optional[str] = None) -> bool:
    payload = {
        "jobID": job_id,
        "payload": {
            "status": status,
            "progress": progress,
            "logs": logs or [],
            "result": result,
            "error": error,
        },
    }
    try:
        response = await http_client.post(f"/nodes/{config.NODE_UUID}/job-update", json=payload, headers=_node_headers())
        response.raise_for_status()
        return True
    except Exception as e:
        detail = ""
        if hasattr(e, "response") and getattr(e, "response") is not None:
            try:
                detail = f" | body={e.response.text}"
            except Exception:
                pass
        print(f"Failed to push job update: {e}{detail}")
        return False
