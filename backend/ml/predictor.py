import pickle
import os
import numpy as np

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

            return {
                "status": "Approved" if prediction == 1 else "Rejected",
                "probability": round(probability, 2)
            }
        except Exception as e:
            return {"error": str(e)}

predictor = LoanPredictor()
