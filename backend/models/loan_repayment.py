from app import db
from datetime import datetime

class LoanRepayment(db.Model):
    __tablename__ = "loan_repayments"

    id = db.Column(db.Integer, primary_key=True)
    loan_id = db.Column(db.Integer, db.ForeignKey("loan_applications.id"), nullable=False)

    month_number = db.Column(db.Integer, nullable=False)
    due_date = db.Column(db.DateTime, nullable=False)
    emi_amount = db.Column(db.Float, nullable=False)
    paid_status = db.Column(db.String(20), default="unpaid")   # paid / unpaid
    paid_at = db.Column(db.DateTime, nullable=True)