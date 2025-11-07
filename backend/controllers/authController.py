"""
Authentication Controller
"""
from flask import request, jsonify
from flask_jwt_extended import create_access_token, get_jwt_identity
from models.User import User
from middleware.authMiddleware import validate_request_data
from datetime import datetime

class AuthController:
    """Authentication controller for handling auth operations"""
    
    @staticmethod
    @validate_request_data(['name', 'email', 'password'])
    def register(data):
        """Register a new user"""
        try:
            name = data.get('name', '').strip()
            email = data.get('email', '').strip()
            password = data.get('password', '')
            role = data.get('role', 'student')
            
            print(f'📝 Registration attempt: {name}, {email}, {role}')
            
            # Validate name length
            if len(name) < 3:
                return jsonify({
                    'success': False,
                    'message': 'Name must be at least 3 characters long'
                }), 400
            
            # Validate email format
            if not User.validate_email(email):
                return jsonify({
                    'success': False,
                    'message': 'Please provide a valid email address'
                }), 400
            
            # Validate password strength
            if not User.validate_password(password):
                return jsonify({
                    'success': False,
                    'message': 'Password must be at least 6 characters and contain uppercase, lowercase, and number'
                }), 400
            
            # Check if user already exists
            existing_user = User.find_by_email(email)
            if existing_user:
                return jsonify({
                    'success': False,
                    'message': 'Email already registered. Please use a different email or login.'
                }), 409
            
            # Validate role (default to student if invalid)
            if not User.is_valid_role(role):
                role = 'student'

            # Create new user (mentor is chosen later by student)
            new_user = User(name=name, email=email, password=password, role=role, mentor_id=None, mentor_name=None)
            user_data = new_user.save()
            
            # Generate JWT token
            token = create_access_token(identity=str(user_data['_id']))
            
            # Prepare response (exclude password and _id)
            user_response = {
                'id': str(user_data['_id']),
                'name': user_data['name'],
                'email': user_data['email'],
                'role': user_data['role'],
                'mentor_id': user_data.get('mentor_id') and str(user_data.get('mentor_id')),
                'mentor_name': user_data.get('mentor_name'),
                'created_at': user_data['created_at'].isoformat()
            }
            
            print(f'✅ User registered successfully: {user_response["email"]}')
            
            return jsonify({
                'success': True,
                'message': 'Registration successful',
                'token': token,
                'user': user_response
            }), 201
            
        except ValueError as e:
            return jsonify({
                'success': False,
                'message': str(e)
            }), 400
            
        except Exception as e:
            print(f'❌ Registration error: {e}')
            return jsonify({
                'success': False,
                'message': 'Server error during registration. Please try again.'
            }), 500
    
    @staticmethod
    @validate_request_data(['email', 'password'])
    def login(data):
        """Login user"""
        try:
            email = data.get('email', '').strip()
            password = data.get('password', '')
            
            print(f'🔐 Login attempt: {email}')
            
            # Validate email format
            if not User.validate_email(email):
                return jsonify({
                    'success': False,
                    'message': 'Please provide a valid email address'
                }), 400
            
            # Authenticate user
            user = User.authenticate(email, password)
            
            if not user:
                return jsonify({
                    'success': False,
                    'message': 'Invalid credentials. Please check your email and password.'
                }), 401
            
            # Generate JWT token
            token = create_access_token(identity=str(user['_id']))
            
            # Prepare response (exclude password and _id)
            user_response = {
                'id': str(user['_id']),
                'name': user['name'],
                'email': user['email'],
                'role': user['role'],
                'created_at': user['created_at'].isoformat()
            }
            
            print(f'✅ Login successful: {user_response["email"]}')
            
            return jsonify({
                'success': True,
                'message': 'Login successful',
                'token': token,
                'user': user_response
            }), 200
            
        except Exception as e:
            print(f'❌ Login error: {e}')
            return jsonify({
                'success': False,
                'message': 'Server error during login. Please try again.'
            }), 500
    
    @staticmethod
    def verify_token():
        """Verify JWT token and get user data"""
        try:
            # Get current user ID from token
            current_user_id = get_jwt_identity()
            
            # Find user in database
            user = User.find_by_id(current_user_id)
            
            if not user:
                return jsonify({
                    'success': False,
                    'message': 'User not found'
                }), 404
            
            # Prepare response (exclude password and _id)
            user_response = {
                'id': str(user['_id']),
                'name': user['name'],
                'email': user['email'],
                'role': user['role'],
                'created_at': user['created_at'].isoformat()
            }
            
            return jsonify({
                'success': True,
                'user': user_response
            }), 200
            
        except Exception as e:
            print(f'❌ Token verification error: {e}')
            return jsonify({
                'success': False,
                'message': 'Token verification failed'
            }), 401
    
    @staticmethod
    def logout():
        """Logout user (client-side token removal)"""
        return jsonify({
            'success': True,
            'message': 'Logout successful'
        }), 200
    
    @staticmethod
    def forgot_password():
        """Send password reset email"""
        try:
            data = request.get_json()
            
            if not data or not data.get('email'):
                return jsonify({
                    'success': False,
                    'message': 'Please provide an email address'
                }), 400
            
            email = data.get('email', '').strip()
            
            # Find user
            user = User.find_by_email(email)
            
            if not user:
                # Don't reveal if user exists (security best practice)
                return jsonify({
                    'success': True,
                    'message': 'If an account exists with this email, a password reset link has been sent.'
                }), 200
            
            # In production: Generate reset token, save to DB, send email
            # For now, just return success
            print(f'🔑 Password reset requested for: {email}')
            
            return jsonify({
                'success': True,
                'message': 'Password reset email sent successfully'
            }), 200
            
        except Exception as e:
            print(f'❌ Forgot password error: {e}')
            return jsonify({
                'success': False,
                'message': 'Error sending reset email. Please try again.'
            }), 500
    
    @staticmethod
    def reset_password():
        """Reset password with token"""
        try:
            data = request.get_json()
            
            if not data:
                return jsonify({
                    'success': False,
                    'message': 'Request body is required'
                }), 400
            
            token = data.get('token')
            password = data.get('password')
            
            if not token or not password:
                return jsonify({
                    'success': False,
                    'message': 'Please provide reset token and new password'
                }), 400
            
            # Validate password strength
            if not User.validate_password(password):
                return jsonify({
                    'success': False,
                    'message': 'Password must be at least 6 characters and contain uppercase, lowercase, and number'
                }), 400
            
            # In production: Verify reset token, find user, update password
            # For now, just return success
            print('🔒 Password reset attempt with token')
            
            return jsonify({
                'success': True,
                'message': 'Password reset successful. Please login with your new password.'
            }), 200
            
        except Exception as e:
            print(f'❌ Reset password error: {e}')
            return jsonify({
                'success': False,
                'message': 'Error resetting password. Please try again.'
            }), 500
    
    @staticmethod
    def get_all_users():
        """Get all users (for admin purposes)"""
        try:
            users = User.get_all_users()
            
            # Convert fields for JSON serialization safely
            from datetime import datetime
            for user in users:
                if user.get('_id'):
                    user['id'] = str(user['_id'])
                    del user['_id']
                # Optional role-related fields
                if user.get('mentor_id'):
                    try:
                        user['mentor_id'] = str(user['mentor_id'])
                    except Exception:
                        pass
                # Datetime fields may be missing or already strings
                for ts_field in ['created_at', 'updated_at', 'started_at', 'completed_at']:
                    if ts_field in user and isinstance(user[ts_field], datetime):
                        user[ts_field] = user[ts_field].isoformat()
            
            return jsonify({
                'success': True,
                'count': len(users),
                'users': users
            }), 200
            
        except Exception as e:
            print(f'❌ Get all users error: {e}')
            return jsonify({
                'success': False,
                'message': 'Error retrieving users'
            }), 500
