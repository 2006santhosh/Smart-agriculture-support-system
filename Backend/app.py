from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np
import pandas as pd
import os
from PIL import Image
from tensorflow.keras.models import load_model

app = Flask(__name__)
CORS(app)

# ===============================
# LOAD MODELS
# ===============================

# 🌿 Plant disease model
disease_model = load_model("leaf_disease_model.h5")

# 🌾 Crop recommendation model
with open("crop_model.pkl", "rb") as f:
    crop_model, crop_encoder = pickle.load(f)

# 🐄 Animal disease model
with open("model.pkl", "rb") as f:
    animal_model, animal_columns = pickle.load(f)

print("✅ All models loaded successfully")

# ===============================
# FILE UPLOAD SETUP
# ===============================
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

# ===============================
# PLANT DISEASE LABELS
# ===============================
disease_classes = [
    "Early Blight",
    "Late Blight",
    "Leaf Mold",
    "Septoria Leaf Spot",
    "Healthy"
]

# ===============================
# TAMIL NADU CROPS
# ===============================
TN_CROPS = [
    "rice","sugarcane","maize","millet","millets",
    "groundnut","cotton","banana","coconut",
    "pulses","ragi","sorghum"
]

DISTRICT_PRIORITY = {
    "thanjavur": ["Rice","Sugarcane"],
    "nagapattinam": ["Rice"],
    "erode": ["Sugarcane","Turmeric"],
    "coimbatore": ["Coconut","Maize"],
    "salem": ["Millets","Pulses"],
    "madurai": ["Millets","Groundnut"],
    "tirunelveli": ["Banana","Pulses"],
    "dindigul": ["Millets","Groundnut"],
}

# ===============================
# HELPERS
# ===============================
def get_weather(city):
    return 28, 70, 100

def get_soil_by_city(city):
    soil_map = {
        "madurai":[35,30,28,6.2],
        "erode":[60,40,35,6.5],
        "coimbatore":[55,45,40,6.8],
        "thanjavur":[80,40,40,6.7],
        "salem":[65,50,42,6.6],
        "tirunelveli":[30,25,25,6.3],
        "dindigul":[40,35,30,6.4],
    }
    return soil_map.get(city.lower(), [50,40,40,6.5])

def suitability_label(prob):
    if prob > 70:
        return "Highly Suitable"
    elif prob > 50:
        return "Suitable"
    else:
        return "Moderately Suitable"

# ===============================
# HOME
# ===============================
@app.route("/")
def home():
    return jsonify({"message": "Smart Agriculture API running"})

# ===============================
# CROP RECOMMENDATION
# ===============================
@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()
        location = data.get("location","").strip()
        season = data.get("season","Kharif")

        if not location:
            return jsonify({"error":"Location required"}),400

        if location.lower() == "chennai":
            return jsonify({
                "location":location,
                "note":"Urban region detected",
                "urban_farming_options":[
                    "Spinach","Tomato","Chilli","Coriander","Mint"
                ]
            })

        N,P,K,ph = get_soil_by_city(location)
        temperature,humidity,rainfall = get_weather(location)

        if season == "Kharif":
            rainfall *= 1.3
        elif season == "Rabi":
            rainfall *= 0.7
        elif season == "Summer":
            rainfall *= 0.4

        features = pd.DataFrame([{
            "N":N,"P":P,"K":K,"pH":ph,
            "rainfall":rainfall,
            "temperature":temperature
        }])

        probs = crop_model.predict_proba(features)[0]
        indices = np.argsort(probs)[-5:][::-1]
        crops = crop_encoder.inverse_transform(indices)
        probs = probs[indices]*100

        # ===============================
        # FIXED RECOMMENDATION LOGIC
        # ===============================
        recommendations = []

        for crop, prob in zip(crops, probs):
            recommendations.append({
                "crop": crop,
                "suitability": suitability_label(prob)
            })

        if location.lower() in DISTRICT_PRIORITY:
            priority = DISTRICT_PRIORITY[location.lower()]
            for c in priority:
                recommendations.insert(0,{
                    "crop": c,
                    "suitability": "Highly Suitable"
                })

        unique=[]
        for rec in recommendations:
            if rec["crop"] not in [u["crop"] for u in unique]:
                unique.append(rec)

        recommendations = unique[:3]

        if not recommendations:
            recommendations = [
                {"crop":"Maize","suitability":"Suitable"},
                {"crop":"Millets","suitability":"Suitable"},
                {"crop":"Groundnut","suitability":"Moderately Suitable"}
            ]

        return jsonify({
            "location":location,
            "season":season,
            "top_recommendations":recommendations
        })

    except Exception as e:
        print("Prediction Error:",e)
        return jsonify({"error":"Prediction failed"}),500

# ===============================
# PLANT DISEASE DETECTION
# ===============================
def is_leaf_image(image):
    green = image[:,:,1]
    red = image[:,:,0]
    blue = image[:,:,2]

    green_pixels = np.sum((green > red) & (green > blue))
    total_pixels = image.shape[0] * image.shape[1]
    green_ratio = green_pixels / total_pixels

    texture = np.std(image)

    return green_ratio > 0.25 and texture > 20

