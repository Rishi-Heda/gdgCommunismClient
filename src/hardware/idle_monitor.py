import asyncio
import time
import psutil

from src.core.state_manager import (
    AppMode, 
    EngineStatus, 
    get_full_system_state,
    update_engine
)
from src.core.config import config

_cpu_low_start_timestamp = None

async def start_idle_monitor_loop():
    global _cpu_low_start_timestamp
    print("📊 CPU Monitor Started (Listening for idle states).")
    
    psutil.cpu_percent(interval=None)
    
    while True:
        state = get_full_system_state()
        app_mode = state["app_mode"]
        engine_status = state["engine_status"]
        
        if app_mode == AppMode.DONATE.value:
            if engine_status in [EngineStatus.WAITING.value, EngineStatus.READY.value]:
                
                current_cpu = psutil.cpu_percent(interval=None)
                
                if _cpu_low_start_timestamp:
                    seconds_left = max(0, config.IDLE_TIME_REQUIRED_SECONDS - (time.time() - _cpu_low_start_timestamp))
                    print(f"🔍 X-RAY: CPU @ {current_cpu}% | Target: <{config.MAX_IDLE_CPU_PERCENT}% | Countdown: {seconds_left:.0f}s")
                else:
                    print(f"🚫 X-RAY: CPU @ {current_cpu}% | Target: <{config.MAX_IDLE_CPU_PERCENT}% | Status: Too high to start timer.")
                
                if current_cpu > config.MAX_IDLE_CPU_PERCENT:
                    _cpu_low_start_timestamp = None
                    
                    if engine_status == EngineStatus.READY.value:
                        await update_engine(EngineStatus.WAITING)
                else:
                    if _cpu_low_start_timestamp is None:
                        _cpu_low_start_timestamp = time.time()
                        
                    cpu_resting_seconds = time.time() - _cpu_low_start_timestamp
                    
                    if cpu_resting_seconds >= config.IDLE_TIME_REQUIRED_SECONDS:
                        if engine_status == EngineStatus.WAITING.value:
                            print(f"💤 CPU continuously below {config.MAX_IDLE_CPU_PERCENT}% for {config.IDLE_TIME_REQUIRED_SECONDS}s. READY!")
                            await update_engine(EngineStatus.READY)
                            
            else:
                _cpu_low_start_timestamp = None
        else:
            _cpu_low_start_timestamp = None
                    
        await asyncio.sleep(2)
