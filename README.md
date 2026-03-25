# 🏆 AI-Based Sand Mould Defect Detection & Prediction System

This project was developed during **SREC Innovate – Industrial Hackathon**, where we secured **1st Prize** 🥇 for solving a real-world problem provided by **Indoshell Mould Limited**.

---

## 📌 Problem Statement

**“Major rejection reduction – Sand defects in the top 3 rejection parts”**

In foundries, defects originating from sand moulds (such as cracks, erosion, and improper compaction) lead to high rejection rates in casting products. Detecting these issues early can significantly improve production quality and reduce waste.

---

## 💡 Solution Overview

We developed a **hybrid AI + IoT system** that:

- **Predicts defects before casting** using process parameters  
- **Detects defects after casting** using computer vision  
- **Monitors real-time sand conditions** using sensors  

This enables **predictive and preventive quality control** in foundries.

---

## ⚙️ System Architecture

    ┌────────────────────┐
    │  IoT Sensors       │
    │ (Moisture, Temp)   │
    └─────────┬──────────┘
              │
              ▼
    ┌────────────────────┐
    │  ANN Model         │
    │ (Defect Prediction)│
    └─────────┬──────────┘
              │
              ▼
    ┌────────────────────┐
    │  Decision System   │
    │ (Accept / Reject)  │
    └─────────┬──────────┘
              │
              ▼
    ┌────────────────────┐
    │  Camera Input      │
    └─────────┬──────────┘
              │
              ▼
    ┌────────────────────┐
    │  ResNet50 Model    │
    │ (Defect Detection) │
    └────────────────────┘


---

## 🔬 Key Features

- 📊 **Predictive Analysis** using ANN  
- 👁️ **Visual Inspection** using ResNet50  
- 🌡️ **Real-time Monitoring** with IoT sensors  
- ⚡ **Early defect prevention before casting**  
- 🏭 **Industry-relevant solution**

---

## 🧠 Methodology

### 1. Industry Research
- Visited a nearby foundry to understand sand moulding processes  
- Identified key parameters affecting mould quality  

---

### 2. Dataset Creation
- Created a **synthetic dataset** based on critical parameters:
  - Moisture
  - Temperature
  - Permeability *(or your parameter)*
  - Compaction *(or your parameter)*

---

### 3. ANN Model (Prediction)
- Input: Process parameters  
- Output: Defective / Non-defective prediction  
- Goal: Prevent defects before casting  

---

### 4. Computer Vision Model
- Model: **ResNet50 (Transfer Learning)**
- Task: Detect defects in casting products  
- Classes: Defective / Non-defective  

---

### 5. IoT Integration
- Sensors used:
  - *(Add your sensors here, e.g., DHT11, Soil Moisture Sensor)*  
- Purpose:
  - Capture real-time sand conditions  
  - Feed data into prediction model  

---

## 🛠️ Tech Stack

- Python  
- TensorFlow / PyTorch  
- OpenCV  
- Arduino / ESP32  
- IoT Sensors  
- Streamlit (optional dashboard)

---

## 📈 Results

- Successfully demonstrated:
  - Real-time defect prediction  
  - Visual defect detection  
  - Integration of AI + IoT  

- Achieved a working prototype within hackathon timeframe  

---

## 🚀 Future Improvements

- Collect larger real-world dataset from foundries  
- Improve model accuracy with advanced architectures (YOLO, EfficientNet)  
- Deploy as a real-time industrial monitoring system  
- Integrate cloud dashboard for remote monitoring  

---

## 📂 Project Structure

├── dataset/
├── models/
├── ann_model/
├── resnet_model/
├── iot_integration/
├── app/
└── README.md


---

## 📌 How to Run

1. Clone the repository:


2. Install dependencies:
pip install -r requirements.txt


3. Run the application:
python app.py


---

## 🙌 Acknowledgements

- SREC Innovate Hackathon organizers  
- Indoshell Mould Limited for the problem statement  
- Foundry professionals for sharing practical insights  

---

## 📬 Contact

Feel free to connect for collaboration or queries!

---

⭐ If you found this project interesting, consider giving it a star!

