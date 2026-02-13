"""
CV Analysis API routes.
Handles CV upload, analysis, and history retrieval.
"""
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, status
from typing import Dict, Any
import logging

from app.services.analysis_service import AnalysisService
from app.schemas.analysis_schema import AnalysisResponse, AnalysisHistory
from app.core.security import get_current_user

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/analyze", tags=["Analysis"])

# Initialize analysis service
analysis_service = AnalysisService()


@router.post("/cv", response_model=AnalysisResponse, status_code=status.HTTP_200_OK)
async def analyze_cv(
    file: UploadFile = File(...),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Upload and analyze a CV PDF file.
    Protected route - requires authentication.
    
    Args:
        file: PDF file to analyze
        current_user: Current authenticated user (injected)
        
    Returns:
        AnalysisResponse: Complete analysis results
        
    Raises:
        HTTPException: If file is invalid or analysis fails
    """
    try:
        # Validate file type
        if not file.filename.lower().endswith(".pdf"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Please upload a PDF file"
            )
        
        # Validate file size (max 10MB)
        file.file.seek(0, 2)  # Seek to end
        file_size = file.file.tell()
        file.file.seek(0)  # Seek back to start
        
        max_size = 10 * 1024 * 1024  # 10MB
        if file_size > max_size:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="File size exceeds 10MB limit"
            )
        
        user_id = str(current_user["_id"])
        
        logger.info(f"Processing CV analysis for user {user_id}: {file.filename}")
        
        # Perform analysis
        result = await analysis_service.analyze_cv(
            file_obj=file.file,
            filename=file.filename,
            user_id=user_id
        )
        
        return AnalysisResponse(**result)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"CV analysis failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Analysis failed: {str(e)}"
        )


@router.get("/history", response_model=AnalysisHistory)
async def get_analysis_history(
    current_user: Dict[str, Any] = Depends(get_current_user),
    limit: int = 50
):
    """
    Get analysis history for the current user.
    Protected route - requires authentication.
    
    Args:
        current_user: Current authenticated user (injected)
        limit: Maximum number of results to return (default: 50)
        
    Returns:
        AnalysisHistory: List of past analyses
    """
    try:
        user_id = str(current_user["_id"])
        
        logger.info(f"Fetching analysis history for user {user_id}")
        
        history = await analysis_service.get_user_history(user_id, limit)
        
        return AnalysisHistory(**history)
        
    except Exception as e:
        logger.error(f"Failed to fetch history: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch analysis history"
        )


@router.get("/{analysis_id}", response_model=AnalysisResponse)
async def get_analysis(
    analysis_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Get a specific analysis by ID.
    Protected route - requires authentication.
    
    Args:
        analysis_id: Unique analysis identifier
        current_user: Current authenticated user (injected)
        
    Returns:
        AnalysisResponse: Complete analysis data
        
    Raises:
        HTTPException: If analysis not found or unauthorized
    """
    try:
        user_id = str(current_user["_id"])
        
        logger.info(f"Fetching analysis {analysis_id} for user {user_id}")
        
        analysis = await analysis_service.get_analysis_by_id(analysis_id, user_id)
        
        return AnalysisResponse(**analysis)
        
    except Exception as e:
        logger.error(f"Failed to fetch analysis: {e}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis not found"
        )
