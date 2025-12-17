from flask import Blueprint, request, jsonify
from ml.predictor import predictor

ml_bp = Blueprint('ml', __name__)

@ml_bp.route('/predict', methods=['POST'])
def predict_loan_approval():
    try:
        data = request.get_json()
        
        # We now pass the whole data object to the predictor
        # Validation can be enhanced here, but for now we trust predictor handles missing keys with defaults or errors
        required_fields = ['loan_amount', 'cibil_score', 'income_annum'] # Check major ones
        
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400

        result = predictor.predict(data)
        
        if "error" in result:
            return jsonify(result), 500

        return jsonify(result), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
