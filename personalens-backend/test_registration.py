#!/usr/bin/env python3
"""
Test registration endpoint to diagnose 500 error
"""
import requests
import json

# Backend URL - adjust if needed
API_URL = "http://localhost:8000"

def test_health():
    """Test health endpoint"""
    try:
        response = requests.get(f"{API_URL}/health")
        print(f"Health Check Status: {response.status_code}")
        print(json.dumps(response.json(), indent=2))
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Health check failed: {e}")
        return False

def test_registration():
    """Test registration endpoint"""
    test_user = {
        "username": "testuser123",
        "email": "testuser123@example.com",
        "password": "testpass123"
    }
    
    try:
        response = requests.post(
            f"{API_URL}/auth/register",
            json=test_user,
            headers={"Content-Type": "application/json"}
        )
        
        print(f"\nRegistration Status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 201:
            print("✅ Registration successful!")
            return True
        elif response.status_code == 400:
            print("⚠️  User already exists or validation error")
            return False
        else:
            print(f"❌ Registration failed with status {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Registration request failed: {e}")
        return False

if __name__ == "__main__":
    print("=" * 50)
    print("PersonaLens Registration Test")
    print("=" * 50)
    
    print("\n1. Testing Health Endpoint...")
    health_ok = test_health()
    
    if health_ok:
        print("\n2. Testing Registration...")
        test_registration()
    else:
        print("\n❌ Skipping registration test - backend not healthy")
