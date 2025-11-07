"""
MongoDB Database Configuration
"""
from pymongo import MongoClient
from flask import current_app
import os

class Database:
    """Database connection manager"""
    _client = None
    _db = None
    
    @classmethod
    def init_app(cls, app):
        """Initialize database connection"""
        try:
            cls._client = MongoClient(app.config['MONGODB_URI'])
            cls._db = cls._client[app.config['MONGODB_DATABASE']]
            
            # Test connection
            cls._client.admin.command('ping')
            print(f"✅ Connected to MongoDB: {app.config['MONGODB_DATABASE']}")
            
        except Exception as e:
            print(f"❌ MongoDB connection failed: {e}")
            raise e
    
    @classmethod
    def get_db(cls):
        """Get database instance"""
        if cls._db is None:
            raise RuntimeError("Database not initialized. Call init_app() first.")
        return cls._db
    
    @classmethod
    def get_collection(cls, collection_name):
        """Get collection instance"""
        return cls.get_db()[collection_name]
    
    @classmethod
    def close_connection(cls):
        """Close database connection"""
        if cls._client:
            cls._client.close()
            print("🔌 MongoDB connection closed")

# Database instance
db = Database()
