from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class SensorReadingCreate(BaseModel):
    device_id: str
    crop_id: Optional[int] = None
    soil_moisture: Optional[float] = None
    soil_temperature: Optional[float] = None
    air_temperature: Optional[float] = None
    humidity: Optional[float] = None
    soil_ph: Optional[float] = None
    light_intensity: Optional[float] = None
    rainfall: Optional[float] = None

class SensorReadingResponse(SensorReadingCreate):
    id: int
    timestamp: datetime
    
    class Config:
        orm_mode = True

class DeviceResponse(BaseModel):
    id: str
    name: str
    type: str
    status: str
    ip_address: Optional[str]
    uptime: Optional[int]
    signal_strength: Optional[float]
    last_telemetry_at: Optional[datetime]
    
    class Config:
        orm_mode = True

class IrrigationToggle(BaseModel):
    zone: str
    status: str # e.g. "on" or "off"
    duration_minutes: Optional[int] = None

class IrrigationStatusResponse(BaseModel):
    zone: str
    status: str
    last_updated: datetime

class AIResponse(BaseModel):
    disease: str
    class_index: int
    confidence: float
