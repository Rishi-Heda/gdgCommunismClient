import asyncio
import json
import zipfile
from datetime import datetime, timezone
from pathlib import Path, PurePosixPath
from typing import Any

import docker
import psutil

from src.core.config import config
from src.core.state_manager import AppMode, EngineStatus, get_full_system_state, update_engine
from src.docker_engine.task_manifest import build_checkpoint_plan, load_context_bundle, load_task_manifest, resolve_execution_steps
from src.storage.file_manager import INPUTS_DIR, OUTPUTS_DIR

try:
    docker_client = docker.from_env()
except Exception as e:
    print(f"Failed to connect to Docker. Is Docker Desktop running? Error: {e}")
    docker_client = None


def _utc_timestamp() -> str:
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")


def _collect_metrics() -> dict[str, Any]:
    metrics = {
        "cpu": psutil.cpu_percent(interval=None),
        "ram": round(psutil.virtual_memory().used / (1024 ** 3), 2),
        "gpu": None,
        "vram": None,
    }

    try:
        import GPUtil

        gpus = GPUtil.getGPUs()
        if gpus:
            metrics["gpu"] = round(gpus[0].load * 100, 2)
            metrics["vram"] = round(gpus[0].memoryUsed / 1024, 2)
    except Exception:
        pass

    return metrics


def _append_event(task_id: str, step: str, event_type: str, message: str, level: str = "info", progress: int = 0, extra: dict[str, Any] | None = None) -> None:
    OUTPUTS_DIR.mkdir(parents=True, exist_ok=True)
    log_path = OUTPUTS_DIR / f"{task_id}_events.jsonl"
    event = {
        "jobID": task_id,
        "nodeID": config.NODE_UUID,
        "timestamp": _utc_timestamp(),
        "level": level,
        "type": event_type,
        "message": message,
        "step": step,
        "progress": progress,
        "metrics": _collect_metrics(),
        "extra": extra or {},
    }
    with log_path.open("a", encoding="utf-8") as f:
        f.write(json.dumps(event) + "\n")


def _write_container_logs(container, task_id: str) -> None:
    OUTPUTS_DIR.mkdir(parents=True, exist_ok=True)
    logs_path = OUTPUTS_DIR / f"{task_id}_container.log"

    try:
        log_bytes = container.logs(stdout=True, stderr=True)
        logs_path.write_text(log_bytes.decode("utf-8", errors="replace"), encoding="utf-8")
        print(f"Saved execution logs to {logs_path}.")
    except Exception as e:
        print(f"Failed to save container logs: {e}")


def _create_checkpoint_snapshot(task_id: str, checkpoint_index: int, step_name: str) -> None:
    checkpoint_dir = OUTPUTS_DIR / "checkpoints"
    checkpoint_dir.mkdir(parents=True, exist_ok=True)
    checkpoint_path = checkpoint_dir / f"checkpoint_{checkpoint_index:03d}.zip"

    with zipfile.ZipFile(checkpoint_path, "w", compression=zipfile.ZIP_DEFLATED) as archive:
        for file_path in OUTPUTS_DIR.rglob("*"):
            if not file_path.is_file():
                continue
            if checkpoint_dir in file_path.parents:
                continue
            archive.write(file_path, file_path.relative_to(OUTPUTS_DIR))

        archive.writestr(
            "checkpoint_metadata.json",
            json.dumps(
                {
                    "jobID": task_id,
                    "step": step_name,
                    "checkpoint_index": checkpoint_index,
                    "timestamp": _utc_timestamp(),
                    "metrics": _collect_metrics(),
                },
                indent=2,
            ),
        )


def _container_script_path(script_path: Path) -> str:
    return str(PurePosixPath("/app/inputs") / script_path.relative_to(INPUTS_DIR).as_posix())


