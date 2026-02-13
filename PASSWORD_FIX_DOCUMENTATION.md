# Password Length Fix - Bcrypt 72-Byte Limit

## Problem
Users were getting this error during registration:
```
Password processing failed: password cannot be longer than 72 bytes, truncate manually if necessary (e.g. my_password[:72])
```

## Root Cause

### Bcrypt Limitation
Bcrypt has a **hard limit of 72 bytes** for passwords. This is a fundamental limitation of the bcrypt algorithm itself, not a bug.

### Library Compatibility Issue
- The app was using `passlib 1.7.4` with `bcrypt 5.0.0`
- These versions are **incompatible**, causing errors even with short passwords
- Passlib 1.7.4 was designed for older bcrypt versions (< 4.0.0)

### No Automatic Truncation
The previous code had truncation logic, but passlib was rejecting passwords before the truncation could happen.

## Solution Implemented

### 1. Switched from passlib to Direct bcrypt API

**Before (using passlib):**
```python
from passlib.context import CryptContext
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)  # ❌ Fails with long passwords
```

**After (using bcrypt directly):**
```python
import bcrypt

def hash_password(password: str) -> str:
    password_bytes = _truncate_password_bytes(password)
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes, salt)
    return hashed.decode('utf-8')  # ✅ Works with any length
```

### 2. Smart Password Truncation

The `_truncate_password_bytes()` method safely handles the 72-byte limit:

```python
def _truncate_password_bytes(password: str) -> bytes:
    password_bytes = password.encode('utf-8')
    
    # If already under limit, return as-is
    if len(password_bytes) <= 72:
        return password_bytes
    
    # Iteratively reduce to avoid cutting UTF-8 characters
    max_length = 72
    while len(password[:max_length].encode('utf-8')) > 72:
        max_length -= 1
    
    return password[:max_length].encode('utf-8')
```

**Why this approach?**
- UTF-8 characters can be 1-4 bytes each
- Simply truncating at byte 72 could cut in the middle of a multi-byte character
- We reduce the character count until the bytes fit within 72

### 3. Consistent Truncation in Both Hash and Verify

Both `hash_password()` and `verify_password()` use the same truncation:

```python
def hash_password(password: str) -> str:
    password_bytes = _truncate_password_bytes(password)  # Truncate
    # ... hash the truncated password
    
def verify_password(plain_password: str, hashed_password: str) -> bool:
    password_bytes = _truncate_password_bytes(plain_password)  # Same truncation!
    return bcrypt.checkpw(password_bytes, hashed_bytes)
```

This ensures that verification works correctly even if the user's password is longer than 72 bytes.

## Testing

All test scenarios pass ✅:

### Test 1: Short ASCII Password
```
Password: 'password123' (11 bytes)
✅ Hash: $2b$12$HMKGl93L4P9S8...
✅ Verify: PASSED
```

### Test 2: Long ASCII Password  
```
Password: 100 'a's (100 bytes → truncated to 72)
✅ Hash: $2b$12$m.Y7293Zw5imE...
✅ Verify: PASSED
```

### Test 3: Multi-byte UTF-8 (Emojis)
```
Password: 20 lock emojis (80 bytes → truncated to 72)
✅ Hash: $2b$12$2rTP3reM6Ili0...
✅ Verify: PASSED
```

### Test 4: Mixed Characters at Boundary
```
Password: 70 'a's + 1 emoji (74 bytes → truncated to 70)
✅ Hash: $2b$12$IlsFu/TJGXazw...
✅ Verify: PASSED
```

### Test 5: Very Long Password
```
Password: 'SecurePassword123!' × 12 (216 bytes → truncated to 72)
✅ Hash: $2b$12$iQWZ7xIs/WgUZ...
✅ Verify: PASSED
```

### Test 6: Consistency Check
```
Password: 150 'x's (150 bytes → truncated to 72)
✅ Hash 1: $2b$12$zQCSLRgPzjdkD...
✅ Hash 2: $2b$12$7UzmLwQ1tgBVw...
✅ Verify against both: PASSED
```

## User Experience

### What Users See

**Before:**
```
❌ Error: Password processing failed: password cannot be longer than 72 bytes
```

