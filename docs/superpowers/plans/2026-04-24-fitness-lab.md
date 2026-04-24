# The Fitness Lab — Full-Stack Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete full-stack gym website for "The Fitness Lab" with public pages, owner dashboard, FastAPI backend, and MongoDB Atlas database.

**Architecture:** Pure API-driven (Option A) — all public-facing classes and pricing data are fetched from the FastAPI backend at runtime so owner dashboard edits appear live. JWT auth protects all write routes. Frontend on Vercel, backend on Render.

**Tech Stack:** React 18 + Vite + Tailwind CSS (frontend), FastAPI + motor + MongoDB Atlas + python-jose + passlib (backend), react-router-dom v6, no TypeScript.

---

## File Map

### Backend (`fitness-lab/backend/`)
| File | Responsibility |
|------|---------------|
| `requirements.txt` | Python deps |
| `.env.example` | Env var template |
| `database.py` | motor client, collection accessors |
| `models.py` | Pydantic models: UserModel, ClassModel, PricingModel |
| `auth.py` | JWT create/verify, bcrypt hashing, `get_current_user` dep |
| `routes/auth_routes.py` | POST /login, POST /change-password |
| `routes/classes_routes.py` | GET (public), POST/PUT/DELETE (protected) |
| `routes/pricing_routes.py` | GET (public), PUT (protected) |
| `main.py` | FastAPI app, CORS, router mounts |
| `seed.py` | One-time seeder: admin user + 4 classes + 4 pricing rows |

### Frontend (`fitness-lab/frontend/`)
| File | Responsibility |
|------|---------------|
| `package.json` | deps: react, react-dom, react-router-dom, lucide-react |
| `vite.config.js` | Vite config |
| `tailwind.config.js` | Tailwind config with custom colors/fonts |
| `index.html` | HTML shell, Google Fonts link |
| `vercel.json` | SPA rewrite rule |
| `.env.example` | VITE_API_URL template |
| `src/index.css` | CSS variables, base styles |
| `src/main.jsx` | React entry point |
| `src/App.jsx` | Router, routes, ProtectedRoute |
| `src/components/Navbar.jsx` | Sticky nav, scroll transparency, mobile hamburger |
| `src/components/Footer.jsx` | 3-col footer, social links |
| `src/pages/Home.jsx` | Hero + Programs + Facility + Pricing preview + CTA |
| `src/pages/Classes.jsx` | Expanded program cards |
| `src/pages/Gallery.jsx` | Image grid + lightbox modal |
| `src/pages/Pricing.jsx` | Full pricing table + WhatsApp CTA |
| `src/pages/Contact.jsx` | Two-col: info + WhatsApp card |
| `src/pages/OwnerLogin.jsx` | Login form → JWT → redirect |
| `src/dashboard/Dashboard.jsx` | 3-tab dashboard: Programs, Pricing, Account |

---

## Task 1: Backend — requirements.txt + .env.example

**Files:**
- Create: `backend/requirements.txt`
- Create: `backend/.env.example`

- [ ] **Step 1: Create requirements.txt**

```
fastapi
uvicorn
motor
pymongo
python-jose[cryptography]
passlib[bcrypt]
python-dotenv
pydantic
```

Save to `backend/requirements.txt`.

- [ ] **Step 2: Create .env.example**

```
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-key-change-this
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
```

Save to `backend/.env.example`.

- [ ] **Step 3: Create .env from example (developer action)**

Copy `.env.example` to `.env` and fill in real MongoDB Atlas URI and a strong JWT secret.

- [ ] **Step 4: Install dependencies**

```bash
cd fitness-lab/backend
pip install -r requirements.txt
```

Expected: all packages install without error.

- [ ] **Step 5: Commit**

```bash
git -C /Users/devaharsha/fitness-lab add backend/requirements.txt backend/.env.example
git -C /Users/devaharsha/fitness-lab commit -m "feat: backend requirements and env template"
```

---

## Task 2: Backend — database.py

**Files:**
- Create: `backend/database.py`

- [ ] **Step 1: Write database.py**

```python
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
```

- [ ] **Step 2: Verify syntax**

```bash
cd fitness-lab/backend && python -c "import database; print('OK')"
```

Expected: `OK`

- [ ] **Step 3: Commit**

```bash
git -C /Users/devaharsha/fitness-lab add backend/database.py
git -C /Users/devaharsha/fitness-lab commit -m "feat: motor database connection"
```

---

## Task 3: Backend — models.py

**Files:**
- Create: `backend/models.py`

- [ ] **Step 1: Write models.py**

```python
from pydantic import BaseModel, Field
from typing import Optional

class UserModel(BaseModel):
    email: str
    hashed_password: str

class ClassModel(BaseModel):
    name: str
    description: str
    schedule: str
    image_url: str

class ClassUpdateModel(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    schedule: Optional[str] = None
    image_url: Optional[str] = None

class PricingModel(BaseModel):
    name: str
    best_price: bool = False
    monthly: str
    quarterly: str
    half_yearly: str
    yearly: str

class PricingUpdateModel(BaseModel):
    name: Optional[str] = None
    best_price: Optional[bool] = None
    monthly: Optional[str] = None
    quarterly: Optional[str] = None
    half_yearly: Optional[str] = None
    yearly: Optional[str] = None
```

- [ ] **Step 2: Verify**

```bash
cd fitness-lab/backend && python -c "import models; print('OK')"
```

Expected: `OK`

- [ ] **Step 3: Commit**

```bash
git -C /Users/devaharsha/fitness-lab add backend/models.py
git -C /Users/devaharsha/fitness-lab commit -m "feat: pydantic models"
```

---

## Task 4: Backend — auth.py

**Files:**
- Create: `backend/auth.py`

- [ ] **Step 1: Write auth.py**

```python
import os
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("JWT_SECRET", "fallback-secret")
ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def decode_token(token: str) -> dict:
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    return decode_token(credentials.credentials)
```

- [ ] **Step 2: Verify**

```bash
cd fitness-lab/backend && python -c "import auth; print('OK')"
```

Expected: `OK`

- [ ] **Step 3: Commit**

```bash
git -C /Users/devaharsha/fitness-lab add backend/auth.py
git -C /Users/devaharsha/fitness-lab commit -m "feat: JWT auth and bcrypt helpers"
```

---

## Task 5: Backend — routes/

**Files:**
- Create: `backend/routes/__init__.py`
- Create: `backend/routes/auth_routes.py`
- Create: `backend/routes/classes_routes.py`
- Create: `backend/routes/pricing_routes.py`

- [ ] **Step 1: Create routes/__init__.py**

Empty file: `backend/routes/__init__.py`

- [ ] **Step 2: Write auth_routes.py**

```python
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from database import users_collection
from auth import hash_password, verify_password, create_access_token, get_current_user

router = APIRouter()

class LoginRequest(BaseModel):
    email: str
    password: str

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str
    confirm_password: str

@router.post("/login")
async def login(req: LoginRequest):
    user = await users_collection.find_one({"email": req.email})
    if not user or not verify_password(req.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": req.email})
    return {"access_token": token, "token_type": "bearer"}

@router.post("/change-password")
async def change_password(req: ChangePasswordRequest, current_user: dict = Depends(get_current_user)):
    if req.new_password != req.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")
    user = await users_collection.find_one({"email": current_user["sub"]})
    if not user or not verify_password(req.current_password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Current password is incorrect")
    new_hash = hash_password(req.new_password)
    await users_collection.update_one(
        {"email": current_user["sub"]},
        {"$set": {"hashed_password": new_hash}}
    )
    return {"message": "Password updated successfully"}
```

- [ ] **Step 3: Write classes_routes.py**

