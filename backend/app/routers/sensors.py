from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

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

@router.get("/summary")
def get_sensors_summary(db: Session = Depends(get_db)):
    # Returns the latest telemetry
    # For now simply return a stub, but would actually group by device_id and get max timestamp
    return {"status": "ok", "message": "Latest telemetry would appear here"}

@router.get("/timeseries")
def get_sensors_timeseries(
    device_id: Optional[str] = None, 
    start_time: Optional[datetime] = None, 
    end_time: Optional[datetime] = None,
    limit: int = Query(100, le=1000),
    db: Session = Depends(get_db)
):
    query = db.query(models.SensorReading)
    if device_id:
        query = query.filter(models.SensorReading.device_id == device_id)
    if start_time:
        query = query.filter(models.SensorReading.timestamp >= start_time)
    if end_time:
        query = query.filter(models.SensorReading.timestamp <= end_time)
        
    readings = query.order_by(models.SensorReading.timestamp.desc()).limit(limit).all()
    return readings
