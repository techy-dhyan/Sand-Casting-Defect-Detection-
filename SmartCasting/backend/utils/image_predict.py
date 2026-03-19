import os
import random
import numpy as np
import cv2

try:
    # We only import TF here so that if the user doesn't have it installed yet, the mock fallback still somewhat works 
    # (though requirements.txt specifies it)
    import tensorflow as tf
except ImportError:
    tf = None

MODEL_PATH = os.path.join(os.path.dirname(__file__), "../models/casting_defect_resnet50_model.h5")
IMG_SIZE = 224

try:
    if tf and os.path.exists(MODEL_PATH):
        model = tf.keras.models.load_model(MODEL_PATH)
        MODEL_LOADED = True
    else:
        MODEL_LOADED = False
        print("Warning: Image prediction model not found or tensorflow not installed. Using mock fallback.")
except Exception as e:
    MODEL_LOADED = False
    print(f"Error loading image prediction model: {e}. Using mock fallback.")

def predict_image(file):
    if MODEL_LOADED:
        # Convert file upload directly to opencv format
        img = cv2.imdecode(np.frombuffer(file.read(), np.uint8), cv2.IMREAD_COLOR)
        if img is None:
            return "Error parsing image"
            
        img = cv2.resize(img, (IMG_SIZE, IMG_SIZE))
        img = img / 255.0
        
        img = np.expand_dims(img, axis=0)
        
        pred = model.predict(img)[0][0]
        
        if pred > 0.5:
            return "Defective"
        else:
            return "No Defect"
    else:
        # --- MOCK LOGIC FOR HACKATHON DEMO ---
        # Simply returns a random determination to showcase the UI flow
        return random.choice(["Defective", "No Defect", "Defective"])
