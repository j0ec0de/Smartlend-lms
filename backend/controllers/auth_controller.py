# controllers/auth_controller.py
from extensions import db
from models.user import User
from flask_bcrypt import Bcrypt
from utils.jwt_utils import create_access_token, get_jwt_identity

bcrypt = Bcrypt()

def register_user(data):
    if not data.get("email") or not data.get("password"):
        return {"message": "Missing fields"}, 400

    existing_user = User.query.filter_by(email=data["email"]).first()
    if existing_user:
        return {"message": "User already exists"}, 409

    hashed_pw = bcrypt.generate_password_hash(
        data["password"]
    ).decode("utf-8")

    user = User(
        name=data["name"],
        email=data["email"],
        password=hashed_pw
    )

    db.session.add(user)
    db.session.commit()

    return {"message": "User registered successfully"}, 201


def login_user(data):
    user = User.query.filter_by(email=data["email"]).first()

    if not user or not bcrypt.check_password_hash(
        user.password, data["password"]
    ):
        return {"message": "Invalid email or password"}, 401

    token = create_access_token(user.id)

    return {
        "message": "User logged in successfully",
        "access_token": token,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email
        }
    }, 200


def get_current_user():
    user = get_jwt_identity()

    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role
    }, 200
