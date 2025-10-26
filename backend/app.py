"""
Flask Application - Mental Wellness API
"""
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from datetime import timedelta
import os
import sys
from datetime import datetime

# Add the backend directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Import configurations and modules
from config.config import config
from config.db import db
from models.User import User
from routes.authRoutes import auth_bp

def create_app(config_name=None):
    """Create and configure Flask application"""
    
    # Create Flask app
    app = Flask(__name__)
    
    # Load configuration
    config_name = config_name or os.environ.get('FLASK_ENV', 'default')
    app.config.from_object(config[config_name])
    
    # Initialize extensions
    CORS(app, origins=app.config['CORS_ORIGINS'])
    JWTManager(app)
    
    # Initialize database
    db.init_app(app)
    
    # Register blueprints
    app.register_blueprint(auth_bp)
    
    # ========== MIDDLEWARE ==========
    
    @app.before_request
    def log_request():
        """Log incoming requests"""
        if request.method in ['POST', 'PUT', 'PATCH']:
            print(f"\n📥 {request.method} {request.path}")
            print(f"   Body: {request.get_json()}")
            print(f"   Headers: {dict(request.headers)}")
    
    # ========== ROUTES ==========
    
    @app.route('/', methods=['GET'])
    def root():
        """Root endpoint"""
        return jsonify({
            'success': True,
            'message': 'Mental Wellness API',
            'version': '1.0.0',
            'framework': 'Flask',
            'database': 'MongoDB',
            'authentication': 'JWT',
            'endpoints': {
                'health': 'GET /api/health',
                'documentation': 'GET /api/docs',
                'auth': {
                    'register': 'POST /api/auth/register',
                    'login': 'POST /api/auth/login',
                    'verify': 'GET /api/auth/verify',
                    'logout': 'POST /api/auth/logout',
                    'forgotPassword': 'POST /api/auth/forgot-password',
                    'resetPassword': 'POST /api/auth/reset-password'
                }
            }
        })
    
    @app.route('/api/health', methods=['GET'])
    def health_check():
        """Health check endpoint"""
        try:
            # Test database connection
            db.get_db().admin.command('ping')
            db_status = 'connected'
        except Exception as e:
            db_status = f'error: {str(e)}'
        
        return jsonify({
            'success': True,
            'message': 'Server is running',
            'timestamp': datetime.utcnow().isoformat(),
            'environment': app.config.get('FLASK_ENV', 'development'),
            'database': db_status,
            'framework': 'Flask',
            'version': '1.0.0'
        }), 200
    
    @app.route('/api/docs', methods=['GET'])
    def api_docs():
        """API documentation endpoint"""
        return jsonify({
            'success': True,
            'api': 'Mental Wellness API',
            'version': '1.0.0',
            'framework': 'Flask',
            'baseUrl': f'http://localhost:{app.config["PORT"]}/api',
            'authentication': 'JWT Bearer Token',
            'endpoints': [
                {
                    'method': 'POST',
                    'path': '/api/auth/register',
                    'description': 'Register a new user',
                    'body': {
                        'name': 'string (required)',
                        'email': 'string (required)',
                        'password': 'string (required, min 6 chars)',
                        'role': 'string (optional, default: student)'
                    }
                },
                {
                    'method': 'POST',
                    'path': '/api/auth/login',
                    'description': 'Login user',
                    'body': {
                        'email': 'string (required)',
                        'password': 'string (required)'
                    }
                },
                {
                    'method': 'GET',
                    'path': '/api/auth/verify',
                    'description': 'Verify JWT token',
                    'headers': {
                        'Authorization': 'Bearer <token>'
                    }
                },
                {
                    'method': 'POST',
                    'path': '/api/auth/logout',
                    'description': 'Logout user (client-side token removal)'
                },
                {
                    'method': 'POST',
                    'path': '/api/auth/forgot-password',
                    'description': 'Send password reset email',
                    'body': {
                        'email': 'string (required)'
                    }
                },
                {
                    'method': 'POST',
                    'path': '/api/auth/reset-password',
                    'description': 'Reset password with token',
                    'body': {
                        'token': 'string (required)',
                        'password': 'string (required)'
                    }
                }
            ]
        })
    
    # ========== ERROR HANDLING ==========
    
    @app.errorhandler(404)
    def not_found(error):
        """404 error handler"""
        return jsonify({
            'success': False,
            'message': 'Route not found',
            'path': request.path,
            'method': request.method
        }), 404
    
    @app.errorhandler(405)
    def method_not_allowed(error):
        """405 error handler"""
        return jsonify({
            'success': False,
            'message': 'Method not allowed',
            'path': request.path,
            'method': request.method
        }), 405
    
    @app.errorhandler(500)
    def internal_error(error):
        """500 error handler"""
        return jsonify({
            'success': False,
            'message': 'Internal server error',
            'error': str(error) if app.debug else 'An error occurred'
        }), 500
    
    # JWT error handlers
    @app.errorhandler(401)
    def unauthorized(error):
        """401 error handler"""
        return jsonify({
            'success': False,
            'message': 'Unauthorized access'
        }), 401
    
    @app.errorhandler(403)
    def forbidden(error):
        """403 error handler"""
        return jsonify({
            'success': False,
            'message': 'Forbidden access'
        }), 403
    
    # ========== INITIALIZATION ==========
    
    def create_test_users():
        """Create test users on startup"""
        try:
            User.create_test_users()
        except Exception as e:
            print(f"Error creating test users: {e}")
    
    # Create test users immediately
    create_test_users()
    
    return app

# Create app instance
app = create_app()

if __name__ == '__main__':
    # Print startup information
    print('\n' + '='.repeat(60))
    print('🚀 MENTAL WELLNESS API SERVER (FLASK)')
    print('='.repeat(60))
    print(f'📡 Server Status: Starting')
    print(f'🌍 Environment: {app.config.get("FLASK_ENV", "development")}')
    print(f'📍 Port: {app.config["PORT"]}')
    print(f'⏰ Started at: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}')
    print('\n🔗 Access URLs:')
    print(f'   Local:           http://localhost:{app.config["PORT"]}')
    print(f'   Network:         http://<your-ip>:{app.config["PORT"]}')
    print(f'   Health Check:    http://localhost:{app.config["PORT"]}/api/health')
    print(f'   Documentation:   http://localhost:{app.config["PORT"]}/api/docs')
    print('\n📱 React Native Connection:')
    print(f'   iOS Simulator:      http://localhost:{app.config["PORT"]}/api')
    print(f'   Android Emulator:   http://10.0.2.2:{app.config["PORT"]}/api')
    print(f'   Physical Device:    http://<your-ip>:{app.config["PORT"]}/api')
    print('\n👤 Test Users:')
    print('   Student: student@test.com / password123')
    print('   Admin:   admin@test.com / admin123')
    print('='.repeat(60) + '\n')
    
    # Run the app
    app.run(
        host=app.config['HOST'],
        port=app.config['PORT'],
        debug=app.config.get('DEBUG', False)
    )
