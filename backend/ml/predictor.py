import pickle
import os
import numpy as np
from extensions import db
from models.prediction_log import PredictionLog

# Set paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, 'model.pkl')
SCALER_PATH = os.path.join(BASE_DIR, 'scaler.pkl')

class LoanPredictor:
    def __init__(self):
        self.model = None
        self.scaler = None
        self._load_artifacts()

    def _load_artifacts(self):
        try:
            with open(MODEL_PATH, 'rb') as f:
                self.model = pickle.load(f)
            with open(SCALER_PATH, 'rb') as f:
                self.scaler = pickle.load(f)
            print("ML Artifacts loaded successfully.")
        except Exception as e:
            print(f"Error loading ML artifacts: {e}")
            self.model = None
            self.scaler = None

    def predict(self, data):
        """
        data: dict containing:
        - no_of_dependents (int)
        - education (str: 'Graduate'/'Not Graduate')
        - self_employed (str: 'Yes'/'No')
        - income_annum (float)
        - loan_amount (float)
        - loan_term (int)
        - cibil_score (int)
        - residential_assets_value (float)
        - commercial_assets_value (float)
        - luxury_assets_value (float)
        - bank_asset_value (float)
        """
        if not self.model or not self.scaler:
            return {"error": "Model not loaded properly"}

        try:
            # Preprocess Categorical Inputs
            education_val = 1 if data.get('education') == 'Graduate' else 0
            self_employed_val = 1 if data.get('self_employed') == 'Yes' else 0
            
            # Prepare input array in specific order
            features = np.array([[
                float(data.get('no_of_dependents', 0)),
                education_val,
                self_employed_val,
                float(data.get('income_annum', 0)),
                float(data.get('loan_amount', 0)),
                float(data.get('loan_term', 0)),
                float(data.get('cibil_score', 0)),
                float(data.get('residential_assets_value', 0)),
                float(data.get('commercial_assets_value', 0)),
                float(data.get('luxury_assets_value', 0)),
                float(data.get('bank_asset_value', 0))
            ]])
            
            # Scale input
            features_scaled = self.scaler.transform(features)
            
            # Predict
            prediction = self.model.predict(features_scaled)[0]
            probability = self.model.predict_proba(features_scaled)[0][1]

            # Explainability: Calculate contributions
            # Coeffs shape is (1, n_features) for binary classification
            features_list = [
                'no_of_dependents', 'education', 'self_employed', 'income_annum', 
                'loan_amount', 'loan_term', 'cibil_score', 
                'residential_assets_value', 'commercial_assets_value', 
                'luxury_assets_value', 'bank_asset_value'
            ]
            
            contributions = {}
            if hasattr(self.model, 'coef_'):
                coefs = self.model.coef_[0]
                # feature * weight
                weighted_features = features_scaled[0] * coefs
                
                # Zip and sort by absolute influence
                for name, weight in zip(features_list, weighted_features):
                    contributions[name] = round(weight, 4)
                
            # Log to Database
            status_result = "Approved" if prediction == 1 else "Rejected"
            try:
                log_entry = PredictionLog(
                    input_features=data,
                    status=status_result,
                    probability=round(probability, 2),
                    top_factors=contributions
                )
                db.session.add(log_entry)
                db.session.commit()
                print("Prediction logged to DB.")
                log_id = log_entry.id # Capture ID
            except Exception as db_e:
                print(f"Failed to log prediction: {db_e}")
                db.session.rollback()
                log_id = None

            return {
                "status": status_result,
                "probability": round(probability, 2),
                "factors": contributions,
                "log_id": log_id 
            }
        except Exception as e:
            return {"error": str(e)}

predictor = LoanPredictor()
