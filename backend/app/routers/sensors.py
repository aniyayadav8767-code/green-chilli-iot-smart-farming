from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from datetime import datetime, timedelta, timezone

from ..database import get_db
from .. import models, schemas
from ..models import utcnow

router = APIRouter(prefix="/api/sensors", tags=["sensors"])


@router.post("/data")
def receive_telemetry(data: schemas.SensorReadingCreate, db: Session = Depends(get_db)):
    try:
        # Update device telemetry
        device = db.query(models.Device).filter(models.Device.id == data.device_id).first()
        if not device:
            raise HTTPException(status_code=404, detail="Device not found")
        
        device.last_telemetry_at = utcnow()
        db.commit()

        # Insert reading
        reading = models.SensorReading(**data.dict())
        db.add(reading)
        db.commit()
        db.refresh(reading)
        
        return {"status": "ok", "reading_id": reading.id}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


def _compute_status(value, low, high, labels=("Low", "Optimal", "High")):
    """Compute a human-readable status from value and range."""
    if value is None:
        return labels[1]  # default
    if value < low:
        return labels[0]
    if value > high:
        return labels[2]
    return labels[1]


def _badge(status_text):
    """Return a Tailwind badge class string based on status text."""
    s = status_text.lower()
    if s in ("optimal", "good", "healthy", "active"):
        return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
    elif s in ("high", "warning", "dry"):
        return "bg-amber-500/10 text-amber-600 border-amber-500/20"
    elif s in ("low", "critical", "wet"):
        return "bg-rose-500/10 text-rose-600 border-rose-500/20"
    return "bg-slate-500/10 text-slate-600 border-slate-500/20"


@router.get("/summary")
def get_sensors_summary(db: Session = Depends(get_db)):
    """Return the latest sensor telemetry formatted for the React frontend."""
    # Get the most recent reading
    latest = (
        db.query(models.SensorReading)
        .order_by(models.SensorReading.timestamp.desc())
        .first()
    )

    # If there are no readings yet, return a structured empty response
    if not latest:
        return {
            "temperature": {"value": "--", "unit": "°C", "trend": "N/A", "trendUp": False, "status": "No Data", "badgeColor": "bg-slate-500/10 text-slate-600 border-slate-500/20", "min": 18, "max": 38},
            "humidity": {"value": "--", "unit": "%", "trend": "N/A", "trendUp": False, "status": "No Data", "badgeColor": "bg-slate-500/10 text-slate-600 border-slate-500/20", "min": 40, "max": 85},
            "soilMoisture": {"value": "--", "unit": "%", "trend": "N/A", "trendUp": False, "status": "No Data", "badgeColor": "bg-slate-500/10 text-slate-600 border-slate-500/20", "min": 30, "max": 70},
            "lightIntensity": {"value": "--", "unit": "Lux", "trend": "N/A", "trendUp": False, "status": "No Data", "badgeColor": "bg-slate-500/10 text-slate-600 border-slate-500/20", "min": 200, "max": 1200},
            "pumpStatus": {"value": "UNKNOWN", "mode": "Unknown", "status": "No Data", "badgeColor": "bg-slate-500/10 text-slate-600 border-slate-500/20", "lastActivated": "N/A", "runtimeToday": "N/A"},
            "plantHealth": {"value": "--", "score": 0, "status": "No Data", "badgeColor": "bg-slate-500/10 text-slate-600 border-slate-500/20", "riskLevel": "Unknown"},
        }

    # Compute trend by comparing latest to the reading before it
    prev = (
        db.query(models.SensorReading)
        .filter(models.SensorReading.id < latest.id)
        .order_by(models.SensorReading.timestamp.desc())
        .first()
    )

    def _trend(new_val, old_val):
        if new_val is None or old_val is None or old_val == 0:
            return "N/A", False
        delta = ((new_val - old_val) / abs(old_val)) * 100
        return f"{delta:+.1f}%", delta >= 0

    temp_val = latest.air_temperature
    hum_val = latest.humidity
    soil_val = latest.soil_moisture
    light_val = latest.light_intensity

    temp_trend, temp_up = _trend(temp_val, prev.air_temperature if prev else None)
    hum_trend, hum_up = _trend(hum_val, prev.humidity if prev else None)
    soil_trend, soil_up = _trend(soil_val, prev.soil_moisture if prev else None)
    light_trend, light_up = _trend(light_val, prev.light_intensity if prev else None)

    temp_status = _compute_status(temp_val, 18, 38, ("Cold", "Optimal", "Hot"))
    hum_status = _compute_status(hum_val, 40, 85, ("Low", "Good", "High"))
    soil_status = _compute_status(soil_val, 30, 70, ("Dry", "Optimal", "Wet"))
    light_status = _compute_status(light_val, 200, 900, ("Low Light", "Good", "High Sun"))

    # Pump status from latest irrigation log
    last_irrigation = (
        db.query(models.IrrigationLog)
        .order_by(models.IrrigationLog.timestamp.desc())
        .first()
    )
    pump_active = last_irrigation and last_irrigation.status == "Active"
    pump_val = "PUMP ON" if pump_active else "PUMP OFF"
    pump_status_text = "Active" if pump_active else "Standby"

    # Plant health = simple heuristic from sensor quality
    health_score = 100
    if temp_val is not None:
        if temp_val < 15 or temp_val > 42:
            health_score -= 30
        elif temp_val < 18 or temp_val > 38:
            health_score -= 10
    if soil_val is not None:
        if soil_val < 20 or soil_val > 80:
            health_score -= 25
        elif soil_val < 30 or soil_val > 70:
            health_score -= 10
    if hum_val is not None:
        if hum_val < 30 or hum_val > 90:
            health_score -= 15
    health_score = max(0, min(100, health_score))
    health_status = "Healthy" if health_score >= 70 else ("Fair" if health_score >= 40 else "Critical")
    risk_level = "Low Risk" if health_score >= 70 else ("Medium Risk" if health_score >= 40 else "High Risk")

    return {
        "temperature": {
            "value": round(temp_val, 1) if temp_val is not None else "--",
            "unit": "°C",
            "trend": temp_trend,
            "trendUp": temp_up,
            "status": temp_status,
            "badgeColor": _badge(temp_status),
            "min": 18, "max": 38,
        },
        "humidity": {
            "value": round(hum_val, 1) if hum_val is not None else "--",
            "unit": "%",
            "trend": hum_trend,
            "trendUp": hum_up,
            "status": hum_status,
            "badgeColor": _badge(hum_status),
            "min": 40, "max": 85,
        },
        "soilMoisture": {
            "value": round(soil_val, 1) if soil_val is not None else "--",
            "unit": "%",
            "trend": soil_trend,
            "trendUp": soil_up,
            "status": soil_status,
            "badgeColor": _badge(soil_status),
            "min": 30, "max": 70,
        },
        "lightIntensity": {
            "value": round(light_val, 1) if light_val is not None else "--",
            "unit": "Lux",
            "trend": light_trend,
            "trendUp": light_up,
            "status": light_status,
            "badgeColor": _badge(light_status),
            "min": 200, "max": 1200,
        },
        "pumpStatus": {
            "value": pump_val,
            "mode": "Automatic AI Mode",
            "status": pump_status_text,
            "badgeColor": _badge(pump_status_text),
            "lastActivated": str(last_irrigation.timestamp) if last_irrigation else "N/A",
            "runtimeToday": "N/A",
        },
        "plantHealth": {
            "value": f"{health_score}%",
            "score": health_score,
            "status": health_status,
            "badgeColor": _badge(health_status),
            "riskLevel": risk_level,
        },
    }


