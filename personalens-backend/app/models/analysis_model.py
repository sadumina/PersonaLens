"""
Analysis document model for MongoDB.
"""
from datetime import datetime
from typing import Dict, List, Any
from pydantic import BaseModel, Field


class AnalysisModel(BaseModel):
    """
    Analysis document structure in MongoDB.
    
    Attributes:
        analysis_id: Unique identifier for the analysis
        user_id: ID of the user who owns this analysis
        filename: Name of the uploaded CV file
        total_score: Overall CV score (0-100)
        clusters: Skill cluster scores
        detected_skills: List of detected skills with their categories
        personality: Personality trait scores
        timestamp: When the analysis was performed
    """
    
    analysis_id: str = Field(..., description="Unique analysis identifier")
    user_id: str = Field(..., description="User ID")
    filename: str = Field(..., description="Original filename")
    total_score: float = Field(..., ge=0, le=100, description="Total score")
    clusters: Dict[str, int] = Field(..., description="Skill cluster scores")
    detected_skills: List[Dict[str, Any]] = Field(..., description="Detected skills")
    personality: Dict[str, int] = Field(..., description="Personality traits")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="Analysis timestamp")
    
    class Config:
        json_schema_extra = {
            "example": {
                "analysis_id": "507f1f77bcf86cd799439011",
                "user_id": "507f191e810c19729de860ea",
                "filename": "john_doe_cv.pdf",
                "total_score": 82.5,
                "clusters": {
                    "technical": 85,
                    "soft_skills": 78,
                    "languages": 90
                },
                "detected_skills": [
                    {"name": "Python", "category": "technical"},
                    {"name": "Leadership", "category": "soft_skills"}
                ],
                "personality": {
                    "leadership": 80,
                    "innovation": 85,
                    "collaboration": 75,
                    "confidence": 82
                },
                "timestamp": "2026-02-13T10:30:00Z"
            }
        }
