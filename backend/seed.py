import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext
from dotenv import load_dotenv

load_dotenv()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

MONGO_URI = os.getenv("MONGO_URI")
client = AsyncIOMotorClient(MONGO_URI)
db = client["fitness_lab"]

CLASSES = [
    {
        "name": "Strength Training",
        "description": "Build raw muscle and functional strength with compound lifts, progressive overload principles, and expert coaching.",
        "schedule": "MON, THU - 7:30 AM",
        "image_url": "/images/strength_weights.jpg",
    },
    {
        "name": "HIIT",
        "description": "High-intensity interval training designed to torch calories, boost metabolism, and improve cardiovascular endurance.",
        "schedule": "TUE, FRI - 6:00 AM",
        "image_url": "/images/cardio_zone.jpg",
    },
    {
        "name": "Functional Training",
        "description": "Train movements, not muscles. Improve mobility, stability, and real-world athletic performance.",
        "schedule": "WED, SAT - 8:00 AM",
        "image_url": "/images/functional_zone.jpg",
    },
    {
        "name": "Personal Training",
        "description": "One-on-one coaching tailored to your goals, fitness level, and schedule. Maximum results, minimum guesswork.",
        "schedule": "FLEXIBLE TIMING",
        "image_url": "/images/full_gym_overview.jpg",
    },
]

PRICING = [
    {
        "name": "Individual",
        "best_price": False,
        "monthly": "₹2,500/-",
        "quarterly": "₹6,500/-",
        "half_yearly": "₹10,500/-",
        "yearly": "₹15,000/-",
    },
    {
        "name": "Couple",
        "best_price": True,
        "monthly": "₹4,500/-",
        "quarterly": "₹11,000/-",
        "half_yearly": "₹18,000/-",
        "yearly": "₹30,000/-",
    },
    {
        "name": "Gold Personal Training",
        "best_price": True,
        "monthly": "₹7,000/-",
        "quarterly": "₹20,000/-",
        "half_yearly": "₹38,000/-",
        "yearly": "₹70,000/-",
    },
    {
        "name": "Platinum Personal Training",
        "best_price": True,
        "monthly": "₹15,000/-",
        "quarterly": "₹40,000/-",
        "half_yearly": "₹75,000/-",
        "yearly": "₹1,20,000/-",
    },
]

async def seed():
    # Users
    existing = await db["users"].find_one({"email": "admin@thefitnesslab.com"})
    if not existing:
        await db["users"].insert_one({
            "email": "admin@thefitnesslab.com",
            "hashed_password": pwd_context.hash("FitnessLab@2024"),
        })
        print("✓ Admin user created")
    else:
        print("• Admin user already exists, skipping")

    # Classes
    count = await db["classes"].count_documents({})
    if count == 0:
        await db["classes"].insert_many(CLASSES)
        print(f"✓ {len(CLASSES)} classes inserted")
    else:
        print(f"• Classes already seeded ({count} found), skipping")

    # Pricing
    count = await db["pricing"].count_documents({})
    if count == 0:
        await db["pricing"].insert_many(PRICING)
        print(f"✓ {len(PRICING)} pricing packages inserted")
    else:
        print(f"• Pricing already seeded ({count} found), skipping")

    print("\nSeed complete.")

if __name__ == "__main__":
    asyncio.run(seed())
