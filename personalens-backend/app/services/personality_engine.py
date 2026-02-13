"""
Personality Engine for analyzing personality signals from CV text.
"""
from typing import Dict, List
import logging

logger = logging.getLogger(__name__)


class PersonalityEngine:
    """
    Engine for extracting personality signals from professional writing.
    Uses keyword/phrase matching (upgradeable to NLP/ML models).
    
    Note: This is NOT psychological profiling - it analyzes professional
    writing patterns and language signals in CVs.
    """
    
    # Keyword patterns for different personality traits
    LEADERSHIP_KEYWORDS: List[str] = [
        "led", "managed", "mentored", "coordinated", "owned", "directed",
        "supervised", "guided", "orchestrated", "spearheaded", "championed"
    ]
    
    COMMUNICATION_KEYWORDS: List[str] = [
        "presented", "communicated", "explained", "articulated", "conveyed",
        "demonstrated", "trained", "taught", "spoke", "wrote", "documented"
    ]
    
    ANALYTICAL_KEYWORDS: List[str] = [
        "analyzed", "evaluated", "assessed", "investigated", "researched",
        "studied", "examined", "measured", "calculated", "optimized"
    ]
    
    CREATIVITY_KEYWORDS: List[str] = [
        "designed", "created", "innovated", "developed", "invented",
        "conceived", "pioneered", "built", "crafted", "engineered"
    ]
    
    TEAMWORK_KEYWORDS: List[str] = [
        "collaborated", "team", "worked with", "partnered", "cooperated",
        "cross-functional", "group", "pair", "together", "joint"
    ]
    
    def __init__(self):
        """Initialize the personality engine."""
        self.logger = logger
    
    def analyze(self, text: str) -> Dict[str, int]:
        """
        Analyze text for personality signals.
        
        Args:
            text: CV text content to analyze
            
        Returns:
            Dict mapping personality traits to scores (0-100)
        """
        if not text:
            self.logger.warning("Empty text provided for personality analysis")
            return {
                "leadership": 0,
                "communication": 0,
                "analytical": 0,
                "creativity": 0,
                "teamwork": 0
            }
        
        text_lower = text.lower()
        
        # Count occurrences of each trait's keywords
        leadership_count = sum(1 for word in self.LEADERSHIP_KEYWORDS if word in text_lower)
        communication_count = sum(1 for word in self.COMMUNICATION_KEYWORDS if word in text_lower)
        analytical_count = sum(1 for word in self.ANALYTICAL_KEYWORDS if word in text_lower)
        creativity_count = sum(1 for word in self.CREATIVITY_KEYWORDS if word in text_lower)
        teamwork_count = sum(1 for word in self.TEAMWORK_KEYWORDS if word in text_lower)
        
        # Calculate scores (with scaling factors and capping at 100)
        leadership = min(leadership_count * 12, 100)
        communication = min(communication_count * 10, 100)
        analytical = min(analytical_count * 10, 100)
        creativity = min(creativity_count * 10, 100)
        teamwork = min(teamwork_count * 10, 100)
        
        self.logger.info(f"Personality analysis complete: L={leadership}, C={communication}, A={analytical}, Cr={creativity}, T={teamwork}")
        
        return {
            "leadership": leadership,
            "communication": communication,
            "analytical": analytical,
            "creativity": creativity,
            "teamwork": teamwork
        }


# Backward compatibility function
def analyze_personality(text: str) -> Dict:
    """
    Legacy function for backward compatibility.
    Delegates to PersonalityEngine.
    """
    engine = PersonalityEngine()
    result = engine.analyze(text)
    
    # Add compatibility fields
    result["innovation"] = result["creativity"]  # Map creativity to innovation
    result["collaboration"] = result["teamwork"]  # Map teamwork to collaboration
    result["confidence"] = min(int((result["leadership"] + result["communication"]) / 2), 100)
    
    return result
