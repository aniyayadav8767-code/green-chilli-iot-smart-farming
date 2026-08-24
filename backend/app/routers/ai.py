from fastapi import APIRouter, File, UploadFile, HTTPException
from PIL import Image
import io

from ..ml.predictor import predict_disease
from .. import schemas

router = APIRouter(prefix="/api/ai", tags=["ai"])

@router.post("/predict", response_model=schemas.AIResponse)
async def upload_and_predict(file: UploadFile = File(...)):
    if file.content_type not in ["image/jpeg", "image/png"]:
        raise HTTPException(status_code=400, detail="Unsupported image type")
        
    try:
        image_data = await file.read()
        image = Image.open(io.BytesIO(image_data)).convert('RGB')
        
        result = predict_disease(image)
        
        return schemas.AIResponse(
            disease=result["disease"],
            class_index=result["class_index"],
            confidence=result["confidence"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
