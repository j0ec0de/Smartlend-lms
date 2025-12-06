from flask import Blueprint, request, jsonify
from extensions import db
from models.user import User
from flask_bcrypt import Bcrypt

bcrypt = Bcrypt()
auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.json
    hashed_pw = bcrypt.generate_password_hash(data["password"]).decode('utf-8')

    user = User(name=data["name"], email=data["email"], password=hashed_pw)
    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "User registered successfully"}), 201
