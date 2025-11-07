"""
Validation Utilities
"""
import re
from datetime import datetime

class Validators:
    """Validation utility class"""
    
    @staticmethod
    def validate_email(email):
        """Validate email format"""
        if not email or not isinstance(email, str):
            return False
        
        email_regex = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
        return re.match(email_regex, email.strip()) is not None
    
    @staticmethod
    def validate_password(password):
        """Validate password strength"""
        if not password or not isinstance(password, str):
            return False
        
        # At least 6 characters, 1 uppercase, 1 lowercase, 1 number
        return (len(password) >= 6 and 
                re.search(r'[a-z]', password) and 
                re.search(r'[A-Z]', password) and 
                re.search(r'\d', password))
    
    @staticmethod
    def validate_name(name):
        """Validate name format"""
        if not name or not isinstance(name, str):
            return False
        
        name = name.strip()
        return len(name) >= 3 and len(name) <= 100
    
    @staticmethod
    def validate_role(role):
        """Validate user role"""
        valid_roles = ['student', 'admin']
        return role in valid_roles
    
    @staticmethod
    def sanitize_string(value):
        """Sanitize string input"""
        if not value or not isinstance(value, str):
            return ''
        
        return value.strip()
    
    @staticmethod
    def validate_required_fields(data, required_fields):
        """Validate required fields in data"""
        if not data or not isinstance(data, dict):
            return False, "Data is required"
        
        missing_fields = []
        for field in required_fields:
            if field not in data or not data[field]:
                missing_fields.append(field)
        
        if missing_fields:
            return False, f"Missing required fields: {', '.join(missing_fields)}"
        
        return True, "Valid"
    
    @staticmethod
    def validate_user_data(data):
        """Validate complete user data"""
        # Check required fields
        required_fields = ['name', 'email', 'password']
        is_valid, message = Validators.validate_required_fields(data, required_fields)
        
        if not is_valid:
            return False, message
        
        # Validate individual fields
        if not Validators.validate_name(data['name']):
            return False, "Name must be between 3 and 100 characters"
        
        if not Validators.validate_email(data['email']):
            return False, "Please provide a valid email address"
        
        if not Validators.validate_password(data['password']):
            return False, "Password must be at least 6 characters and contain uppercase, lowercase, and number"
        
        # Validate role if provided
        if 'role' in data and not Validators.validate_role(data['role']):
            return False, "Role must be either 'student' or 'admin'"
        
        return True, "Valid"
    
    @staticmethod
    def validate_login_data(data):
        """Validate login data"""
        required_fields = ['email', 'password']
        is_valid, message = Validators.validate_required_fields(data, required_fields)
        
        if not is_valid:
            return False, message
        
        if not Validators.validate_email(data['email']):
            return False, "Please provide a valid email address"
        
        return True, "Valid"
