"""
Authentication Routes
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from controllers.authController import AuthController
from middleware.authMiddleware import token_required, admin_required

# Create blueprint
auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new user"""
    return AuthController.register(request.get_json())

@auth_bp.route('/login', methods=['POST'])
def login():
    """Login user"""
    return AuthController.login(request.get_json())

@auth_bp.route('/verify', methods=['GET'])
@jwt_required()
def verify():
    """Verify JWT token and get user data"""
    return AuthController.verify_token()

@auth_bp.route('/logout', methods=['POST'])
def logout():
    """Logout user (client-side token removal)"""
    return AuthController.logout()

@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    """Send password reset email"""
    return AuthController.forgot_password()

@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    """Reset password with token"""
    return AuthController.reset_password()

@auth_bp.route('/users', methods=['GET'])
@admin_required
def get_all_users(current_user):
    """Get all users (admin only)"""
    return AuthController.get_all_users()

# Health check for auth routes
@auth_bp.route('/health', methods=['GET'])
def auth_health():
    """Health check for auth routes"""
    return jsonify({
        'success': True,
        'message': 'Auth routes are working',
        'routes': [
            'POST /api/auth/register',
            'POST /api/auth/login',
            'GET /api/auth/verify',
            'POST /api/auth/logout',
            'POST /api/auth/forgot-password',
            'POST /api/auth/reset-password',
            'GET /api/auth/users (admin only)'
        ]
    }), 200
