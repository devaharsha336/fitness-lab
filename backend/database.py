import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

client = AsyncIOMotorClient(MONGO_URI)
db = client["fitness_lab"]

users_collection = db["users"]
classes_collection = db["classes"]
pricing_collection = db["pricing"]
