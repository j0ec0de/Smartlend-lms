from flask import Blueprint, request, jsonify
from extensions import db
from models.user import User
from flask_bcrypt import Bcrypt
from utils.jwt_utils import create_access_token, jwt_required, get_jwt_identity

bcrypt = Bcrypt()
auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.json

    existing_user = User.query.filter_by(email=data["email"]).first()
    if(existing_user):
        return jsonify({"message": "User already exists"}), 409

    hashed_pw = bcrypt.generate_password_hash(data["password"]).decode('utf-8')

    user = User(name=data["name"], email=data["email"], password=hashed_pw)
    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "User registered successfully"}), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json

    user = User.query.filter_by(email=data["email"]).first()

    if user and bcrypt.check_password_hash(user.password, data["password"]):
        token = create_access_token(user.id)
        return jsonify({
            "message": "User logged in successfully",
            "access_token": token,
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email
            }
        }), 200


    return jsonify({"message": "Invalid email or password"}), 401



@auth_bp.route("/me", methods=["GET"])
@jwt_required
def me():
    user = get_jwt_identity()
    return jsonify({
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role
    }), 200
