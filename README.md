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

### Add gym photos

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
6. Add environment variables: `MONGO_URI`, `JWT_SECRET`, `JWT_ALGORITHM=HS256`, `ACCESS_TOKEN_EXPIRE_MINUTES=1440`
7. Deploy and note the service URL (e.g., `https://fitness-lab-api.onrender.com`)

### Frontend → Vercel
1. Import repo on vercel.com
2. Set root directory to `fitness-lab/frontend`
3. Add environment variable: `VITE_API_URL` = your Render service URL
4. Deploy — `vercel.json` handles SPA routing automatically
