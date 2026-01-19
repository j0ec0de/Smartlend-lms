from flask import Blueprint, jsonify
from extensions import db
from models.user import User
from models.loan_applications import LoanApplication
from models.prediction_log import PredictionLog

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/stats', methods=['GET'])
def get_dashboard_stats():
    try:
        # 1. Total Applications
        total_predictions = PredictionLog.query.count()
        total_loans = LoanApplication.query.count()

        # 2. Approval Rates (From Logs & Actual Loans)
        approved_predictions = PredictionLog.query.filter_by(status='Approved').count()
        approval_rate_ml = round((approved_predictions / total_predictions * 100), 1) if total_predictions > 0 else 0

        # 3. Recent Predictions
        recent_logs = PredictionLog.query.order_by(PredictionLog.created_at.desc()).limit(10).all()
        recent_activity = [log.to_dict() for log in recent_logs]

        # 4. Confidence Distribution (Simple histogram buckets)
        # Using simple python aggregation for prototype speed, ideally SQL
        all_logs = PredictionLog.query.with_entities(PredictionLog.probability).all()
        confidence_levels = {"High (>80%)": 0, "Medium (50-80%)": 0, "Low (<50%)": 0}
        
        for (prob,) in all_logs:
            if prob > 0.8:
                confidence_levels["High (>80%)"] += 1
            elif prob > 0.5:
                confidence_levels["Medium (50-80%)"] += 1
            else:
                confidence_levels["Low (<50%)"] += 1

        return jsonify({
            "overview": {
                "total_loans": total_loans,
                "total_ml_predictions": total_predictions,
                "ml_approval_rate": approval_rate_ml
            },
            "recent_activity": recent_activity,
            "confidence_distribution": confidence_levels
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
