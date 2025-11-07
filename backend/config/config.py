"""
Flask Application Configuration
"""
import os
from datetime import timedelta
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class Config:
    """Base configuration class"""
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'your-secret-key-change-this-in-production'
    
    # JWT Configuration
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'your-jwt-secret-key-change-this-in-production'
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=int(os.environ.get('JWT_ACCESS_TOKEN_EXPIRES', 7)))
    
    # MongoDB Configuration
    MONGODB_URI = os.environ.get('MONGODB_URI') or 'mongodb://localhost:27017/mental_wellness_db'
    MONGODB_DATABASE = os.environ.get('MONGODB_DATABASE') or 'mental_wellness_db'
    
    # CORS Configuration
    CORS_ORIGINS = os.environ.get('CORS_ORIGINS', '*').split(',')
    
    # Server Configuration
    PORT = int(os.environ.get('PORT', 3000))
    HOST = os.environ.get('HOST', '0.0.0.0')

class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    FLASK_ENV = 'development'

class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False
    FLASK_ENV = 'production'

class TestingConfig(Config):
    """Testing configuration"""
    TESTING = True
    MONGODB_DATABASE = 'mental_wellness_test_db'

# Configuration dictionary
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}
