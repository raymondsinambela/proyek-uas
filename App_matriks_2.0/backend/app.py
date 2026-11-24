
from pathlib import Path
from flask import Flask, request, jsonify, send_from_directory

from backend.engine.obe_elemen import metode_obe
from backend.engine.obe_persamaan import selesaikan_persamaan

BASE_DIR = Path(__file__).resolve().parent.parent
FRONTEND_DIR = BASE_DIR / "frontend"

app = Flask(
    __name__,
    static_folder=str(FRONTEND_DIR),
    static_url_path="/static"
)


@app.route("/")
def home():
    return send_from_directory(FRONTEND_DIR, "index.html")


@app.route("/api/health")
def health():
    return jsonify({
        "app": "App Matriks 2.0",
        "status": "Backend aktif",
        "version": "0.3.0"
    })


@app.route("/api/obe", methods=["POST"])
def hitung_obe():
    data = request.get_json(silent=True)

    if not isinstance(data, dict) or "matriks" not in data:
        return jsonify({"error": "Data matriks tidak valid"}), 400

    try:
        hasil = metode_obe(data["matriks"])
        return jsonify(hasil)
    except (ValueError, TypeError, KeyError) as error:
        return jsonify({"error": str(error)}), 400


@app.route("/api/persamaan", methods=["POST"])
def hitung_persamaan():
    data = request.get_json(silent=True)

    if not isinstance(data, dict) or "persamaan" not in data:
        return jsonify({"error": "Data persamaan tidak valid"}), 400

    try:
        hasil = selesaikan_persamaan(data["persamaan"])
        return jsonify(hasil)
    except (ValueError, TypeError, KeyError) as error:
        return jsonify({"error": str(error)}), 400


if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=5000,
        debug=False
    )
