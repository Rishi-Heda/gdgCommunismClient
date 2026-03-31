import docker
from typing import List

# Use the same client setup as container.py
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
        # Get all running containers
        containers = docker_client.containers.list()
        
        if not containers:
            return ["No active tasks running."]
            
        # Assuming we only run one task at a time, grab the first one
        active_container = containers[0]
        
        # Fetch the logs (returns a byte string)
        log_bytes = active_container.logs(tail=tail, stdout=True, stderr=True)
        
        # Decode and split into a list of strings
        log_lines = log_bytes.decode('utf-8').split('\n')
        
        # Remove empty lines
        return [line for line in log_lines if line.strip()]
        
    except Exception as e:
        return [f"Error reading logs: {e}"]