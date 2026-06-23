import asyncio
import hashlib
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

MONGO_URI = os.getenv("MONGO_URI")
client = AsyncIOMotorClient(MONGO_URI, tlsAllowInvalidCertificates=True)
db = client["fitness_lab"]

CLASSES = [
    {
        "name": "Personal Training",
        "description": "One-on-one coaching tailored to your goals, current fitness level, and schedule. Your dedicated trainer designs every session, tracks your progress, and adjusts your plan for maximum results. Flexible timings to fit your lifestyle.",
        "schedule": "FLEXIBLE TIMING",
        "image_url": "/images/full_gym_overview.jpg",
    },
    {
        "name": "Body Transformation",
        "description": "A structured, results-driven program designed to reshape your physique through a combination of strength training, conditioning, and nutrition guidance. Whether you're starting from scratch or breaking through a plateau, this program delivers visible change. Ideal for those committed to a complete lifestyle overhaul.",
        "schedule": "MON, WED, FRI - 7:00 AM",
        "image_url": "/images/strength_weights.jpg",
    },
    {
        "name": "Weight Loss",
        "description": "A calorie-burning, metabolism-boosting program combining cardio, resistance training, and dietary strategy to help you shed fat effectively and sustainably. Each session is designed to maximize energy expenditure while preserving lean muscle mass. Suitable for all fitness levels.",
        "schedule": "TUE, THU, SAT - 6:30 AM",
        "image_url": "/images/cardio_zone.jpg",
    },
    {
        "name": "Weight Gain",
        "description": "A targeted muscle-building program focused on hypertrophy, progressive overload, and structured nutrition to help you gain lean mass efficiently. Includes guided strength sessions with expert coaching on form and recovery. Perfect for those looking to build size and strength simultaneously.",
        "schedule": "MON, WED, FRI - 8:00 AM",
        "image_url": "/images/strength_weights.jpg",
    },
    {
        "name": "Cardio",
        "description": "Improve your heart health, stamina, and endurance with our dedicated cardio program featuring treadmill intervals, cycling, rowing, and more. Sessions are paced for all fitness levels — from beginners building base endurance to athletes pushing their aerobic limits. A perfect foundation for any fitness goal.",
        "schedule": "MON TO SAT - 6:00 AM",
        "image_url": "/images/cardio_zone.jpg",
    },
    {
        "name": "Strength",
        "description": "Build raw power and functional muscle through progressive overload, compound lifts, and structured periodization. Our certified coaches guide you through squat, bench, deadlift, and accessory work suited for beginners and seasoned lifters alike. Expect measurable strength gains within weeks.",
        "schedule": "MON, THU - 7:30 AM",
        "image_url": "/images/strength_weights.jpg",
    },
    {
        "name": "HIIT",
        "description": "High-intensity interval training that torches calories, spikes your metabolism, and builds cardiovascular endurance in shorter sessions. Alternating explosive effort bursts with strategic recovery periods, HIIT is ideal for maximum results in minimum time. No two sessions are the same.",
        "schedule": "TUE, FRI - 6:00 AM",
        "image_url": "/images/cardio_zone.jpg",
    },
    {
        "name": "Circuit Training",
        "description": "Move through a series of resistance and cardio stations designed to build total-body strength and endurance simultaneously. Circuit training keeps your heart rate elevated while targeting multiple muscle groups in a single session. A great option for those who want variety and efficiency.",
        "schedule": "WED, SAT - 7:00 AM",
        "image_url": "/images/functional_zone.jpg",
    },
    {
        "name": "Kick Boxing",
        "description": "Combine martial arts techniques with high-energy conditioning to build strength, coordination, and explosive power. Our kick boxing sessions are designed for fitness — no prior experience required — delivering a full-body workout that's as fun as it is effective.",
        "schedule": "TUE, SAT - 8:00 AM",
        "image_url": "/images/functional_zone.jpg",
    },
    {
        "name": "Hyrox Training",
        "description": "Purpose-built preparation for Hyrox competitions, combining functional fitness stations with running segments to build race-ready endurance and strength. Whether you're a first-timer or a seasoned competitor, our Hyrox program gets you across the finish line faster.",
        "schedule": "MON, THU - 6:30 AM",
        "image_url": "/images/full_gym_overview.jpg",
    },
    {
        "name": "Yodha Training",
        "description": "An intense warrior-style conditioning program inspired by military fitness, combining bodyweight challenges, functional strength, and endurance drills. Yodha training is designed to push your physical and mental limits, building resilience and toughness from the inside out.",
        "schedule": "WED, FRI - 6:00 AM",
        "image_url": "/images/hero_banner.jpg",
    },
    {
        "name": "Hybrid Gym",
        "description": "The best of both worlds — combines strength training and cardio conditioning in a single, efficient program. Hybrid Gym is designed for those who refuse to compromise, building a body that is equally powerful and well-conditioned. Suitable for intermediate to advanced fitness enthusiasts.",
        "schedule": "MON, WED, SAT - 7:00 AM",
        "image_url": "/images/full_gym_overview.jpg",
    },
    {
        "name": "Group Workouts",
        "description": "Train alongside a community of like-minded members in high-energy group sessions led by expert coaches. Group workouts combine motivation, accountability, and structured programming to keep you consistent and progressing. Available across multiple formats and fitness levels.",
        "schedule": "MON TO SAT - 8:00 AM",
        "image_url": "/images/hero_banner.jpg",
    },
]

PRICING = [
    {
        "name": "Individual (1 Person)",
        "best_price": False,
        "monthly": "₹2,500/-",
        "quarterly": "₹7,000/-",
        "half_yearly": "₹10,500/-",
        "yearly": "₹15,000/-",
    },
    {
        "name": "Couple (2 Persons)",
        "best_price": True,
        "monthly": "₹4,500/-",
        "quarterly": "₹11,500/-",
        "half_yearly": "₹20,000/-",
        "yearly": "₹28,000/-",
    },
    {
        "name": "Gold Personal Training (Sharing)",
        "best_price": True,
        "monthly": "₹8,000/-",
        "quarterly": "₹20,000/-",
        "half_yearly": "₹38,000/-",
        "yearly": "₹70,000/-",
    },
    {
        "name": "Platinum One to One Training",
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
            "hashed_password": hash_password("FitnessLab@2024"),
        })
        print("✓ Admin user created")
    else:
        print("• Admin user already exists, skipping")

    # Classes — always replace so program list stays current
    await db["classes"].delete_many({})
    await db["classes"].insert_many(CLASSES)
    print(f"✓ {len(CLASSES)} classes inserted")

    # Pricing — always replace so packages and prices stay current
    await db["pricing"].delete_many({})
    await db["pricing"].insert_many(PRICING)
    print(f"✓ {len(PRICING)} pricing packages inserted")

    print("\nSeed complete.")

if __name__ == "__main__":
    asyncio.run(seed())
