from flask import Flask
from extensions import db, migrate
from flask_cors import CORS
from config import Config

from models.user import User
from models.loan_applications import LoanApplication
from models.document import Document
from models.approval import Approval
from models.loan_repayment import LoanRepayment


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app)
    db.init_app(app)

    migrate.init_app(app, db)

    # Import routes
    from routes.auth_routes import auth_bp
    # from routes.loan import loan_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    # app.register_blueprint(loan_bp, url_prefix="/api/loan")

    return app



if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
