from flask import Flask, request, jsonify
import joblib
import pandas as pd
import json
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)



# Define the model path
model_path = "housing_model.pkl"

# Check if the model file exists
if not os.path.exists(model_path):
    raise FileNotFoundError(f"Model file not found: {model_path}")

# Load the trained model
model = joblib.load(model_path)

# Utility functions
def encode_city(city_name, mapping_file):
    with open(mapping_file, 'r') as file:
        mapping = json.load(file)
    for key, value in mapping.items():
        if value == city_name:
            return int(key)
    return None

def encode_location(location_name, mapping_file):
    with open(mapping_file, 'r') as file:
        mapping = json.load(file)
    for key, value in mapping.items():
        if value == location_name:
            return int(key)
    return None

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json
    baths = int(data["baths"])
    bedrooms = int(data["bedrooms"])
    area_sqft = float(data["area_sqft"])
    city = data["city"]
    location = data["location"]

    city_mapping_file = "city_mapping.json"
    location_mapping_file = "location_mapping.json"

    encoded_city = encode_city(city, city_mapping_file)
    encoded_location = encode_location(location, location_mapping_file)

    if encoded_city is None or encoded_location is None:
        return jsonify({"error": "City or Location not found in mapping"}), 400

    input_data = pd.DataFrame({
        'baths': [baths],
        'bedrooms': [bedrooms],
        'area_sqft': [area_sqft],
        'city': [encoded_city],
        'location': [encoded_location]
    })

    predicted_price = model.predict(input_data)[0]
    return jsonify({"predicted_price": predicted_price})

@app.route("/recommend", methods=["POST"])
def recommend():
    data = request.json
    budget = int(data["budget"])
    baths = int(data["baths"])
    bedrooms = int(data["bedrooms"])
    city = data["city"]

    properties = pd.DataFrame(data["properties"])

    suitable_properties = properties[
        (properties["price"] <= budget) &
        (properties["baths"] >= baths) &
        (properties["bedrooms"] >= bedrooms) &
        (properties["city"] == city)
    ]

    unique_locations = suitable_properties['location'].unique()[:10]

    decoded_locations = decode_locations(unique_locations, 'location_mapping.json')
    return jsonify({"recommended_locations": decoded_locations})


def decode_locations(encoded_locations, mapping_file):
    with open(mapping_file, 'r') as file:
        mapping = json.load(file)
    decoded_locations = [mapping[str(encoded)] for encoded in encoded_locations]
    return decoded_locations

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)