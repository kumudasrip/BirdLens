
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import io

app = Flask(__name__)

@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok",
        "message": "BirdLens AI backend is running!"
    })

@app.route("/api/identify", methods=["POST"])
def identify():
    if "photo" not in request.files:
        return jsonify({"error": "Please upload a bird photo."}), 400

    photo = request.files["photo"]

    try:
        image = Image.open(io.BytesIO(photo.read())).convert("RGB")
        return jsonify({
            "status": "success",
            "message": "Photo received successfully!",
            "image_size": list(image.size),
            "identified": False,
            "note": "AI model connection is the next step."
        })
    except Exception:
        return jsonify({"error": "Please upload a valid image."}), 400

if __name__ == "__main__":
    app.run(debug=True, port=5000)
