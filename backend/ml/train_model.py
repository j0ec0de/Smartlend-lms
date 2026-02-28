import pandas as pd
import pickle
import os
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report

# Set paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_PATH = os.path.join(BASE_DIR, '../../ml/loan_approval_dataset.csv')
MODEL_PATH = os.path.join(BASE_DIR, 'model.pkl')
SCALER_PATH = os.path.join(BASE_DIR, 'scaler.pkl')

def train():
    print("Loading dataset...")
    if not os.path.exists(DATASET_PATH):
        print(f"Error: Dataset not found at {DATASET_PATH}")
        return

    df = pd.read_csv(DATASET_PATH)
    
    # Clean column names (remove leading/trailing spaces)
    df.columns = df.columns.str.strip()

    # Clean categorical data (remove potential spaces)
    df['education'] = df['education'].str.strip()
    df['self_employed'] = df['self_employed'].str.strip()
    df['loan_status'] = df['loan_status'].str.strip()

    # Encoding Categorical Features
    df['education'] = df['education'].map({'Graduate': 1, 'Not Graduate': 0})
    df['self_employed'] = df['self_employed'].map({'Yes': 1, 'No': 0})
    df['loan_status'] = df['loan_status'].map({'Approved': 1, 'Rejected': 0})

    # --- ADVANCED FEATURE ENGINEERING ---
    print("Performing feature engineering...")
    
    # 1. Loan to Income Ratio (DTI equivalent)
    df['loan_income_ratio'] = df['loan_amount'] / (df['income_annum'] + 1)
    
    # 2. Total Assets
    df['total_assets'] = (
        df['residential_assets_value'] + 
        df['commercial_assets_value'] + 
        df['luxury_assets_value'] + 
        df['bank_asset_value']
    )
    
    # 3. Asset to Loan Ratio
    df['asset_loan_ratio'] = df['total_assets'] / (df['loan_amount'] + 1)
    
    # 4. Income per Dependent
    df['income_per_dependent'] = df['income_annum'] / (df['no_of_dependents'] + 1)

    # Define Feature Columns
    feature_cols = [
        'no_of_dependents', 'education', 'self_employed', 'income_annum', 
        'loan_amount', 'loan_term', 'cibil_score', 
        'residential_assets_value', 'commercial_assets_value', 
        'luxury_assets_value', 'bank_asset_value',
        'loan_income_ratio', 'asset_loan_ratio', 'income_per_dependent'
    ]

    X = df[feature_cols]
    y = df['loan_status']
    X = X.fillna(0)

    # Split data
    print("Splitting data...")
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Scale features
    print("Scaling features...")
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    # Train model
    print("Training Logistic Regression model...")
    model = LogisticRegression(max_iter=1000)
    model.fit(X_train_scaled, y_train)

    # Evaluate
    y_pred = model.predict(X_test_scaled)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Model trained. Accuracy: {accuracy:.4f}")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))

    # Save artifacts
    print("Saving model and scaler...")
    with open(MODEL_PATH, 'wb') as f:
        pickle.dump(model, f)
    
    with open(SCALER_PATH, 'wb') as f:
        pickle.dump(scaler, f)

    print("Success: artifacts saved.")

if __name__ == "__main__":
    train()
