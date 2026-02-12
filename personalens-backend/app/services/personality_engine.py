from typing import Dict

LEADERSHIP_WORDS = ["led", "managed", "mentored", "coordinated", "owned"]
INNOVATION_WORDS = ["built", "created", "designed", "developed", "implemented"]
COLLAB_WORDS = ["team", "collaborated", "worked with", "cross-functional", "pair"]

def analyze_personality(text: str) -> Dict:
    """
    Lightweight heuristic analysis of writing tone.
    This is NOT psychology — it's a professional writing-signal extractor.
    """
    t = text.lower()

    leadership = sum(1 for w in LEADERSHIP_WORDS if w in t) * 12
    innovation = sum(1 for w in INNOVATION_WORDS if w in t) * 10
    collaboration = sum(1 for w in COLLAB_WORDS if w in t) * 10

    # clamp to 0..100
    leadership = min(leadership, 100)
    innovation = min(innovation, 100)
    collaboration = min(collaboration, 100)

    confidence = min(int((leadership + innovation) / 2), 100)

    return {
        "leadership": leadership,
        "innovation": innovation,
        "collaboration": collaboration,
        "confidence": confidence,
    }
