from extensions import db
from datetime import datetime

class Approval(db.Model):
    __tablename__ = "approvals"

    id = db.Column(db.Integer, primary_key=True)
    loan_id = db.Column(db.Integer, db.ForeignKey("loan_applications.id"), nullable=False)

    approved_by = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)
    status = db.Column(db.String(20), nullable=False)  # approved / rejected / review
    remarks = db.Column(db.String(300))

    approved_at = db.Column(db.DateTime, default=datetime.utcnow)

    approver = db.relationship("User", backref="approvals_given")  # admin / officer