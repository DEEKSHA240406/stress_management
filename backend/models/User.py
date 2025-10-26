"""
User Model for MongoDB
"""
from datetime import datetime
from bson import ObjectId
from config.db import db
import bcrypt
import re

class User:
    """User model for MongoDB"""
    
    def __init__(self, name=None, email=None, password=None, role='student'):
        self.name = name
        self.email = email
        self.password = password
        self.role = role
        self.created_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()
    
    @staticmethod
    def get_collection():
        """Get users collection"""
        return db.get_collection('users')
    
    @staticmethod
    def validate_email(email):
        """Validate email format"""
        email_regex = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
        return re.match(email_regex, email) is not None
    
    @staticmethod
    def validate_password(password):
        """Validate password strength"""
        # At least 6 characters, 1 uppercase, 1 lowercase, 1 number
        return (len(password) >= 6 and 
                re.search(r'[a-z]', password) and 
                re.search(r'[A-Z]', password) and 
                re.search(r'\d', password))
    
    @staticmethod
    def hash_password(password):
        """Hash password using bcrypt"""
        salt = bcrypt.gensalt()
        return bcrypt.hashpw(password.encode('utf-8'), salt)
    
    @staticmethod
    def verify_password(password, hashed_password):
        """Verify password against hash"""
        return bcrypt.checkpw(password.encode('utf-8'), hashed_password)
    
    def save(self):
        """Save user to database"""
        try:
            # Validate required fields
            if not self.name or not self.email or not self.password:
                raise ValueError("Name, email, and password are required")
            
            # Validate email format
            if not self.validate_email(self.email):
                raise ValueError("Invalid email format")
            
            # Validate password strength
            if not self.validate_password(self.password):
                raise ValueError("Password must be at least 6 characters and contain uppercase, lowercase, and number")
            
            # Check if user already exists
            existing_user = self.get_collection().find_one({'email': self.email.lower()})
            if existing_user:
                raise ValueError("Email already registered")
            
            # Hash password
            self.password = self.hash_password(self.password)
            
            # Prepare user data
            user_data = {
                'name': self.name.strip(),
                'email': self.email.lower().strip(),
                'password': self.password,
                'role': self.role,
                'created_at': self.created_at,
                'updated_at': self.updated_at
            }
            
            # Insert user
            result = self.get_collection().insert_one(user_data)
            
            # Return user without password
            user_data['_id'] = result.inserted_id
            del user_data['password']
            
            return user_data
            
        except Exception as e:
            raise e
    
    @staticmethod
    def find_by_email(email):
        """Find user by email"""
        return User.get_collection().find_one({'email': email.lower()})
    
    @staticmethod
    def find_by_id(user_id):
        """Find user by ID"""
        try:
            if isinstance(user_id, str):
                user_id = ObjectId(user_id)
            return User.get_collection().find_one({'_id': user_id})
        except Exception:
            return None
    
    @staticmethod
    def authenticate(email, password):
        """Authenticate user with email and password"""
        try:
            user = User.find_by_email(email)
            if not user:
                return None
            
            if User.verify_password(password, user['password']):
                # Return user without password
                user_copy = user.copy()
                del user_copy['password']
                return user_copy
            
            return None
            
        except Exception as e:
            print(f"Authentication error: {e}")
            return None
    
    @staticmethod
    def update_user(user_id, update_data):
        """Update user data"""
        try:
            if isinstance(user_id, str):
                user_id = ObjectId(user_id)
            
            # Remove password from update data if present
            update_data.pop('password', None)
            update_data['updated_at'] = datetime.utcnow()
            
            result = User.get_collection().update_one(
                {'_id': user_id},
                {'$set': update_data}
            )
            
            return result.modified_count > 0
            
        except Exception as e:
            print(f"Update user error: {e}")
            return False
    
    @staticmethod
    def delete_user(user_id):
        """Delete user"""
        try:
            if isinstance(user_id, str):
                user_id = ObjectId(user_id)
            
            result = User.get_collection().delete_one({'_id': user_id})
            return result.deleted_count > 0
            
        except Exception as e:
            print(f"Delete user error: {e}")
            return False
    
    @staticmethod
    def get_all_users():
        """Get all users (for admin purposes)"""
        try:
            users = list(User.get_collection().find({}, {'password': 0}))
            return users
        except Exception as e:
            print(f"Get all users error: {e}")
            return []
    
    @staticmethod
    def create_test_users():
        """Create test users for development"""
        try:
            test_users = [
                {
                    'name': 'Test Student',
                    'email': 'student@test.com',
                    'password': User.hash_password('password123'),
                    'role': 'student',
                    'created_at': datetime.utcnow(),
                    'updated_at': datetime.utcnow()
                },
                {
                    'name': 'Test Admin',
                    'email': 'admin@test.com',
                    'password': User.hash_password('admin123'),
                    'role': 'admin',
                    'created_at': datetime.utcnow(),
                    'updated_at': datetime.utcnow()
                }
            ]
            
            # Check if test users already exist
            existing_student = User.find_by_email('student@test.com')
            existing_admin = User.find_by_email('admin@test.com')
            
            if not existing_student:
                User.get_collection().insert_one(test_users[0])
                print("✅ Test student user created: student@test.com / password123")
            
            if not existing_admin:
                User.get_collection().insert_one(test_users[1])
                print("✅ Test admin user created: admin@test.com / admin123")
                
        except Exception as e:
            print(f"Error creating test users: {e}")
    
    def to_dict(self):
        """Convert user to dictionary"""
        return {
            'name': self.name,
            'email': self.email,
            'role': self.role,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
