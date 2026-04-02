import motor.motor_asyncio
from src.core.config import config

class MongoDB:
    def __init__(self):
        self.client = None
        self.db = None

    def connect(self):
        if not config.MONGODB_URL:
            print("WARNING: MONGODB_URL not set in .env. Database features will be disabled.")
            return

        try:
            self.client = motor.motor_asyncio.AsyncIOMotorClient(config.MONGODB_URL)
            self.db = self.client["hive_mind"]
            print(f"Connected to MongoDB: {self.db.name}")
        except Exception as e:
            print(f"Failed to connect to MongoDB: {e}")

    def get_collection(self, name: str):
        if self.db is None:
            return None
        return self.db[name]

db_client = MongoDB()
db_client.connect()

async def get_users_collection():
    return db_client.get_collection("users")

async def get_jobs_collection():
    return db_client.get_collection("jobs")

async def get_system_specs_collection():
    return db_client.get_collection("system_specs")

async def get_node_insights_collection():
    return db_client.get_collection("node_insights")
