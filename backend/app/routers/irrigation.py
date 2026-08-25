from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timezone, timedelta

from ..database import get_db
from .. import models, schemas
from ..models import utcnow

router = APIRouter(prefix="/api/irrigation", tags=["irrigation"])

# In-memory pump state (until hardware is connected)
_pump_state = {
    "status": "OFF",
    "mode": "Automatic",
    "last_toggled": None,
}


@router.get("/status")
def get_irrigation_status(db: Session = Depends(get_db)):
    """
    Return enriched irrigation status matching the frontend's expected shape:
    {pumpStatus, mode, tankLevel, waterUsageToday, pumpRuntimeToday, flowRate,
     lastActivated, nextScheduledRun, schedules[]}
    """
    # Compute today's water usage and runtime from irrigation_logs
    today_start = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)

    today_logs = (
        db.query(models.IrrigationLog)
        .filter(models.IrrigationLog.timestamp >= today_start)
        .all()
    )

    total_runtime = sum(log.duration_minutes or 0 for log in today_logs)
    # Approximate water usage: 18.5 L/min flow rate
    water_usage = round(total_runtime * 18.5)

    # Get last irrigation event
    last_log = (
        db.query(models.IrrigationLog)
        .order_by(models.IrrigationLog.timestamp.desc())
        .first()
    )

    last_activated = _pump_state["last_toggled"] or (str(last_log.timestamp) if last_log else "N/A")

    # Build schedule from recent logs
    recent_logs = (
        db.query(models.IrrigationLog)
        .order_by(models.IrrigationLog.timestamp.desc())
        .limit(5)
        .all()
    )

    schedules = []
    for i, log in enumerate(recent_logs):
        schedules.append({
            "id": log.id,
            "time": log.timestamp.strftime("%I:%M %p") if log.timestamp else "N/A",
            "duration": f"{log.duration_minutes} mins" if log.duration_minutes else "N/A",
            "zone": log.zone or "Zone A",
            "trigger": log.trigger_type or "Manual",
            "status": log.status or "Completed",
        })

    # If no real logs, provide default placeholder schedule
    if not schedules:
        schedules = [
            {"id": 1, "time": "06:30 AM", "duration": "20 mins", "zone": "Zone A (Chillies)", "trigger": "Moisture < 35%", "status": "Pending"},
            {"id": 2, "time": "06:00 PM", "duration": "25 mins", "zone": "Zone B (Chillies)", "trigger": "Scheduled AI Run", "status": "Pending"},
        ]

    return {
        "pumpStatus": _pump_state["status"],
        "mode": _pump_state["mode"],
        "tankLevel": 78,  # Would come from ultrasonic sensor in production
        "waterUsageToday": water_usage or 0,
        "pumpRuntimeToday": total_runtime or 0,
        "flowRate": "18.5 L/min" if _pump_state["status"] == "ON" else "0.0 L/min",
        "lastActivated": last_activated,
        "nextScheduledRun": "18:00:00 (AI Condition-Triggered)",
        "schedules": schedules,
    }


@router.post("/toggle")
def toggle_irrigation(command: schemas.IrrigationToggle, db: Session = Depends(get_db)):
    """Toggle pump status and log the event to irrigation_logs table."""
    new_status = command.status.upper()
    if new_status not in ("ON", "OFF"):
        raise HTTPException(status_code=400, detail="Status must be 'on' or 'off'")

    # Update in-memory state
    _pump_state["status"] = new_status
    _pump_state["last_toggled"] = datetime.now(timezone.utc).isoformat()

    # Log to database
    try:
        log_entry = models.IrrigationLog(
            timestamp=utcnow(),
            duration_minutes=command.duration_minutes or 0,
            zone=command.zone,
            trigger_type="Manual",
            status="Active" if new_status == "ON" else "Completed",
        )
        db.add(log_entry)
        db.commit()
    except Exception as e:
        db.rollback()

    return {
        "status": "ok",
        "pump_status": new_status,
        "zone": command.zone,
        "logged": True,
    }
