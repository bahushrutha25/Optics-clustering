from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from sklearn.cluster import OPTICS
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# Improved CORS handling
frontend_url = os.getenv("FRONTEND_URL", "*")
# If frontend_url is a comma-separated list, split it
origins = [url.strip() for url in frontend_url.split(",")] if frontend_url != "*" else "*"

CORS(app, resources={r"/*": {
    "origins": origins,
    "methods": ["GET", "POST", "OPTIONS"],
    "allow_headers": ["Content-Type", "Authorization"]
}})

@app.route('/')
def health_check():
    return jsonify({"status": "healthy", "message": "OPTICS Clustering API is running"}), 200

@app.route('/cluster', methods=['POST', 'OPTIONS'])
def cluster():
    if request.method == 'OPTIONS':
        return '', 204
        
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400

    # Robust integer parsing for min_samples
    try:
        min_samples = int(request.form.get('min_samples', 3))
        if min_samples < 1:
            min_samples = 1
    except (TypeError, ValueError):
        min_samples = 3

    try:
        df = pd.read_csv(file)
        # Check for both 'x'/'y' and 'X'/'Y' (case-insensitive)
        df.columns = [c.lower().strip() for c in df.columns]
        
        if 'x' not in df.columns or 'y' not in df.columns:
            return jsonify({"error": "CSV must contain 'x' and 'y' columns"}), 400
            
        X = df[['x', 'y']]

        # Handle potential NaN values
        if X.isnull().values.any():
            X = X.fillna(0)

        model = OPTICS(min_samples=min_samples)
        labels = model.fit_predict(X)

        return jsonify({
            "x": df['x'].tolist(),
            "y": df['y'].tolist(),
            "labels": labels.tolist()
        })
    except Exception as e:
        return jsonify({"error": f"Processing failed: {str(e)}"}), 500

# For local development
if __name__ == '__main__':
    app.run(debug=True, port=5000)