@router.get("/timeseries")
def get_sensors_timeseries(
    device_id: Optional[str] = None,
    period: Optional[str] = Query("24h", description="Time period: 24h, 7d, 30d"),
    start_time: Optional[datetime] = None, 
    end_time: Optional[datetime] = None,
    limit: int = Query(100, le=1000),
    db: Session = Depends(get_db)
):
    """Return sensor readings formatted for Recharts (time, temp, humidity, moisture, light)."""
    query = db.query(models.SensorReading)

    if device_id:
        query = query.filter(models.SensorReading.device_id == device_id)

    # Apply period filter if no explicit start/end
    if not start_time and not end_time and period:
        now = datetime.now(timezone.utc)
        if period == "7d":
            start_time = now - timedelta(days=7)
        elif period == "30d":
            start_time = now - timedelta(days=30)
        else:  # default 24h
            start_time = now - timedelta(hours=24)

    if start_time:
        query = query.filter(models.SensorReading.timestamp >= start_time)
    if end_time:
        query = query.filter(models.SensorReading.timestamp <= end_time)
        
    readings = query.order_by(models.SensorReading.timestamp.asc()).limit(limit).all()

    # Format for Recharts: [{time, temp, humidity, moisture, light}, ...]
    result = []
    for r in readings:
        result.append({
            "time": r.timestamp.strftime("%H:%M") if r.timestamp else "",
            "temp": round(r.air_temperature, 1) if r.air_temperature is not None else None,
            "humidity": round(r.humidity, 1) if r.humidity is not None else None,
            "moisture": round(r.soil_moisture, 1) if r.soil_moisture is not None else None,
            "light": round(r.light_intensity, 1) if r.light_intensity is not None else None,
        })

    return result
