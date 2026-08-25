import sys
import os
from datetime import datetime, timedelta, timezone

# Add backend directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal
from app import models

def seed():
    db = SessionLocal()
    try:
        # Check if already seeded
        if db.query(models.Device).first():
            print("Database already contains devices. Skipping seed.")
            return

        print("Seeding database with initial IoT devices, sensor readings, and AI history...")

        # 1. Seed Crops
        crop_chilli = models.Crop(
            crop_name="Guntur Chilli",
            scientific_name="Capsicum annuum",
            variety="Teja"
        )
        db.add(crop_chilli)
        db.flush() # gets ID

        # 2. Seed Devices
        dev_sensors = models.Device(
            id="NODE_ESP8266_A",
            name="Field Telemetry Gateway",
            type="ESP8266 Sensors",
            status="Online",
            ip_address="10.95.60.102",
            uptime=342000, # 95 hours
            signal_strength=82.4
        )
        dev_cam = models.Device(
            id="NODE_ESP32_CAM",
            name="Camera Node",
            type="ESP32-CAM Node",
            status="Online",
            ip_address="10.95.60.188",
            uptime=172800, # 48 hours
            signal_strength=74.5
        )
        db.add_all([dev_sensors, dev_cam])

        # 3. Seed Sensor Readings
        # Create readings over the last 24 hours to generate timeseries graphs
        base_time = datetime.now(timezone.utc)
        readings = []
        for i in range(24):
            time_point = base_time - timedelta(hours=i)
            # Make readings fluctuate realistically
            readings.append(models.SensorReading(
                device_id="NODE_ESP8266_A",
                crop_id=crop_chilli.id,
                timestamp=time_point,
                soil_moisture=38.5 + (i % 5) * 1.5 - (i % 3) * 0.8,
                air_temperature=26.4 + (i % 4) * 0.9 - (i % 3) * 0.5,
                humidity=65.2 - (i % 5) * 1.2 + (i % 3) * 1.0,
                light_intensity=6500 - (i % 8) * 400 + (300 if i < 12 else -500),
                soil_ph=6.4,
                rainfall=0.0
            ))
        db.add_all(readings)

        # 4. Seed Crop Health AI Scans
        health_scans = [
            models.CropHealth(
                crop_id=crop_chilli.id,
                timestamp=base_time - timedelta(minutes=45),
                health_status="Healthy",
                disease_name="Chilli___healthy",
                confidence=0.9750,
                image_path="https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&w=400&q=85"
            ),
            models.CropHealth(
                crop_id=crop_chilli.id,
                timestamp=base_time - timedelta(hours=3),
                health_status="Diseased",
                disease_name="Chilli__Whitefly",
                confidence=0.8840,
                image_path="https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=400&q=85"
            ),
            models.CropHealth(
                crop_id=crop_chilli.id,
                timestamp=base_time - timedelta(hours=12),
                health_status="Healthy",
                disease_name="Chilli___healthy",
                confidence=0.9410,
                image_path="https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&w=400&q=85"
            ),
            models.CropHealth(
                crop_id=crop_chilli.id,
                timestamp=base_time - timedelta(hours=22),
                health_status="Diseased",
                disease_name="Chilli__Leaf_Curl_Virus",
                confidence=0.9120,
                image_path="https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&w=400&q=85"
            )
        ]
        db.add_all(health_scans)

        # 5. Seed Irrigation Logs
        irrigation_events = [
            models.IrrigationLog(
                timestamp=base_time - timedelta(hours=6),
                duration_minutes=20,
                zone="Zone A (Chillies)",
                trigger_type="Scheduled AI Run",
                status="Completed"
            ),
            models.IrrigationLog(
                timestamp=base_time - timedelta(hours=18),
                duration_minutes=15,
                zone="Zone B (Chillies)",
                trigger_type="Moisture < 35%",
                status="Completed"
            )
        ]
        db.add_all(irrigation_events)

        db.commit()
        print("Database successfully seeded!")
    except Exception as e:
        db.rollback()
        import traceback
        traceback.print_exc()
        print(f"Error seeding database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed()
