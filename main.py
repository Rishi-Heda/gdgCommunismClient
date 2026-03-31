import asyncio
import uvicorn
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path

from src.core.state_manager import (
    AppMode,
    EngineStatus,
    get_current_state,
    get_full_system_state,
    set_current_state,
)
from src.core.config import config

from src.api.routes import router as api_router
from src.network.client import (
    download_assigned_artifact,
    fetch_assignment,
    push_job_update,
    register_node,
    upload_job_result_bundle,
)
from src.network.heartbeat import start_heartbeat_loop

from src.hardware.idle_monitor import start_idle_monitor_loop
from src.docker_engine.container import execute_task
from src.storage.file_manager import archive_execution_bundle, clean_workspace, extract_inputs, INPUTS_DIR
from src.storage.local_db import increment_task_completed

async def task_polling_engine():
    """
    The heart of the Client Node. Fetches work, manages files,
    executes Docker, and uploads results safely.
    """
    print("Task Polling Engine Started.")

    while True:
        state = get_full_system_state()

        if state["app_mode"] == AppMode.DONATE.value and state["engine_status"] in {
            EngineStatus.READY.value,
            EngineStatus.WAITING.value,
        }:
            print("Asking server for assignment...")
            task_data = await fetch_assignment()

            if task_data:
                task_id = task_data.get("jobID")
                docker_image = config.DEFAULT_DOCKER_IMAGE

                print(f"Received Task {task_id}. Beginning execution pipeline...")

                clean_workspace()

                await push_job_update(task_id, status="running", progress=5, logs=["Assignment accepted"])
                downloaded_zip_path = None
                execution_ok = False
                upload_result_meta = None

                try:
                    zip_path = await download_assigned_artifact(task_id)
                    downloaded_zip_path = zip_path
                    download_success = True
                except Exception as e:
                    print(f"Failed to download assigned artifact: {e}")
                    download_success = False

                if download_success:
                    extract_success = extract_inputs(zip_path)

                    if extract_success:
                        execution_ok = await execute_task(task_id, docker_image)

                        final_state = get_full_system_state()
                        if final_state["engine_status"] != EngineStatus.ABORTING.value:
                            try:
                                bundle_path = archive_execution_bundle(task_id, source_zip_path=downloaded_zip_path)
                                upload_result_meta = await upload_job_result_bundle(task_id, bundle_path)
                            except Exception as e:
                                print(f"Failed to archive/upload result bundle: {e}")

                            if execution_ok:
                                await push_job_update(
                                    task_id,
                                    status="completed",
                                    progress=100,
                                    logs=["Task completed"],
                                    result={"ok": True, "result_bundle": upload_result_meta},
                                )
                                increment_task_completed(hours_taken=0.5, credits_earned=10)
                                print(f"Pipeline complete for Task {task_id}!")
                            else:
                                await push_job_update(
                                    task_id,
                                    status="failed",
                                    progress=100,
                                    logs=["Task failed"],
                                    error="Execution failed",
                                    result={"result_bundle": upload_result_meta},
                                )
                    else:
                        await push_job_update(task_id, status="failed", progress=100, logs=["Input extraction failed"], error="Extract failed")
                        print(f"Skipping Task {task_id}: downloaded inputs could not be extracted.")
                else:
                    await push_job_update(task_id, status="failed", progress=100, logs=["Artifact download failed"], error="TCP download failed")

                clean_workspace()

            else:
                await asyncio.sleep(5)

        else:
            await asyncio.sleep(2)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Manages startup and shutdown sequences for the node.
    """
    print(f"--- Starting {config.APP_NAME} (Node: {config.NODE_UUID}) ---")

    await set_current_state(AppMode.IDLE)

    is_registered = await register_node()
    if not is_registered:
        print("Warning: Could not register with Master Server on boot. Will keep running, but networking may fail.")

    engine_task = asyncio.create_task(task_polling_engine())
    heartbeat_task = asyncio.create_task(start_heartbeat_loop())
    monitor_task = asyncio.create_task(start_idle_monitor_loop())

    print("Client Node Initialized and Web Dashboard is Live.")

    yield

    print("\nShutting down client node gracefully...")

    engine_task.cancel()
    heartbeat_task.cancel()
    monitor_task.cancel()

    current_state = get_full_system_state()
    if current_state["engine_status"] == EngineStatus.COMPUTING.value:
        print("Node was computing during shutdown! Master server will reassign the task via TTL timeout.")

    print("Goodbye.")

app = FastAPI(
    title=config.APP_NAME,
    description="Local dashboard and background worker for decentralized compute sharing.",
    version=config.VERSION,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")

@app.get("/")
async def root():
    docs_url = f"http://{config.LOCAL_DASHBOARD_HOST}:{config.LOCAL_DASHBOARD_PORT}/docs"
    return {
        "message": "Compute Node Engine is Running",
        "current_state": get_full_system_state(),
        "dashboard_docs": docs_url,
    }

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=config.LOCAL_DASHBOARD_HOST,
        port=config.LOCAL_DASHBOARD_PORT,
        reload=False,
    )
