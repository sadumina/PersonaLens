"""
API Test Script
"""
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

print("=" * 60)
print("Testing PersonaLens API")
print("=" * 60)

# Test 1: Health check
print("\n1. Testing health endpoint...")
response = client.get('/health')
print(f"   Status: {response.status_code}")
print(f"   Response: {response.json()}")
assert response.status_code == 200
print("   ✅ Health check passed")

# Test 2: User registration
print("\n2. Testing user registration...")
user_data = {
    'username': 'testuser123',
    'email': 'testuser123@example.com',
    'password': 'testpass123'
}
response = client.post('/auth/register', json=user_data)
print(f"   Status: {response.status_code}")
if response.status_code == 201:
    print(f"   Response: {response.json()}")
    print("   ✅ User registration passed")
else:
    print(f"   Error: {response.json()}")
    # If user exists, that's okay for testing
    if response.status_code == 400:
        print("   (User already exists, continuing...)")

# Test 3: User login
print("\n3. Testing user login...")
login_data = {
    'email': 'testuser123@example.com',
    'password': 'testpass123'
}
response = client.post('/auth/login', json=login_data)
print(f"   Status: {response.status_code}")
assert response.status_code == 200
token_data = response.json()
token = token_data['access_token']
print("   ✅ Login successful, token obtained")

# Test 4: Get current user (protected route)
print("\n4. Testing protected route (get current user)...")
headers = {'Authorization': f'Bearer {token}'}
response = client.get('/auth/me', headers=headers)
print(f"   Status: {response.status_code}")
assert response.status_code == 200
user_info = response.json()
print(f"   User info: username={user_info['username']}, email={user_info['email']}")
print("   ✅ Protected route working")

# Test 5: Get analysis history (should be empty)
print("\n5. Testing analysis history endpoint...")
response = client.get('/analyze/history', headers=headers)
print(f"   Status: {response.status_code}")
assert response.status_code == 200
history = response.json()
print(f"   Total analyses: {history['total']}")
print("   ✅ History endpoint working")

print("\n" + "=" * 60)
print("All tests passed! ✅")
print("=" * 60)
