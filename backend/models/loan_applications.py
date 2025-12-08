from app import db
from datetime import datetime

class LoanApplication(db.Model):
    __tablename__ = "loan_applications"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    loan_type = db.Column(db.String(120))
    amount = db.Column(db.Numeric(10, 2), nullable=False)
    tenure_months = db.Column(db.Integer, nullable=False)
    interest_rate = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), default="pending") 
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships

    documents = db.relationship("Document", backref="loan", lazy=True)
    approvals = db.relationship("Approval", backref="loan", lazy=True)
    repayments = db.relationship("LoanRepayment", backref="loan", lazy=True)