```python
from fastapi import APIRouter, HTTPException, Depends
from bson import ObjectId
from database import classes_collection
from models import ClassModel, ClassUpdateModel
from auth import get_current_user

router = APIRouter()

def serialize(doc) -> dict:
    doc["id"] = str(doc["_id"])
    del doc["_id"]
    return doc

@router.get("")
async def get_classes():
    classes = await classes_collection.find().to_list(100)
    return [serialize(c) for c in classes]

@router.post("")
async def create_class(cls: ClassModel, _=Depends(get_current_user)):
    result = await classes_collection.insert_one(cls.dict())
    created = await classes_collection.find_one({"_id": result.inserted_id})
    return serialize(created)

@router.put("/{class_id}")
async def update_class(class_id: str, cls: ClassUpdateModel, _=Depends(get_current_user)):
    updates = {k: v for k, v in cls.dict().items() if v is not None}
    if not updates:
        raise HTTPException(status_code=400, detail="No fields to update")
    await classes_collection.update_one({"_id": ObjectId(class_id)}, {"$set": updates})
    updated = await classes_collection.find_one({"_id": ObjectId(class_id)})
    if not updated:
        raise HTTPException(status_code=404, detail="Class not found")
    return serialize(updated)

@router.delete("/{class_id}")
async def delete_class(class_id: str, _=Depends(get_current_user)):
    result = await classes_collection.delete_one({"_id": ObjectId(class_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Class not found")
    return {"message": "Deleted"}
```

- [ ] **Step 4: Write pricing_routes.py**

```python
from fastapi import APIRouter, HTTPException, Depends
from bson import ObjectId
from database import pricing_collection
from models import PricingUpdateModel
from auth import get_current_user

router = APIRouter()

def serialize(doc) -> dict:
    doc["id"] = str(doc["_id"])
    del doc["_id"]
    return doc

@router.get("")
async def get_pricing():
    packages = await pricing_collection.find().to_list(20)
    return [serialize(p) for p in packages]

@router.put("/{pricing_id}")
async def update_pricing(pricing_id: str, pkg: PricingUpdateModel, _=Depends(get_current_user)):
    updates = {k: v for k, v in pkg.dict().items() if v is not None}
    if not updates:
        raise HTTPException(status_code=400, detail="No fields to update")
    await pricing_collection.update_one({"_id": ObjectId(pricing_id)}, {"$set": updates})
    updated = await pricing_collection.find_one({"_id": ObjectId(pricing_id)})
    if not updated:
        raise HTTPException(status_code=404, detail="Package not found")
    return serialize(updated)
```

- [ ] **Step 5: Commit**

```bash
git -C /Users/devaharsha/fitness-lab add backend/routes/
git -C /Users/devaharsha/fitness-lab commit -m "feat: auth, classes, pricing routes"
```

---

## Task 6: Backend — main.py + seed.py

**Files:**
- Create: `backend/main.py`
- Create: `backend/seed.py`

- [ ] **Step 1: Write main.py**

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import auth_routes, classes_routes, pricing_routes

app = FastAPI(title="The Fitness Lab API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_routes.router, prefix="/api/auth", tags=["auth"])
app.include_router(classes_routes.router, prefix="/api/classes", tags=["classes"])
app.include_router(pricing_routes.router, prefix="/api/pricing", tags=["pricing"])

@app.get("/")
async def root():
    return {"status": "The Fitness Lab API is running"}
```

- [ ] **Step 2: Write seed.py**

```python
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
```

- [ ] **Step 3: Start backend and verify**

```bash
cd fitness-lab/backend
uvicorn main:app --reload
```

Open http://localhost:8000 — expected: `{"status": "The Fitness Lab API is running"}`
Open http://localhost:8000/docs — expected: Swagger UI with all routes.

- [ ] **Step 4: Run seed**

```bash
cd fitness-lab/backend
python seed.py
```

Expected output:
```
✓ Admin user created
✓ 4 classes inserted
✓ 4 pricing packages inserted

Seed complete.
```

- [ ] **Step 5: Commit**

```bash
git -C /Users/devaharsha/fitness-lab add backend/main.py backend/seed.py
git -C /Users/devaharsha/fitness-lab commit -m "feat: main app entrypoint and seed script"
```

---

## Task 7: Frontend — Scaffold (package.json, configs, index.html)

**Files:**
- Create: `frontend/package.json`
- Create: `frontend/vite.config.js`
- Create: `frontend/tailwind.config.js`
- Create: `frontend/index.html`
- Create: `frontend/vercel.json`
- Create: `frontend/.env.example`
- Create: `frontend/public/images/.gitkeep`

- [ ] **Step 1: Write package.json**

```json
{
  "name": "fitness-lab-frontend",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.26.2",
    "lucide-react": "^0.446.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.47",
    "tailwindcss": "^3.4.13",
    "vite": "^5.4.8"
  }
}
```

- [ ] **Step 2: Write vite.config.js**

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

- [ ] **Step 3: Write tailwind.config.js**

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        accent: '#E6FF00',
        card: '#111111',
        border: '#222222',
        muted: '#888888',
      },
      fontFamily: {
        heading: ['"Barlow Condensed"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

- [ ] **Step 4: Write index.html**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>The Fitness Lab — Premium Gym in Hyderabad</title>
    <meta name="description" content="The Fitness Lab — Where science meets sweat. Premium fitness experience in Manikonda, Hyderabad." />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800&family=DM+Sans:wght@400;500&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

- [ ] **Step 5: Write vercel.json**

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

- [ ] **Step 6: Write .env.example**

```
VITE_API_URL=https://your-backend.onrender.com
```

- [ ] **Step 7: Create placeholder images folder**

```bash
mkdir -p fitness-lab/frontend/public/images
touch fitness-lab/frontend/public/images/.gitkeep
```

- [ ] **Step 8: Install deps**

```bash
cd fitness-lab/frontend && npm install
```

Expected: node_modules created, no errors.

- [ ] **Step 9: Commit**

```bash
git -C /Users/devaharsha/fitness-lab add frontend/
git -C /Users/devaharsha/fitness-lab commit -m "feat: frontend scaffold — vite, tailwind, package.json"
```

---

## Task 8: Frontend — src/index.css + main.jsx + App.jsx

**Files:**
- Create: `frontend/src/index.css`
- Create: `frontend/src/main.jsx`
- Create: `frontend/src/App.jsx`

- [ ] **Step 1: Write src/index.css**

```css
@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800&family=DM+Sans:wght@400;500&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --bg: #000000;
  --accent: #E6FF00;
  --text-primary: #ffffff;
  --text-muted: #888888;
  --card-bg: #111111;
  --border: #222222;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
}

body {
  background-color: var(--bg);
  color: var(--text-primary);
  font-family: 'DM Sans', sans-serif;
  -webkit-font-smoothing: antialiased;
}

.section-label {
  color: var(--accent);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  font-size: 0.75rem;
  font-family: 'DM Sans', sans-serif;
  font-weight: 500;
}

.section-heading {
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 800;
  text-transform: uppercase;
  color: #ffffff;
  line-height: 1;
}

.fade-in-up {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.fade-in-up.visible {
  opacity: 1;
  transform: translateY(0);
}
```

- [ ] **Step 2: Write src/main.jsx**

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

- [ ] **Step 3: Write src/App.jsx**

```jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Classes from './pages/Classes'
import Gallery from './pages/Gallery'
import Pricing from './pages/Pricing'
import Contact from './pages/Contact'
import OwnerLogin from './pages/OwnerLogin'
import Dashboard from './dashboard/Dashboard'

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('fitness_lab_token')
  return token ? children : <Navigate to="/owner-login" replace />
}

function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/classes" element={<Layout><Classes /></Layout>} />
        <Route path="/gallery" element={<Layout><Gallery /></Layout>} />
        <Route path="/pricing" element={<Layout><Pricing /></Layout>} />
        <Route path="/contact" element={<Layout><Contact /></Layout>} />
        <Route path="/owner-login" element={<OwnerLogin />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}
