# Smart Foundry AI System (SmartCasting)

An AI-powered predictive and automated inspection system designed for Industry 4.0 casting manufacturing. This project integrates IoT sensors, computer vision, and machine learning to optimize foundry operations and reduce casting defects.

## 🚀 Key Features

- **AI-Driven Defect Prediction**: Utilizes deep learning models to predict casting defect risks based on real-time manufacturing parameters.
- **Automated Visual Inspection**: High-precision computer vision system (ResNet50-based) to identify surface defects like blowholes, scabs, and porosity from casting images.
- **Live IoT Sensor Integration**: Seamless connection with ESP32-based hardware for real-time monitoring of critical parameters like furnace temperature and sand moisture.
- **Smart Manufacturing Recommendations**: Dynamic, actionable advice provided for every detected defect to help engineers stabilize the process immediately.
- **Modern Industrial Dashboard**: High-performance React dashboard with a sleek, glassmorphism-inspired UI for intuitive monitoring and analysis.
- **Multifaceted Process Analysis**: Analyzes complex variables including moisture percentage, permeability, mold hardness, and pouring temperature.

## 🛠️ Technology Stack

- **Frontend**: React.js, Vite, Lucide React (Icons), Axios, CSS (Glassmorphism)
- **Backend**: Python, Flask, Flask-CORS
- **Machine Learning**: TensorFlow/Keras, Scikit-Learn, OpenCV, NumPy, Joblib
- **Hardware**: ESP32, Analog Moisture Sensors, WiFi-based HTTP Communication
- **Models**: CNN (ResNet50) for Image Classification, Neural Networks for Process Parameter Prediction

## 📁 Project Structure

```text
SmartCasting/
├── frontend/          # React + Vite Dashboard
├── backend/           # Flask API Service
│   ├── models/        # Trained ML/DL Models
│   └── utils/         # Prediction Logic & Preprocessing
└── hardware/          # ESP32 Firmware (Arduino/C++)
```

## 🔌 Setup Instructions

### Backend
1. Navigate to `SmartCasting/backend`.
2. Install dependencies: `pip install -r requirements.txt`.
3. Start the server: `python app.py`. (Runs on port 5000)

### Frontend
1. Navigate to `SmartCasting/frontend`.
2. Install dependencies: `npm install`.
3. Start the dev server: `npm run dev`.

### Hardware (Optional)
1. Open `hardware/esp32_sensor/esp32_sensor.ino` in Arduino IDE.
2. Update Wi-Fi credentials and backend IP address.
3. Flash to ESP32 board.

## 📝 Predicted Defect Types & Actions
- **Blowhole**: Reduce sand moisture below 5% and improve venting.
- **Sand Wash**: Increase mold hardness and reduce pouring rate.
- **Scab**: Reduce pouring temperature and check sand expansion.
- **Porosity**: Improve degassing process and reduce pouring temperature.

---
*Built for Industry 4.0 Manufacturing Excellence.*
