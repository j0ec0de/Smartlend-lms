import os
from flask import current_app
from werkzeug.utils import secure_filename
from utils.jwt_utils import get_jwt_identity
from models.document import Document
from models.loan_applications import LoanApplication
from extensions import db

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in current_app.config['ALLOWED_EXTENSIONS']

def upload_document(request, loan_id):
    try:
        current_user = get_jwt_identity()
        
        # 1. Check if the loan exists and belongs to this user
        # (This prevents User A from uploading docs to User B's loan)
        loan = LoanApplication.query.filter_by(id=loan_id, user_id=current_user.id).first()
        if not loan:
            return {"error": "Loan not found or unauthorized"}, 404

        # 2. Check if file is present
        if 'file' not in request.files:
            return {"error": "No file part in the request"}, 400
            
        file = request.files['file']
        
        if file.filename == '':
            return {"error": "No selected file"}, 400

        # 3. Validate File Type
        if file and allowed_file(file.filename):
            # Secure the filename (prevents hacking via file names)
            filename = secure_filename(file.filename)
            
            # Create a unique name to prevent overwrites (e.g., 105_resume.pdf)
            unique_filename = f"{loan_id}_{filename}"
            file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], unique_filename)
            
            # 4. Save File to Disk
            file.save(file_path)

            # 5. Save Record to Database
            new_doc = Document(
                loan_id=loan_id,
                file_name=filename,
                file_path=file_path,
                file_type=filename.rsplit('.', 1)[1].lower()
            )
            
            db.session.add(new_doc)
            db.session.commit()

            return {"message": "File uploaded successfully", "doc_id": new_doc.id}, 201
        
        else:
            return {"error": "File type not allowed"}, 400

    except Exception as e:
        return {"error": str(e)}, 500