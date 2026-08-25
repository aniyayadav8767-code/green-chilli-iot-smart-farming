from fastapi import APIRouter, File, UploadFile, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from PIL import Image
import io
import base64
import httpx
import logging

from ..ml.predictor import predict_disease
from ..database import get_db
from .. import models, schemas
from ..models import utcnow

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/ai", tags=["ai"])


def _save_prediction(db: Session, disease: str, confidence: float, image_path: str = None):
    """Save a prediction result to the crop_health table."""
    try:
        health_record = models.CropHealth(
            crop_id=None,  # No specific crop ID for now
            timestamp=utcnow(),
            health_status="Healthy" if "healthy" in disease.lower() else "Diseased",
            disease_name=disease,
            confidence=confidence,
            image_path=image_path,
        )
        db.add(health_record)
        db.commit()
        db.refresh(health_record)
        return health_record.id
    except Exception as e:
        db.rollback()
        logger.error(f"Failed to save prediction: {e}")
        return None


@router.post("/predict", response_model=schemas.AIResponse)
async def upload_and_predict(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """Manual image upload → EfficientNet-B0 inference → save to DB."""
    if file.content_type not in ["image/jpeg", "image/png"]:
        raise HTTPException(status_code=400, detail="Unsupported image type")
        
    try:
        image_data = await file.read()
        image = Image.open(io.BytesIO(image_data)).convert('RGB')
        
        result = predict_disease(image)
        
        # Save prediction to crop_health table
        _save_prediction(db, result["disease"], result["confidence"])
        
        return schemas.AIResponse(
            disease=result["disease"],
            class_index=result["class_index"],
            confidence=result["confidence"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/capture")
async def capture_and_predict(ip: str, db: Session = Depends(get_db)):
    """
    Production camera pathway:
    1. FastAPI fetches image from ESP32-CAM at http://{ip}/capture
    2. Runs EfficientNet-B0 inference
    3. Saves result to crop_health table
    4. Returns prediction + base64 image to frontend
    """
    if not ip or not ip.strip():
        raise HTTPException(status_code=400, detail="ESP32-CAM IP address is required")
    
    clean_ip = ip.strip().replace("http://", "").replace("https://", "").split("/")[0]
    capture_url = f"http://{clean_ip}/capture"
    
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(capture_url)
            
        if response.status_code != 200:
            raise HTTPException(
                status_code=502,
                detail=f"ESP32-CAM returned status {response.status_code}"
            )
        
        image_bytes = response.content
        image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        
        # Run EfficientNet-B0 inference
        result = predict_disease(image)
        
        # Save prediction to crop_health table
        record_id = _save_prediction(db, result["disease"], result["confidence"], f"esp32_capture_{clean_ip}")
        
        # Encode image as base64 for frontend display
        img_base64 = base64.b64encode(image_bytes).decode('utf-8')
        content_type = response.headers.get("content-type", "image/jpeg")
        
        return {
            "disease": result["disease"],
            "class_index": result["class_index"],
            "confidence": result["confidence"],
            "image_base64": f"data:{content_type};base64,{img_base64}",
            "record_id": record_id,
            "source": "esp32_cam",
            "esp_ip": clean_ip,
        }
        
    except httpx.ConnectError:
        raise HTTPException(
            status_code=503,
            detail=f"Cannot connect to ESP32-CAM at {capture_url}. Ensure the device is powered on and on the same network as the server."
        )
    except httpx.TimeoutException:
        raise HTTPException(
            status_code=504,
            detail=f"ESP32-CAM at {capture_url} timed out. The device may be busy or unreachable."
        )
    except Exception as e:
        logger.error(f"Capture and predict error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/crop-health")
def get_latest_crop_health(db: Session = Depends(get_db)):
    """Return the most recent AI prediction from crop_health table."""
    latest = (
        db.query(models.CropHealth)
        .order_by(models.CropHealth.timestamp.desc())
        .first()
    )
    
    if not latest:
        return {
            "status": "no_data",
            "message": "No AI predictions have been run yet.",
        }
    
    return {
        "id": latest.id,
        "timestamp": str(latest.timestamp),
        "health_status": latest.health_status,
        "disease_name": latest.disease_name,
        "confidence": latest.confidence,
        "image_path": latest.image_path,
    }


@router.get("/history")
def get_prediction_history(
    limit: int = Query(10, le=50),
    db: Session = Depends(get_db)
):
    """Return recent AI prediction history from crop_health table."""
    records = (
        db.query(models.CropHealth)
        .order_by(models.CropHealth.timestamp.desc())
        .limit(limit)
        .all()
    )
    
    return [
        {
            "id": r.id,
            "timestamp": str(r.timestamp),
            "health_status": r.health_status,
            "disease_name": r.disease_name,
            "confidence": r.confidence,
            "image_path": r.image_path,
        }
        for r in records
    ]
