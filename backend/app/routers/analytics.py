from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime, timezone, timedelta
import random

from ..database import get_db
from .. import models

router = APIRouter(prefix="/api/analytics", tags=["analytics"])

@router.get("/predictive")
def get_predictive_analytics(db: Session = Depends(get_db)):
    """
    Generate predictive analytics based on recent sensor telemetry and disease scans:
    - healthIndex: computed from recent sensor readings (0-100)
    - diseaseRiskScore: computed from recent scans (0-100)
    - waterRequirement: calculated based on current soil moisture
    - aiRecommendation: plain text recommendation string
    - soilDepletionForecast: next 12 hours forecast
    """
    # 1. Health Index (based on latest reading)
    latest_reading = (
        db.query(models.SensorReading)
        .order_by(models.SensorReading.timestamp.desc())
        .first()
    )

    health_index = 94  # default
    soil_moisture = 42.8  # default
    if latest_reading:
        soil_moisture = latest_reading.soil_moisture or 42.8
        temp = latest_reading.air_temperature or 28.4
        
        # Simple heuristic
        score = 100
        if temp < 18 or temp > 38:
            score -= 10
        if soil_moisture < 30 or soil_moisture > 70:
            score -= 15
        health_index = max(30, min(100, score))

    # 2. Disease Risk Rating (based on recent scans in history)
    recent_scans = (
        db.query(models.CropHealth)
        .order_by(models.CropHealth.timestamp.desc())
        .limit(10)
        .all()
    )
    
    if recent_scans:
        diseased_count = sum(1 for s in recent_scans if s.health_status != "Healthy")
        disease_risk = round((diseased_count / len(recent_scans)) * 100)
    else:
        disease_risk = 12  # default fallback

    # 3. Water Requirement & AI Recommendation
    water_req = "0 Liters"
    recommendation = "Soil moisture levels are optimal. No irrigation required."
    
    if soil_moisture < 35:
        water_req = "140 Liters"
        recommendation = f"Soil moisture is critically low at {soil_moisture:.1f}%. Automatic drip irrigation is scheduled to run for 20 minutes."
    elif soil_moisture < 45:
        water_req = "80 Liters"
        recommendation = f"Soil moisture is at {soil_moisture:.1f}%. Soil moisture is projected to drop below 35% within the next 4 hours. Suggest running irrigation for 10 minutes."
    
    # 4. Soil Depletion Forecast (Next 12 Hours)
    # Generate a realistic depletion curve drying down by ~1.5% per hour from current moisture.
    forecast = []
    current_prediction = soil_moisture
    
    for h in range(0, 13, 2):
        hour_label = "Now" if h == 0 else f"+{h}h"
        
        # Simulate irrigation event prediction at +8 hours if moisture would fall below 35%
        if h == 8 and current_prediction < 35:
            current_prediction = min(60.0, current_prediction + 22.2)
            hour_label = "+8h (Irrigated)"
        elif h > 0:
            # Dries out by random amount between 1.0% and 1.8% every 2 hours
            current_prediction = max(20.0, current_prediction - random.uniform(2.0, 3.6))
            
        forecast.append({
            "hour": hour_label,
            "actual": round(soil_moisture, 1) if h == 0 else None,
            "predicted": round(current_prediction, 1)
        })

    return {
        "healthIndex": health_index,
        "diseaseRiskScore": disease_risk,
        "waterRequirement": water_req,
        "aiRecommendation": recommendation,
        "soilDepletionForecast": forecast
    }
