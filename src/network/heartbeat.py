import asyncio
import psutil
import time

from src.core.config import config
from src.core.state_manager import get_full_system_state, AppMode, EngineStatus
from src.network.client import http_client
from src.docker_engine.telemetry import get_latest_container_logs

async def start_heartbeat_loop():
    """
    Asynchronous background loop that pings the Master Server every 10 seconds.
    Acts as the 'Dead Man's Switch' for fault tolerance.
    """
    print("💓 Network Heartbeat Started.")
    
    # Wait a moment on boot before pinging
    await asyncio.sleep(5)
    
    while True:
        try:
            state = get_full_system_state()
            app_mode = state["app_mode"]
            engine_status = state["engine_status"]
            active_task_id = state.get("active_task_id")
            
            # We only need to send detailed heartbeats if the app is in DONATE mode
            if app_mode == AppMode.DONATE.value:
                
                # Gather live telemetry
                payload = {
                    "node_uuid": config.NODE_UUID,
                    "engine_status": engine_status,
                    "current_cpu_percent": psutil.cpu_percent(interval=None),
                    "timestamp": time.time(),
                }
                
                # If we are actively computing, attach the latest AI logs
                if engine_status == EngineStatus.COMPUTING.value and active_task_id:
                    payload["active_task_id"] = active_task_id
                    payload["latest_logs"] = get_latest_container_logs(tail=10)
                
                # Send the heartbeat to the Master Server
                # (Fire and forget, we don't need to parse the response)
                await http_client.post(f"/api/nodes/{config.NODE_UUID}/heartbeat", json=payload)
                
        except Exception as e:
            # If the internet drops, the heartbeat fails silently here.
            # The Master Server's Redis TTL will naturally expire if it doesn't 
            # receive this ping within 30 seconds.
            pass
            
        # Wait 10 seconds before the next ping
        await asyncio.sleep(10)