**After:**
```
✅ Registration successful!
(Long passwords automatically truncated, no error shown)
```

### Logging (Backend Only)

When a password exceeds 72 bytes, the backend logs:
```
WARNING: Password truncated from 150 bytes to 72 bytes
```

This helps admins monitor if users are trying to use extremely long passwords.

## Security Considerations

### Is Truncation Secure?

**Yes!** Here's why:

1. **Bcrypt's Built-in Limit**: Even without our truncation, bcrypt itself only uses the first 72 bytes. We're just making this explicit.

2. **Consistent Behavior**: Both hashing and verification use the same truncation, so authentication works correctly.

3. **Entropy is Sufficient**: A well-designed 72-byte password has more than enough entropy (randomness) to be secure. Most passwords are much shorter anyway.

4. **No Information Leakage**: Users don't see different behavior between short and long passwords. They just register successfully.

### Recommended Password Policy

For best security, recommend to users:
- Minimum: 8-12 characters (enforced in schema as 6+ currently)
- Maximum: No need to enforce since truncation handles it
- Use variety: Mix of uppercase, lowercase, numbers, symbols
- Length isn't everything: A 12-character random password is more secure than a 100-character dictionary phrase

## Migration Notes

### Existing Users

Existing users with hashed passwords will:
- ✅ Continue to log in normally (bcrypt hashes are backward compatible)
- ✅ Not need to reset their passwords
- ✅ Experience no disruption

### New Users

New users can:
- ✅ Register with any password length
- ✅ Use international characters and emojis
- ✅ No "password too long" errors

## Files Changed

1. **`app/core/security.py`**
   - Removed passlib dependency
   - Added direct bcrypt usage
   - Implemented `_truncate_password_bytes()`
   - Updated `hash_password()` and `verify_password()`

2. **`app/schemas/user_schema.py`**
   - Added `@field_validator` for password length
   - Warns (doesn't reject) if password > 72 bytes

3. **`test_password_truncation.py`**
   - Comprehensive test suite
   - Tests all edge cases
   - Validates truncation logic

## Running Tests

```bash
cd personalens-backend
source venv/bin/activate
python3 test_password_truncation.py
```

Expected output:
```
======================================================================
Testing Password Truncation (Bcrypt 72-byte limit)
======================================================================
All tests completed!
✅ 6/6 tests passed
```

## Technical Details

### Why 72 Bytes?

Bcrypt's design:
1. Converts password to bytes
2. Runs it through Blowfish cipher in EKS mode
3. Blowfish uses password for key setup with **72-byte limit**
4. Any bytes beyond 72 are ignored

This is **not a bug** - it's how bcrypt was designed in 1999.

### UTF-8 Character Sizes

- ASCII (a-z, 0-9, etc.): 1 byte per character
- Latin extended (é, ñ, etc.): 2 bytes per character  
- Chinese/Japanese/Korean: 3 bytes per character
- Emojis: 4 bytes per character

Our truncation respects these boundaries to avoid breaking characters.

### Alternative Solutions (Not Used)

1. **Use SHA-256 + Bcrypt**: Hash password with SHA-256 first, then bcrypt the hash
   - Pros: No length limit
   - Cons: More complex, potential security edge cases

2. **Switch to Argon2**: Modern alternative to bcrypt
   - Pros: No 72-byte limit, more secure
   - Cons: Migration needed, more CPU intensive

3. **Reject Long Passwords**: Return error if > 72 bytes
   - Pros: Explicit about limit
   - Cons: Bad UX, users confused

We chose automatic truncation for **best user experience** while maintaining security.

## References

- [Bcrypt Specification](https://en.wikipedia.org/wiki/Bcrypt)
- [OWASP Password Storage](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
- [bcrypt Python Library](https://github.com/pyca/bcrypt/)

## Summary

✅ **Problem**: Bcrypt 72-byte limit causing registration failures
✅ **Solution**: Automatic, safe password truncation using direct bcrypt API  
✅ **Testing**: All edge cases validated
✅ **Security**: Maintained, no compromises
✅ **UX**: Seamless, no user-visible errors

Users can now register with any password length! 🎉
