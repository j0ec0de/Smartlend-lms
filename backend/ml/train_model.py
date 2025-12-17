import pandas as pd
import pickle
import os
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score

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

    # Features to use:
    # 1. no_of_dependents
    # 2. education (Categorical)
    # 3. self_employed (Categorical)
    # 4. income_annum
    # 5. loan_amount
    # 6. loan_term
    # 7. cibil_score
    # 8. residential_assets_value
    # 9. commercial_assets_value
    # 10. luxury_assets_value
    # 11. bank_asset_value
    
    # Clean categorical data (remove potential spaces)
    df['education'] = df['education'].str.strip()
    df['self_employed'] = df['self_employed'].str.strip()
    df['loan_status'] = df['loan_status'].str.strip()

    # Encoding Categorical Features
    # Education: Graduate -> 1, Not Graduate -> 0
    df['education'] = df['education'].map({'Graduate': 1, 'Not Graduate': 0})
    
    # Self Employed: Yes -> 1, No -> 0
    df['self_employed'] = df['self_employed'].map({'Yes': 1, 'No': 0})
    
    # Loan Status: Approved -> 1, Rejected -> 0
    df['loan_status'] = df['loan_status'].map({'Approved': 1, 'Rejected': 0})

    # Define Feature Columns in Specific Order
    feature_cols = [
        'no_of_dependents', 'education', 'self_employed', 'income_annum', 
        'loan_amount', 'loan_term', 'cibil_score', 
        'residential_assets_value', 'commercial_assets_value', 
        'luxury_assets_value', 'bank_asset_value'
    ]

    X = df[feature_cols]
    y = df['loan_status']

    # Handle any potential remaining NaNs (though analysis showed none, good practice)
    X = X.fillna(0) # Simple strategy

    # Split data
    print("Splitting data...")
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=0)

    # Scale features
    print("Scaling features...")
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    # Train model
    print("Training Logistic Regression model...")
    model = LogisticRegression()
    model.fit(X_train_scaled, y_train)

    # Evaluate
    y_pred = model.predict(X_test_scaled)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Model trained. Accuracy: {accuracy:.2f}")

    # Save artifacts
    print("Saving model and scaler...")
    with open(MODEL_PATH, 'wb') as f:
        pickle.dump(model, f)
    
    with open(SCALER_PATH, 'wb') as f:
        pickle.dump(scaler, f)

    print("Done!")

if __name__ == "__main__":
    train()
