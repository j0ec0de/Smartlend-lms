from flask import Blueprint, jsonify
from utils.jwt_utils import jwt_required
from controllers.repayment_controller import get_schedule

repayment_bp = Blueprint('repayments', __name__)

@repayment_bp.route('/<int:loan_id>', methods=['GET'])
@jwt_required
def view_schedule(loan_id):
    response, status = get_schedule(loan_id)
    return jsonify(response), status