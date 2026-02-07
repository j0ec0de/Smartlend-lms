from flask import request, jsonify
from extensions import db
from models.loan_applications import LoanApplication
from models.user import User
from utils.jwt_utils import get_jwt_identity
from ml.predictor import predictor
from models.prediction_log import PredictionLog

def apply_for_loan(data): 
    try:
        current_user = get_jwt_identity()
        user_db = User.query.get(current_user.id)
        if user_db.role == 'admin':
            return {"error": "Admins cannot apply for loans"}, 403
        

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

        # Run ML Prediction & Link Log
        try:
            # Prepare data for predictor
            pred_data = {
                "no_of_dependents": data.get("no_of_dependents", 0),
                "education": data.get("education", "Not Graduate"), # Default fallback
                "self_employed": data.get("self_employed", "No"),
                "income_annum": float(monthly_salary or 0) * 12, # Annualize
                "loan_amount": float(amount or 0),
                "loan_term": int(tenure_months or 12) / 12, # Years
                "cibil_score": float(credit_history or 0), # Map credit_history to score
                "residential_assets_value": float(data.get("assets_value", 0)), # Simplified asset mapping
                "commercial_assets_value": 0,
                "luxury_assets_value": 0,
                "bank_asset_value": 0
            }
            
            # Predict
            ml_result = predictor.predict(pred_data)
            
            if 'log_id' in ml_result and ml_result['log_id']:
                 new_loan.prediction_log_id = ml_result['log_id']
                 new_loan.risk_category = ml_result.get('status')
                 new_loan.ai_confidence_score = ml_result.get('probability')

        except Exception as ml_e:
            print(f"ML Association failed: {ml_e}")

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
                "tenure_months": loan.tenure_months,
                "interest_rate": loan.interest_rate,
                "date": loan.created_at.isoformat(),
                "documents": [{"id": d.id, "name": d.file_name, "type": d.file_type} for d in loan.documents],
                "ai_analysis": loan.prediction_log.to_dict() if loan.prediction_log else None,
                "monthly_salary": loan.monthly_salary,
                "credit_history": loan.credit_history
            })
        
        return output, 200
    except Exception as e:
        return {"error": str(e)}, 500

def update_loan(loan_id, data):
    try:
        current_user = get_jwt_identity()
        loan = LoanApplication.query.get(loan_id)
        
        if not loan:
             return {"error": "Loan not found"}, 404
             
        if loan.user_id != current_user.id:
             return {"error": "Unauthorized"}, 403
             
        if loan.status != "Pending":
             return {"error": "Cannot edit a loan that is not pending"}, 400
             
        # Update fields
        loan.loan_type = data.get("loan_type", loan.loan_type)
        loan.amount = data.get("amount", loan.amount)
        loan.tenure_months = data.get("tenure_months", loan.tenure_months)
        loan.interest_rate = data.get("interest_rate", loan.interest_rate)
        loan.monthly_salary = data.get("monthly_salary", loan.monthly_salary)
        loan.credit_history = data.get("credit_history", loan.credit_history)

        # Simple re-validation (optional but good)
        if loan.monthly_salary and loan.credit_history:
            score = (float(loan.monthly_salary) / 1000) + (float(loan.credit_history) * 2)
            if score < 70:
                 return {
                    "message": "Loan updates rejected based on risk assessment",
                    "score": score
                }, 400
        
        db.session.commit()
        return {"message": "Loan updated successfully", "loan": {
            "id": loan.id,
            "amount": loan.amount,
            "status": loan.status,
            "type": loan.loan_type
        }}, 200
    except Exception as e:
        db.session.rollback()
        return {"error": str(e)}, 500

def delete_loan(loan_id):
    try:
        current_user = get_jwt_identity()
        loan = LoanApplication.query.get(loan_id)

        if not loan:
             return {"error": "Loan not found"}, 404
             
        if loan.user_id != current_user.id:
             return {"error": "Unauthorized"}, 403
             
        # Optional: restrict to Pending
        if loan.status != "Pending":
             return {"error": "Cannot delete a loan that has been processed"}, 400
             
        # Custom Cascade Delete for SQLite/DBs without cascade configured
        from models.document import Document
        from models.approval import Approval
        from models.loan_repayment import LoanRepayment

        # Delete dependence
        Document.query.filter_by(loan_id=loan.id).delete()
        Approval.query.filter_by(loan_id=loan.id).delete()
        LoanRepayment.query.filter_by(loan_id=loan.id).delete()
             
        db.session.delete(loan)
        db.session.commit()
        return {"message": "Loan deleted successfully"}, 200
    except Exception as e:
        db.session.rollback()
        print(f"Delete failed: {e}") # Debug log
        return {"error": str(e)}, 500