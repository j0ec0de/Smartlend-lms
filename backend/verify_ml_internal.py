from app import create_app
from extensions import db
from ml.predictor import predictor
from models.prediction_log import PredictionLog

def verify_internal():
    app = create_app()
    with app.app_context():
        print("Running internal verification...")
        
        # Data for prediction
        data = {
            "no_of_dependents": 0,
            "education": "Graduate",
            "self_employed": "Yes",
            "income_annum": 8000000,
            "loan_amount": 2000000,
            "loan_term": 10,
            "cibil_score": 750,
            "residential_assets_value": 3000000,
            "commercial_assets_value": 0,
            "luxury_assets_value": 1000000,
            "bank_asset_value": 2000000
        }

        # 1. Predict
        try:
            result = predictor.predict(data)
            print("Prediction Result:", result)
        except Exception as e:
            print(f"Prediction Failed: {e}")
            return

        # 2. Verify Log
        latest_log = PredictionLog.query.order_by(PredictionLog.id.desc()).first()
        if latest_log:
            print(f"Latest Log ID: {latest_log.id}")
            print(f"Log Status: {latest_log.status}")
            print(f"Log Factors: {latest_log.top_factors}")
            
            # Simple assertion
            if latest_log.status == result['status']:
                print("SUCCESS: Log matches prediction result.")
            else:
                print("FAILURE: Log status does not match.")
        else:
            print("FAILURE: No log found.")

if __name__ == "__main__":
    verify_internal()
