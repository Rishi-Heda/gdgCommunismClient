# src/hardware/detectors.py
import platform
import psutil

def get_hardware_specs() -> dict:
    """
    Dynamically reads the host machine's hardware specifications.
    """
    # Get RAM in GB (rounding to 2 decimal places)
    total_ram_bytes = psutil.virtual_memory().total
    total_ram_gb = round(total_ram_bytes / (1024 ** 3), 2)
    
    # Get CPU info
    cpu_cores_physical = psutil.cpu_count(logical=False)
    cpu_cores_logical = psutil.cpu_count(logical=True)
    
    # Optional: GPUtil for NVIDIA GPUs (requires pip install gputil)
    gpu_info = "No GPU detected or GPUtil not installed"
    try:
        import GPUtil
        gpus = GPUtil.getGPUs()
        if gpus:
            # Just grab the first GPU name
            gpu_info = gpus[0].name 
    except ImportError:
        pass

    return {
        "os": platform.system(),
        "cpu": platform.processor() or f"{cpu_cores_logical} Core Processor",
        "cpu_cores_physical": cpu_cores_physical,
        "cpu_cores_logical": cpu_cores_logical,
        "ram_gb": total_ram_gb,
        "gpu": gpu_info
    }