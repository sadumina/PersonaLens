"""
PersonaLens API - FastAPI Application Entry Point
Enterprise CV Analysis Platform
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

from app.core.config import settings
from app.core.database import Database
from app.utils.logger import setup_logging
from app.api.auth import router as auth_router
from app.api.analyze import router as analyze_router

# Setup logging
setup_logging(level="INFO")
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan manager.
    Handles startup and shutdown events.
    """
    # Startup
    logger.info("Starting PersonaLens API")
    logger.info(f"Environment: {settings.ENVIRONMENT}")
    
    # Connect to MongoDB
    await Database.connect_db()
    
    yield
    
    # Shutdown
    logger.info("Shutting down PersonaLens API")
    await Database.close_db()


# Create FastAPI application
app = FastAPI(
    title="PersonaLens API",
    version="1.0.0",
    description="Enterprise CV Analysis Platform - AI-powered resume analysis",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router)
app.include_router(analyze_router)


@app.get("/health")
async def health_check():
    """
    Health check endpoint with database connectivity check.
    
    Returns:
        Dict: Status information including database status
    """
    db_status = "disconnected"
    db_error = None
    
    try:
        db = Database.get_database()
        # Try to ping the database
        await db.command('ping')
        db_status = "connected"
    except Exception as e:
        db_error = str(e)
        logger.error(f"Database health check failed: {e}")
    
    return {
        "status": "ok" if db_status == "connected" else "degraded",
        "service": "PersonaLens API",
        "version": "1.0.0",
        "environment": settings.ENVIRONMENT,
        "database": {
            "status": db_status,
            "error": db_error
        }
    }


@app.get("/")
def root():
    """
    Root endpoint.
    
    Returns:
        Dict: Welcome message
    """
    return {
        "message": "Welcome to PersonaLens API",
        "docs": "/docs",
        "health": "/health"
    }
