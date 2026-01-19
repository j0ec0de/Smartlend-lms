from app import create_app
from extensions import db
from models.user import User
from models.loan_applications import LoanApplication
from controllers.loan_controller import apply_for_loan
# from flask_jwt_extended import create_access_token - Not used, causing error

# We need to mock get_jwt_identity since apply_for_loan uses it.
# Instead of mocking, let's just create a dummy user and use a context block where we patch the utils.

from unittest.mock import patch, MagicMock

def verify_link():
    app = create_app()
    with app.app_context():
        # Setup: Create a test user
        user = User.query.filter_by(email="test_feedback@example.com").first()
        if not user:
            user = User(name="Test Feedback", email="test_feedback@example.com", password="hash")
            db.session.add(user)
            db.session.commit()
        
        print(f"Using User ID: {user.id}")

        # Mock Identity
        mock_identity = MagicMock()
        mock_identity.id = user.id

        with patch('controllers.loan_controller.get_jwt_identity', return_value=mock_identity):
            # Apply for Loan
            data = {
                "loan_type": "Personal",
                "amount": 500000,
                "tenure_months": 24,
                "monthly_salary": 60000,
                "credit_history": 750,
                "assets_value": 2000000
            }
            
            print("Applying for loan...")
            result, status = apply_for_loan(data)
            print(f"Result: {result}, Status: {status}")
            
            if status == 201:
                loan_id = result['loan_id']
                loan = LoanApplication.query.get(loan_id)
                
                print(f"Loan ID: {loan.id}")
                print(f"Prediction Log ID: {loan.prediction_log_id}")
                
                if loan.prediction_log_id:
                    print("SUCCESS: Loan is linked to PredictionLog.")
                    print(f"Linked Log Factors: {loan.prediction_log.top_factors}")
                else:
                    print("FAILURE: prediction_log_id is None.")
            else:
                print("FAILURE: Loan application failed.")

if __name__ == "__main__":
    verify_link()
