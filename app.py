import os
import tempfile
import logging
from pathlib import Path

from flask import Flask, jsonify, request, send_from_directory
from gradio_client import Client
from gradio_client import handle_file

app = Flask(__name__)

BASE_DIR = Path(__file__).resolve().parent
SPACE_ID = "ksri33/birdlens-ai"

app.config["MAX_CONTENT_LENGTH"] = 10 * 1024 * 1024  # 10 MB

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def get_gradio_client():
    """Create a client for the BirdLens Hugging Face Space."""
    token = os.getenv("HF_TOKEN")

    if token:
        return Client(SPACE_ID, token=token, verbose=False)

    return Client(SPACE_ID, verbose=False)


@app.route("/")
def home():
    return send_from_directory(BASE_DIR, "index.html")


@app.route("/<path:filename>")
def serve_frontend(filename):
    """Serve existing CSS, JavaScript, and image assets."""
    return send_from_directory(BASE_DIR, filename)


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok",
        "service": "BirdLens backend"
    })


@app.route("/api/identify", methods=["POST"])
def identify():
    if "image" not in request.files:
        return jsonify({
            "success": False,
            "error": "Please upload a bird photo."
        }), 400

    image = request.files["image"]

    if not image.filename:
        return jsonify({
            "success": False,
            "error": "Please select an image first."
        }), 400

    allowed_extensions = {".jpg", ".jpeg", ".png", ".webp"}
    extension = Path(image.filename).suffix.lower()

    if extension not in allowed_extensions:
        return jsonify({
            "success": False,
            "error": "Please use a JPG, PNG, or WebP image."
        }), 400

    temp_path = None

    try:
        # Save the upload temporarily so Gradio Client can read it.
        with tempfile.NamedTemporaryFile(
            suffix=extension,
            delete=False
        ) as temp_file:
            temp_path = temp_file.name
            image.save(temp_file)

        client = get_gradio_client()

        result = client.predict(
            handle_file(temp_path),
            api_name="/identify_bird"
        )

        # Your Space returns Markdown containing its top predictions.
        if isinstance(result, (list, tuple)):
            result = result[0] if result else ""

        result_text = str(result).strip()

        if (
            not result_text
            or "could not identify this image" in result_text.lower()
            or "please upload a bird photo" in result_text.lower()
        ):
            return jsonify({
                "success": False,
                "error": (
                    "The AI could not identify this photo right now. "
                    "You can still save the sighting manually."
                )
            }), 503

        return jsonify({
            "success": True,
            "result": result_text
        })

    except Exception as error:
        # Log technical details on the server, not to the public webpage.
        logger.exception("Bird identification request failed")

        error_text = str(error).lower()

        if any(word in error_text for word in [
            "quota", "rate limit", "zerogpu", "usage limit"
        ]):
            message = (
                "Our AI has temporarily reached its free usage limit. "
                "Please try again later, or save your sighting manually."
            )
        elif any(word in error_text for word in [
            "timeout", "timed out"
        ]):
            message = (
                "The AI took too long to respond. "
                "Please try again in a little while."
            )
        else:
            message = (
                "Bird identification is temporarily unavailable. "
                "You can still save your sighting manually."
            )

        return jsonify({
            "success": False,
            "error": message
        }), 503

    finally:
        if temp_path and os.path.exists(temp_path):
            os.remove(temp_path)


@app.errorhandler(413)
def file_too_large(_error):
    return jsonify({
        "success": False,
        "error": "Your image is too large. Please upload an image under 10 MB."
    }), 413


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)