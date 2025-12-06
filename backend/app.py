from flask import Flask
from extensions import db
from flask_cors import CORS
from config import Config



def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app)
    db.init_app(app)

    # Import routes
    from routes.auth import auth_bp
    # from routes.loan import loan_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    # app.register_blueprint(loan_bp, url_prefix="/api/loan")

    return app



if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
