from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np
import pandas as pd
import requests


app = Flask(__name__)
CORS(app)


# ===============================
# Load ML Model + Encoder
# ===============================

with open("model.pkl", "rb") as f:
    model, le = pickle.load(f)

print("ML model loaded successfully!")


# ===============================
# Load Soil Data
# ===============================

soil_data = pd.read_csv("data/soil_data.csv")


# ===============================
# OpenWeather API Key
# ===============================

API_KEY = "207118263657af64b03bcd322bfb0c52" 


# ===============================
# Helper Functions
# ===============================

def get_soil_data(district):

    row = soil_data[
        soil_data["district"].str.lower() == district.lower()
    ]

    if row.empty:
        return None

    return row.iloc[0]


def get_weather(city):

    url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric"

    response = requests.get(url)
    data = response.json()

    if "main" not in data:
        return None

    temperature = data["main"]["temp"]
    humidity = data["main"]["humidity"]

    # Rainfall (if not available → default 100)
    rainfall = data.get("rain", {}).get("1h", 100)

    return temperature, humidity, rainfall


# ===============================
# Home API (Test)
# ===============================

@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "Smart Crop Advisory API is running"
    })


# ===============================
# Prediction API
# ===============================

@app.route("/predict", methods=["POST"])
def predict():

    try:

        data = request.get_json()

        if not data:
            return jsonify({"error": "No input data"}), 400


        # Get Inputs
        location = data.get("location")
        season = data.get("season")

        if not location or not season:
            return jsonify({"error": "Missing fields"}), 400


        # ==========================
        # Get Soil Data
        # ==========================

        soil = get_soil_data(location)

        if soil is None:
            return jsonify({"error": "District not found"}), 404


        N = soil["N"]
        P = soil["P"]
        K = soil["K"]
        ph = soil["ph"]


        # ==========================
        # Get Weather Data
        # ==========================

        weather = get_weather(location)

        if weather is None:
            return jsonify({"error": "Weather fetch failed"}), 500


        temperature, humidity, rainfall = weather


        # ==========================
        # Encode Season
        # ==========================

        season_encoded = le.transform([season])[0]


        # ==========================
        # Prepare Features
        # ==========================

        features = np.array([[
            N,
            P,
            K,
            temperature,
            humidity,
            ph,
            rainfall,
            season_encoded
        ]])


        # ==========================
        # Predict
        # ==========================

        prediction = model.predict(features)[0]

        print("PREDICTED:", prediction)


        # ==========================
        # Response
        # ==========================

        result = {
            "location": location,
            "season": season,
            "temperature": temperature,
            "humidity": humidity,
            "rainfall": rainfall,
            "recommended_crop": prediction
        }

        return jsonify(result)


    except Exception as e:

        print("ERROR:", e)

        return jsonify({
            "error": "Server failed"
        }), 500


# ===============================
# Run Server
# ===============================

if __name__ == "__main__":

    print("Starting Smart Crop Advisory Server...")

    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )
