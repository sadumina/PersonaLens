"""
Analysis Service - Orchestration layer for CV analysis.
Coordinates PDF parsing, skill clustering, and personality analysis.
"""
from typing import Dict, Any, BinaryIO
from datetime import datetime
import uuid
import logging
from app.services.pdf_parser import PDFParserService
from app.services.skill_cluster_engine import SkillClusterEngine
from app.services.personality_engine import PersonalityEngine
from app.core.database import Database

logger = logging.getLogger(__name__)


class AnalysisService:
    """
    Service for orchestrating complete CV analysis workflow.
    Coordinates multiple analysis engines and stores results.
    """
    
    def __init__(
        self,
        pdf_parser: PDFParserService = None,
        skill_engine: SkillClusterEngine = None,
        personality_engine: PersonalityEngine = None
    ):
        """
        Initialize the analysis service with dependency injection.
        
        Args:
            pdf_parser: PDF parsing service (creates new if None)
            skill_engine: Skill clustering engine (creates new if None)
            personality_engine: Personality analysis engine (creates new if None)
        """
        self.pdf_parser = pdf_parser or PDFParserService()
        self.skill_engine = skill_engine or SkillClusterEngine()
        self.personality_engine = personality_engine or PersonalityEngine()
        self.logger = logger
    
    async def analyze_cv(
        self,
        file_obj: BinaryIO,
        filename: str,
        user_id: str
    ) -> Dict[str, Any]:
        """
        Perform complete CV analysis.
        
        Workflow:
        1. Extract text from PDF
        2. Analyze skills and clusters
        3. Analyze personality signals
        4. Calculate total score
        5. Store results in database
        6. Return structured response
        
        Args:
            file_obj: File object containing PDF data
            filename: Original filename
            user_id: ID of the user performing analysis
            
        Returns:
            Dict containing analysis results
            
        Raises:
            Exception: If any step of the analysis fails
        """
        try:
            self.logger.info(f"Starting CV analysis for user {user_id}, file: {filename}")
            
            # Step 1: Extract text from PDF
            text = self.pdf_parser.extract_text(file_obj)
            
            if not text:
                raise Exception("No text could be extracted from the PDF")
            
            # Step 2: Analyze skills and clusters
            skill_result = self.skill_engine.analyze(text)
            
            # Step 3: Analyze personality signals
            personality_result = self.personality_engine.analyze(text)
            
            # Step 4: Calculate weighted total score
            # 70% weight on skills, 30% weight on personality
            skill_score = skill_result["total_score"]
            personality_avg = sum(personality_result.values()) / len(personality_result)
            total_score = round((skill_score * 0.7) + (personality_avg * 0.3), 2)
            
            # Step 5: Generate analysis ID
            analysis_id = str(uuid.uuid4())
            timestamp = datetime.utcnow()
            
            # Step 6: Prepare analysis document
            analysis_doc = {
                "_id": analysis_id,
                "analysis_id": analysis_id,
                "user_id": user_id,
                "filename": filename,
                "total_score": total_score,
                "clusters": skill_result["clusters"],
                "detected_skills": skill_result["detected_skills"],
                "personality": personality_result,
                "timestamp": timestamp
            }
            
            # Step 7: Store in database
            db = Database.get_database()
            await db.analyses.insert_one(analysis_doc)
            
            self.logger.info(f"Analysis complete: {analysis_id}, score: {total_score}")
            
            # Step 8: Return response
            return {
                "analysis_id": analysis_id,
                "total_score": total_score,
                "clusters": skill_result["clusters"],
                "detected_skills": skill_result["detected_skills"],
                "personality": personality_result,
                "timestamp": timestamp,
                "filename": filename
            }
            
        except Exception as e:
            self.logger.error(f"Analysis failed: {e}")
            raise
    
    async def get_analysis_by_id(self, analysis_id: str, user_id: str) -> Dict[str, Any]:
        """
        Retrieve a specific analysis by ID.
        
        Args:
            analysis_id: Unique analysis identifier
            user_id: User ID (for authorization)
            
        Returns:
            Dict containing analysis data
            
        Raises:
            Exception: If analysis not found or unauthorized
        """
        db = Database.get_database()
        analysis = await db.analyses.find_one({
            "analysis_id": analysis_id,
            "user_id": user_id
        })
        
        if not analysis:
            raise Exception("Analysis not found or unauthorized")
        
        # Remove MongoDB _id field
        analysis.pop("_id", None)
        
        return analysis
    
    async def get_user_history(self, user_id: str, limit: int = 50) -> Dict[str, Any]:
        """
        Get analysis history for a user.
        
        Args:
            user_id: User ID
            limit: Maximum number of results to return
            
        Returns:
            Dict containing list of analyses
        """
        db = Database.get_database()
        
        # Get analyses sorted by timestamp (newest first)
        cursor = db.analyses.find(
            {"user_id": user_id}
        ).sort("timestamp", -1).limit(limit)
        
        analyses = await cursor.to_list(length=limit)
        
        # Format for history view (only essential fields)
        history_items = []
        for analysis in analyses:
            history_items.append({
                "analysis_id": analysis["analysis_id"],
                "filename": analysis["filename"],
                "total_score": analysis["total_score"],
                "timestamp": analysis["timestamp"]
            })
        
        return {
            "total": len(history_items),
            "analyses": history_items
        }
