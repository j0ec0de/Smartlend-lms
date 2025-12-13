from flask import Blueprint, request, jsonify
from utils.jwt_utils import jwt_required
from controllers.document_controller import upload_document

document_bp = Blueprint('document', __name__)

@document_bp.route('/upload/<int:loan_id>', methods=['POST'])
@jwt_required
def upload(loan_id):
    response, status = upload_document(request, loan_id)
    return jsonify(response), status