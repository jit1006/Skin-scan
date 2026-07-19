from flask import Blueprint, request, jsonify
from utils.image_processing import preprocess_image
from utils.predictor import predict_disease
from config import Config

predict_bp = Blueprint('predict_bp', __name__)

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in Config.ALLOWED_EXTENSIONS

@predict_bp.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({"error": "No image part in the request"}), 400
        
    file = request.files['image']
    
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
        
    if not allowed_file(file.filename):
        return jsonify({"error": "File type not allowed. Allowed types: png, jpg, jpeg"}), 400
        
    try:
        # 1. Preprocess
        img_array = preprocess_image(file)
        
        # 2. Predict
        result = predict_disease(img_array)
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({"error": f"Error during prediction: {str(e)}"}), 500
