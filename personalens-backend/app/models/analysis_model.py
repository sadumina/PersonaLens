from pydantic import BaseModel
from typing import Dict

class AnalysisResponse(BaseModel):
    total_score: float
    clusters: Dict[str, int]
    detected_skills: Dict[str, int]
    personality: Dict[str, int]
