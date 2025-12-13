from functools import wraps
from datetime import datetime, timedelta
import jwt

from flask import request, jsonify, current_app, g


def create_access_token(identity, expires_minutes=60):
    """Create a JWT access token encoding the given identity (usually user id)."""
    now = datetime.utcnow()
    payload = {
        "sub": str(identity),  # Convert to string
        "iat": now,
        "exp": now + timedelta(minutes=expires_minutes),
    }
    secret_key = current_app.config.get("JWT_SECRET_KEY")
    token = jwt.encode(payload, secret_key, algorithm="HS256")
    # PyJWT may return bytes in some versions
    if isinstance(token, bytes):
        token = token.decode("utf-8")
    return token


def decode_token(token):
    """Decode a token and return the payload or raise jwt exceptions."""
    secret_key = current_app.config.get("JWT_SECRET_KEY")
    return jwt.decode(token, secret_key, algorithms=["HS256"])


def jwt_required(fn):
    """Decorator to protect routes and load `g.current_user`.

    Expects Authorization header: "Bearer <token>".
    """
    @wraps(fn)
    def wrapper(*args, **kwargs):
        from models.user import User
        
        auth_header = request.headers.get("Authorization", None)
        if not auth_header:
            return jsonify({"message": "Missing Authorization header"}), 401

        parts = auth_header.split()
        if parts[0].lower() != "bearer" or len(parts) != 2:
            return jsonify({"message": "Invalid Authorization header"}), 401

        token = parts[1]
        try:
            payload = decode_token(token)
        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Token has expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"message": "Invalid token"}), 401

        user_id = payload.get("sub")
        if user_id is None:
            return jsonify({"message": "Invalid token payload"}), 401

        try:
            user_id = int(user_id)  # Convert back to int
        except (ValueError, TypeError):
            return jsonify({"message": "Invalid token payload"}), 401

        user = User.query.get(user_id)
        if not user:
            return jsonify({"message": "User not found"}), 401

        g.current_user = user
        return fn(*args, **kwargs)

    return wrapper


def get_jwt_identity():
    """Return the currently authenticated user (set by `jwt_required`)."""
    return getattr(g, "current_user", None)
