"""
MongoDB database connection and lifecycle management using Motor async driver.
"""
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from typing import Optional
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)


class Database:
    """
    MongoDB database connection manager.
    Handles connection lifecycle and provides database/collection accessors.
    """
    
    client: Optional[AsyncIOMotorClient] = None
    db: Optional[AsyncIOMotorDatabase] = None
    
    @classmethod
    async def connect_db(cls) -> None:
        """
        Establish connection to MongoDB.
        Called during application startup.
        """
        try:
            logger.info(f"Connecting to MongoDB: {settings.DATABASE_NAME}")
            cls.client = AsyncIOMotorClient(settings.MONGODB_URI)
            cls.db = cls.client[settings.DATABASE_NAME]
            
            # Test the connection
            await cls.client.admin.command('ping')
            logger.info("Successfully connected to MongoDB")
            
            # Create indexes
            await cls.create_indexes()
            
        except Exception as e:
            logger.error(f"Failed to connect to MongoDB: {e}")
            raise
    
    @classmethod
    async def close_db(cls) -> None:
        """
        Close MongoDB connection.
        Called during application shutdown.
        """
        if cls.client:
            logger.info("Closing MongoDB connection")
            cls.client.close()
            cls.client = None
            cls.db = None
    
    @classmethod
    async def create_indexes(cls) -> None:
        """
        Create database indexes for performance optimization.
        Handles duplicate key errors gracefully.
        """
        if cls.db is None:
            return
        
        try:
            # Create indexes for users collection with error handling
            try:
                await cls.db.users.create_index("email", unique=True)
                logger.info("Created unique index on users.email")
            except Exception as e:
                # Index might already exist or have conflicts
                logger.warning(f"Email index creation skipped: {e}")
            
            try:
                await cls.db.users.create_index("username", unique=True)
                logger.info("Created unique index on users.username")
            except Exception as e:
                logger.warning(f"Username index creation skipped: {e}")
            
            # Create indexes for analyses collection
            try:
                await cls.db.analyses.create_index("user_id")
                await cls.db.analyses.create_index("timestamp")
                await cls.db.analyses.create_index("analysis_id", unique=True)
                logger.info("Created indexes on analyses collection")
            except Exception as e:
                logger.warning(f"Analysis indexes creation skipped: {e}")
            
            logger.info("Database index setup completed")
        except Exception as e:
            logger.warning(f"Index creation warning: {e}")
            # Don't fail the startup if index creation fails
    
    @classmethod
    def get_database(cls) -> AsyncIOMotorDatabase:
        """
        Get the database instance.
        
        Returns:
            AsyncIOMotorDatabase: Database instance
            
        Raises:
            RuntimeError: If database is not connected
        """
        if cls.db is None:
            raise RuntimeError("Database not connected. Call connect_db() first.")
        return cls.db
    
    @classmethod
    def get_collection(cls, collection_name: str):
        """
        Get a specific collection.
        
        Args:
            collection_name: Name of the collection
            
        Returns:
            Collection instance
        """
        db = cls.get_database()
        return db[collection_name]


# Convenience function for dependency injection
async def get_database() -> AsyncIOMotorDatabase:
    """
    Dependency function to get database instance.
    Used in FastAPI route dependencies.
    """
    return Database.get_database()
