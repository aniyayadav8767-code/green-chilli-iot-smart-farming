from PIL import Image
import torch
from torchvision import transforms
from .model_loader import model_service

def preprocess_image(image: Image.Image):
    # EfficientNet-B0 standard transforms
    preprocessing = transforms.Compose([
        transforms.Resize(256),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ])
    return preprocessing(image).unsqueeze(0) # add batch dimension

def predict_disease(image: Image.Image):
    if model_service.model is None:
        raise Exception("ML Model is not loaded or unavailable")
        
    input_tensor = preprocess_image(image)
    
    with torch.no_grad():
        output = model_service.model(input_tensor)
        probabilities = torch.nn.functional.softmax(output[0], dim=0)
        
        confidence, predicted_idx = torch.max(probabilities, 0)
        
        class_idx = predicted_idx.item()
        score = confidence.item()
        
    disease_name = model_service.classes.get(class_idx, "Unknown")
    
    return {
        "disease": disease_name,
        "class_index": class_idx,
        "confidence": round(score, 4)
    }
