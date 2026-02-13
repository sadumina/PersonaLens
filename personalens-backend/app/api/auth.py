"""
Authentication API routes.
Handles user registration, login, and profile management.
"""
from fastapi import APIRouter, HTTPException, status, Depends
from typing import Dict, Any
import logging
from datetime import datetime

from app.schemas.user_schema import UserRegister, UserLogin, Token, UserResponse
from app.core.security import SecurityService, get_current_user
from app.core.database import Database

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserRegister):
    """
    Register a new user.
    
    Args:
        user_data: User registration data
        
    Returns:
        UserResponse: Created user data
        
    Raises:
        HTTPException: If username or email already exists
    """
    try:
        logger.info(f"Registration attempt for email: {user_data.email}, username: {user_data.username}")
        
        # Get database
        try:
            db = Database.get_database()
            logger.info("Database connection obtained")
        except Exception as e:
            logger.error(f"Failed to get database: {e}")
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail=f"Database unavailable: {str(e)}"
            )
        
        # Check if email already exists
        try:
            existing_email = await db.users.find_one({"email": user_data.email})
            if existing_email:
                logger.warning(f"Email already registered: {user_data.email}")
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Email already registered"
                )
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error checking existing email: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Database query failed: {str(e)}"
            )
        
        # Check if username already exists
        try:
            existing_username = await db.users.find_one({"username": user_data.username})
            if existing_username:
                logger.warning(f"Username already taken: {user_data.username}")
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Username already taken"
                )
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error checking existing username: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Database query failed: {str(e)}"
            )
        
        # Hash password
        try:
            hashed_password = SecurityService.hash_password(user_data.password)
            logger.info("Password hashed successfully")
        except Exception as e:
            logger.error(f"Password hashing failed: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Password processing failed: {str(e)}"
            )
        
        # Create user document
        user_doc = {
            "username": user_data.username,
            "email": user_data.email,
            "hashed_password": hashed_password,
            "created_at": datetime.utcnow(),
            "is_active": True
        }
        
        # Insert user
        try:
            result = await db.users.insert_one(user_doc)
            user_id = str(result.inserted_id)
            logger.info(f"New user registered successfully: {user_data.username} ({user_data.email}), ID: {user_id}")
        except Exception as e:
            logger.error(f"Failed to insert user: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to create user: {str(e)}"
            )
        
        return UserResponse(
            id=user_id,
            username=user_data.username,
            email=user_data.email,
            created_at=user_doc["created_at"],
            is_active=True
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected registration error: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration failed: {str(e)}"
        )


@router.post("/login", response_model=Token)
async def login(credentials: UserLogin):
    """
    Authenticate user and return JWT token.
    
    Args:
        credentials: User login credentials
        
    Returns:
        Token: JWT access token
        
    Raises:
        HTTPException: If authentication fails
    """
    try:
        db = Database.get_database()
        
        # Find user by email
        user = await db.users.find_one({"email": credentials.email})
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password"
            )
        
        # Verify password
        if not SecurityService.verify_password(credentials.password, user["hashed_password"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password"
            )
        
        # Check if user is active
        if not user.get("is_active", True):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Inactive user account"
            )
        
        # Create access token
        access_token = SecurityService.create_access_token(
            data={"sub": str(user["_id"]), "email": user["email"]}
        )
        
        logger.info(f"User logged in: {user['email']}")
        
        return Token(access_token=access_token, token_type="bearer")
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Login failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Login failed"
        )


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: Dict[str, Any] = Depends(get_current_user)):
    """
    Get current authenticated user information.
    
    Args:
        current_user: Current user from JWT token (injected)
        
    Returns:
        UserResponse: Current user data
    """
    return UserResponse(
        id=str(current_user["_id"]),
        username=current_user["username"],
        email=current_user["email"],
        created_at=current_user["created_at"],
        is_active=current_user.get("is_active", True)
    )
