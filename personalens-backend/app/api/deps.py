"""
Shared dependencies for API routes.
"""
from fastapi import Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import Dict, Any
from app.core.database import get_database
from app.core.security import get_current_user


async def get_db() -> AsyncIOMotorDatabase:
    """
    Dependency to get database instance.
    
    Returns:
        AsyncIOMotorDatabase: Database instance
    """
    return await get_database()


async def get_current_active_user(
    current_user: Dict[str, Any] = Depends(get_current_user)
) -> Dict[str, Any]:
    """
    Dependency to get current active user.
    
    Args:
        current_user: Current user from JWT token
        
    Returns:
        Dict: Current user data
        
    Raises:
        HTTPException: If user is not active
    """
    if not current_user.get("is_active", True):
        from fastapi import HTTPException, status
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user"
        )
    return current_user
