from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from .database import Base
from datetime import datetime, timezone

def utcnow():
    return datetime.now(timezone.utc)

class Crop(Base):
    __tablename__ = "crops"
    id = Column(Integer, primary_key=True, index=True)
    crop_name = Column(String, index=True)
    scientific_name = Column(String)
    variety = Column(String)
    created_at = Column(DateTime(timezone=True), default=utcnow)
    
class Device(Base):
    __tablename__ = "devices"
    id = Column(String, primary_key=True, index=True)
    name = Column(String)
    type = Column(String)
    status = Column(String)
    ip_address = Column(String, nullable=True)
    uptime = Column(Integer, nullable=True)
    signal_strength = Column(Float, nullable=True)
    last_telemetry_at = Column(DateTime(timezone=True), nullable=True)
    
class SensorReading(Base):
    __tablename__ = "sensor_readings"
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime(timezone=True), default=utcnow)
    device_id = Column(String, ForeignKey("devices.id"))
    crop_id = Column(Integer, ForeignKey("crops.id"), nullable=True)
    variety = Column(String, nullable=True)
    soil_moisture = Column(Float, nullable=True)
    soil_temperature = Column(Float, nullable=True)
    air_temperature = Column(Float, nullable=True)
    humidity = Column(Float, nullable=True)
    soil_ph = Column(Float, nullable=True)
    light_intensity = Column(Float, nullable=True)
    rainfall = Column(Float, nullable=True)
    
    __table_args__ = (
        Index('idx_sensor_readings_timestamp', timestamp),
        Index('idx_sensor_readings_device_id', device_id),
    )

class IrrigationLog(Base):
    __tablename__ = "irrigation_logs"
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime(timezone=True), default=utcnow)
    duration_minutes = Column(Integer)
    zone = Column(String)
    trigger_type = Column(String)
    status = Column(String)

class CropHealth(Base):
    __tablename__ = "crop_health"
    id = Column(Integer, primary_key=True, index=True)
    crop_id = Column(Integer, ForeignKey("crops.id"))
    timestamp = Column(DateTime(timezone=True), default=utcnow)
    health_status = Column(String)
    disease_name = Column(String, nullable=True)
    confidence = Column(Float, nullable=True)
    image_path = Column(String, nullable=True)

class Prediction(Base):
    __tablename__ = "predictions"
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime(timezone=True), default=utcnow)
    crop_id = Column(Integer, ForeignKey("crops.id"))
    metric_name = Column(String)
    prediction_value = Column(Float)
    prediction_time = Column(DateTime(timezone=True))
