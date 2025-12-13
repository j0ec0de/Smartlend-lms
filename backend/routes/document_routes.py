from flask import Blueprint, request, jsonify
from utils.jwt_utils import jwt_required
from utils.decorators import admin_required
from controllers.document_controller import upload_document, get_document_file, get_my_document_file

document_bp = Blueprint('documents', __name__)

@document_bp.route('/upload/<int:loan_id>', methods=['POST'])
@jwt_required
def upload(loan_id):
    response, status = upload_document(request, loan_id)
    return jsonify(response), status

@document_bp.route('/view/<int:document_id>', methods=["GET"])
@jwt_required
@admin_required()
def view_file(document_id):
    return get_document_file(document_id)

@document_bp.route('/my-view/<int:document_id>', methods=["GET"])
@jwt_required
def view_my_file(document_id):
    return get_my_document_file(document_id)