async def _run_step(task_id: str, docker_image: str, step: dict[str, Any], context_bundle: dict[str, Any], progress_base: int, progress_max: int, checkpoint_plan: dict[str, int]) -> None:
    step_name = step["name"]
    script_path = step["script_path"]
    command = ["python", _container_script_path(script_path)]
    nano_cpus_limit = int(config.MAX_CPU_CORES_TO_DONATE * 1e9)
    container = None
    checkpoint_interval = checkpoint_plan.get("interval_seconds", 0)
    checkpoint_count = checkpoint_plan.get("count", 0)
    checkpoints_emitted = 0
    last_checkpoint_at = asyncio.get_running_loop().time()

    _append_event(task_id, step_name, "execution", f"Starting step {step_name}", progress=progress_base)

    try:
        container = docker_client.containers.run(
            image=docker_image,
            detach=True,
            command=command,
            working_dir="/app/inputs",
            environment={
                "PYTHONUNBUFFERED": "1",
                "TASK_CONTEXT_JSON": json.dumps(context_bundle),
                "TASK_STEP_NAME": step_name,
            },
            nano_cpus=nano_cpus_limit,
            mem_limit=config.MAX_RAM_GB_TO_DONATE,
            volumes={
                str(OUTPUTS_DIR.absolute()): {"bind": "/app/outputs", "mode": "rw"},
                str(INPUTS_DIR.absolute()): {"bind": "/app/inputs", "mode": "ro"},
            },
        )

        while True:
            container.reload()

            now = asyncio.get_running_loop().time()
            if checkpoint_interval > 0 and checkpoints_emitted < checkpoint_count and now - last_checkpoint_at >= checkpoint_interval:
                checkpoints_emitted += 1
                last_checkpoint_at = now
                _create_checkpoint_snapshot(task_id, checkpoints_emitted, step_name)
                _append_event(
                    task_id,
                    step_name,
                    "lifecycle",
                    f"Checkpoint {checkpoints_emitted} created",
                    progress=min(progress_max, progress_base + checkpoints_emitted),
                    extra={"checkpoint_index": checkpoints_emitted},
                )

            if container.status == "exited":
                exit_code = container.attrs["State"]["ExitCode"]
                if exit_code != 0:
                    _append_event(
                        task_id,
                        step_name,
                        "error",
                        f"Step {step_name} failed with exit code {exit_code}",
                        level="error",
                        progress=progress_base,
                        extra={"exit_code": exit_code},
                    )
                    raise RuntimeError(f"Step {step_name} failed with exit code {exit_code}")

                _append_event(task_id, step_name, "execution", f"Step {step_name} completed", progress=progress_max)
                return

            current_state = get_full_system_state()
            if current_state["engine_status"] == EngineStatus.ABORTING.value:
                _append_event(task_id, step_name, "lifecycle", "Graceful disconnect requested", level="warning", progress=progress_base)
                container.kill(signal="SIGTERM")
                await asyncio.sleep(5)
                return

            _append_event(task_id, step_name, "system", f"Step {step_name} still running", progress=progress_base)
            await asyncio.sleep(2)

    finally:
        if container is not None:
            _write_container_logs(container, task_id)
            try:
                container.remove(force=True)
            except Exception:
                pass


async def execute_task(task_id: str, docker_image: str):
    """
    Run downloaded Python tasks, optionally following a manifest-defined flow,
    while capturing structured execution logs and checkpoint snapshots.
    """
    if not docker_client:
        print("Docker not available. Cannot execute task.")
        return

    manifest = load_task_manifest(INPUTS_DIR)
    steps = resolve_execution_steps(INPUTS_DIR, manifest)
    if not steps:
        print("No Python files were found in the downloaded inputs. Cannot execute task.")
        await update_engine(EngineStatus.OFFLINE)
        return

    context_bundle = load_context_bundle(INPUTS_DIR, manifest, steps)
    checkpoint_plan = build_checkpoint_plan(manifest)

    print(f"Pulling Docker image: {docker_image}...")
    try:
        docker_client.images.pull(docker_image)
    except Exception as e:
        print(f"Failed to pull image: {e}")
        await update_engine(EngineStatus.OFFLINE)
        return

    print(
        f"Starting Task {task_id} with {config.MAX_CPU_CORES_TO_DONATE} cores and "
        f"{config.MAX_RAM_GB_TO_DONATE} RAM."
    )
    await update_engine(EngineStatus.COMPUTING, task_id=task_id)
    _append_event(task_id, "task", "lifecycle", "Task execution started", extra={"manifest": manifest, "context_keys": list(context_bundle.keys())})

    try:
        total_steps = max(len(steps), 1)
        for index, step in enumerate(steps, start=1):
            progress_base = int(((index - 1) / total_steps) * 100)
            progress_max = int((index / total_steps) * 100)
            await _run_step(task_id, docker_image, step, context_bundle, progress_base, progress_max, checkpoint_plan)

        _append_event(task_id, "task", "lifecycle", "Task execution completed", progress=100)
    except Exception as e:
        _append_event(task_id, "task", "error", str(e), level="error")
        print(f"Container execution error: {e}")
    finally:
        final_state = get_full_system_state()
        next_status = (
            EngineStatus.WAITING
            if final_state["app_mode"] == AppMode.DONATE.value
            else EngineStatus.OFFLINE
        )
        await update_engine(next_status)
