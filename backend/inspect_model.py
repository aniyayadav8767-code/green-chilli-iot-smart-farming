import torch
from pathlib import Path

# Adjust path based on your findings
model_path = Path(__file__).parent.parent / "ml" / "models" / "chilli_disease_best.pth"
checkpoint = torch.load(model_path, map_location=torch.device('cpu'))

if isinstance(checkpoint, dict):
    print("Checkpoint keys:", checkpoint.keys())
    
    for k in ["model_state_dict", "state_dict"]:
        if k in checkpoint:
            print(f"Found '{k}'")
else:
    print("Checkpoint is not a dictionary.")
    
