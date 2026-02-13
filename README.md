# PersonaLens - Enterprise CV Analysis Platform

AI-powered CV analysis platform that provides deep insights into technical capabilities, skill distribution, and personality signals through multi-dimensional visualization.

## 🚀 Quick Start

**Want to run the backend immediately?** See [QUICKSTART.md](QUICKSTART.md) or use our helper scripts:

```bash
# Linux/Mac
cd personalens-backend
./run_backend.sh

# Windows
cd personalens-backend
run_backend.bat
```

The script automatically sets up everything and starts the backend server!

## 🎯 Features

- **User Authentication**: Secure JWT-based authentication with registration and login
- **CV Upload**: Drag-and-drop PDF upload with validation
- **AI Analysis**: Advanced skill clustering and personality trait analysis
- **Interactive Dashboard**: Beautiful visualizations with charts and graphs
- **Analysis History**: Track and compare past CV analyses
- **Responsive Design**: Works seamlessly on desktop and mobile

## 🏗️ Architecture

### Backend (FastAPI + MongoDB)
- **FastAPI** with Python 3.11+
- **MongoDB** with Motor async driver
- **JWT Authentication** with bcrypt password hashing
- **OOP Architecture** with service layer pattern
- **Pydantic v2** for data validation

### Frontend (React + Vite)
- **React 18** with Vite
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Recharts** for data visualization
- **React Router** for navigation
- **Context API** for state management

## 📦 Prerequisites

- Docker and Docker Compose (recommended)
- OR:
  - Python 3.11+
  - Node.js 18+
  - MongoDB 7+

## 🚦 Quick Start with Docker

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd PersonaLens
   ```

2. **Start all services**
   ```bash
   docker-compose up --build -d
   ```

3. **Access the application**
   - Frontend: http://localhost
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

4. **Stop services**
   ```bash
   docker-compose down
   ```

## 🛠️ Development Setup

> **💡 Tip**: Use the helper scripts for the easiest setup! See [QUICKSTART.md](QUICKSTART.md)

### Backend Setup (Manual)

1. **Navigate to backend directory**
   ```bash
   cd personalens-backend
   ```

2. **Use the helper script (Recommended)**
   ```bash
   ./run_backend.sh  # Linux/Mac
   # OR
   run_backend.bat   # Windows
   ```
   
   **Or follow manual steps:**

3. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment**
   ```bash
   cp .env.example .env
   # The .env file is already configured with MongoDB Atlas cloud database
   # Edit .env if you need to use a different MongoDB instance
   ```

5. **Run the backend**
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd personalens-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Run the frontend**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173

## 📁 Project Structure

```
PersonaLens/
├── personalens-backend/
│   ├── app/
│   │   ├── core/           # Configuration, database, security
│   │   ├── models/         # MongoDB document models
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── services/       # Business logic services
│   │   ├── api/            # API route handlers
│   │   ├── utils/          # Utility functions
│   │   └── main.py         # FastAPI application
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
├── personalens-frontend/
│   ├── src/
│   │   ├── config/         # API configuration
│   │   ├── context/        # React contexts
│   │   ├── hooks/          # Custom hooks
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   └── App.jsx         # Main app component
│   ├── package.json
│   ├── Dockerfile
│   └── .env.example
└── docker-compose.yml
```

## 🔒 Environment Variables

### Backend (.env)
```
# MongoDB Atlas Cloud Database
MONGODB_URI=mongodb+srv://sadumina:Sadumina2003@sadumina.c82ip.mongodb.net/coconut_analytics?retryWrites=true&w=majority
DATABASE_NAME=coconut_analytics
JWT_SECRET=your-super-secret-key-change-this-in-production
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
CORS_ORIGINS=["http://localhost:3000", "http://localhost:5173"]
ENVIRONMENT=development
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:8000
```

## 📚 API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login and get JWT token
- `GET /auth/me` - Get current user info (protected)

### Analysis
- `POST /analyze/cv` - Upload and analyze CV (protected)
- `GET /analyze/history` - Get analysis history (protected)
- `GET /analyze/{analysis_id}` - Get specific analysis (protected)

### Health
- `GET /health` - Health check endpoint

## 🧪 Testing

### Backend Tests
```bash
cd personalens-backend
pytest
```

### Frontend Tests
```bash
cd personalens-frontend
npm test
```

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `docker ps | grep mongo`
- Check connection string in `.env`
- Verify network connectivity

### CORS Errors
- Add frontend URL to `CORS_ORIGINS` in backend `.env`
- Restart backend after changing CORS settings

### JWT Token Expired
- Check `ACCESS_TOKEN_EXPIRE_MINUTES` setting
- Clear browser localStorage and login again

### PDF Parsing Fails
- Ensure PDF is valid and not corrupted
- Check file size (max 10MB)
- Verify PDF contains extractable text

## 🚀 Production Deployment

### Quick Deploy

**Want to deploy to production?** See our comprehensive deployment guides:

- **[HOW_TO_DEPLOY.txt](HOW_TO_DEPLOY.txt)** - Quick visual guide with 3 deployment options
- **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** - Complete guide covering all platforms
- **[PRODUCTION_CHECKLIST.md](PRODUCTION_CHECKLIST.md)** - Pre and post-deployment checklist

### Deployment Options

1. **Docker Compose (Easiest)**
   ```bash
   # Configure environment
   cp personalens-backend/.env.example personalens-backend/.env
   nano personalens-backend/.env  # Edit with your settings
   
   # Deploy
   docker-compose up --build -d
   ```

2. **Cloud Platforms**
   - DigitalOcean Droplet (Recommended - $12/month)
   - AWS EC2
   - Google Cloud Run
   - Azure Container Instances
   - Heroku

3. **Manual Deployment**
   - Traditional server setup
   - Custom configurations

### Pre-Deployment Requirements

✅ MongoDB Atlas account and connection string  
✅ Strong JWT secret (32+ characters)  
✅ Domain name (optional but recommended)  
✅ SSL certificate (Let's Encrypt is free)

### Key Configuration

```env
# Backend .env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
JWT_SECRET=your-super-secret-key-min-32-chars
CORS_ORIGINS=["https://yourdomain.com"]
ENVIRONMENT=production
```

### Verify Deployment

```bash
# Check health
curl https://yourdomain.com/api/health

# View logs
docker-compose logs -f
```

For detailed instructions, troubleshooting, and platform-specific guides, see [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md).

## 🔒 Security

PersonaLens implements multiple layers of security:

- **Password Security**: Bcrypt hashing with salt
- **Authentication**: JWT tokens for stateless auth
- **Authorization**: Protected API routes with dependency injection
- **CORS**: Configured origins to prevent unauthorized access
- **Input Validation**: Pydantic schemas validate all inputs
- **File Security**: Type and size validation on uploads
- **Database**: NoSQL (MongoDB) prevents SQL injection
- **Dependencies**: Regular security scanning with patched versions
  - FastAPI 0.109.1 (ReDoS vulnerability patched)
  - python-multipart 0.0.22 (Multiple vulnerabilities patched)

See [SECURITY_FIXES.md](SECURITY_FIXES.md) for detailed security patch information.

**Security Status**: ✅ No known vulnerabilities

## 📝 License

This project is licensed under the MIT License.

## 👥 Contributing

Contributions are welcome! Please read the contributing guidelines before submitting PRs.

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

Built with ❤️ using FastAPI, React, and MongoDB
