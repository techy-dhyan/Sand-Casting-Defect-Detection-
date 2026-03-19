# Smart Casting AI Models

This directory is where you should place your trained ML models for the application to load them correctly.

## Required Process Models (Scikit-Learn)
1. `sand_defect_model.pkl`: A scikit-learn model predicting defect types from parameters (moisture_percent, permeability, mold_hardness, pouring_temp_C).
2. `label_encoder.pkl`: The exact joblib LabelEncoder used to inverse_transform the predictions.

## Required Image Models (Keras/Tensorflow)
1. `casting_defect_resnet50_model.h5`: A standard Keras `.h5` model configured to accept `224x224` images with 3 channels, returning a binary classification (0 for Defective, 1 for Not Defective, or conversely, adjust threshold in `utils/image_predict.py`).

*Note: If these files are absent, the application is configured to run entirely on dynamic "mock" logic, so you can test the UI and demonstrate the flow seamlessly even if the data scientists are still training the actual models!*
