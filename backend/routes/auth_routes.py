# routes/auth_routes.py
from flask import Blueprint, request, jsonify
from controllers.auth_controller import (
    register_user,
    login_user,
    get_current_user
)
from utils.jwt_utils import jwt_required

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    response, status = register_user(request.json)
    return jsonify(response), status


@auth_bp.route("/login", methods=["POST"])
def login():
    response, status = login_user(request.json)
    return jsonify(response), status


@auth_bp.route("/me", methods=["GET"])
@jwt_required
def me():
    response, status = get_current_user()
    return jsonify(response), status
