import asyncio
import os
import sys
from motor.motor_asyncio import AsyncIOMotorClient

# Add src to the path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from src.core.config import config

async def init_db():
    print(f"Connecting to MongoDB at {config.MONGODB_URL}...")
    client = AsyncIOMotorClient(config.MONGODB_URL)
    
    db = client["hive_mind"]

    print(f"Using database: {db.name}")

    # 1. Users collection
    users = db["users"]
    await users.delete_many({}) # Clear existing
    await users.insert_one({
        "userID": config.NODE_UUID,
        "is_active": True,
        "current_job_id": None,
        "capabilities": ["CPU", "GPU", "RAM"],
        "mind_credits": 2450.0,
        "hive_coins": 12800.0,
        "created_at": "2024-03-20T10:00:00.000Z",
        "last_seen_at": "2024-03-31T09:00:00.000Z"
    })
    print("Seeded 'users' collection.")

    # 2. System Specs collection
    system_specs = db["system_specs"]
    await system_specs.delete_many({})
    await system_specs.insert_one({
        "id": "spec-local-01",
        "userID": config.NODE_UUID,
        "os": "Windows 11 Pro",
        "cpu": "Intel i9-13900K",
        "cpu_cores_physical": 24,
        "cpu_cores_logical": 32,
        "ram_gb": 32.0,
        "gpu": "RTX 4080"
    })
    print("Seeded 'system_specs' collection.")

    # 3. Node Insights collection
    node_insights = db["node_insights"]
    await node_insights.delete_many({})
    # Insert for our node
    await node_insights.insert_one({
        "id": "insight-local-01",
        "userID": config.NODE_UUID,
        "utilization_percent": 45.5,
        "active_time_seconds": 36000,
        "cpu_utilization_percent": 34.0,
        "ram_utilization_percent": 51.0,
        "gpu_utilization_percent": 67.0,
        "running_tasks": 3,
        "extra_metrics": {"temp": 68, "fan_speed": 45}
    })
    # Add some other nodes for the dashboard
    await node_insights.insert_many([
        {
            "id": "insight-remote-01",
            "userID": "node-77a2",
            "utilization_percent": 88.0,
            "active_time_seconds": 120000,
            "cpu_utilization_percent": 85.0,
            "ram_utilization_percent": 64.0,
            "gpu_utilization_percent": 92.0,
            "running_tasks": 12,
            "extra_metrics": {"temp": 72}
        },
        {
            "id": "insight-remote-02",
            "userID": "node-22c9",
            "utilization_percent": 25.0,
            "active_time_seconds": 86400,
            "cpu_utilization_percent": 42.0,
            "ram_utilization_percent": 38.0,
            "gpu_utilization_percent": 0.0,
            "running_tasks": 1,
            "extra_metrics": {"temp": 55}
        }
    ])
    print("Seeded 'node_insights' collection.")

    # 4. Jobs collection
    jobs = db["jobs"]
    await jobs.delete_many({})
    await jobs.insert_many([
        {
            "id": "job-9412",
            "name": "LLM Fine-tuning (Research)",
            "submitter": "ai_lab_01",
            "status": "RUNNING",
            "assigned_node_id": "node-77a2",
            "progress": 68,
            "type": "AI Training",
            "description": "Fine-tuning a Llama-3 8B model on specialized medical datasets.",
            "started_at": "2024-03-20 14:30",
            "duration": "18h 42m",
            "cpu": 85,
            "gpu": 92,
            "ram": 64
        },
        {
            "id": "job-8821",
            "name": "Climate Simulation v4",
            "submitter": "meteo_group",
            "status": "PENDING",
            "assigned_node_id": None,
            "progress": 0,
            "type": "Simulation",
            "description": "High-resolution climate modeling for atmospheric simulation.",
            "started_at": "-",
            "duration": "< 1h",
            "cpu": 0,
            "gpu": 0,
            "ram": 0
        },
        {
            "id": "job-7210",
            "name": "Genome Sequencing",
            "submitter": "bio_genetics",
            "status": "RUNNING",
            "assigned_node_id": "node-22c9",
            "progress": 42,
            "type": "Data Processing",
            "description": "Processing raw DNA sequences for variant analysis.",
            "started_at": "2024-03-20 16:15",
            "duration": "6h 12m",
            "cpu": 72,
            "gpu": 0,
            "ram": 48
        }
    ])
    print("Seeded 'jobs' collection.")

    print("Success: Database initialized with mock data.")

if __name__ == "__main__":
    asyncio.run(init_db())
