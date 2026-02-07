# SmartLend LMS - Code Documentation

This document provides a comprehensive technical overview of the SmartLend Learning Management System (LMS) codebase.

## 1. Backend Architecture

The backend is built with **Flask** and structured using **Blueprints** to ensure modularity.

### Core Modules

*   **`app.py`**: Entry point. Initializes Flask, Database (`db`), and registers all Blueprints.
*   **`extensions.py`**: Global instances for `db` (SQLAlchemy) and `migrate` (Flask-Migrate) to prevent circular imports.
*   **`config.py`**: Configuration class (SQLAlchemy URI, Secret Keys).

### Controllers (`backend/controllers/`)

Business logic is isolated in controllers.

#### `loan_controller.py`
Handles loan lifecycle operations.
*   **`apply_for_loan(data)`**:
    *   Accepts loan details (amount, tenure, income, etc.).
    *   **Logic**: Calculates a basic risk score.
    *   **ML Integration**: Calls `predictor.predict()` to assess risk using the ML model.
    *   **Stores**: Creates `LoanApplication` and `PredictionLog` records.
*   **`get_my_loans()`**: Fetches loans for the logged-in user.
*   **`update_loan(loan_id, data)`**: Updates details for 'Pending' loans.
*   **`delete_loan(loan_id)`**: Deletes a loan application and cascades deletes for related Documents/Approvals.

#### `auth_controller.py`
*   **`register(data)`**: Creates a new `User` with hashed password.
*   **`login(data)`**: Validates credentials and returns a JWT token.

### Models (`backend/models/`)

Database schemas using SQLAlchemy ORM.

#### `LoanApplication` (`loan_applications.py`)
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | Integer | Primary Key |
| `user_id` | Foreign Key | Owner of the loan |
| `amount` | Numeric | Loan Amount |
| `status` | String | 'Pending', 'Approved', 'Rejected' |
| `risk_category` | String | ML Output: 'Approved'/'Rejected' (Predicted) |
| `ai_confidence_score`| Float | ML Confidence (0.0 - 1.0) |

#### `PredictionLog` (`prediction_log.py`)
Stores the detailed output of the ML model for audit purposes, including exact input features and contribution factors.

## 2. Machine Learning Module (`backend/ml/`)

The system uses a Logistic Regression model to predict loan approval probability.

*   **`predictor.py`**: The inference engine.
    *   **`LoanPredictor` Class**: Singleton that loads `model.pkl` and `scaler.pkl`.
    *   **`predict(data)` Method**:
        1.  Preprocesses input (One-Hot Encoding for 'Education', 'Self_Employed').
        2.  Scales numerical features.
        3.  Computes probability (`predict_proba`).
        4.  Logs result to DB.
        5.  Returns `status`, `probability`, and `factors` (feature importance).

## 3. Frontend Architecture (`frontend/src/`)

Built with **React** and **Vite**.

### Pages

*   **`pages/dashboard/UserDashboard.jsx`**:
    *   Fetches loans via `api.get('/loans/my-loans')`.
    *   Displays loans in `Card` components.
    *   Allows navigation to `EditLoan` or triggering `delete_loan`.
*   **`pages/dashboard/EditLoan.jsx`**: Form to update existing loan applications.
*   **`pages/ApplyLoan.jsx`**: Form for new applications.

### Services

*   **`api.js`**: Axios interceptor that automatically attaches the JWT token from localStorage to every request (`Authorization: Bearer <token>`).

## 4. API Endpoints (`backend/routes/`)

| Method | Endpoint | Function | Access |
| :--- | :--- | :--- | :--- |
| POST | `/api/auth/login` | Login User | Public |
| POST | `/api/loans/apply` | Apply for Loan | User |
| GET | `/api/loans/my-loans`| List Loans | User |
| PUT | `/api/loans/<id>` | Update Loan | Owner (Pending only) |
| DELETE | `/api/loans/<id>` | Delete Loan | Owner (Pending only) |
| GET | `/api/admin/dashboard`| Admin Stats | Admin |

## 5. ML Scripts Documentation

Detailed documentation for the standalone scripts used for model training and verification.

### `backend/ml/train_model.py`

This script handles the end-to-end process of training the machine learning model.

#### Workflow:
1.  **Data Loading**: Reads `ml/loan_approval_dataset.csv`.
2.  **Preprocessing**:
    *   **Cleaning**: Trims whitespace from column names and string values.
    *   **Encoding**: Converts categorical strings to binary integers:
        *   `education`: "Graduate" -> 1, "Not Graduate" -> 0
        *   `self_employed`: "Yes" -> 1, "No" -> 0
        *   `loan_status` (Target): "Approved" -> 1, "Rejected" -> 0
3.  **Feature Selection**: Selects 11 key features (Income, Assets, CIBIL Score, etc.).
4.  **Scaling**: Uses `StandardScaler` to normalize feature distributions (crucial for Logistic Regression).
5.  **Training**: Fits a **Logistic Regression** model on 75% of the data.
6.  **Artifact Generation**: Saves two files required for inference:
    *   `model.pkl`: The trained model object.
    *   `scaler.pkl`: The exact scaler fitted on the training data.

### `backend/verify_ml.py`

A utility script to manually test the deployed ML API endpoints (`/api/ml/predict`) without using the frontend.

#### Functionality:
*   **Test 1 (Likely Approved)**: Sends a request with a high CIBIL score (850) and moderate loan amount. Verifies that the system returns "Approved".
*   **Test 2 (Likely Rejected)**: Sends a request with a low CIBIL score (300) and excessive loan amount. Verifies that the system returns "Rejected".
*   **Usage**: Run this script while `app.py` is running to confirm the ML integration works via HTTP.

