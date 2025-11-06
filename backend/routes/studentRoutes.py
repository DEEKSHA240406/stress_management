"""
Student Routes
"""
from flask import Blueprint
from flask_jwt_extended import jwt_required
from controllers.studentController import StudentController
from middleware.authMiddleware import token_required, student_required

student_bp = Blueprint('student', __name__, url_prefix='/api/students')

@student_bp.route('/select-mentor', methods=['POST'])
@student_required
def select_mentor(current_user):
    return StudentController.select_mentor()


