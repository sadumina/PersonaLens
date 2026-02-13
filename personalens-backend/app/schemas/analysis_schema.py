"""
Pydantic schemas for analysis requests and responses.
"""
from pydantic import BaseModel, Field
from typing import Dict, List, Any
from datetime import datetime


class SkillItem(BaseModel):
    """
    Schema for individual skill item.
    """
    name: str = Field(..., description="Skill name")
    category: str = Field(..., description="Skill category")


class AnalysisResponse(BaseModel):
    """
    Schema for CV analysis response.
    """
    analysis_id: str = Field(..., description="Unique analysis identifier")
    total_score: float = Field(..., ge=0, le=100, description="Overall CV score")
    clusters: Dict[str, int] = Field(..., description="Skill cluster scores")
    detected_skills: List[SkillItem] = Field(..., description="List of detected skills")
    personality: Dict[str, int] = Field(..., description="Personality trait scores")
    timestamp: datetime = Field(..., description="Analysis timestamp")
    filename: str = Field(..., description="Original filename")
    
    class Config:
        json_schema_extra = {
            "example": {
                "analysis_id": "507f1f77bcf86cd799439011",
                "total_score": 82.5,
                "clusters": {
                    "technical": 85,
                    "soft_skills": 78,
                    "languages": 90,
                    "tools": 80,
                    "certifications": 75
                },
                "detected_skills": [
                    {"name": "Python", "category": "technical"},
                    {"name": "Leadership", "category": "soft_skills"}
                ],
                "personality": {
                    "leadership": 80,
                    "communication": 75,
                    "analytical": 85,
                    "creativity": 70,
                    "teamwork": 78
                },
                "timestamp": "2026-02-13T10:30:00Z",
                "filename": "john_doe_cv.pdf"
            }
        }


class AnalysisHistoryItem(BaseModel):
    """
    Schema for analysis history item (summary view).
    """
    analysis_id: str
    filename: str
    total_score: float
    timestamp: datetime
    
    class Config:
        json_schema_extra = {
            "example": {
                "analysis_id": "507f1f77bcf86cd799439011",
                "filename": "john_doe_cv.pdf",
                "total_score": 82.5,
                "timestamp": "2026-02-13T10:30:00Z"
            }
        }


class AnalysisHistory(BaseModel):
    """
    Schema for list of past analyses.
    """
    total: int = Field(..., description="Total number of analyses")
    analyses: List[AnalysisHistoryItem] = Field(..., description="List of analyses")
    
    class Config:
        json_schema_extra = {
            "example": {
                "total": 5,
                "analyses": [
                    {
                        "analysis_id": "507f1f77bcf86cd799439011",
                        "filename": "john_doe_cv.pdf",
                        "total_score": 82.5,
                        "timestamp": "2026-02-13T10:30:00Z"
                    }
                ]
            }
        }
