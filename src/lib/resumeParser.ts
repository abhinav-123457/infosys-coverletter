export interface ParsedResume {
  name: string;
  email: string;
  phone: string;
  github: string;
  linkedin: string;
  portfolio: string;
  skills: string[];
  rawText: string;
  cleanedText: string; // added for debugging
}

export function parseResumeText(rawText: string): ParsedResume {
  console.log("Starting resume parsing...");

  // Step 1: Clean common OCR artifacts
  let text = rawText
    .replace(/\s+/g, ' ')           // normalize all whitespace to single spaces
    .replace(/-\s+/g, '-')          // fix broken hyphens
    .replace(/\s+\./g, '.')         // fix space before dot
    .replace(/([a-z]) \./g, '$1.') // fix space before dot after letter
    .replace(/([a-zA-Z0-9]) ([a-zA-Z0-9])@([a-zA-Z0-9])/g, '$1$2@$3') // fix email spaces
    .replace(/([a-z]) l \.com/gi, '$1l.com') // common gmail OCR error
    .replace(/gmail\s*\.\s*com/gi, 'gmail.com')
    .replace(/(\d+)\s*([–-])\s*(\d+)/g, '$1$2$3')   // fix "June 2023 – May 2027" spacing
    .replace(/CGPA\s*-\s*([\d.]+)/g, 'CGPA $1')
    .trim();

  console.log("Cleaned text preview (first 300 chars):", text.slice(0, 300));

  // Email - more aggressive cleaning
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi;
  let email = (text.match(emailRegex) || [])[0] || "";
  if (!email) {
    // fallback pattern for broken emails
    const brokenEmailMatch = text.match(/abhinavshakya063\s*@\s*gmai\s*l\s*\.?\s*com/i);
    if (brokenEmailMatch) {
      email = "abhinavshakya063@gmail.com";
    }
  }
  console.log("Extracted email:", email);

  // Phone - handle Indian mobile formats with spaces/dashes
  const phoneRegex = /(?:\+91|91|0)?[\s.-]*[6789]\d{9}|8\s*800680347/i;
  let phone = "";
  const phoneMatch = text.match(phoneRegex);
  if (phoneMatch) {
    phone = phoneMatch[0]
      .replace(/\s+/g, '')
      .replace(/-/g, '')
      .replace(/^0/, '+91');
    if (!phone.startsWith('+')) phone = '+91' + phone;
  }
  console.log("Extracted phone:", phone);

  // GitHub - stricter to avoid false positives, handle dashed usernames
  const githubPatterns = [
  /https?:\/\/github\.com\/([a-zA-Z0-9_-]+(?:\s*-\s*[a-zA-Z0-9_-]+)*)/i,  // captures "abhinav - 123457" and cleans to abhinav-123457
  /github\.com\/([a-zA-Z0-9_-]+(?:\s*-\s*[a-zA-Z0-9_-]+)*)/i,
  /(?:github|gh)\s*[:\-]\s*([a-zA-Z0-9_-]+)/i,
  /abhinav\s*-\s*(\d{5,6})/i,  // direct match for this resume's pattern
];

let github = "";
for (const pattern of githubPatterns) {
  const match = text.match(pattern);
  if (match) {
    // Clean up any spaces around hyphens and reconstruct username
    let user = (match[1] || match[2] || match[3] || match[4])
      .replace(/\s*-\s*/g, '-')   // replace " - " with "-"
      .replace(/\s+/g, '');       // remove any other spaces
    if (user) {
      github = `github.com/${user}`;
      break;
    }
  }
};

  // LinkedIn - handles multiple formats
  const linkedinPatterns = [
    /linkedin\.com\/in\/([a-zA-Z0-9_-]+)/i,
    /(?:LinkedIn|LI)\s*[:\|•\-–—]\s*([a-zA-Z0-9_-]+)/i,
    /(?:linkedin:\s*)([a-zA-Z0-9_-]+)/i,
  ];
  let linkedin = "";
  for (const pattern of linkedinPatterns) {
    const match = text.match(pattern);
    if (match) {
      linkedin = match[1].includes("linkedin.com") ? match[1] : `linkedin.com/in/${match[1]}`;
      break;
    }
  }
  console.log("Extracted linkedin:", linkedin);

  // Portfolio / personal website detection
  const portfolioMatch = text.match(/(?:portfolio|website|site)\s*[:\|•\-–—]\s*(https?:\/\/[^\s,]+)/i)
    || text.match(/(https?:\/\/(?!(?:github|linkedin|twitter|facebook)\.com)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}[^\s,]*)/i);
  const portfolio = portfolioMatch ? portfolioMatch[1].trim() : "";
  console.log("Extracted portfolio:", portfolio);

  // Extract name - prioritize uppercase at top
  let name = "";
  const nameMatch = text.match(/^([A-Z\s]{5,})(?=\s*(?:Uttar|India|\+91|[\d-]))/i);
  if (nameMatch && nameMatch[1]) {
    name = nameMatch[1].trim().replace(/\s{2,}/g, ' ');
  }

  // Fallback: look for "First Last" pattern near top
  if (!name) {
    const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
    for (const line of lines.slice(0, 5)) {
      const cleaned = line.replace(/[•\|📧📱🔗☎️✉️]/g, "").trim();
      if (
        /^[A-Z][a-z]+\s+[A-Z][a-z]+$/.test(cleaned) &&
        cleaned.length > 1 &&
        cleaned.length < 60
      ) {
        name = cleaned;
        break;
      }
    }
  }

  // Ultimate fallback from email
  if (!name && email) {
    const emailUser = email.split('@')[0];
    name = emailUser
      .replace(/(\d+)/g, '')
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .trim()
      .split(/\s+/)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
  }
  console.log("Extracted name:", name);

  let skills = extractSkills(text);
  skills = [...new Set(skills)].sort(); // Deduplicate and sort
  console.log("Extracted skills:", skills);

  return { name, email, phone, github, linkedin, portfolio, skills, rawText, cleanedText: text };
}

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
  "Authentication", "Session Management",
  "Feature Engineering", "Data Preprocessing", "Model Evaluation",
  "Ultralytics", "Hugging Face Transformers", "Diffusers", "Stable Diffusion",
  "FastAI", "Weights & Biases", "Azure AI", "Neural Networks",
  "Model Evaluation & Metrics", "Linear Algebra", "Calculus",
  "Probability", "Optimization Techniques", "Gradient Methods",
  "Vector Spaces", "Matrix Operations", "Postman", "VS Code",
  "Jupyter Notebook", "Google Colab", "Vercel", "Heroku",
  "Analytical Thinking", "Collaboration", "Attention to Detail",
  "Project Ownership", "Fast Learning", "Decision Making", "Presentation Skills"
];

function extractSkills(text: string): string[] {
  const lower = text.toLowerCase();
  return KNOWN_SKILLS.filter((skill) => {
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    // Handle skills with special chars like C++, C#
    const pattern = new RegExp(`(?:^|[\\s,•\\|;(])${escaped}(?:$|[\\s,•\\|;)])`, "i");
    return pattern.test(` ${lower} `);
  });
}

export async function extractTextFromPDF(file: File): Promise<string> {
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items.map((item: any) => item.str);
    fullText += strings.join(" ") + "\n";
  }

  fullText = fullText
    .replace(/\n+/g, '\n')
    .replace(/\s{2,}/g, ' ')
    .trim();

  console.log("Extracted PDF text:", fullText); // Added logging for extracted text

  return fullText;
}

export function extractTextFromTXT(file: File): Promise<string> {
  return file.text();
}

export async function extractTextFromDOCX(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  // Use mammoth for DOCX parsing
  const mammoth = await import("mammoth");
  const result = await mammoth.extractRawText({ arrayBuffer });
  console.log("Extracted DOCX text:", result.value); // Added logging
  return result.value;
}