from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from .. import models, schemas

router = APIRouter(prefix="/api/devices", tags=["devices"])

@router.get("", response_model=List[schemas.DeviceResponse])
def list_devices(db: Session = Depends(get_db)):
    devices = db.query(models.Device).all()
    return devices

@router.get("/{device_id}", response_model=schemas.DeviceResponse)
def get_device(device_id: str, db: Session = Depends(get_db)):
    device = db.query(models.Device).filter(models.Device.id == device_id).first()
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")
    return device
