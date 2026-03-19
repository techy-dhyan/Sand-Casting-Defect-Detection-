from flask import Flask, request, jsonify
from flask_cors import CORS
from utils.process_predict import predict_process
from utils.image_predict import predict_image

app = Flask(__name__)
# Enable CORS for the React frontend
CORS(app)

# Store the latest sensor data ping via ESP32
latest_sensor_data = {}

def get_recommendation(defect):
    """
    Provide actionable manufacturing recommendation based on the predicted defect.
    """
    if defect == "Blowhole":
        return "Reduce sand moisture below 5% and improve venting."
    elif defect == "Sand_Wash":
        return "Increase mold hardness and reduce pouring rate."
    elif defect == "Scab":
        return "Reduce pouring temperature and check sand expansion properties."
    elif defect == "Porosity":
        return "Improve degassing process and reduce pouring temperature."
    elif defect == "Defective":
        return "Inspect casting visually for gating system issues or surface anomalies."
    
    return "Process is stable. No action required."

@app.route("/sensor-data", methods=["POST"])
def receive_sensor():
    global latest_sensor_data
    try:
        latest_sensor_data = request.json
        print("Received ESP32 sensor ping:", latest_sensor_data)
        return jsonify({"status": "received"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 400

@app.route("/get-sensor-data", methods=["GET"])
def get_sensor():
    return jsonify(latest_sensor_data)

@app.route("/predict-process", methods=["POST"])
def process_api():
    try:
        data = request.json
        print("Received process data:", data)
        result = predict_process(data)
        recommendation = get_recommendation(result)
        
        return jsonify({
            "prediction": result,
            "recommendation": recommendation,
            "status": "success"
        })
    except Exception as e:
        print(f"Error in process prediction: {e}")
        return jsonify({"prediction": "Error", "status": "error", "message": str(e)}), 500

@app.route("/predict-image", methods=["POST"])
def image_api():
    try:
        if "image" not in request.files:
            return jsonify({"prediction": "Error", "status": "error", "message": "No image part in the request"}), 400
            
        file = request.files["image"]
        
        if file.filename == '':
            return jsonify({"prediction": "Error", "status": "error", "message": "No selected file"}), 400
            
        result = predict_image(file)
        recommendation = get_recommendation(result)
        
        return jsonify({
            "prediction": result,
            "recommendation": recommendation,
            "status": "success"
        })
    except Exception as e:
        import traceback
        traceback.print_exc()
        print(f"Error in image prediction: {e}")
        return jsonify({"prediction": "Error", "status": "error", "message": str(e)}), 500

if __name__ == "__main__":
    print("Starting Smart Casting AI Backend...")
    app.run(debug=True, port=5000)
