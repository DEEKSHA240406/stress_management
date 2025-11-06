"""
Test submission Routes
"""
from flask import Blueprint
from flask_jwt_extended import jwt_required
from controllers.studentController import StudentController
from middleware.authMiddleware import student_required

test_bp = Blueprint('tests', __name__, url_prefix='/api/tests')

@test_bp.route('/submit', methods=['POST'])
@student_required
def submit_test(current_user):
    return StudentController.submit_test()


