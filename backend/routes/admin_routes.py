from flask import Blueprint, request, jsonify
from utils.jwt_utils import jwt_required
from utils.decorators import admin_required 
from controllers.admin_controller import get_all_loans, update_loan_status

admin_bp = Blueprint('admin', __name__)

# 1. View All Loans
@admin_bp.route('/loans', methods=['GET'])
@jwt_required    
@admin_required()  
def list_all_loans():
    response, status = get_all_loans()
    return jsonify(response), status

# 2. Approve/Reject Loan
@admin_bp.route('/loan/<int:loan_id>/status', methods=['PUT'])
@jwt_required
@admin_required()
def change_status(loan_id):
    response, status = update_loan_status(request.json, loan_id)
    return jsonify(response), status