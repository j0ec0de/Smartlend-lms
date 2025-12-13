from flask import request, jsonify
from extensions import db
from models.loan_applications import LoanApplication
from utils.jwt_utils import get_jwt_identity

def apply_for_loan(data): 
    try:
        current_user = get_jwt_identity()
        

        #extract data
        loan_type = data.get("loan_type")
        amount = data.get("amount")
        tenure_months = data.get("tenure_months")
        interest_rate = data.get("interest_rate", 10.0)
        monthly_salary = data.get("monthly_salary")
        credit_history = data.get("credit_history", 0)

        if monthly_salary and credit_history:
            score = (monthly_salary / 1000) + (credit_history * 2)
            if score < 70:
                return {
                    "message": "Loan Rejected bases on risk assessment",
                    "score": score
                }, 400
            
        new_loan = LoanApplication(
            user_id = current_user.id,
            loan_type = loan_type,
            amount = amount,
            tenure_months = tenure_months,
            interest_rate = interest_rate,
            monthly_salary = monthly_salary,
            credit_history = credit_history,
            status = "Pending"
        )

        db.session.add(new_loan)
        db.session.commit()

        return {
            "message": "Loan application submitted successfully",
            "loan_id": new_loan.id
        }, 201
    except Exception as e:
        return { "error": str(e) }, 500

def get_my_loans():
    try:
        current_user = get_jwt_identity()
        loans = LoanApplication.query.filter_by(user_id=current_user.id).all()
        
        # Serialize data
        output = []
        for loan in loans:
            output.append({
                "id": loan.id,
                "amount": loan.amount,
                "status": loan.status,
                "type": loan.loan_type,
                "date": loan.created_at 
            })
        
        return output, 200
    except Exception as e:
        return {"error": str(e)}, 500