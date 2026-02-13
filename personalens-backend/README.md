# PersonaLens Backend

FastAPI backend for the PersonaLens CV analysis platform.

## 🚀 Quick Start

### Option 1: Use the Helper Script (Recommended)

**Linux/Mac:**
```bash
./run_backend.sh
```

**Windows:**
```bash
run_backend.bat
```

The script will automatically:
- Check and start MongoDB if needed
- Create virtual environment
- Install dependencies
- Configure environment
- Start the backend server

### Option 2: Manual Setup

**Note:** This project uses MongoDB Atlas (cloud database). The connection is already configured in `.env`.

```bash
# 1. Setup Python environment
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Setup environment (already configured for MongoDB Atlas)
cp .env.example .env

# 4. Run the backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

To use a local MongoDB instead:
```bash
# Start local MongoDB
docker run -d -p 27017:27017 --name mongodb \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password \
  mongo:7

# Update .env with: MONGODB_URI=mongodb://admin:password@localhost:27017
```

## 📍 Access Points

Once running, you can access:
- **API**: http://localhost:8000
- **Interactive API Docs**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

## 🏗️ Architecture

```
app/
├── core/           # Configuration, database, security
├── models/         # MongoDB document models
├── schemas/        # Pydantic validation schemas
├── services/       # Business logic (PDF parsing, analysis)
├── api/            # API route handlers
└── utils/          # Utility functions
```

## 🔧 Environment Variables

Edit `.env` to configure:

```env
# MongoDB Atlas Cloud Database
MONGODB_URI=mongodb+srv://sadumina:Sadumina2003@sadumina.c82ip.mongodb.net/coconut_analytics?retryWrites=true&w=majority
DATABASE_NAME=coconut_analytics
JWT_SECRET=your-super-secret-key-change-this-in-production
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
CORS_ORIGINS=["http://localhost:3000", "http://localhost:5173"]
ENVIRONMENT=development
```

**Note:** The project is configured to use MongoDB Atlas (cloud). For local development, you can switch to a local MongoDB instance if needed.

## 📚 API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login and get JWT token
- `GET /auth/me` - Get current user (protected)

### Analysis
- `POST /analyze/cv` - Upload and analyze CV (protected)
- `GET /analyze/history` - Get analysis history (protected)
- `GET /analyze/{analysis_id}` - Get specific analysis (protected)

### Health
- `GET /health` - Health check

## 🧪 Testing

```bash
# Run API tests
python test_api.py

# Or use the interactive docs
# Visit: http://localhost:8000/docs
```

## 🐛 Troubleshooting

### MongoDB Connection Issues
```bash
# The project uses MongoDB Atlas (cloud database)
# If you see connection errors:
# 1. Check your internet connection
# 2. Verify credentials in .env file
# 3. Check MongoDB Atlas IP whitelist settings (allow your IP)

# To use local MongoDB instead:
docker run -d -p 27017:27017 --name mongodb \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password \
  mongo:7

# Then update .env: MONGODB_URI=mongodb://admin:password@localhost:27017
```

### Module Import Errors
```bash
# Ensure virtual environment is activated
source venv/bin/activate

# Reinstall dependencies
pip install -r requirements.txt
```

### Port Already in Use
```bash
# Use a different port
uvicorn app.main:app --port 8001
```

## 📖 More Documentation

- [Quick Start Guide](../QUICKSTART.md) - Detailed setup instructions
- [Main README](../README.md) - Full project documentation
- [Implementation Summary](../IMPLEMENTATION_SUMMARY.md) - Technical details
- [Security Fixes](../SECURITY_FIXES.md) - Security patches applied

## 🔒 Security

All dependencies are scanned and patched:
- FastAPI 0.109.1 (ReDoS patched)
- python-multipart 0.0.22 (Multiple vulnerabilities patched)

See [SECURITY_FIXES.md](../SECURITY_FIXES.md) for details.
