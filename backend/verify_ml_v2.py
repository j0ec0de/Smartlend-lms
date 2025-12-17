import requests
import json

def verify_api_v2():
    url = "http://localhost:5000/api/ml/predict"
    
    # Test Case 1: Likely Approved (High Income, High Assets, Low Loan, High CIBIL, Graduate, Self Employed)
    data1 = {
        "no_of_dependents": 0,
        "education": "Graduate",
        "self_employed": "Yes",
        "income_annum": 10000000,
        "loan_amount": 2000000,
        "loan_term": 10,
        "cibil_score": 850,
        "residential_assets_value": 5000000,
        "commercial_assets_value": 5000000,
        "luxury_assets_value": 5000000,
        "bank_asset_value": 5000000
    }
    
    try:
        print("Testing Case 1 (Strong Profile)...")
        response = requests.post(url, json=data1)
        print(f"Status: {response.status_code}")
        print(response.json())
    except Exception as e:
        print(f"Test 1 Failed: {e}")

    # Test Case 2: Likely Rejected (Low Income, High Loan, Low CIBIL)
    data2 = {
        "no_of_dependents": 5,
        "education": "Not Graduate",
        "self_employed": "No",
        "income_annum": 100000, 
        "loan_amount": 50000000, # Very high loan for low income
        "loan_term": 2,
        "cibil_score": 300, # Very low score
        "residential_assets_value": 0,
        "commercial_assets_value": 0,
        "luxury_assets_value": 0,
        "bank_asset_value": 0
    }

    try:
        print("\nTesting Case 2 (Weak Profile)...")
        response = requests.post(url, json=data2)
        print(f"Status: {response.status_code}")
        print(response.json())
    except Exception as e:
        print(f"Test 2 Failed: {e}")

if __name__ == "__main__":
    verify_api_v2()
