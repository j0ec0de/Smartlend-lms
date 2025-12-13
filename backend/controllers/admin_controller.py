from models.loan_applications import LoanApplication
from models.document import Document
from extensions import db

def get_all_loans():
    try:
        # Fetch all loans, ordered by latest first
        loans = LoanApplication.query.order_by(LoanApplication.created_at.desc()).all()
        
        output = []
        for loan in loans:
            output.append({
                "id": loan.id,
                "user_id": loan.user_id,
                "amount": loan.amount,
                "type": loan.loan_type,
                "status": loan.status,
                "risk_score": f"Salary: {loan.monthly_salary}, Credit: {loan.credit_history}",
                "date": loan.created_at
            })
        return output, 200
    except Exception as e:
        return {"error": str(e)}, 500

def update_loan_status(data, loan_id):
    try:
        loan = LoanApplication.query.get(loan_id)
        if not loan:
            return {"error": "Loan not found"}, 404

        # Expected data: {"status": "Approved"} or {"status": "Rejected"}
        new_status = data.get('status')
        
        if new_status not in ['Approved', 'Rejected']:
            return {"error": "Invalid status. Use 'Approved' or 'Rejected'"}, 400

        loan.status = new_status
        db.session.commit()

        return {"message": f"Loan {loan_id} marked as {new_status}"}, 200

    except Exception as e:
        return {"error": str(e)}, 500