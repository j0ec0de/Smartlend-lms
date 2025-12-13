from utils.jwt_utils import get_jwt_identity
from models.loan_repayment import LoanRepayment
from models.loan_applications import LoanApplication
from models.user import User

def get_schedule(loan_id):
    try:
        current_user = get_jwt_identity()
        
        # 1. Fetch the Loan to check ownership
        loan = LoanApplication.query.get(loan_id)
        if not loan:
            return {"error": "Loan not found"}, 404

        # 2. Security Check: 
        # Allow if User is the Owner OR User is Admin
        # (Assuming you have a way to check admin, or just check ID for now)
        if loan.user_id != current_user.id:
            # Optional: Check if admin
            # user = User.query.get(current_user_id)
            # if user.role != 'admin':
            return {"error": "Unauthorized access to this schedule"}, 403

        # 3. Fetch Repayments
        repayments = LoanRepayment.query.filter_by(loan_id=loan_id).order_by(LoanRepayment.month_number).all()

        output = []
        for r in repayments:
            output.append({
                "month": r.month_number,
                "date": r.due_date.strftime('%Y-%m-%d'),
                "amount": r.emi_amount,
                "status": r.paid_status
            })

        return output, 200

    except Exception as e:
        return {"error": str(e)}, 500