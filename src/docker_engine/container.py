import asyncio
from pathlib import Path, PurePosixPath

import docker

from src.core.config import config
from src.core.state_manager import AppMode, EngineStatus, get_full_system_state, update_engine
from src.storage.file_manager import INPUTS_DIR, OUTPUTS_DIR

try:
    docker_client = docker.from_env()
except Exception as e:
    print(f"Failed to connect to Docker. Is Docker Desktop running? Error: {e}")
    docker_client = None


def _find_python_entrypoint() -> Path | None:
    """Find the first Python file inside the extracted task inputs."""
    python_files = sorted(INPUTS_DIR.rglob("*.py"))
    return python_files[0] if python_files else None


def _write_container_logs(container, task_id: str) -> None:
    """Persist container stdout/stderr into the outputs directory."""
    OUTPUTS_DIR.mkdir(parents=True, exist_ok=True)
    logs_path = OUTPUTS_DIR / f"{task_id}_container.log"

    try:
        log_bytes = container.logs(stdout=True, stderr=True)
        logs_path.write_text(log_bytes.decode("utf-8", errors="replace"), encoding="utf-8")
        print(f"Saved execution logs to {logs_path}.")
    except Exception as e:
        print(f"Failed to save container logs: {e}")


async def execute_task(task_id: str, docker_image: str):
    """
    Pulls the task image, runs the downloaded Python entrypoint from /app/inputs,
    and captures its logs into /app/outputs for archiving.
    """
    if not docker_client:
        print("Docker not available. Cannot execute task.")
        return

    entrypoint = _find_python_entrypoint()
    if not entrypoint:
        print("No Python files were found in the downloaded inputs. Cannot execute task.")
        await update_engine(EngineStatus.OFFLINE)
        return

    container_script_path = PurePosixPath("/app/inputs") / entrypoint.relative_to(INPUTS_DIR).as_posix()

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

    nano_cpus_limit = int(config.MAX_CPU_CORES_TO_DONATE * 1e9)

    try:
        container = docker_client.containers.run(
            image=docker_image,
            detach=True,
            command=["python", str(container_script_path)],
            working_dir="/app/inputs",
            environment={"PYTHONUNBUFFERED": "1"},
            nano_cpus=nano_cpus_limit,
            mem_limit=config.MAX_RAM_GB_TO_DONATE,
            volumes={
                str(OUTPUTS_DIR.absolute()): {"bind": "/app/outputs", "mode": "rw"},
                str(INPUTS_DIR.absolute()): {"bind": "/app/inputs", "mode": "ro"},
            },
        )

        await update_engine(EngineStatus.COMPUTING, task_id=task_id)

        while True:
            container.reload()

            if container.status == "exited":
                exit_code = container.attrs["State"]["ExitCode"]
                if exit_code == 0:
                    print(f"Task {task_id} completed successfully!")
                else:
                    print(f"Task {task_id} failed with exit code {exit_code}.")
                break

            current_state = get_full_system_state()
            if current_state["engine_status"] == EngineStatus.ABORTING.value:
                print("Graceful Disconnect Triggered! Sending SIGTERM to container...")
                container.kill(signal="SIGTERM")
                await asyncio.sleep(5)
                break

            await asyncio.sleep(2)

    except Exception as e:
        print(f"Container execution error: {e}")
    finally:
        if "container" in locals():
            _write_container_logs(container, task_id)

        print("Cleaning up Docker container...")
        try:
            container.remove(force=True)
        except Exception:
            pass

        final_state = get_full_system_state()
        next_status = (
            EngineStatus.WAITING
            if final_state["app_mode"] == AppMode.DONATE.value
            else EngineStatus.OFFLINE
        )
        await update_engine(next_status)
