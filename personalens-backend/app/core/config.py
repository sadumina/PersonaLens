"""
Application configuration using Pydantic BaseSettings.
Loads configuration from environment variables.
"""
from typing import List
from pydantic_settings import BaseSettings
from pydantic import Field


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables.
    
    Attributes:
        MONGODB_URI: MongoDB connection string
        DATABASE_NAME: Name of the database
        JWT_SECRET: Secret key for JWT token generation
        JWT_ALGORITHM: Algorithm used for JWT encoding
        ACCESS_TOKEN_EXPIRE_MINUTES: JWT token expiry time in minutes
        CORS_ORIGINS: List of allowed CORS origins
        ENVIRONMENT: Current environment (development/production)
    """
    
    # MongoDB Configuration
    MONGODB_URI: str = Field(
        default="mongodb+srv://sadumina:Sadumina2003@sadumina.c82ip.mongodb.net/coconut_analytics?retryWrites=true&w=majority",
        description="MongoDB connection URI"
    )
    DATABASE_NAME: str = Field(
        default="coconut_analytics",
        description="Database name"
    )
    
    # JWT Configuration
    JWT_SECRET: str = Field(
        default="your-super-secret-key-change-this-in-production",
        description="Secret key for JWT token generation"
    )
    JWT_ALGORITHM: str = Field(
        default="HS256",
        description="Algorithm for JWT encoding"
    )
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(
        default=1440,  # 24 hours
        description="Access token expiration time in minutes"
    )
    
    # CORS Configuration
    CORS_ORIGINS: List[str] = Field(
        default=["http://localhost:3000", "http://localhost:5173"],
        description="Allowed CORS origins"
    )
    
    # Environment
    ENVIRONMENT: str = Field(
        default="development",
        description="Current environment"
    )
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# Global settings instance
settings = Settings()
