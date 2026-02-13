"""
User document model for MongoDB.
"""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field


class UserModel(BaseModel):
    """
    User document structure in MongoDB.
    
    Attributes:
        username: Unique username
        email: Unique email address
        hashed_password: Bcrypt hashed password
        created_at: Timestamp when user was created
        is_active: Whether the user account is active
    """
    
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = Field(default=True)
    
    class Config:
        json_schema_extra = {
            "example": {
                "username": "johndoe",
                "email": "john@example.com",
                "hashed_password": "$2b$12$...",
                "created_at": "2026-02-13T10:30:00Z",
                "is_active": True
            }
        }
