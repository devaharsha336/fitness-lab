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
        "description": "One-on-one sessions with our certified personal trainers tailored specifically to your fitness goals. Whether you want to build strength, lose weight, or improve overall health, your trainer designs every workout around you. Get maximum results with expert guidance, form correction, and constant motivation.",
        "schedule": "Flexible Timing",
        "image_url": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80",
    },
    {
        "name": "Body Transformation",
        "description": "A comprehensive 12-week program combining strength training, nutrition coaching, and cardio to completely reshape your physique. Designed for those serious about dramatic, visible change. Track your progress weekly with body composition measurements and adjust the plan as you evolve.",
        "schedule": "Mon, Wed, Fri – 6:00 AM & 6:00 PM",
        "image_url": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&q=80",
    },
    {
        "name": "Weight Loss",
        "description": "A science-backed fat loss program combining high-intensity workouts with metabolic conditioning to burn calories efficiently. Our coaches guide you through every session while monitoring your diet and recovery. Sustainable, healthy weight loss with real, lasting results.",
        "schedule": "Tue, Thu, Sat – 7:00 AM & 7:00 PM",
        "image_url": "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=800&q=80",
    },
    {
        "name": "Weight Gain",
        "description": "Structured muscle-building program for those looking to add lean mass and improve body composition. Combines progressive overload strength training with a personalized calorie and protein plan. Build the physique you've always wanted with expert programming and nutrition support.",
        "schedule": "Mon, Thu – 8:00 AM & 5:00 PM",
        "image_url": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
    },
    {
        "name": "Cardio",
        "description": "High-energy cardio sessions designed to improve cardiovascular endurance, burn fat, and boost your overall stamina. Includes treadmill intervals, cycling, rowing, and aerobic circuits. Perfect for beginners and experienced athletes looking to level up their conditioning.",
        "schedule": "Daily – 6:00 AM & 6:30 PM",
        "image_url": "https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?w=800&q=80",
    },
    {
        "name": "Strength",
        "description": "Progressive strength training focused on compound movements — squats, deadlifts, bench press, and overhead press. Build raw power and muscular endurance with structured periodization and expert coaching. Suitable for all levels from beginners to advanced lifters.",
        "schedule": "Mon, Wed, Fri – 7:30 AM & 7:00 PM",
        "image_url": "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800&q=80",
    },
    {
        "name": "HIIT",
        "description": "High-Intensity Interval Training that alternates between explosive bursts of effort and short recovery periods. Burns maximum calories in minimum time and keeps your metabolism elevated for hours after the session. 45-minute classes that challenge every muscle group.",
        "schedule": "Tue, Fri – 6:00 AM & 7:00 PM",
        "image_url": "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=800&q=80",
    },
    {
        "name": "Circuit Training",
        "description": "Full-body circuit workouts that rotate through multiple exercise stations targeting different muscle groups. Combines strength, endurance, and agility for a complete fitness experience in one session. Great for those who want variety and intensity without long rest periods.",
        "schedule": "Mon, Wed, Sat – 8:00 AM & 6:00 PM",
        "image_url": "https://images.unsplash.com/photo-1571388208497-71bedc66e932?w=800&q=80",
    },
    {
        "name": "Kick Boxing",
        "description": "High-energy kickboxing classes combining martial arts techniques with cardiovascular conditioning. Learn punches, kicks, and combinations while burning serious calories and building core strength. No prior experience needed — just bring your energy.",
        "schedule": "Tue, Thu – 7:00 AM & 7:30 PM",
        "image_url": "https://images.unsplash.com/photo-1555597673-b21d5c935865?w=800&q=80",
    },
    {
        "name": "Hyrox Training",
        "description": "Functional fitness training modeled after the global Hyrox competition format — combining running with functional workout stations like sled pushes, rowing, and burpee broad jumps. Build elite-level endurance and strength simultaneously. Ideal for competitive athletes and fitness enthusiasts.",
        "schedule": "Wed, Sat – 6:30 AM & 5:30 PM",
        "image_url": "https://images.unsplash.com/photo-1533560904424-a0c61dc306fc?w=800&q=80",
    },
    {
        "name": "Yodha Training",
        "description": "Our signature warrior-style training program inspired by ancient Indian martial discipline, blending calisthenics, functional movement, and mental toughness conditioning. Build a resilient body and a warrior mindset through structured progressive challenges. Exclusive to The Fitness Lab.",
        "schedule": "Mon, Thu, Sat – 6:00 AM",
        "image_url": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80",
    },
    {
        "name": "Hybrid Gym",
        "description": "The ultimate blend of strength training and endurance work for those who want to excel at both. Hybrid training cycles between heavy lifting blocks and aerobic conditioning so you never have to choose between being strong and being fit. Train like an elite, perform like an athlete.",
        "schedule": "Tue, Fri, Sun – 7:00 AM & 6:00 PM",
        "image_url": "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&q=80",
    },
    {
        "name": "Group Workouts",
        "description": "Energetic group fitness classes led by motivating coaches in a community atmosphere. Train alongside like-minded people, push each other to new limits, and make fitness a social experience. Classes rotate weekly so you always have something fresh to look forward to.",
        "schedule": "Daily – 7:00 AM & 6:00 PM",
        "image_url": "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80",
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
