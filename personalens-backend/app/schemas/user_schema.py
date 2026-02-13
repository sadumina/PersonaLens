"""
Pydantic schemas for user authentication and registration.
"""
from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional
from datetime import datetime


class UserRegister(BaseModel):
    """
    Schema for user registration request.
    """
    username: str = Field(..., min_length=3, max_length=50, description="Unique username")
    email: EmailStr = Field(..., description="User email address")
    password: str = Field(..., min_length=6, description="User password (min 6 characters)")
    
    @field_validator('password')
    @classmethod
    def validate_password_length(cls, v: str) -> str:
        """
        Validate password length and warn if it exceeds bcrypt's 72-byte limit.
        
        Note: Passwords longer than 72 bytes will be automatically truncated
        during hashing due to bcrypt limitations.
        """
        password_bytes = v.encode('utf-8')
        if len(password_bytes) > 72:
            # Just log a warning, don't reject - the SecurityService will handle truncation
            import logging
            logger = logging.getLogger(__name__)
            logger.warning(f"Password exceeds 72 bytes ({len(password_bytes)} bytes). Will be truncated during hashing.")
        return v
    
    class Config:
        json_schema_extra = {
            "example": {
                "username": "johndoe",
                "email": "john@example.com",
                "password": "securepassword123"
            }
        }


class UserLogin(BaseModel):
    """
    Schema for user login request.
    """
    email: EmailStr = Field(..., description="User email address")
    password: str = Field(..., description="User password")
    
    class Config:
        json_schema_extra = {
            "example": {
                "email": "john@example.com",
                "password": "securepassword123"
            }
        }


class Token(BaseModel):
    """
    Schema for JWT token response.
    """
    access_token: str = Field(..., description="JWT access token")
    token_type: str = Field(default="bearer", description="Token type")
    
    class Config:
        json_schema_extra = {
            "example": {
                "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                "token_type": "bearer"
            }
        }


class UserResponse(BaseModel):
    """
    Schema for user data response.
    """
    id: str = Field(..., description="User ID")
    username: str = Field(..., description="Username")
    email: EmailStr = Field(..., description="Email address")
    created_at: datetime = Field(..., description="Account creation timestamp")
    is_active: bool = Field(..., description="Account active status")
    
    class Config:
        json_schema_extra = {
            "example": {
                "id": "507f1f77bcf86cd799439011",
                "username": "johndoe",
                "email": "john@example.com",
                "created_at": "2026-02-13T10:30:00Z",
                "is_active": True
            }
        }
