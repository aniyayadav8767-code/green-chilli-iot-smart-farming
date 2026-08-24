from fastapi import APIRouter

router = APIRouter(prefix="/api/weather", tags=["weather"])

@router.get("")
def get_weather():
    # Make this a clean service interface/stub
    return {"status": "not_configured", "message": "Weather provider is not yet connected"}
