from extensions import db
from datetime import datetime
from sqlalchemy.dialects.postgresql import JSON  # If using Postgres, otherwise standard JSON

class PredictionLog(db.Model):
    __tablename__ = "prediction_logs"

    id = db.Column(db.Integer, primary_key=True)
    input_features = db.Column(db.JSON, nullable=False)  # Stores the raw input data
    status = db.Column(db.String(20), nullable=False) # Approved/Rejected
    probability = db.Column(db.Float, nullable=False)
    top_factors = db.Column(db.JSON, nullable=True) # Stores 'why' (e.g. {"cibil": -0.5})
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "input_features": self.input_features,
            "status": self.status,
            "probability": self.probability,
            "top_factors": self.top_factors,
            "created_at": self.created_at.isoformat()
        }
