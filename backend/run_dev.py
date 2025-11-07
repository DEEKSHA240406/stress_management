#!/usr/bin/env python3
"""
Development startup script for Mental Wellness API
"""
import os
import sys
import subprocess
from pathlib import Path

def check_python_version():
    """Check if Python version is 3.8+"""
    if sys.version_info < (3, 8):
        print("❌ Python 3.8 or higher is required")
        print(f"   Current version: {sys.version}")
        return False
    print(f"✅ Python version: {sys.version.split()[0]}")
    return True

def check_virtual_env():
    """Check if virtual environment is activated"""
    if hasattr(sys, 'real_prefix') or (hasattr(sys, 'base_prefix') and sys.base_prefix != sys.prefix):
        print("✅ Virtual environment is activated")
        return True
    else:
        print("⚠️  Virtual environment not detected")
        print("   Consider running: python -m venv venv && venv\\Scripts\\activate")
        return False

def check_dependencies():
    """Check if required packages are installed"""
    try:
        import flask
        import pymongo
        import bcrypt
        import flask_jwt_extended
        import flask_cors
        print("✅ All required packages are installed")
        return True
    except ImportError as e:
        print(f"❌ Missing dependency: {e}")
        print("   Run: pip install -r requirements.txt")
        return False

def check_env_file():
    """Check if .env file exists"""
    env_file = Path('.env')
    if env_file.exists():
        print("✅ .env file found")
        return True
    else:
        print("⚠️  .env file not found")
        print("   Copy env.example to .env and configure your settings")
        return False

def check_mongodb():
    """Check MongoDB connection"""
    try:
        from pymongo import MongoClient
        client = MongoClient('mongodb://localhost:27017/', serverSelectionTimeoutMS=2000)
        client.admin.command('ping')
        print("✅ MongoDB connection successful")
        return True
    except Exception as e:
        print(f"❌ MongoDB connection failed: {e}")
        print("   Make sure MongoDB is running on localhost:27017")
        return False

def main():
    """Main startup function"""
    print("🚀 Mental Wellness API - Development Startup")
    print("=" * 50)
    
    # Run checks
    checks = [
        check_python_version(),
        check_virtual_env(),
        check_dependencies(),
        check_env_file(),
        check_mongodb()
    ]
    
    print("\n" + "=" * 50)
    
    if all(checks):
        print("✅ All checks passed! Starting Flask application...")
        print("=" * 50)
        
        # Start Flask app
        try:
            from app import app
            app.run(
                host=os.environ.get('HOST', '0.0.0.0'),
                port=int(os.environ.get('PORT', 3000)),
                debug=True
            )
        except Exception as e:
            print(f"❌ Failed to start Flask application: {e}")
            sys.exit(1)
    else:
        print("❌ Some checks failed. Please fix the issues above.")
        print("\nQuick setup:")
        print("1. python -m venv venv")
        print("2. venv\\Scripts\\activate  # Windows")
        print("   source venv/bin/activate  # macOS/Linux")
        print("3. pip install -r requirements.txt")
        print("4. cp env.example .env")
        print("5. python run_dev.py")
        sys.exit(1)

if __name__ == "__main__":
    main()
