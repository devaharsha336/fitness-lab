import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import auth_routes, classes_routes, pricing_routes

# Disable Swagger UI and ReDoc in production to avoid exposing API schema
_debug = os.getenv("DEBUG", "false").lower() == "true"
app = FastAPI(
    title="The Fitness Lab API",
    docs_url="/docs" if _debug else None,
    redoc_url="/redoc" if _debug else None,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://fitness-lab-ochre.vercel.app"],
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
