import pickle
import os
import pandas as pd
import numpy as np

# Set paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, 'model.pkl')

def inspect_model_weights():
    # Define features in the EXACT order used during training in train_model.py
    feature_names = [
        'no_of_dependents', 'education', 'self_employed', 'income_annum', 
        'loan_amount', 'loan_term', 'cibil_score', 
        'residential_assets_value', 'commercial_assets_value', 
        'luxury_assets_value', 'bank_asset_value'
    ]

    try:
        with open(MODEL_PATH, 'rb') as f:
            model = pickle.load(f)
        
        # Logistic Regression coefficients
        # model.coef_[0] is an array of weights for class 1 (Approved)
        coefficients = model.coef_[0]
        
        # Create a dataframe for nice display
        importance = pd.DataFrame({
            'Feature': feature_names,
            'Weight (Coefficient)': coefficients,
            'Absolute Impact': np.abs(coefficients)
        })
        
        # Sort by absolute impact to see what matters most
        importance = importance.sort_values(by='Absolute Impact', ascending=False)
        
        print("\n--- Model Feature Importance (Weights) ---")
        print("Positive Weight = Increases chance of Approval")
        print("Negative Weight = Decreases chance of Approval\n")
        print(importance.to_string(index=False))
        
        print("\nModel Intercept:", model.intercept_[0])

    except Exception as e:
        print(f"Error inspecting model: {e}")

if __name__ == "__main__":
    inspect_model_weights()
