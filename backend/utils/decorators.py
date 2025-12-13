from functools import wraps
from utils.jwt_utils import get_jwt_identity
from models.user import User 

def admin_required():
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            # 1. Get the User ID from the token
            current_user = get_jwt_identity()
            
            # 2. Fetch user from DB to check role
            user = User.query.get(current_user.id)
            
            # 3. Check if user exists and is admin
            if not user or user.role != 'admin':
                return {"error": "Admins only! Access denied."}, 403
            
            # 4. If Admin, allow access
            return fn(*args, **kwargs)
        return decorator
    return wrapper