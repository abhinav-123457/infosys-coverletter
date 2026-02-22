export interface SkillMatch {
  skill: string;
  matched: boolean;
}

export interface MatchResult {
  matchedSkills: string[];
  unmatchedJobSkills: string[];
  additionalCandidateSkills: string[];
  matchScore: number;
  allMatches: SkillMatch[];
}

export function extractJobSkills(jobDescription: string): string[] {
  const KNOWN_SKILLS = [
  "JavaScript", "TypeScript", "Python", "Java", "C++", "C#", "C", "Ruby", "Go", "Rust", "Swift", "Scala",
  "React", "Angular", "Vue", "Node.js", "Express", "Express.js", "Django", "Flask", "Spring", "Next.js",
  "HTML", "CSS", "Sass", "SCSS", "Tailwind", "Bootstrap", "Material UI", "Chakra UI",
  "SQL", "PostgreSQL", "MySQL", "MongoDB", "Redis", "Firebase", "Supabase", "DynamoDB", "Cassandra",
  "AWS", "Azure", "GCP", "Docker", "Kubernetes", "CI/CD", "Git", "GitHub", "GitLab", "Bitbucket",
  "REST", "REST APIs", "GraphQL", "API", "Microservices", "gRPC",
  "Machine Learning", "Deep Learning", "NLP", "Computer Vision", "TensorFlow", "PyTorch",
  "Keras", "Scikit-learn", "OpenCV", "Hugging Face", "LLMs", "Generative AI", "Transformer Models",
  "Agile", "Scrum", "Jira", "Figma", "Adobe", "Canva",
  "Communication", "Leadership", "Problem Solving", "Teamwork", "Critical Thinking",
  "Project Management", "Time Management", "Adaptability", "Creativity",
  "Data Analysis", "Data Science", "Statistics", "R", "Tableau", "Power BI", "Excel",
  "Linux", "Windows", "macOS", "Networking", "Security", "DevOps", "SRE",
  "Testing", "Jest", "Cypress", "Selenium", "Unit Testing", "Pytest",
  "Blockchain", "Web3", "Solidity", "Ethereum", "Smart Contracts",
  "PHP", "Laravel", "WordPress", "Shopify",
  "Kotlin", "Flutter", "React Native", "iOS", "Android", "Swift UI",
  "NumPy", "Pandas", "Matplotlib", "Seaborn", "SpaCy", "NLTK",
  "FastAPI", "Spring Boot", "Ruby on Rails",
  "Prompt Engineering", "Fine-tuning", "Transfer Learning",
  "XGBoost", "LightGBM", "CatBoost", "Random Forest",
  "Dialogflow", "YOLOv8", "ONNX", "MLflow",
  "Supabase", "Authentication", "Session Management",
  "Feature Engineering", "Data Preprocessing", "Model Evaluation",
];


  const lower = jobDescription.toLowerCase();
  return KNOWN_SKILLS.filter((skill) => {
    const pattern = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
    return pattern.test(lower);
  });
}

export function matchSkills(candidateSkills: string[], jobSkills: string[]): MatchResult {
  const candidateLower = candidateSkills.map((s) => s.toLowerCase());
  const jobLower = jobSkills.map((s) => s.toLowerCase());

  const matched = jobSkills.filter((s) => candidateLower.includes(s.toLowerCase()));
  const unmatched = jobSkills.filter((s) => !candidateLower.includes(s.toLowerCase()));
  const additional = candidateSkills.filter((s) => !jobLower.includes(s.toLowerCase()));

  const score = jobSkills.length > 0 ? Math.round((matched.length / jobSkills.length) * 100) : 0;

  const allMatches: SkillMatch[] = jobSkills.map((skill) => ({
    skill,
    matched: candidateLower.includes(skill.toLowerCase()),
  }));

  return {
    matchedSkills: matched,
    unmatchedJobSkills: unmatched,
    additionalCandidateSkills: additional,
    matchScore: score,
    allMatches,
  };
}
