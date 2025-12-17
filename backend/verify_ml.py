import requests
import json

def verify_api():
    url = "http://localhost:5000/api/ml/predict"
    
    # Test Case 1: Likely Approved
    data1 = {"loan_amount": 500000, "cibil_score": 850}
    try:
        response = requests.post(url, json=data1)
        print(f"Test 1 (High Score): {response.status_code}")
        print(response.json())
    except Exception as e:
        print(f"Test 1 Failed: {e}")

    # Test Case 2: Likely Rejected
    data2 = {"loan_amount": 50000000, "cibil_score": 300}
    try:
        response = requests.post(url, json=data2)
        print(f"Test 2 (Low Score): {response.status_code}")
        print(response.json())
    except Exception as e:
        print(f"Test 2 Failed: {e}")

if __name__ == "__main__":
    verify_api()
