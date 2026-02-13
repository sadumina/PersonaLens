#!/usr/bin/env python3
"""
Test password truncation for bcrypt 72-byte limit fix
"""
import sys
sys.path.insert(0, '.')

from app.core.security import SecurityService


def test_password_truncation():
    """Test various password scenarios"""
    
    print("=" * 70)
    print("Testing Password Truncation (Bcrypt 72-byte limit)")
    print("=" * 70)
    
    # Test 1: Normal short password
    print("\n1. Testing short ASCII password (< 72 bytes):")
    short_pass = "password123"
    print(f"   Password: '{short_pass}'")
    print(f"   Length: {len(short_pass)} chars, {len(short_pass.encode('utf-8'))} bytes")
    try:
        hashed = SecurityService.hash_password(short_pass)
        verified = SecurityService.verify_password(short_pass, hashed)
        print(f"   ✅ Hash successful: {hashed[:20]}...")
        print(f"   ✅ Verification: {'PASSED' if verified else 'FAILED'}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    # Test 2: Long ASCII password (> 72 bytes)
    print("\n2. Testing long ASCII password (> 72 bytes):")
    long_pass = "a" * 100
    print(f"   Password: {'a' * 20}... (100 'a's)")
    print(f"   Length: {len(long_pass)} chars, {len(long_pass.encode('utf-8'))} bytes")
    try:
        hashed = SecurityService.hash_password(long_pass)
        verified = SecurityService.verify_password(long_pass, hashed)
        print(f"   ✅ Hash successful: {hashed[:20]}...")
        print(f"   ✅ Verification: {'PASSED' if verified else 'FAILED'}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    # Test 3: Multi-byte UTF-8 characters
    print("\n3. Testing multi-byte UTF-8 characters:")
    utf8_pass = "🔒" * 20  # Each emoji is 4 bytes
    print(f"   Password: 20 lock emojis")
    print(f"   Length: {len(utf8_pass)} chars, {len(utf8_pass.encode('utf-8'))} bytes")
    try:
        hashed = SecurityService.hash_password(utf8_pass)
        verified = SecurityService.verify_password(utf8_pass, hashed)
        print(f"   ✅ Hash successful: {hashed[:20]}...")
        print(f"   ✅ Verification: {'PASSED' if verified else 'FAILED'}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    # Test 4: Mixed characters at boundary
    print("\n4. Testing mixed ASCII and UTF-8 at 72-byte boundary:")
    mixed_pass = "a" * 70 + "🔒"  # 70 bytes + 4 bytes = 74 bytes
    print(f"   Password: 70 'a's + 1 emoji")
    print(f"   Length: {len(mixed_pass)} chars, {len(mixed_pass.encode('utf-8'))} bytes")
    try:
        hashed = SecurityService.hash_password(mixed_pass)
        verified = SecurityService.verify_password(mixed_pass, hashed)
        print(f"   ✅ Hash successful: {hashed[:20]}...")
        print(f"   ✅ Verification: {'PASSED' if verified else 'FAILED'}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    # Test 5: Very long password
    print("\n5. Testing very long password (200 bytes):")
    very_long = "SecurePassword123!" * 12  # ~216 bytes
    print(f"   Password: 'SecurePassword123!' repeated 12 times")
    print(f"   Length: {len(very_long)} chars, {len(very_long.encode('utf-8'))} bytes")
    try:
        hashed = SecurityService.hash_password(very_long)
        verified = SecurityService.verify_password(very_long, hashed)
        print(f"   ✅ Hash successful: {hashed[:20]}...")
        print(f"   ✅ Verification: {'PASSED' if verified else 'FAILED'}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    # Test 6: Consistency check - same long password should verify
    print("\n6. Testing consistency - hash and verify same long password:")
    test_pass = "x" * 150
    print(f"   Password: 150 'x's ({len(test_pass.encode('utf-8'))} bytes)")
    try:
        hash1 = SecurityService.hash_password(test_pass)
        hash2 = SecurityService.hash_password(test_pass)
        verify1 = SecurityService.verify_password(test_pass, hash1)
        verify2 = SecurityService.verify_password(test_pass, hash2)
        print(f"   ✅ First hash:  {hash1[:20]}...")
        print(f"   ✅ Second hash: {hash2[:20]}...")
        print(f"   ✅ Verify against first hash: {'PASSED' if verify1 else 'FAILED'}")
        print(f"   ✅ Verify against second hash: {'PASSED' if verify2 else 'FAILED'}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    print("\n" + "=" * 70)
    print("All tests completed!")
    print("=" * 70)


if __name__ == "__main__":
    test_password_truncation()
