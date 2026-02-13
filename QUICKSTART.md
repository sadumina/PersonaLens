# 🚀 Quick Start Guide - Running the Backend

This guide will help you get the PersonaLens backend up and running in minutes.

## Option 1: Using Docker (Easiest - Recommended) 🐳

This is the fastest way to get everything running, including MongoDB!

```bash
# From the root directory
docker-compose up -d

# Check if it's running
curl http://localhost:8000/health

# View logs
docker-compose logs -f backend

# Stop everything
docker-compose down
```

**That's it!** The backend will be available at http://localhost:8000

---

## Option 2: Manual Setup (Development) 💻

### Step 1: MongoDB Configuration

**Note:** This project is configured to use MongoDB Atlas (cloud database). The connection URI is already set in the `.env` file.

If you need to use a local MongoDB instead, you can:

```bash
# Start local MongoDB with Docker
docker run -d -p 27017:27017 --name mongodb \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password \
  mongo:7

# Then update .env with: MONGODB_URI=mongodb://admin:password@localhost:27017
```

### Step 2: Setup Backend

```bash
# Navigate to backend directory
cd personalens-backend

# Create virtual environment (first time only)
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate  # Linux/Mac
# OR
venv\Scripts\activate     # Windows

# Install dependencies (first time only)
pip install -r requirements.txt

# Copy environment file (first time only)
cp .env.example .env
# Edit .env if needed (default values work for local development)

# Run the backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Step 3: Verify It's Running

Open your browser or use curl:
- **API**: http://localhost:8000
- **Interactive API Docs**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

---

## Option 3: Using Helper Scripts 🎯

We've included helper scripts to make your life easier!

### Linux/Mac:
```bash
cd personalens-backend
chmod +x run_backend.sh
./run_backend.sh
```

### Windows:
```bash
cd personalens-backend
run_backend.bat
```

These scripts will:
1. Check if MongoDB is running (start it if needed with Docker)
2. Create virtual environment if it doesn't exist
3. Install dependencies if needed
4. Copy .env.example to .env if needed
5. Start the backend server

---

## 📝 Common Commands

### Development
```bash
# Run with auto-reload (recommended for development)
uvicorn app.main:app --reload

# Run on specific host/port
uvicorn app.main:app --host 0.0.0.0 --port 8000

# Run with specific log level
uvicorn app.main:app --log-level debug
```

### Testing
```bash
# Test the API
curl http://localhost:8000/health

# Open interactive API documentation
# Visit: http://localhost:8000/docs
```

---

## 🐛 Troubleshooting

### "Module not found" errors
```bash
# Make sure you're in the virtual environment
source venv/bin/activate

# Reinstall dependencies
pip install -r requirements.txt
```

### "Cannot connect to MongoDB"
```bash
# The project uses MongoDB Atlas (cloud database)
# If you see connection errors, check:
# 1. Your internet connection
# 2. MongoDB Atlas IP whitelist settings
# 3. Credentials in .env file

# To use local MongoDB instead:
docker run -d -p 27017:27017 --name mongodb \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password \
  mongo:7

# Then update .env: MONGODB_URI=mongodb://admin:password@localhost:27017
```

### "Port 8000 already in use"
```bash
# Find what's using port 8000
lsof -i :8000  # Mac/Linux
netstat -ano | findstr :8000  # Windows

# Kill the process or use a different port
uvicorn app.main:app --port 8001
```

### "ImportError: cannot import name ..."
```bash
# You might have wrong Python version
python --version  # Should be 3.11+

# Or wrong dependencies
pip install -r requirements.txt --upgrade
```

---

## 🔧 Configuration

The backend uses environment variables from `.env` file:

```env
# MongoDB Atlas Cloud URI
MONGODB_URI=mongodb+srv://sadumina:Sadumina2003@sadumina.c82ip.mongodb.net/coconut_analytics?retryWrites=true&w=majority
DATABASE_NAME=coconut_analytics
JWT_SECRET=your-super-secret-key-change-this-in-production
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
CORS_ORIGINS=["http://localhost:3000", "http://localhost:5173"]
ENVIRONMENT=development
```

**For local development, the default values work fine!**

---

## 🎓 Next Steps

1. **Test the API**: Visit http://localhost:8000/docs
2. **Create a user**: Use the `/auth/register` endpoint
3. **Upload a CV**: Use the `/analyze/cv` endpoint
4. **Check the frontend**: See `personalens-frontend/` for frontend setup

---

## 📚 Additional Resources

- Full README: [README.md](../README.md)
- API Documentation: http://localhost:8000/docs (when running)
- Implementation Details: [IMPLEMENTATION_SUMMARY.md](../IMPLEMENTATION_SUMMARY.md)
- Security Information: [SECURITY_FIXES.md](../SECURITY_FIXES.md)

---

**Need help?** Open an issue on GitHub!
