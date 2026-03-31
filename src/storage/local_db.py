import json
import os
from pathlib import Path

DB_FILE_PATH = Path("local_node_stats.json")

def _initialize_db():
    """Creates the JSON file if it doesn't exist."""
    if not DB_FILE_PATH.exists():
        default_data = {
            "tasks_completed": 0,
            "hours_donated": 0.0,
            "credits": 0
        }
        with open(DB_FILE_PATH, "w") as f:
            json.dump(default_data, f, indent=4)

def get_node_history() -> dict:
    """Reads the current history from the JSON file."""
    _initialize_db()
    with open(DB_FILE_PATH, "r") as f:
        return json.load(f)

def increment_task_completed(hours_taken: float, credits_earned: int):
    """
    Your Docker execution script will call this function 
    right after a task successfully finishes.
    """
    _initialize_db()
    with open(DB_FILE_PATH, "r") as f:
        data = json.load(f)
        
    data["tasks_completed"] += 1
    data["hours_donated"] += hours_taken
    data["credits"] += credits_earned
    
    with open(DB_FILE_PATH, "w") as f:
        json.dump(data, f, indent=4)