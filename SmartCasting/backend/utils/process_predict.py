import joblib
import numpy as np
import os
import random

# Define paths to model files
MODEL_PATH = os.path.join(os.path.dirname(__file__), "../models/sand_defect_model.pkl")
ENCODER_PATH = os.path.join(os.path.dirname(__file__), "../models/label_encoder.pkl")

# Attempt to load models, fallback to mock if they don't exist
try:
    if os.path.exists(MODEL_PATH) and os.path.exists(ENCODER_PATH):
        model = joblib.load(MODEL_PATH)
        encoder = joblib.load(ENCODER_PATH)
        MODEL_LOADED = True
    else:
        MODEL_LOADED = False
        print("Warning: Process prediction models not found. Using mock fallback.")
except Exception as e:
    MODEL_LOADED = False
    print(f"Error loading process prediction models: {e}. Using mock fallback.")

def predict_process(data):
    """
    Predict defect risk based on process parameters.
    Expected data dict:
    {
        "moisture_percent": 5.2,
        "permeability": 100,
        "mold_hardness": 95,
        "pouring_temp_C": 1450
    }
    """
    if MODEL_LOADED:
        features = np.array([[
            data.get("moisture_percent", 5.0),
            data.get("permeability", 100),
            data.get("mold_hardness", 90),
            data.get("pouring_temp_C", 1400)
        ]])
        
        pred = model.predict(features)
        label = encoder.inverse_transform(pred)[0]
        return label
    else:
        # --- MOCK LOGIC FOR HACKATHON DEMO ---
        # Analyze parameters to give a realistic pseudo-prediction
        moisture = data.get("moisture_percent", 5.0)
        hardness = data.get("mold_hardness", 90)
        temp = data.get("pouring_temp_C", 1400)
        
        if moisture > 5.0:
            return "Blowhole"
        elif hardness < 85:
            return "Sand_Wash"
        elif temp > 1430:
            return "Scab"
        
        # If parameters are somewhat reasonable, there's a chance of no defect
        if random.random() > 0.5:
            return "No Defect"
        else:
            return random.choice(["Blowhole", "Sand_Wash", "Scab", "Porosity"])
