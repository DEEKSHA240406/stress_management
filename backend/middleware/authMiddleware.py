"""
JWT Authentication Middleware
"""
from functools import wraps
from flask import request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity, verify_jwt_in_request
from models.User import User
from bson import ObjectId

def token_required(f):
    """Decorator to require JWT token for protected routes"""
    @wraps(f)
    def decorated(*args, **kwargs):
        try:
            # Verify JWT token
            verify_jwt_in_request()
            
            # Get current user ID from token
            current_user_id = get_jwt_identity()
            
            # Find user in database
            user = User.find_by_id(current_user_id)
            
            if not user:
                return jsonify({
                    'success': False,
                    'message': 'User not found'
                }), 404
            
            # Add current user to kwargs for use in route
            kwargs['current_user'] = user
            
            return f(*args, **kwargs)
            
        except Exception as e:
            return jsonify({
                'success': False,
                'message': 'Token is invalid or expired'
            }), 401
    
    return decorated

def admin_required(f):
    """Decorator to require admin role for protected routes"""
    @wraps(f)
    def decorated(*args, **kwargs):
        try:
            # Verify JWT token
            verify_jwt_in_request()
            
            # Get current user ID from token
            current_user_id = get_jwt_identity()
            
            # Find user in database
            user = User.find_by_id(current_user_id)
            
            if not user:
                return jsonify({
                    'success': False,
                    'message': 'User not found'
                }), 404
            
            # Check if user is admin
            if user.get('role') != 'admin':
                return jsonify({
                    'success': False,
                    'message': 'Admin access required'
                }), 403
            
            # Add current user to kwargs for use in route
            kwargs['current_user'] = user
            
            return f(*args, **kwargs)
            
        except Exception as e:
            return jsonify({
                'success': False,
                'message': 'Token is invalid or expired'
            }), 401
    
    return decorated

def student_required(f):
    """Decorator to require student role for protected routes"""
    @wraps(f)
    def decorated(*args, **kwargs):
        try:
            # Verify JWT token
            verify_jwt_in_request()
            
            # Get current user ID from token
            current_user_id = get_jwt_identity()
            
            # Find user in database
            user = User.find_by_id(current_user_id)
            
            if not user:
                return jsonify({
                    'success': False,
                    'message': 'User not found'
                }), 404
            
            # Check if user is student
            if user.get('role') != 'student':
                return jsonify({
                    'success': False,
                    'message': 'Student access required'
                }), 403
            
            # Add current user to kwargs for use in route
            kwargs['current_user'] = user
            
            return f(*args, **kwargs)
            
        except Exception as e:
            return jsonify({
                'success': False,
                'message': 'Token is invalid or expired'
            }), 401
    
    return decorated

def get_current_user():
    """Get current user from JWT token"""
    try:
        verify_jwt_in_request()
        current_user_id = get_jwt_identity()
        user = User.find_by_id(current_user_id)
        return user
    except Exception:
        return None

def validate_request_data(required_fields):
    """Decorator to validate request data"""
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            data = request.get_json()
            
            if not data:
                return jsonify({
                    'success': False,
                    'message': 'Request body is required'
                }), 400
            
            # Check for required fields
            missing_fields = []
            for field in required_fields:
                if field not in data or not data[field]:
                    missing_fields.append(field)
            
            if missing_fields:
                return jsonify({
                    'success': False,
                    'message': f'Missing required fields: {", ".join(missing_fields)}'
                }), 400
            
            # Add validated data to kwargs
            kwargs['data'] = data
            
            return f(*args, **kwargs)
        
        return decorated
    return decorator