```

- [ ] **Step 4: Verify dev server starts**

```bash
cd fitness-lab/frontend && npm run dev
```

Expected: Vite starts on http://localhost:5173. Browser shows blank page (no components yet) without console errors.

- [ ] **Step 5: Commit**

```bash
git -C /Users/devaharsha/fitness-lab add frontend/src/
git -C /Users/devaharsha/fitness-lab commit -m "feat: React entry, routing, and base CSS"
```

---

## Task 9: Frontend — Navbar.jsx

**Files:**
- Create: `frontend/src/components/Navbar.jsx`

- [ ] **Step 1: Write Navbar.jsx**

```jsx
import { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Lock, Menu, X } from 'lucide-react'

const SOCIAL_LINKS = {
  instagram: 'https://www.instagram.com/thefitnesslabgym?utm_source=qr&igsh=MWRwc3ljbXV2eHN1ZA%3D%3D',
  facebook: 'https://www.facebook.com/thefitnesslabfl?rdid=I0DAc5rDNaR39ix5&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F14atX1FapyC%2F',
  whatsapp: 'https://api.whatsapp.com/send/?phone=919912223125&text&type=phone_number&app_absent=0',
  maps: 'https://share.google/HdkgsfHTe9xOIv1ze',
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinkClass = ({ isActive }) =>
    `text-xs font-body font-medium uppercase tracking-widest transition-colors duration-200 ${
      isActive ? 'text-accent' : 'text-white hover:text-accent'
    }`

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-black border-b border-border' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="font-heading font-extrabold text-xl uppercase text-white tracking-tight">
          THE FITNESS <span style={{ color: '#E6FF00' }}>LAB</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          <NavLink to="/classes" className={navLinkClass}>Classes</NavLink>
          <NavLink to="/gallery" className={navLinkClass}>Gallery</NavLink>
          <NavLink to="/pricing" className={navLinkClass}>Pricing</NavLink>
          <NavLink to="/contact" className={navLinkClass}>Contact</NavLink>
        </div>

        {/* Desktop Right */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href="https://api.whatsapp.com/send/?phone=919912223125&text&type=phone_number&app_absent=0"
            target="_blank"
            rel="noreferrer"
            className="bg-accent text-black font-body font-bold text-xs uppercase tracking-widest px-5 py-2 transition-opacity hover:opacity-90"
          >
            JOIN NOW
          </a>
          <Link
            to="/owner-login"
            className="flex items-center gap-1.5 text-white border border-border px-3 py-2 text-xs uppercase tracking-widest font-body hover:border-accent hover:text-accent transition-colors"
          >
            <Lock size={12} />
            Owner Login
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-white"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-black border-t border-border px-6 py-4 flex flex-col gap-4">
          {['classes', 'gallery', 'pricing', 'contact'].map((page) => (
            <NavLink
              key={page}
              to={`/${page}`}
              className={navLinkClass}
              onClick={() => setMenuOpen(false)}
            >
              {page}
            </NavLink>
          ))}
          <a
            href="https://api.whatsapp.com/send/?phone=919912223125&text&type=phone_number&app_absent=0"
            target="_blank"
            rel="noreferrer"
            className="bg-accent text-black font-bold text-xs uppercase tracking-widest px-5 py-2 text-center"
          >
            JOIN NOW
          </a>
          <Link
            to="/owner-login"
            className="flex items-center justify-center gap-1.5 text-white border border-border px-3 py-2 text-xs uppercase tracking-widest"
            onClick={() => setMenuOpen(false)}
          >
            <Lock size={12} />
            Owner Login
          </Link>
        </div>
      )}
    </nav>
  )
}
```

- [ ] **Step 2: Verify in browser**

Start dev server and navigate to http://localhost:5173. The navbar should appear transparent on top and turn solid black on scroll.

- [ ] **Step 3: Commit**

```bash
git -C /Users/devaharsha/fitness-lab add frontend/src/components/Navbar.jsx
git -C /Users/devaharsha/fitness-lab commit -m "feat: Navbar with scroll transparency and mobile menu"
```

---

## Task 10: Frontend — Footer.jsx

**Files:**
- Create: `frontend/src/components/Footer.jsx`

- [ ] **Step 1: Write Footer.jsx**

```jsx
import { Link } from 'react-router-dom'
import { Instagram, Facebook, MessageCircle, MapPin, Phone } from 'lucide-react'

const SOCIAL = [
  { icon: Instagram, href: 'https://www.instagram.com/thefitnesslabgym?utm_source=qr&igsh=MWRwc3ljbXV2eHN1ZA%3D%3D', label: 'Instagram' },
  { icon: Facebook, href: 'https://www.facebook.com/thefitnesslabfl?rdid=I0DAc5rDNaR39ix5&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F14atX1FapyC%2F', label: 'Facebook' },
  { icon: MessageCircle, href: 'https://api.whatsapp.com/send/?phone=919912223125&text&type=phone_number&app_absent=0', label: 'WhatsApp' },
  { icon: MapPin, href: 'https://share.google/HdkgsfHTe9xOIv1ze', label: 'Google Maps' },
]

export default function Footer() {
  return (
    <footer className="bg-black border-t border-border">
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Left */}
        <div>
          <p className="font-heading font-extrabold text-2xl uppercase text-white mb-3">
            THE FITNESS <span style={{ color: '#E6FF00' }}>LAB</span>
          </p>
          <p className="text-muted text-sm leading-relaxed">
            Where science meets sweat. Premium fitness experience in the heart of Hyderabad.
          </p>
        </div>

        {/* Center */}
        <div>
          <p className="section-label mb-4">Quick Links</p>
          <div className="flex flex-col gap-2">
            {[['Classes', '/classes'], ['Gallery', '/gallery'], ['Pricing', '/pricing'], ['Contact', '/contact']].map(([label, to]) => (
              <Link key={to} to={to} className="text-muted text-sm hover:text-accent transition-colors">
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Right */}
        <div>
          <p className="section-label mb-4">Connect</p>
          <div className="flex gap-2 mb-4">
            {SOCIAL.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="w-9 h-9 border border-border flex items-center justify-center text-muted hover:text-accent hover:border-accent transition-colors"
              >
                <Icon size={15} />
              </a>
            ))}
          </div>
          <div className="flex items-start gap-2 text-muted text-sm mb-2">
            <MapPin size={14} className="mt-0.5 flex-shrink-0" />
            <span>PVSR Palace, 3rd & 4th Floor, Sri Ram Nagar Colony, Golden Temple Rd, Manikonda</span>
          </div>
          <div className="flex items-center gap-2 text-muted text-sm">
            <Phone size={14} />
            <span>+91 99122 23125</span>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <span className="text-muted text-xs">© 2026 The Fitness Lab. All rights reserved.</span>
        <Link to="/owner-login" className="text-muted text-xs uppercase tracking-widest hover:text-accent transition-colors">
          Owner Login
        </Link>
      </div>
    </footer>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git -C /Users/devaharsha/fitness-lab add frontend/src/components/Footer.jsx
git -C /Users/devaharsha/fitness-lab commit -m "feat: Footer with social links and quick nav"
```

---

## Task 11: Frontend — Home.jsx

**Files:**
- Create: `frontend/src/pages/Home.jsx`

- [ ] **Step 1: Write Home.jsx**

```jsx
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Instagram, Facebook, MessageCircle, MapPin, Dumbbell } from 'lucide-react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const SOCIAL = [
  { icon: Instagram, href: 'https://www.instagram.com/thefitnesslabgym?utm_source=qr&igsh=MWRwc3ljbXV2eHN1ZA%3D%3D', label: 'Instagram' },
  { icon: Facebook, href: 'https://www.facebook.com/thefitnesslabfl?rdid=I0DAc5rDNaR39ix5&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F14atX1FapyC%2F', label: 'Facebook' },
  { icon: MessageCircle, href: 'https://api.whatsapp.com/send/?phone=919912223125&text&type=phone_number&app_absent=0', label: 'WhatsApp' },
  { icon: MapPin, href: 'https://share.google/HdkgsfHTe9xOIv1ze', label: 'Maps' },
]

