from fastapi import APIRouter, HTTPException

from .. import schemas
from ..models import utcnow

router = APIRouter(prefix="/api/irrigation", tags=["irrigation"])

# Hardware state stub
MOCK_HARDWARE_STATE = {
    "zone1": "off",
    "zone2": "off"
}

@router.get("/status", response_model=list[schemas.IrrigationStatusResponse])
def get_irrigation_status():
    status_list = []
    for zone, state in MOCK_HARDWARE_STATE.items():
        status_list.append(
            schemas.IrrigationStatusResponse(
                zone=zone,
                status=state,
                last_updated=utcnow()
            )
        )
    return status_list

@router.post("/toggle")
def toggle_irrigation(command: schemas.IrrigationToggle):
    # Just a backend contract handling, do not pretend hardware responded
    return {
        "status": "pending_hardware_update", 
        "requested_zone": command.zone, 
        "requested_state": command.status
    }
