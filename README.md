# PersonaLens - Enterprise CV Analysis Platform

AI-powered CV analysis platform that provides deep insights into technical capabilities, skill distribution, and personality signals through multi-dimensional visualization.

## 🚀 Features

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

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd personalens-backend
   ```

2. **Create virtual environment**
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
   # Edit .env with your configuration
   ```

5. **Start MongoDB** (if not using Docker)
   ```bash
   docker run -d -p 27017:27017 --name mongodb \
     -e MONGO_INITDB_ROOT_USERNAME=admin \
     -e MONGO_INITDB_ROOT_PASSWORD=password \
     mongo:7
   ```

6. **Run the backend**
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
MONGODB_URI=mongodb://admin:password@localhost:27017
DATABASE_NAME=personalens
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

1. **Update environment variables**
   - Set strong `JWT_SECRET`
   - Use production MongoDB URI
   - Update `CORS_ORIGINS` with production URLs

2. **Build and deploy with Docker**
   ```bash
   docker-compose -f docker-compose.yml up -d
   ```

3. **Set up SSL/TLS**
   - Use nginx or Caddy for reverse proxy
   - Obtain SSL certificates (Let's Encrypt)

4. **Monitor and scale**
   - Set up logging and monitoring
   - Configure backup for MongoDB
   - Scale services as needed

## 📝 License

This project is licensed under the MIT License.

## 👥 Contributing

Contributions are welcome! Please read the contributing guidelines before submitting PRs.

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

Built with ❤️ using FastAPI, React, and MongoDB
