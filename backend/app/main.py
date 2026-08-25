from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import Dict

from .config import settings
from .database import get_db, engine
from .routers import sensors, devices, irrigation, ai, weather, analytics

app = FastAPI(
    title="Green Chilli IoT Smart Farming API",
    description="Backend API for IoT sensors, AI prediction, and hardware control.",
    version="1.0.0"
)

# Set up CORS
origins = settings.cors_allowed_origins.split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(sensors.router)
app.include_router(devices.router)
app.include_router(irrigation.router)
app.include_router(ai.router)
app.include_router(weather.router)
app.include_router(analytics.router)

@app.get("/health")
def health_check(db: Session = Depends(get_db)) -> Dict[str, str]:
    if engine is None:
         return {"status": "error", "database": "not configured"}
    try:
        # Check database connectivity
        db.execute(text("SELECT 1"))
        return {"status": "ok", "database": "connected"}
    except Exception as e:
        return {"status": "error", "database": f"failed: {str(e)}"}
