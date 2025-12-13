from flask import Blueprint, request, jsonify
from controllers.loan_controller import (
    apply_for_loan,
    get_my_loans
)
from utils.jwt_utils import jwt_required

loan_bp = Blueprint("loans", __name__)

@loan_bp.route("/apply", methods=["POST"])
@jwt_required
def apply():
    response, status = apply_for_loan(request.json)
    return jsonify(response), status

@loan_bp.route("/my-loans", methods=["GET"])
@jwt_required
def list_loans():
    response, status = get_my_loans()
    return jsonify(response), status