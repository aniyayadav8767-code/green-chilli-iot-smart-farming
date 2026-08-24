import torch
from torchvision import models
import logging
from pathlib import Path

from ..config import settings

logger = logging.getLogger(__name__)

class ModelLoader:
    _instance = None
    
    def __init__(self):
        self.model = None
        self.classes = {
            0: "Chilli__Whitefly",
            1: "Chilli__Yellowish",
            2: "Chilli__Anthracnose",
            3: "Chilli__Damping_Off",
            4: "Chilli__Leaf_Curl_Virus",
            5: "Chilli__Leaf_Spot",
            6: "Chilli__Veinal_Mottle_Virus",
            7: "Chilli___healthy"
        }
        self.load_model()
        
    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance
        
    def load_model(self):
        try:
            raw_path = Path(settings.ml_model_path)
            if not raw_path.is_absolute():
                # Get the absolute path to the backend/ directory
                backend_dir = Path(__file__).resolve().parent.parent.parent
                resolved_path = (backend_dir / raw_path).resolve()
            else:
                resolved_path = raw_path.resolve()
                
            logger.info(f"Resolved ML model path: {resolved_path}")
            
            if not resolved_path.exists():
                logger.error(f"Model path does not exist: {resolved_path}")
                self.model = None
                return
                
            self.model = models.efficientnet_b0(weights=None)
            
            # modify classifier to match 8 classes
            num_ftrs = self.model.classifier[1].in_features
            self.model.classifier[1] = torch.nn.Linear(num_ftrs, len(self.classes))
            
            # Load state dict
            checkpoint = torch.load(resolved_path, map_location=torch.device('cpu'))
            if isinstance(checkpoint, dict) and "model_state_dict" in checkpoint:
                self.model.load_state_dict(checkpoint["model_state_dict"])
            elif isinstance(checkpoint, dict) and "state_dict" in checkpoint:
                self.model.load_state_dict(checkpoint["state_dict"])
            else:
                self.model.load_state_dict(checkpoint)
            self.model.eval()
            logger.info("Successfully loaded ML model")
        except Exception as e:
            logger.error(f"Failed to load model: {str(e)}")
            self.model = None

model_service = ModelLoader.get_instance()
