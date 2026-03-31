import docker
from typing import List

try:
    docker_client = docker.from_env()
except:
    docker_client = None

def get_latest_container_logs(tail: int = 20) -> List[str]:
    """
    Finds the currently running decentralized compute container 
    and grabs the last few lines of its terminal output.
    """
    if not docker_client:
        return ["Docker not connected."]

    try:
        containers = docker_client.containers.list()
        
        if not containers:
            return ["No active tasks running."]
            
        active_container = containers[0]
        
        log_bytes = active_container.logs(tail=tail, stdout=True, stderr=True)
        
        log_lines = log_bytes.decode('utf-8').split('\n')
        
        return [line for line in log_lines if line.strip()]
        
    except Exception as e:
        return [f"Error reading logs: {e}"]