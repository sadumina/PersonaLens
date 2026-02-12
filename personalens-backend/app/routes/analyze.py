from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.pdf_parser import extract_text_from_pdf
from app.services.skill_cluster_engine import analyze_skill_clusters
from app.services.personality_engine import analyze_personality
from app.models.analysis_model import AnalysisResponse

router = APIRouter(prefix="/analyze", tags=["Analyze"])

@router.post("/cv", response_model=AnalysisResponse)
async def analyze_cv(file: UploadFile = File(...)):
    """
    Upload CV PDF -> return skill clusters + personality signals.
    """
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Please upload a PDF file.")

    text = extract_text_from_pdf(file.file)

    skill_result = analyze_skill_clusters(text)
    personality = analyze_personality(text)

    return AnalysisResponse(
        total_score=skill_result["total_score"],
        clusters=skill_result["clusters"],
        detected_skills=skill_result["detected_skills"],
        personality=personality,
    )
