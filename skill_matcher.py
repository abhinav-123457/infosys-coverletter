import re
import random

SKILL_BANK = [
    "python", "java", "sql", "nlp", "deep learning", "prompt engineering", "llmops",
    "computer vision", "data visualization", "tableau", "power bi", "big data", "spark",
    "data engineering", "predictive modeling", "r programming", "data governance", "mlops",
    "statistical analysis", "full-stack development", "kubernetes", "cybersecurity",
    "ethical hacking", "network security", "rust", "react", "node.js", "mobile app development",
    "system design", "critical thinking", "problem solving", "emotional intelligence",
    "adaptability", "active listening", "negotiation", "intercultural fluency", "empathy",
    "conflict resolution", "public speaking", "technical writing", "storytelling", "leadership",
    "time management", "resilience", "creative thinking", "ethical judgment", "strategic foresight",
    "social influence", "self-management", "project management", "agile", "scrum",
    "product management", "stakeholder management", "strategic planning", "financial modeling",
    "risk management", "change management", "machine learning", "git", "docker", "tensorflow",
    "pytorch", "cloud", "aws", "azure", "linux", "data science", "api", "flask", "django",
    "generative ai", "operations management", "supply chain analytics", "business analysis",
    "sales", "entrepreneurship", "budgeting", "quality assurance", "decision making",
    "ux ui design", "design thinking", "digital marketing", "seo", "growth hacking",
    "content strategy", "video production", "branding", "e-commerce", "user research",
    "customer experience", "copywriting", "market research", "esg reporting", "sustainability strategy",
    "blockchain", "fintech", "iot", "robotics", "digital literacy", "augmented reality",
    "quantum computing", "remote coordination"
]

def extract_skills(text):
    text = text.lower()
    found = set()
    for skill in SKILL_BANK:
        if re.search(rf"\b{re.escape(skill)}\b", text):
            found.add(skill.title())
    return list(found)

def match_skills(resume_text, jd_text, limit=5):
    resume_skills = set(extract_skills(resume_text))
    jd_skills = set(extract_skills(jd_text))
    matched = list(resume_skills & jd_skills)
    
    # If matched skills < limit, fill randomly from resume_skills
    if len(matched) < limit:
        remaining = list(resume_skills - set(matched))
        random.shuffle(remaining)
        matched += remaining[:limit-len(matched)]
    
    return matched[:limit]
