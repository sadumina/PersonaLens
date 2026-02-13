# Registration 500 Error - Troubleshooting Guide

## Problem
Registration is failing with a 500 Internal Server Error.

## Root Cause Analysis

Based on the code inspection, the 500 error is likely caused by one of these issues:

### 1. MongoDB Connection Issues (Most Likely)
**Symptoms:**
- Backend can't connect to MongoDB Atlas
- Connection timeout errors
- "Database unavailable" messages

**Causes:**
- IP address not whitelisted in MongoDB Atlas
- Network connectivity issues
- Wrong MongoDB URI credentials

**Solution:**
1. Go to MongoDB Atlas Dashboard
2. Navigate to **Network Access**
3. Add your current IP address OR use `0.0.0.0/0` (allow from anywhere) for development
4. Wait 1-2 minutes for changes to take effect
5. Restart the backend server

### 2. Database Not Initialized
**Symptoms:**
- "Database not connected" errors
- Backend starts but registration fails immediately

**Causes:**
- Database connection not established during startup
- Connection dropped after startup

**Solution:**
1. Check backend logs for "Successfully connected to MongoDB" message
2. If missing, there's a connection issue (see #1)
3. Check the `/health` endpoint - it should show database status

### 3. Index Creation Conflicts
**Symptoms:**
- Backend starts but crashes during index creation
- "Duplicate key" errors

**Causes:**
- Indexes already exist with different configuration
- Duplicate data in the database

**Solution:**
The code has been updated to handle this gracefully. If you still see issues:
1. Drop the indexes in MongoDB Atlas UI
2. Restart the backend to recreate them

## Quick Diagnosis Steps

### Step 1: Check Health Endpoint
```bash
curl http://localhost:8000/health
```

Expected output if working:
```json
{
  "status": "ok",
  "database": {
    "status": "connected",
    "error": null
  }
}
```

If database shows "disconnected", there's a connection issue.

### Step 2: Check Backend Logs
Look for these log messages:
- ✅ "Successfully connected to MongoDB"
- ✅ "Database index setup completed"
- ❌ "Failed to connect to MongoDB"
- ❌ "Database unavailable"

### Step 3: Test Registration
Use the test script:
```bash
cd personalens-backend
python3 test_registration.py
```

This will show exactly where the registration is failing.

## Enhanced Error Messages

The code has been updated to provide detailed error messages:

- **"Database unavailable"** - Can't connect to MongoDB
- **"Database query failed"** - Error checking existing users
- **"Password processing failed"** - Issue with password hashing
- **"Failed to create user"** - Error inserting user into database

These messages will help pinpoint the exact issue.

## MongoDB Atlas IP Whitelist Fix

This is the **most common** cause of the 500 error.

1. **Login to MongoDB Atlas**: https://cloud.mongodb.com/
2. **Select your cluster**: sadumina.c82ip.mongodb.net
3. **Go to Network Access** (in left sidebar)
4. **Click "Add IP Address"**
5. **Option A** - Add your current IP:
   - Click "Add Current IP Address"
   - Click "Confirm"
6. **Option B** - Allow all IPs (for development):
   - Enter `0.0.0.0/0` in the IP Address field
   - Add comment: "Allow all (development only)"
   - Click "Confirm"
7. **Wait 1-2 minutes** for the change to propagate
8. **Restart your backend**

## Testing After Fix

1. Start the backend:
   ```bash
   cd personalens-backend
   source venv/bin/activate
   uvicorn app.main:app --reload
   ```

2. Check health:
   ```bash
   curl http://localhost:8000/health
   ```

3. Try registration from your frontend
   - If it works: ✅ Problem solved!
   - If still fails: Check backend logs for specific error message

## Still Having Issues?

If none of the above helps:

1. **Check MongoDB Atlas Status**: https://status.mongodb.com/
2. **Verify Credentials**: Make sure username/password in .env are correct
3. **Check Network**: Try connecting from a different network
4. **Review Logs**: Look at backend terminal output for detailed errors
5. **Test Connection**: Use MongoDB Compass to test connection with same URI

## Backend Improvements Made

1. **Better Error Handling**: Each step of registration now has specific error handling
2. **Detailed Logging**: Every operation is logged with context
3. **Health Endpoint**: Shows database connectivity status
4. **Graceful Index Creation**: Won't fail startup if indexes have issues
5. **Informative Errors**: Error messages now indicate exact failure point

The backend will now tell you **exactly** what's wrong instead of a generic 500 error.
