"""
Skill Cluster Engine for detecting and clustering skills from CV text.
"""
from typing import Dict, List, Any
import logging

logger = logging.getLogger(__name__)


class SkillClusterEngine:
    """
    Engine for analyzing and clustering skills from CV text.
    Uses keyword-based detection (upgradeable to NLP/ML models).
    """
    
    # Skill clusters with associated keywords
    SKILL_CLUSTERS: Dict[str, List[str]] = {
        "technical": [
            "Python", "Java", "JavaScript", "TypeScript", "C++", "C#", "Go", "Rust",
            "React", "Angular", "Vue", "Next.js", "Node.js", "Django", "Flask",
            "Spring", "FastAPI", "Express", "Machine Learning", "Deep Learning",
            "AI", "TensorFlow", "PyTorch", "Scikit-learn"
        ],
        "soft_skills": [
            "Leadership", "Communication", "Teamwork", "Problem Solving",
            "Critical Thinking", "Creativity", "Adaptability", "Time Management",
            "Collaboration", "Presentation", "Negotiation", "Mentoring"
        ],
        "languages": [
            "English", "Spanish", "French", "German", "Chinese", "Japanese",
            "Arabic", "Portuguese", "Russian", "Italian"
        ],
        "tools": [
            "Git", "GitHub", "GitLab", "Docker", "Kubernetes", "Jenkins",
            "CI/CD", "AWS", "Azure", "GCP", "Terraform", "Ansible",
            "Jira", "Confluence", "Slack", "VS Code"
        ],
        "certifications": [
            "AWS Certified", "Azure Certified", "PMP", "Scrum Master",
            "Google Cloud Certified", "CISSP", "CKA", "CKAD",
            "CompTIA", "Oracle Certified"
        ]
    }
    
    def __init__(self):
        """Initialize the skill cluster engine."""
        self.logger = logger
    
    def analyze(self, text: str) -> Dict[str, Any]:
        """
        Analyze text and detect skills, grouping them into clusters.
        
        Args:
            text: CV text content to analyze
            
        Returns:
            Dict containing:
                - clusters: Dict mapping cluster names to counts
                - detected_skills: List of detected skills with categories
                - total_score: Overall score (0-100)
        """
        if not text:
            self.logger.warning("Empty text provided for skill analysis")
            return {
                "clusters": {cluster: 0 for cluster in self.SKILL_CLUSTERS.keys()},
                "detected_skills": [],
                "total_score": 0.0
            }
        
        text_lower = text.lower()
        
        clusters = {}
        detected_skills = []
        all_skills_count = 0
        found_skills_count = 0
        
        # Analyze each cluster
        for cluster_name, skills in self.SKILL_CLUSTERS.items():
            cluster_count = 0
            
            for skill in skills:
                all_skills_count += 1
                skill_lower = skill.lower()
                
                # Check if skill is mentioned in text
                if skill_lower in text_lower:
                    cluster_count += 1
                    found_skills_count += 1
                    detected_skills.append({
                        "name": skill,
                        "category": cluster_name
                    })
            
            # Calculate cluster score (0-100)
            cluster_score = int((cluster_count / len(skills)) * 100) if skills else 0
            clusters[cluster_name] = cluster_score
        
        # Calculate total score
        total_score = (found_skills_count / all_skills_count * 100) if all_skills_count > 0 else 0
        total_score = round(total_score, 2)
        
        self.logger.info(f"Skill analysis complete: {found_skills_count}/{all_skills_count} skills found, score: {total_score}")
        
        return {
            "clusters": clusters,
            "detected_skills": detected_skills,
            "total_score": total_score
        }


# Backward compatibility function
def analyze_skill_clusters(text: str) -> Dict:
    """
    Legacy function for backward compatibility.
    Delegates to SkillClusterEngine.
    """
    engine = SkillClusterEngine()
    result = engine.analyze(text)
    
    # Convert detected_skills format for backward compatibility
    old_format_skills = {skill["name"]: 1 for skill in result["detected_skills"]}
    
    return {
        "clusters": result["clusters"],
        "detected_skills": old_format_skills,
        "total_score": result["total_score"]
    }
