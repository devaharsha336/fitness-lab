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