function useFadeInUp() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); obs.unobserve(el) } },
      { threshold: 0.15 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return ref
}

const PRICING_ROWS = [
  { name: 'Individual', bestPrice: false, monthly: '₹2,500/-', quarterly: '₹6,500/-', halfYearly: '₹10,500/-', yearly: '₹15,000/-' },
  { name: 'Couple', bestPrice: true, monthly: '₹4,500/-', quarterly: '₹11,000/-', halfYearly: '₹18,000/-', yearly: '₹30,000/-' },
  { name: 'Gold Personal Training', bestPrice: true, monthly: '₹7,000/-', quarterly: '₹20,000/-', halfYearly: '₹38,000/-', yearly: '₹70,000/-' },
  { name: 'Platinum Personal Training', bestPrice: true, monthly: '₹15,000/-', quarterly: '₹40,000/-', halfYearly: '₹75,000/-', yearly: '₹1,20,000/-' },
]

function ProgramCard({ cls }) {
  return (
    <div
      className="relative overflow-hidden min-h-64 flex flex-col justify-end p-6 group cursor-pointer"
      style={{ backgroundImage: `url(${cls.image_url})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
      <div className="relative z-10">
        <Dumbbell size={20} style={{ color: '#E6FF00' }} className="mb-2" />
        <h3 className="section-heading text-2xl mb-1">{cls.name.toUpperCase()}</h3>
        <p className="text-muted text-sm mb-2">{cls.description}</p>
        <p className="text-xs font-medium tracking-widest uppercase" style={{ color: '#E6FF00' }}>{cls.schedule}</p>
      </div>
    </div>
  )
}

export default function Home() {
  const [classes, setClasses] = useState([])
  const [pricing, setPricing] = useState(PRICING_ROWS)

  useEffect(() => {
    fetch(`${API}/api/classes`).then(r => r.json()).then(setClasses).catch(() => {})
    fetch(`${API}/api/pricing`).then(r => r.json()).then(data => { if (data.length) setPricing(data) }).catch(() => {})
  }, [])

  const programsRef = useFadeInUp()
  const facilityRef = useFadeInUp()
  const pricingRef = useFadeInUp()
  const ctaRef = useFadeInUp()

  return (
    <>
      {/* HERO */}
      <section
        className="relative min-h-screen flex flex-col justify-center px-8 md:px-16"
        style={{ backgroundImage: 'url(/images/hero_banner.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.92) 40%, rgba(0,0,0,0.3))' }} />
        <div className="relative z-10 max-w-3xl pt-24">
          <p className="section-label mb-6">Premium Fitness Experience</p>
          <h1 className="section-heading" style={{ fontSize: 'clamp(64px, 10vw, 96px)', lineHeight: 1 }}>
            THE<br />FITNESS<br /><span style={{ color: '#E6FF00' }}>LAB</span>
          </h1>
          <p className="text-muted mt-6 mb-8 max-w-lg leading-relaxed">
            Where science meets sweat. Transform your body with world-class training, cutting-edge equipment, and relentless discipline.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="https://api.whatsapp.com/send/?phone=919912223125&text&type=phone_number&app_absent=0"
              target="_blank"
              rel="noreferrer"
              className="bg-accent text-black font-body font-bold text-sm uppercase tracking-widest px-7 py-3 hover:opacity-90 transition-opacity"
            >
              JOIN NOW →
            </a>
            <Link
              to="/classes"
              className="border border-white text-white font-body font-medium text-sm uppercase tracking-widest px-7 py-3 hover:border-accent hover:text-accent transition-colors"
            >
              EXPLORE CLASSES
            </Link>
          </div>
        </div>

        {/* Social icons */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
          {SOCIAL.map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              className="w-10 h-10 border border-white/30 flex items-center justify-center text-white/60 hover:border-accent hover:text-accent transition-colors"
            >
              <Icon size={16} />
            </a>
          ))}
        </div>
      </section>

      {/* OUR PROGRAMS */}
      <section className="py-20 px-6 md:px-16 max-w-7xl mx-auto fade-in-up" ref={programsRef}>
        <p className="section-label mb-3">What We Offer</p>
        <h2 className="section-heading text-5xl md:text-6xl mb-10">Our Programs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(classes.length ? classes : [
            { name: 'Strength Training', description: 'Build muscle and strength', schedule: 'MON, THU - 7:30 AM', image_url: '/images/strength_weights.jpg' },
            { name: 'HIIT', description: 'High intensity interval training', schedule: 'TUE, FRI - 6:00 AM', image_url: '/images/cardio_zone.jpg' },
            { name: 'Functional Training', description: 'Train movements, not muscles', schedule: 'WED, SAT - 8:00 AM', image_url: '/images/functional_zone.jpg' },
            { name: 'Personal Training', description: 'One-on-one expert coaching', schedule: 'FLEXIBLE TIMING', image_url: '/images/full_gym_overview.jpg' },
          ]).map((cls) => <ProgramCard key={cls.name} cls={cls} />)}
        </div>
      </section>

      {/* OUR FACILITY */}
      <section className="py-20 px-6 md:px-16 max-w-7xl mx-auto fade-in-up" ref={facilityRef}>
        <p className="section-label mb-3">Take A Look</p>
        <h2 className="section-heading text-5xl md:text-6xl mb-10">Our Facility</h2>
        <div className="grid grid-cols-2 gap-2">
          {['/images/full_gym_overview.jpg', '/images/cardio_zone.jpg', '/images/strength_weights.jpg', '/images/hero_banner.jpg'].map((src) => (
            <div key={src} className="overflow-hidden aspect-video">
              <img
                src={src}
                alt="Fitness Lab facility"
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
          ))}
        </div>
      </section>

      {/* OUR PACKAGES */}
      <section className="py-20 px-6 md:px-16 max-w-7xl mx-auto fade-in-up" ref={pricingRef}>
        <p className="section-label mb-3">Membership Plans</p>
        <h2 className="section-heading text-5xl md:text-6xl mb-10">Our Packages</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {['Packages', 'Monthly', 'Quarterly', 'Half-Yearly', 'Yearly'].map((h) => (
                  <th key={h} className="font-heading font-bold uppercase text-left pb-4 pr-6" style={{ color: '#E6FF00', fontSize: '0.9rem', letterSpacing: '0.1em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pricing.map((row) => (
                <tr key={row.name} className="border-b border-border hover:bg-[#1a1a1a] transition-colors">
                  <td className="py-4 pr-6">
                    <span className="text-white font-medium">{row.name}</span>
                    {(row.best_price || row.bestPrice) && (
                      <span className="block text-xs font-bold uppercase tracking-wider" style={{ color: '#E6FF00' }}>Best Price</span>
                    )}
                  </td>
                  <td className="py-4 pr-6 text-muted">{row.monthly}</td>
                  <td className="py-4 pr-6 text-muted">{row.quarterly}</td>
                  <td className="py-4 pr-6 text-muted">{row.half_yearly || row.halfYearly}</td>
                  <td className="py-4 text-muted">{row.yearly}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="text-center mt-10">
          <a
            href="https://api.whatsapp.com/send/?phone=919912223125&text&type=phone_number&app_absent=0"
            target="_blank"
            rel="noreferrer"
            className="inline-block bg-accent text-black font-bold text-sm uppercase tracking-widest px-10 py-3 hover:opacity-90 transition-opacity"
          >
            BOOK NOW →
          </a>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 md:px-16 border-t border-border fade-in-up" ref={ctaRef}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="section-label mb-3">Get In Touch</p>
            <h2 className="section-heading text-4xl md:text-5xl">Ready To Start?</h2>
            <p className="text-muted mt-3">Chat with us on WhatsApp — quick answers, no waiting.</p>
            <div className="flex items-center gap-2 mt-4 text-muted text-sm">
              <MapPin size={14} />
              <span>PVSR Palace, Manikonda, Hyderabad</span>
            </div>
          </div>
          <a
            href="https://api.whatsapp.com/send/?phone=919912223125&text&type=phone_number&app_absent=0"
            target="_blank"
            rel="noreferrer"
            className="flex-shrink-0 bg-accent text-black font-bold text-sm uppercase tracking-widest px-10 py-4 hover:opacity-90 transition-opacity"
          >
            CHAT ON WHATSAPP →
          </a>
        </div>
      </section>
    </>
  )
}
```

- [ ] **Step 2: Verify in browser**

Navigate to http://localhost:5173. The homepage should render with hero, program cards (placeholders if no images yet), facility grid, pricing table, and CTA. Scroll animations should trigger.

- [ ] **Step 3: Commit**

```bash
git -C /Users/devaharsha/fitness-lab add frontend/src/pages/Home.jsx
git -C /Users/devaharsha/fitness-lab commit -m "feat: Home page — hero, programs, facility, pricing, CTA"
```

---

## Task 12: Frontend — Classes.jsx

**Files:**
- Create: `frontend/src/pages/Classes.jsx`

- [ ] **Step 1: Write Classes.jsx**

```jsx
import { useEffect, useRef, useState } from 'react'
import { Dumbbell, Clock, User } from 'lucide-react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const FALLBACK = [
  { name: 'Strength Training', description: 'Build raw muscle and functional strength with compound lifts, progressive overload principles, and expert coaching. Our strength program is suitable for all levels — whether you\'re picking up a barbell for the first time or chasing a new PR.', schedule: 'MON, THU - 7:30 AM', image_url: '/images/strength_weights.jpg' },
  { name: 'HIIT', description: 'High-intensity interval training designed to torch calories, boost metabolism, and improve cardiovascular endurance. Each session pushes your limits with short bursts of effort followed by active recovery.', schedule: 'TUE, FRI - 6:00 AM', image_url: '/images/cardio_zone.jpg' },
  { name: 'Functional Training', description: 'Train movements, not just muscles. Our functional training program improves mobility, stability, and real-world athletic performance using kettlebells, resistance bands, and bodyweight movements.', schedule: 'WED, SAT - 8:00 AM', image_url: '/images/functional_zone.jpg' },
  { name: 'Personal Training', description: 'One-on-one coaching tailored entirely to your goals, current fitness level, and schedule. Your trainer designs every session, monitors progress, and adjusts your plan for maximum results.', schedule: 'FLEXIBLE TIMING', image_url: '/images/full_gym_overview.jpg' },
]

function useFadeInUp() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); obs.unobserve(el) } },
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return ref
}

function ClassCard({ cls, index }) {
  const ref = useFadeInUp()
  return (
    <div ref={ref} className="fade-in-up grid grid-cols-1 md:grid-cols-2 border border-border overflow-hidden">
      <div
        className="min-h-64 relative"
        style={{ backgroundImage: `url(${cls.image_url})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute top-4 left-4">
          <span className="bg-accent text-black text-xs font-bold uppercase tracking-widest px-3 py-1">
            Class {String(index + 1).padStart(2, '0')}
          </span>
        </div>
      </div>
      <div className="bg-card p-8 flex flex-col justify-center">
        <Dumbbell size={24} style={{ color: '#E6FF00' }} className="mb-4" />
        <h3 className="section-heading text-3xl mb-3">{cls.name.toUpperCase()}</h3>
        <p className="text-muted text-sm leading-relaxed mb-6">{cls.description}</p>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 text-sm">
            <Clock size={14} style={{ color: '#E6FF00' }} />
            <span className="text-white">{cls.schedule}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <User size={14} style={{ color: '#E6FF00' }} />
            <span className="text-muted">Certified Trainer</span>
          </div>
        </div>
        <a
          href="https://api.whatsapp.com/send/?phone=919912223125&text&type=phone_number&app_absent=0"
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-block border border-accent text-accent text-xs font-bold uppercase tracking-widest px-6 py-2 hover:bg-accent hover:text-black transition-all w-fit"
        >
          BOOK THIS CLASS →
        </a>
      </div>
    </div>
  )
}

export default function Classes() {
  const [classes, setClasses] = useState([])

  useEffect(() => {
    fetch(`${API}/api/classes`).then(r => r.json()).then(setClasses).catch(() => setClasses(FALLBACK))
  }, [])

  const data = classes.length ? classes : FALLBACK

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 md:px-16 max-w-7xl mx-auto">
      <p className="section-label mb-3">What We Offer</p>
      <h1 className="section-heading text-5xl md:text-7xl mb-12">Our Classes</h1>
      <div className="flex flex-col gap-6">
        {data.map((cls, i) => <ClassCard key={cls.name} cls={cls} index={i} />)}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git -C /Users/devaharsha/fitness-lab add frontend/src/pages/Classes.jsx
git -C /Users/devaharsha/fitness-lab commit -m "feat: Classes page with animated cards"
```

---

## Task 13: Frontend — Gallery.jsx

**Files:**
- Create: `frontend/src/pages/Gallery.jsx`

- [ ] **Step 1: Write Gallery.jsx**

```jsx
import { useState } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

const IMAGES = [
  { src: '/images/hero_banner.jpg', alt: 'The Fitness Lab gym floor' },
  { src: '/images/full_gym_overview.jpg', alt: 'Full gym overview' },
  { src: '/images/cardio_zone.jpg', alt: 'Cardio zone' },
  { src: '/images/functional_zone.jpg', alt: 'Functional training zone' },
  { src: '/images/strength_weights.jpg', alt: 'Strength and weights area' },
  { src: '/images/reception_about.jpg', alt: 'Reception area' },
]

export default function Gallery() {
  const [lightbox, setLightbox] = useState(null)

  const prev = () => setLightbox((i) => (i - 1 + IMAGES.length) % IMAGES.length)
  const next = () => setLightbox((i) => (i + 1) % IMAGES.length)

  const handleKey = (e) => {
    if (e.key === 'ArrowLeft') prev()
    if (e.key === 'ArrowRight') next()
    if (e.key === 'Escape') setLightbox(null)
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 md:px-16 max-w-7xl mx-auto">
      <p className="section-label mb-3">Take A Look</p>
      <h1 className="section-heading text-5xl md:text-7xl mb-12">Our Gallery</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {IMAGES.map((img, i) => (
          <div
            key={img.src}
            className="overflow-hidden cursor-pointer aspect-video"
            onClick={() => setLightbox(i)}
          >
            <img
              src={img.src}
              alt={img.alt}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={() => setLightbox(null)}
          onKeyDown={handleKey}
          tabIndex={0}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-accent transition-colors"
            onClick={() => setLightbox(null)}
          >
            <X size={28} />
          </button>
          <button
            className="absolute left-4 text-white hover:text-accent transition-colors p-2"
            onClick={(e) => { e.stopPropagation(); prev() }}
          >
            <ChevronLeft size={36} />
          </button>
          <img
            src={IMAGES[lightbox].src}
            alt={IMAGES[lightbox].alt}
            className="max-h-[85vh] max-w-[85vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="absolute right-4 text-white hover:text-accent transition-colors p-2"
            onClick={(e) => { e.stopPropagation(); next() }}
          >
            <ChevronRight size={36} />
          </button>
          <div className="absolute bottom-4 text-muted text-sm">
            {lightbox + 1} / {IMAGES.length}
          </div>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git -C /Users/devaharsha/fitness-lab add frontend/src/pages/Gallery.jsx
git -C /Users/devaharsha/fitness-lab commit -m "feat: Gallery page with lightbox modal"
```

---

## Task 14: Frontend — Pricing.jsx

**Files:**
- Create: `frontend/src/pages/Pricing.jsx`

- [ ] **Step 1: Write Pricing.jsx**

```jsx
import { useEffect, useState } from 'react'
import { Check } from 'lucide-react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const FALLBACK = [
  { name: 'Individual', best_price: false, monthly: '₹2,500/-', quarterly: '₹6,500/-', half_yearly: '₹10,500/-', yearly: '₹15,000/-' },
  { name: 'Couple', best_price: true, monthly: '₹4,500/-', quarterly: '₹11,000/-', half_yearly: '₹18,000/-', yearly: '₹30,000/-' },
  { name: 'Gold Personal Training', best_price: true, monthly: '₹7,000/-', quarterly: '₹20,000/-', half_yearly: '₹38,000/-', yearly: '₹70,000/-' },
  { name: 'Platinum Personal Training', best_price: true, monthly: '₹15,000/-', quarterly: '₹40,000/-', half_yearly: '₹75,000/-', yearly: '₹1,20,000/-' },
]

const PERKS = [
  'Access to all gym equipment',
  'Locker room & shower facilities',
  'Unlimited class bookings',
  'Fitness progress tracking',
  'Nutrition guidance',
]

export default function Pricing() {
  const [pricing, setPricing] = useState(FALLBACK)

  useEffect(() => {
    fetch(`${API}/api/pricing`).then(r => r.json()).then(data => { if (data.length) setPricing(data) }).catch(() => {})
  }, [])

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 md:px-16 max-w-7xl mx-auto">
      <p className="section-label mb-3">Membership Plans</p>
      <h1 className="section-heading text-5xl md:text-7xl mb-4">Our Packages</h1>
      <p className="text-muted mb-12 max-w-xl">All memberships include full access to our facility. Choose the plan that works for you.</p>

      {/* Perks */}
      <div className="flex flex-wrap gap-4 mb-12">
        {PERKS.map((perk) => (
          <div key={perk} className="flex items-center gap-2 text-sm text-muted">
            <Check size={14} style={{ color: '#E6FF00' }} />
            {perk}
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-border">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-card">
              {['Package', 'Monthly', 'Quarterly', 'Half-Yearly', 'Yearly'].map((h) => (
                <th key={h} className="font-heading font-bold uppercase text-left px-6 py-4" style={{ color: '#E6FF00', fontSize: '0.85rem', letterSpacing: '0.1em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pricing.map((row) => (
              <tr key={row.name} className="border-b border-border hover:bg-[#1a1a1a] transition-colors">
                <td className="px-6 py-5">
                  <span className="text-white font-medium">{row.name}</span>
                  {row.best_price && (
                    <span className="block text-xs font-bold uppercase tracking-wider mt-0.5" style={{ color: '#E6FF00' }}>Best Price</span>
                  )}
                </td>
                <td className="px-6 py-5 text-muted font-medium">{row.monthly}</td>
                <td className="px-6 py-5 text-muted font-medium">{row.quarterly}</td>
                <td className="px-6 py-5 text-muted font-medium">{row.half_yearly}</td>
                <td className="px-6 py-5 text-muted font-medium">{row.yearly}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-center mt-12">
        <p className="text-muted text-sm mb-6">Ready to join? Message us on WhatsApp to book your membership.</p>
        <a
          href="https://api.whatsapp.com/send/?phone=919912223125&text&type=phone_number&app_absent=0"
          target="_blank"
          rel="noreferrer"
          className="inline-block bg-accent text-black font-bold text-sm uppercase tracking-widest px-12 py-4 hover:opacity-90 transition-opacity"
        >
          BOOK NOW →
        </a>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git -C /Users/devaharsha/fitness-lab add frontend/src/pages/Pricing.jsx
git -C /Users/devaharsha/fitness-lab commit -m "feat: Pricing page with full membership table"
```

---

## Task 15: Frontend — Contact.jsx

**Files:**
- Create: `frontend/src/pages/Contact.jsx`

- [ ] **Step 1: Write Contact.jsx**

```jsx
import { MapPin, Phone, Clock, Instagram, Facebook, MessageCircle } from 'lucide-react'

const SOCIAL = [
  { icon: Instagram, href: 'https://www.instagram.com/thefitnesslabgym?utm_source=qr&igsh=MWRwc3ljbXV2eHN1ZA%3D%3D', label: 'Instagram' },
  { icon: Facebook, href: 'https://www.facebook.com/thefitnesslabfl?rdid=I0DAc5rDNaR39ix5&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F14atX1FapyC%2F', label: 'Facebook' },
  { icon: MessageCircle, href: 'https://api.whatsapp.com/send/?phone=919912223125&text&type=phone_number&app_absent=0', label: 'WhatsApp' },
  { icon: MapPin, href: 'https://share.google/HdkgsfHTe9xOIv1ze', label: 'Google Maps' },
]

export default function Contact() {
  return (
    <div className="min-h-screen pt-24 pb-20 px-6 md:px-16 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        {/* LEFT */}
        <div>
          <p className="section-label mb-3">Get In Touch</p>
          <h1 className="section-heading text-5xl md:text-6xl mb-10">Contact Us</h1>

          <div className="mb-8">
            <p className="text-white font-medium uppercase tracking-widest text-sm mb-4">Visit Us</p>
            <div className="flex items-start gap-3 text-muted text-sm mb-3">
              <MapPin size={16} style={{ color: '#E6FF00' }} className="mt-0.5 flex-shrink-0" />
              <span>PVSR Palace, 3rd & 4th Floor, Sri Ram Nagar Colony, Golden Temple Rd, Manikonda</span>
            </div>
            <div className="flex items-center gap-3 text-muted text-sm">
              <Phone size={16} style={{ color: '#E6FF00' }} />
              <span>+91 99122 23125</span>
            </div>
          </div>

          <div className="mb-8">
            <p className="text-white font-medium uppercase tracking-widest text-sm mb-4">Hours</p>
            <div className="flex items-start gap-3 text-muted text-sm">
              <Clock size={16} style={{ color: '#E6FF00' }} className="mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-white mb-1">Mon – Sat</p>
                <p>Morning: 5:30 AM – 12:00 PM</p>
                <p className="mb-2">Evening: 5:00 PM – 10:00 PM</p>
                <p className="text-white mb-1">Sunday</p>
                <p>Morning: 6:00 AM – 10:00 AM</p>
                <p>Evening: 5:00 PM – 9:00 PM</p>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            {SOCIAL.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="w-10 h-10 border border-border flex items-center justify-center text-muted hover:text-accent hover:border-accent transition-colors"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="bg-card border border-border p-10 flex flex-col items-center text-center">
          <MessageCircle size={48} style={{ color: '#E6FF00' }} className="mb-6" />
          <h2 className="section-heading text-3xl mb-4">Start Your Fitness Journey</h2>
          <p className="text-muted text-sm leading-relaxed mb-8">
            Have questions about our packages or want to book a session? Reach out to us directly on WhatsApp.
          </p>
          <a
            href="https://api.whatsapp.com/send/?phone=919912223125&text&type=phone_number&app_absent=0"
            target="_blank"
            rel="noreferrer"
            className="w-full bg-accent text-black font-bold text-sm uppercase tracking-widest py-4 text-center hover:opacity-90 transition-opacity block mb-4"
          >
            CHAT ON WHATSAPP →
          </a>
          <p className="text-muted text-sm">+91 99122 23125</p>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git -C /Users/devaharsha/fitness-lab add frontend/src/pages/Contact.jsx
git -C /Users/devaharsha/fitness-lab commit -m "feat: Contact page with hours, address, and WhatsApp CTA"
```

---

## Task 16: Frontend — OwnerLogin.jsx

**Files:**
- Create: `frontend/src/pages/OwnerLogin.jsx`

- [ ] **Step 1: Write OwnerLogin.jsx**

```jsx
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function OwnerLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Login failed')
      localStorage.setItem('fitness_lab_token', data.access_token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 relative">
      <Link to="/" className="absolute top-6 left-6 flex items-center gap-2 text-muted text-sm hover:text-accent transition-colors">
        <ArrowLeft size={16} />
        Back to site
      </Link>

      <div
        className="w-full max-w-md bg-card border border-border p-10"
        style={{ boxShadow: '0 0 40px rgba(230,255,0,0.08)' }}
      >
        <h1 className="section-heading text-4xl mb-2">
          OWNER <span style={{ color: '#E6FF00' }}>LOGIN</span>
        </h1>
        <p className="text-muted text-sm mb-8">Access your admin dashboard</p>

        {error && (
          <div className="bg-red-900/30 border border-red-700 text-red-400 text-sm px-4 py-3 mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-black border border-border text-white placeholder-muted text-sm px-4 py-3 pl-10 focus:outline-none focus:border-accent transition-colors"
            />
          </div>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type={showPw ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-black border border-border text-white placeholder-muted text-sm px-4 py-3 pl-10 pr-10 focus:outline-none focus:border-accent transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-white"
            >
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent text-black font-bold text-sm uppercase tracking-widest py-3 mt-2 hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? 'Authenticating…' : 'ACCESS DASHBOARD'}
          </button>
        </form>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git -C /Users/devaharsha/fitness-lab add frontend/src/pages/OwnerLogin.jsx
git -C /Users/devaharsha/fitness-lab commit -m "feat: Owner login page with JWT auth"
```

---

## Task 17: Frontend — Dashboard.jsx

**Files:**
- Create: `frontend/src/dashboard/Dashboard.jsx`

- [ ] **Step 1: Write Dashboard.jsx**

```jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, Plus, Save, Trash2, Edit2, X, Eye, EyeOff } from 'lucide-react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('fitness_lab_token')}`,
  }
}

function Toast({ msg, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500)
    return () => clearTimeout(t)
  }, [onClose])
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 px-6 py-3 text-sm font-medium ${
        type === 'success' ? 'bg-accent text-black' : 'bg-red-700 text-white'
      }`}
    >
      {msg}
    </div>
  )
}

/* ── Programs Tab ── */
function ProgramsTab({ toast }) {
  const [classes, setClasses] = useState([])
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({})
  const [adding, setAdding] = useState(false)
  const [newForm, setNewForm] = useState({ name: '', description: '', schedule: '', image_url: '' })

  useEffect(() => { loadClasses() }, [])

  async function loadClasses() {
    const res = await fetch(`${API}/api/classes`)
    setClasses(await res.json())
  }

  function startEdit(cls) { setEditing(cls.id); setForm({ ...cls }) }
  function cancelEdit() { setEditing(null); setForm({}) }

  async function saveEdit(id) {
    const res = await fetch(`${API}/api/classes/${id}`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify(form) })
    if (res.ok) { toast('Class updated', 'success'); setEditing(null); loadClasses() }
    else toast('Update failed', 'error')
  }

  async function deleteClass(id) {
    if (!window.confirm('Delete this class?')) return
    const res = await fetch(`${API}/api/classes/${id}`, { method: 'DELETE', headers: authHeaders() })
    if (res.ok) { toast('Class deleted', 'success'); loadClasses() }
    else toast('Delete failed', 'error')
  }

  async function addNew() {
    const res = await fetch(`${API}/api/classes`, { method: 'POST', headers: authHeaders(), body: JSON.stringify(newForm) })
    if (res.ok) { toast('Class added', 'success'); setAdding(false); setNewForm({ name: '', description: '', schedule: '', image_url: '' }); loadClasses() }
    else toast('Add failed', 'error')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="section-heading text-2xl">Programs</h2>
        <button onClick={() => setAdding(true)} className="flex items-center gap-2 bg-accent text-black text-xs font-bold uppercase tracking-widest px-4 py-2">
          <Plus size={14} /> Add Program
        </button>
      </div>

      {adding && (
        <div className="bg-card border border-accent p-6 mb-6">
          <h3 className="text-white font-medium mb-4">New Program</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {['name', 'description', 'schedule', 'image_url'].map((field) => (
              <input
                key={field}
                type="text"
                placeholder={field.replace('_', ' ')}
                value={newForm[field]}
                onChange={(e) => setNewForm({ ...newForm, [field]: e.target.value })}
                className="bg-black border border-border text-white text-sm px-3 py-2 focus:outline-none focus:border-accent"
              />
            ))}
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={addNew} className="bg-accent text-black text-xs font-bold uppercase px-5 py-2">Save</button>
            <button onClick={() => setAdding(false)} className="border border-border text-muted text-xs uppercase px-5 py-2">Cancel</button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {classes.map((cls) => (
          <div key={cls.id} className="bg-card border border-border p-5">
            {editing === cls.id ? (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  {['name', 'description', 'schedule', 'image_url'].map((field) => (
                    <input
                      key={field}
                      type="text"
                      value={form[field] || ''}
                      onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                      placeholder={field.replace('_', ' ')}
                      className="bg-black border border-border text-white text-sm px-3 py-2 focus:outline-none focus:border-accent"
                    />
                  ))}
                </div>
                <div className="flex gap-3">
                  <button onClick={() => saveEdit(cls.id)} className="flex items-center gap-1 bg-accent text-black text-xs font-bold uppercase px-4 py-2"><Save size={12} /> Save</button>
                  <button onClick={cancelEdit} className="flex items-center gap-1 border border-border text-muted text-xs uppercase px-4 py-2"><X size={12} /> Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-white font-medium">{cls.name}</p>
                  <p className="text-muted text-sm mt-1">{cls.schedule}</p>
                  <p className="text-muted text-xs mt-1 truncate max-w-md">{cls.description}</p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button onClick={() => startEdit(cls)} className="text-muted hover:text-accent transition-colors"><Edit2 size={16} /></button>
                  <button onClick={() => deleteClass(cls.id)} className="text-muted hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Pricing Tab ── */
function PricingTab({ toast }) {
  const [pricing, setPricing] = useState([])
  const [edits, setEdits] = useState({})

  useEffect(() => { loadPricing() }, [])

  async function loadPricing() {
    const res = await fetch(`${API}/api/pricing`)
    const data = await res.json()
    setPricing(data)
    const init = {}
    data.forEach((p) => { init[p.id] = { ...p } })
    setEdits(init)
  }

  async function savePricing(id) {
    const res = await fetch(`${API}/api/pricing/${id}`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify(edits[id]) })
    if (res.ok) toast('Pricing updated', 'success')
    else toast('Update failed', 'error')
  }

  return (
    <div>
      <h2 className="section-heading text-2xl mb-6">Pricing Manager</h2>
      <div className="flex flex-col gap-4">
        {pricing.map((pkg) => (
          <div key={pkg.id} className="bg-card border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-white font-medium">{pkg.name}</p>
                {pkg.best_price && <span className="text-xs" style={{ color: '#E6FF00' }}>Best Price</span>}
              </div>
              <button onClick={() => savePricing(pkg.id)} className="flex items-center gap-1 bg-accent text-black text-xs font-bold uppercase px-4 py-2">
                <Save size={12} /> Save
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['monthly', 'quarterly', 'half_yearly', 'yearly'].map((field) => (
                <div key={field}>
                  <label className="section-label text-xs mb-1 block">{field.replace('_', ' ')}</label>
                  <input
                    type="text"
                    value={edits[pkg.id]?.[field] || ''}
                    onChange={(e) => setEdits({ ...edits, [pkg.id]: { ...edits[pkg.id], [field]: e.target.value } })}
                    className="w-full bg-black border border-border text-white text-sm px-3 py-2 focus:outline-none focus:border-accent"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Account Tab ── */
function AccountTab({ toast }) {
  const [form, setForm] = useState({ current_password: '', new_password: '', confirm_password: '' })
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (form.new_password !== form.confirm_password) { toast('Passwords do not match', 'error'); return }
    setLoading(true)
    const res = await fetch(`${API}/api/auth/change-password`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(form),
    })
    const data = await res.json()
    if (res.ok) { toast('Password updated successfully', 'success'); setForm({ current_password: '', new_password: '', confirm_password: '' }) }
    else toast(data.detail || 'Update failed', 'error')
    setLoading(false)
  }

  return (
    <div className="max-w-md">
      <h2 className="section-heading text-2xl mb-6">Account Settings</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {[
          { key: 'current_password', label: 'Current Password' },
          { key: 'new_password', label: 'New Password' },
          { key: 'confirm_password', label: 'Confirm New Password' },
        ].map(({ key, label }) => (
          <div key={key} className="relative">
            <label className="section-label block mb-1">{label}</label>
            <input
              type={showPw ? 'text' : 'password'}
              value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              required
              className="w-full bg-black border border-border text-white text-sm px-4 py-3 pr-10 focus:outline-none focus:border-accent"
            />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 bottom-3 text-muted hover:text-white">
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        ))}
        <button
          type="submit"
          disabled={loading}
          className="bg-accent text-black font-bold text-sm uppercase tracking-widest py-3 mt-2 hover:opacity-90 disabled:opacity-50"
        >
          {loading ? 'Updating…' : 'UPDATE PASSWORD'}
        </button>
      </form>
    </div>
  )
}

/* ── Main Dashboard ── */
export default function Dashboard() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('programs')
  const [toastMsg, setToastMsg] = useState(null)

  function showToast(msg, type) { setToastMsg({ msg, type }) }

  function logout() {
    localStorage.removeItem('fitness_lab_token')
    navigate('/owner-login')
  }

  const TABS = [
    { id: 'programs', label: 'Programs Manager' },
    { id: 'pricing', label: 'Pricing Manager' },
    { id: 'account', label: 'Account Settings' },
  ]

  return (
    <div className="min-h-screen bg-black">
      {/* Top bar */}
      <div className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
        <span className="font-heading font-extrabold text-lg uppercase">
          THE FITNESS <span style={{ color: '#E6FF00' }}>LAB</span> — Dashboard
        </span>
        <button onClick={logout} className="flex items-center gap-2 text-muted text-sm hover:text-red-400 transition-colors">
          <LogOut size={16} /> Logout
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-border px-6 flex gap-0">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-6 py-4 text-xs uppercase tracking-widest font-medium border-b-2 transition-colors ${
              tab === t.id ? 'border-accent text-white' : 'border-transparent text-muted hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-6 max-w-5xl mx-auto">
        {tab === 'programs' && <ProgramsTab toast={showToast} />}
        {tab === 'pricing' && <PricingTab toast={showToast} />}
        {tab === 'account' && <AccountTab toast={showToast} />}
      </div>

      {toastMsg && <Toast msg={toastMsg.msg} type={toastMsg.type} onClose={() => setToastMsg(null)} />}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git -C /Users/devaharsha/fitness-lab add frontend/src/dashboard/Dashboard.jsx
git -C /Users/devaharsha/fitness-lab commit -m "feat: Owner dashboard with Programs, Pricing, Account tabs"
```

---

## Task 18: Frontend — PostCSS config (Tailwind requirement)

**Files:**
- Create: `frontend/postcss.config.js`

- [ ] **Step 1: Write postcss.config.js**

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

- [ ] **Step 2: Restart dev server and verify Tailwind works**

```bash
cd fitness-lab/frontend && npm run dev
```

Open http://localhost:5173 — all Tailwind classes should apply (black background, correct fonts).

- [ ] **Step 3: Commit**

```bash
git -C /Users/devaharsha/fitness-lab add frontend/postcss.config.js
git -C /Users/devaharsha/fitness-lab commit -m "chore: postcss config for tailwind"
```

---

## Task 19: Deployment Configs + README

**Files:**
- Create: `backend/render.yaml`
- Create: `fitness-lab/README.md`

- [ ] **Step 1: Write render.yaml**

```yaml
services:
  - type: web
    name: fitness-lab-api
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn main:app --host 0.0.0.0 --port $PORT
    envVars:
      - key: MONGO_URI
        sync: false
      - key: JWT_SECRET
        sync: false
      - key: JWT_ALGORITHM
        value: HS256
      - key: ACCESS_TOKEN_EXPIRE_MINUTES
        value: "1440"
```

- [ ] **Step 2: Write README.md**

```markdown
# The Fitness Lab

Full-stack gym website — React + Vite + Tailwind frontend, FastAPI + MongoDB Atlas backend.

## Local Setup

### Backend

```bash
cd fitness-lab/backend
pip install -r requirements.txt
cp .env.example .env          # fill in MONGO_URI and JWT_SECRET
python seed.py                # seed admin user, classes, pricing
uvicorn main:app --reload     # runs on http://localhost:8000
```

### Frontend

```bash
cd fitness-lab/frontend
npm install
cp .env.example .env.local    # set VITE_API_URL=http://localhost:8000
npm run dev                   # runs on http://localhost:5173
```

### Add your gym photos

Copy 6 images into `frontend/public/images/` with these exact filenames:
- `hero_banner.jpg`
- `full_gym_overview.jpg`
- `cardio_zone.jpg`
- `functional_zone.jpg`
- `strength_weights.jpg`
- `reception_about.jpg`

## Environment Variables

### Backend `.env`
| Variable | Description |
|----------|-------------|
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for JWT signing (use a long random string) |
| `JWT_ALGORITHM` | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `1440` (24 hours) |

### Frontend `.env.local`
| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API base URL (no trailing slash) |

## Default Owner Login

| Field | Value |
|-------|-------|
| Email | `admin@thefitnesslab.com` |
| Password | `FitnessLab@2024` |

**Change this password immediately after first login.**

## Deployment

### Backend → Render
1. Push repo to GitHub
2. Create a new Web Service on render.com
3. Set root directory to `fitness-lab/backend`
4. Build command: `pip install -r requirements.txt`
5. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Add environment variables: `MONGO_URI`, `JWT_SECRET`, `JWT_ALGORITHM`, `ACCESS_TOKEN_EXPIRE_MINUTES`
7. Deploy and note the service URL (e.g., `https://fitness-lab-api.onrender.com`)

### Frontend → Vercel
1. Import repo on vercel.com
2. Set root directory to `fitness-lab/frontend`
3. Add environment variable: `VITE_API_URL` = your Render service URL
4. Deploy — `vercel.json` handles SPA routing automatically
```

- [ ] **Step 3: Commit**

```bash
git -C /Users/devaharsha/fitness-lab add backend/render.yaml README.md
git -C /Users/devaharsha/fitness-lab commit -m "docs: README with setup, deployment, and env vars"
```

---

## Task 20: End-to-End Verification

- [ ] **Step 1: Start backend**

```bash
cd fitness-lab/backend && uvicorn main:app --reload
```

Expected: `Uvicorn running on http://127.0.0.1:8000`

- [ ] **Step 2: Start frontend (new terminal)**

```bash
cd fitness-lab/frontend && npm run dev
```

Expected: `Local: http://localhost:5173/`

- [ ] **Step 3: Verify each route**

| URL | Expected |
|-----|----------|
| http://localhost:5173/ | Home page with hero, programs, pricing |
| http://localhost:5173/classes | 4 class cards from DB |
| http://localhost:5173/gallery | 6 image grid |
| http://localhost:5173/pricing | Full pricing table from DB |
| http://localhost:5173/contact | Two-col layout with WhatsApp card |
| http://localhost:5173/owner-login | Login form |
| http://localhost:5173/dashboard | Redirects to /owner-login (no token) |

- [ ] **Step 4: Verify login and dashboard**

1. Go to http://localhost:5173/owner-login
2. Login with `admin@thefitnesslab.com` / `FitnessLab@2024`
3. Should redirect to /dashboard
4. Programs tab: edit a class name, save, verify change appears on /classes
5. Pricing tab: edit a price, save, verify change appears on /pricing
6. Account tab: change password, logout, login with new password

- [ ] **Step 5: Verify navbar scroll behavior**

Scroll down on home page — navbar should transition from transparent to solid black.

- [ ] **Step 6: Final commit**

```bash
git -C /Users/devaharsha/fitness-lab add -A
git -C /Users/devaharsha/fitness-lab commit -m "chore: final verification pass complete"
```
```