def center_has_green(image):
    h, w, _ = image.shape
    center = image[h//4:3*h//4, w//4:3*w//4]

    green_pixels = np.sum(
        (center[:,:,1] > center[:,:,0]) &
        (center[:,:,1] > center[:,:,2])
    )

    ratio = green_pixels / (center.shape[0] * center.shape[1])
    return ratio > 0.20

@app.route("/detect-disease", methods=["POST"])
def detect_disease():
    try:
        if "image" not in request.files:
            return jsonify({"error": "No image uploaded"}), 400

        file = request.files["image"]
        filepath = os.path.join(app.config["UPLOAD_FOLDER"], file.filename)
        file.save(filepath)

        raw_img = Image.open(filepath).convert("RGB")
        raw_np = np.array(raw_img)

        if not is_leaf_image(raw_np) or not center_has_green(raw_np):
            return jsonify({
                "disease": "No leaf detected",
                "confidence": 0,
                "remedy": "Upload a clear leaf image."
            })

        img = raw_img.resize((224, 224))
        img = np.array(img) / 255.0
        img = np.expand_dims(img, axis=0)

        prediction = disease_model.predict(img)[0]

        index = int(np.argmax(prediction))
        confidence = float(np.max(prediction))
        disease = disease_classes[index]

        sorted_probs = np.sort(prediction)
        if sorted_probs[-1] - sorted_probs[-2] < 0.15:
            return jsonify({
                "disease": "Uncertain",
                "confidence": round(confidence*100,2),
                "remedy": "Leaf not clearly visible."
            })

        if confidence < 0.80:
            return jsonify({
                "disease": "Uncertain",
                "confidence": round(confidence*100,2),
                "remedy": "Retake photo in better lighting."
            })

        if disease == "Healthy":
            return jsonify({
                "disease": "Healthy",
                "confidence": round(confidence*100,2),
                "remedy": "Leaf is healthy."
            })

        remedies = {
            "Early Blight": "Remove infected leaves and apply fungicide.",
            "Late Blight": "Improve air circulation and apply fungicide.",
            "Leaf Mold": "Reduce humidity and improve ventilation.",
            "Septoria Leaf Spot": "Remove affected leaves."
        }

        return jsonify({
            "disease": disease,
            "confidence": round(confidence*100,2),
            "remedy": remedies.get(disease, "Consult agricultural expert.")
        })

    except Exception as e:
        print("Detection Error:", e)
        return jsonify({"error": "Detection failed"}), 500

# ===============================
# 🐄 ANIMAL DISEASE PREDICTION
# ===============================
@app.route("/predict-animal-disease", methods=["POST"])
def predict_animal_disease():
    try:
        data = request.get_json()
        animal = data.get("Animal")

        fever = data.get("Fever", 0)
        mouth = data.get("Mouth_Lesions", 0)
        lame = data.get("Lameness", 0)
        milk = data.get("Milk_Drop", 0)
        nodules = data.get("Skin_Nodules", 0)
        diarrhea = data.get("Diarrhea", 0)
        cough = data.get("Cough", 0)
        appetite = data.get("Loss_Appetite", 0)
        nasal = data.get("Nasal_Discharge", 0)
        swelling = data.get("Swelling", 0)

        if sum([fever,mouth,lame,milk,nodules,diarrhea,cough,appetite,nasal,swelling]) == 0:
            return jsonify({
                "predicted_disease": "Healthy",
                "confidence": "High",
                "treatment": "No treatment required.",
                "advice": "Animal is healthy."
            })

        if animal == "Cow":

            if mouth and lame:
                return jsonify({
                    "predicted_disease": "Foot and Mouth Disease",
                    "confidence": "High",
                    "treatment": "Isolate animal. Disinfect area. Restrict movement.",
                    "advice": "Contact veterinarian immediately."
                })

            if milk and swelling:
                return jsonify({
                    "predicted_disease": "Mastitis",
                    "confidence": "High",
                    "treatment": "Clean udder, discard milk, apply antibiotic treatment.",
                    "advice": "Consult veterinarian."
                })

            if nodules:
                return jsonify({
                    "predicted_disease": "Lumpy Skin Disease",
                    "confidence": "High",
                    "treatment": "Isolate animal and control insects.",
                    "advice": "Seek veterinary care."
                })

            if milk and appetite:
                return jsonify({
                    "predicted_disease": "Brucellosis",
                    "confidence": "Medium",
                    "treatment": "Avoid consuming raw milk.",
                    "advice": "Veterinary testing required."
                })

        if animal == "Goat":

            if diarrhea and nasal and cough:
                return jsonify({
                    "predicted_disease": "PPR (Goat Plague)",
                    "confidence": "High",
                    "treatment": "Isolate infected goats and provide supportive care.",
                    "advice": "Urgent veterinary attention required."
                })

            if nodules:
                return jsonify({
                    "predicted_disease": "Goat Pox",
                    "confidence": "High",
                    "treatment": "Apply antiseptic to lesions and isolate animal.",
                    "advice": "Consult veterinarian."
                })

        if animal == "Sheep":

            if lame and swelling:
                return jsonify({
                    "predicted_disease": "Foot Rot",
                    "confidence": "High",
                    "treatment": "Clean hooves and apply antiseptic footbath.",
                    "advice": "Keep feet dry and clean."
                })

            if diarrhea and appetite:
                return jsonify({
                    "predicted_disease": "Enterotoxemia",
                    "confidence": "High",
                    "treatment": "Immediate veterinary care required.",
                    "advice": "Emergency condition."
                })

        return jsonify({
            "predicted_disease": "General Infection",
            "confidence": "Low",
            "treatment": "Provide fluids and maintain hygiene.",
            "advice": "Consult veterinarian if symptoms continue."
        })

    except Exception as e:
        print("Prediction Error:", e)
        return jsonify({"error": "Prediction failed"}), 500

# ===============================
# RUN SERVER
# ===============================
if __name__ == "__main__":
    app.run(debug=True)