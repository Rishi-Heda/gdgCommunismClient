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
from src.network.client import register_node, fetch_task
from src.network.heartbeat import start_heartbeat_loop

from src.hardware.idle_monitor import start_idle_monitor_loop
from src.docker_engine.container import execute_task
from src.storage.file_manager import clean_workspace, extract_inputs, compress_outputs, INPUTS_DIR
from src.network.client import download_dataset, submit_task_result
from src.storage.local_db import increment_task_completed

async def task_polling_engine():
    """
    The heart of the Client Node. Fetches work, manages files,
    executes Docker, and uploads results safely.
    """
    print("Task Polling Engine Started.")

    while True:
        state = get_full_system_state()

        if state["app_mode"] == AppMode.DONATE.value and state["engine_status"] == EngineStatus.READY.value:
            print("Asking Master Server for tasks...")
            task_data = await fetch_task()

            if task_data:
                task_id = task_data.get("task_id")
                docker_image = task_data.get("docker_image")
                dataset_url = task_data.get("dataset_url")

                print(f"Received Task {task_id}. Beginning execution pipeline...")

                clean_workspace()

                zip_path = INPUTS_DIR / "dataset.zip"
                download_success = await download_dataset(dataset_url, zip_path)

                if download_success:
                    extract_success = extract_inputs(zip_path)

                    if extract_success:
                        await execute_task(task_id, docker_image)

                        final_state = get_full_system_state()
                        if final_state["engine_status"] != EngineStatus.ABORTING.value:
                            results_zip_path = compress_outputs(task_id)
                            upload_success = await submit_task_result(task_id, results_zip_path)

                            if upload_success:
                                increment_task_completed(hours_taken=0.5, credits_earned=10)
                                print(f"Pipeline complete for Task {task_id}!")
                    else:
                        print(f"Skipping Task {task_id}: downloaded inputs could not be extracted.")

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
    return {
        "message": "Compute Node Engine is Running",
        "current_state": get_full_system_state(),
        "dashboard_docs": "http://127.0.0.1:8000/docs",
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=False)
