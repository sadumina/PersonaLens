from typing import Dict, List

SKILL_CLUSTERS: Dict[str, List[str]] = {
    "Frontend": ["React", "Next.js", "Tailwind", "JavaScript", "TypeScript"],
    "Backend": ["FastAPI", "Node", "Spring Boot", "Express", "Java"],
    "Database": ["MongoDB", "MySQL", "PostgreSQL", "SQL"],
    "DevOps": ["Docker", "Azure", "GitHub Actions", "CI/CD"],
}

def analyze_skill_clusters(text: str) -> Dict:
    """
    Simple keyword-based cluster scoring.
    Output:
      - clusters: {clusterName: count}
      - detected_skills: {skill: 0|1}
      - total_score: %
    """
    t = text.lower()

    clusters = {}
    detected_skills = {}

    all_skills = []
    for cluster, skills in SKILL_CLUSTERS.items():
        all_skills.extend(skills)

        count = 0
        for skill in skills:
            found = skill.lower() in t
            detected_skills[skill] = 1 if found else 0
            if found:
                count += 1

        clusters[cluster] = count

    total = len(all_skills) if all_skills else 1
    score = (sum(detected_skills.values()) / total) * 100

    return {
        "clusters": clusters,
        "detected_skills": detected_skills,
        "total_score": round(score, 2),
    }
