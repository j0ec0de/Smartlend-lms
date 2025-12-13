from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta
from models.loan_repayment import LoanRepayment
from models.loan_applications import LoanApplication
from models.document import Document
from models.user import User
from extensions import db

def get_all_loans():
    try:
        # Fetch all loans, ordered by latest first, joined with User to get names
        loans = db.session.query(LoanApplication, User.name).join(User, LoanApplication.user_id == User.id).order_by(LoanApplication.created_at.desc()).all()
        
        output = []
        for loan, user_name in loans:
            output.append({
                "id": loan.id,
                "user_id": loan.user_id,
                "user_name": user_name,
                "amount": loan.amount,
                "type": loan.loan_type,
                "status": loan.status,
                "risk_score": f"Salary: {loan.monthly_salary}, Credit: {loan.credit_history}",
                "date": loan.created_at.isoformat(),
                "documents": [{"id": d.id, "name": d.file_name} for d in loan.documents]
            })
        return output, 200
    except Exception as e:
        return {"error": str(e)}, 500



# Helper Function for EMI
def calculate_emi(principal, annual_rate, tenure_months):
    # 1. FORCE CONVERSION to float to avoid the error
    P = float(principal)
    R_annual = float(annual_rate)
    
    # 2. Calculate Monthly Rate
    # R = Annual Rate / 12 / 100
    r = R_annual / 12 / 100
    
    # 3. EMI Formula
    # prevent division by zero check (optional but good practice)
    if r == 0:
        return round(P / tenure_months, 2)
        
    numerator = P * r * ((1 + r) ** tenure_months)
    denominator = ((1 + r) ** tenure_months) - 1
    
    return round(numerator, 2)

    
def update_loan_status(data, loan_id):
    try:
        loan = LoanApplication.query.get(loan_id)
        if not loan:
            return {"error": "Loan not found"}, 404

        new_status = data.get('status')
        
        # 1. Update Status
        loan.status = new_status
        
        # 2. TRIGGER: If Approved, Generate Schedule
        if new_status == 'Approved':
            # Calculate EMI
            emi = calculate_emi(loan.amount, loan.interest_rate, loan.tenure_months)
            
            # Create Schedule for N months
            start_date = datetime.utcnow().date()
            
            for i in range(1, loan.tenure_months + 1):
                # Calculate next month's date
                due_date = start_date + relativedelta(months=i)
                
                repayment = LoanRepayment(
                    loan_id=loan.id,
                    month_number=i,
                    due_date=due_date,
                    emi_amount=emi,
                    paid_status='Pending'
                )
                db.session.add(repayment)
                
            print(f"Generated {loan.tenure_months} EMI records of {emi} each.")

        db.session.commit()

        return {"message": f"Loan {loan_id} marked as {new_status}"}, 200

    except Exception as e:
        return {"error": str(e)}, 500