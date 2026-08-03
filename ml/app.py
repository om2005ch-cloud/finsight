from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib

app = Flask(__name__)
CORS(app)

model = joblib.load("category_model.pkl")
vectorizer = joblib.load("vectorizer.pkl")

@app.route("/predict-category", methods=["POST"])
def predict_category():
    data = request.get_json()
    description = data.get("description", "")

    if not description:
        return jsonify({"error": "description is required"}), 400

    vec = vectorizer.transform([description])
    prediction = model.predict(vec)[0]

    # get confidence score too
    probabilities = model.predict_proba(vec)[0]
    confidence = max(probabilities)

    return jsonify({
        "category": prediction,
        "confidence": round(float(confidence), 2)
    })
import numpy as np
from sklearn.linear_model import LinearRegression

@app.route("/forecast", methods=["POST"])
def forecast():
    data = request.get_json()
    history = data.get("history", [])  # list of {"month": "2026-02", "total": 2200}

    if len(history) < 2:
        return jsonify({"error": "Need at least 2 months of data to forecast"}), 400

    # convert months to simple numbers: 0, 1, 2, 3...
    X = np.array(range(len(history))).reshape(-1, 1)
    y = np.array([float(h["total"]) for h in history])

    model = LinearRegression()
    model.fit(X, y)

    next_month_index = len(history)
    prediction = model.predict([[next_month_index]])[0]

    # simple confidence range based on how much the data varies
    residuals = y - model.predict(X)
    std_dev = np.std(residuals)

    return jsonify({
        "predicted_amount": round(float(prediction), 2),
        "lower_bound": round(float(prediction - std_dev), 2),
        "upper_bound": round(float(prediction + std_dev), 2),
        "trend": "increasing" if model.coef_[0] > 0 else "decreasing" if model.coef_[0] < 0 else "stable"
    })
from sklearn.ensemble import IsolationForest
@app.route("/detect-anomaly", methods=["POST"])
def detect_anomaly():
    data = request.get_json()
    amounts = data.get("amounts", [])
    new_amount = data.get("new_amount")

    if len(amounts) < 4:
        return jsonify({"error": "Need at least 4 past transactions to check for anomalies"}), 400

    mean = float(np.mean(amounts))
    std = float(np.std(amounts))

    # avoid division by zero if all past amounts are identical
    if std == 0:
        std = 1

    z_score = (new_amount - mean) / std
    is_anomaly = bool(abs(z_score) > 2)  # more than 2 standard deviations away = unusual

    return jsonify({
        "is_anomaly": is_anomaly,
        "new_amount": new_amount,
        "average_amount": round(mean, 2),
        "z_score": round(z_score, 2),
        "deviation": round(new_amount - mean, 2)
    })
if __name__ == "__main__":
    app.run(port=5001, debug=True)