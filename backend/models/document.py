from extensions import db
from datetime import datetime

class Document(db.Model):
    __tablename__ = "documents"

    id = db.Column(db.Integer, primary_key=True)
    loan_id = db.Column(db.Integer, db.ForeignKey("loan_applications.id"), nullable=False)

    file_name = db.Column(db.String(255), nullable=False)
    file_path = db.Column(db.String(500), nullable=False)
    file_type = db.Column(db.String(50)) # e.g., 'pdf', 'jpg'

    verified_status = db.Column(db.String(20), default="pending")   # pending, verified, rejected
    uploaded_at = db.Column(db.DateTime, default=datetime.utcnow)