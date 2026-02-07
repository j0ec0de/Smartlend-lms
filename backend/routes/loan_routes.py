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

@loan_bp.route("/<int:loan_id>", methods=["PUT"])
@jwt_required
def update_loan_route(loan_id):
    from controllers.loan_controller import update_loan
    response, status = update_loan(loan_id, request.json)
    return jsonify(response), status

@loan_bp.route("/<int:loan_id>", methods=["DELETE"])
@jwt_required
def delete_loan_route(loan_id):
    from controllers.loan_controller import delete_loan
    response, status = delete_loan(loan_id)
    return jsonify(response), status