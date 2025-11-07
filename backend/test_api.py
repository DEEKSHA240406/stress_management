#!/usr/bin/env python3
"""
Test script for Mental Wellness API
"""
import requests
import json
import time

BASE_URL = "http://localhost:3000"

def test_health():
    """Test health endpoint"""
    print("🔍 Testing health endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/api/health")
        if response.status_code == 200:
            print("✅ Health check passed")
            return True
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Health check error: {e}")
        return False

def test_register():
    """Test user registration"""
    print("\n🔍 Testing user registration...")
    try:
        data = {
            "name": "Test User",
            "email": "test@example.com",
            "password": "Test123",
            "role": "student"
        }
        response = requests.post(f"{BASE_URL}/api/auth/register", json=data)
        
        if response.status_code == 201:
            result = response.json()
            print("✅ Registration successful")
            print(f"   User ID: {result['user']['id']}")
            print(f"   Token: {result['token'][:20]}...")
            return result['token']
        else:
            print(f"❌ Registration failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Registration error: {e}")
        return None

def test_login():
    """Test user login"""
    print("\n🔍 Testing user login...")
    try:
        data = {
            "email": "student@test.com",
            "password": "password123"
        }
        response = requests.post(f"{BASE_URL}/api/auth/login", json=data)
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Login successful")
            print(f"   User: {result['user']['name']}")
            print(f"   Role: {result['user']['role']}")
            return result['token']
        else:
            print(f"❌ Login failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Login error: {e}")
        return None

def test_verify_token(token):
    """Test token verification"""
    print("\n🔍 Testing token verification...")
    try:
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get(f"{BASE_URL}/api/auth/verify", headers=headers)
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Token verification successful")
            print(f"   User: {result['user']['name']}")
            return True
        else:
            print(f"❌ Token verification failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Token verification error: {e}")
        return False

def test_docs():
    """Test API documentation"""
    print("\n🔍 Testing API documentation...")
    try:
        response = requests.get(f"{BASE_URL}/api/docs")
        if response.status_code == 200:
            print("✅ API documentation accessible")
            return True
        else:
            print(f"❌ API documentation failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ API documentation error: {e}")
        return False

def main():
    """Run all tests"""
    print("🧪 Mental Wellness API Test Suite")
    print("=" * 50)
    
    # Wait a moment for server to start
    print("⏳ Waiting for server to start...")
    time.sleep(2)
    
    tests_passed = 0
    total_tests = 5
    
    # Run tests
    if test_health():
        tests_passed += 1
    
    token = test_login()
    if token:
        tests_passed += 1
        
        if test_verify_token(token):
            tests_passed += 1
    
    if test_register():
        tests_passed += 1
    
    if test_docs():
        tests_passed += 1
    
    # Results
    print("\n" + "=" * 50)
    print(f"📊 Test Results: {tests_passed}/{total_tests} tests passed")
    
    if tests_passed == total_tests:
        print("🎉 All tests passed! API is working correctly.")
    else:
        print("⚠️  Some tests failed. Check the server logs for details.")
    
    print("\n🔗 API Endpoints:")
    print(f"   Health: {BASE_URL}/api/health")
    print(f"   Docs: {BASE_URL}/api/docs")
    print(f"   Register: POST {BASE_URL}/api/auth/register")
    print(f"   Login: POST {BASE_URL}/api/auth/login")

if __name__ == "__main__":
    main()
