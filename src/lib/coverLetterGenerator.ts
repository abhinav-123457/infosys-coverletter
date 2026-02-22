import { ParsedResume } from "./resumeParser";
import { MatchResult } from "./skillMatcher";

export interface GeneratorInput {
  resume: ParsedResume;
  jobTitle: string;
  companyName: string;
  jobDescription: string;
  matchResult: MatchResult;
  templateId: string;
}

export interface TemplateInfo {
  id: string;
  name: string;
  description: string;
  icon: string;
  bestFor: string[];
}

export const TEMPLATES: TemplateInfo[] = [
  {
    id: "professional",
    name: "Professional Classic",
    description: "Traditional and formal tone, ideal for corporate environments.",
    icon: "Briefcase",
    bestFor: ["Corporate", "Finance", "Legal", "Management"],
  },
  {
    id: "technical",
    name: "Technical Expert",
    description: "Emphasizes technical skills, projects, and engineering mindset.",
    icon: "Code",
    bestFor: ["Software Engineering", "DevOps", "Data Science", "AI/ML", "IT"],
  },
  {
    id: "creative",
    name: "Creative & Bold",
    description: "Personality-forward with storytelling for creative roles.",
    icon: "Palette",
    bestFor: ["Design", "Marketing", "Content", "Media"],
  },
  {
    id: "career-change",
    name: "Career Changer",
    description: "Highlights transferable skills for industry transitions.",
    icon: "RefreshCw",
    bestFor: ["Career Transition", "Reskilling"],
  },
  {
    id: "executive",
    name: "Executive Leadership",
    description: "Strategic, results-driven for senior roles.",
    icon: "Crown",
    bestFor: ["Director", "VP", "C-Suite"],
  },
  {
    id: "entry-level",
    name: "Fresh Graduate / Student",
    description: "Enthusiastic, focuses on potential, projects & learning.",
    icon: "GraduationCap",
    bestFor: ["Internship", "Junior", "Entry-Level", "Graduate", "AI/ML Student"],
  },
];

function getHelpers(input: GeneratorInput) {
  const { resume, jobTitle, companyName, matchResult } = input;

  const name = resume.name?.trim() || "Candidate";
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const topMatched = matchResult.matchedSkills.slice(0, 6);
  const additional = matchResult.additionalCandidateSkills.slice(0, 4);

  const skillsList = topMatched.length > 0 ? topMatched.join(", ") : "relevant technical skills";

  const contactLine = [
    resume.email && `email: ${resume.email}`,
    resume.phone && `phone: ${resume.phone}`,
  ].filter(Boolean).join(" | ");

  const profilesLine = [
    resume.github && `GitHub: ${resume.github.replace(/^(https?:\/\/)?(www\.)?/, '')}`,
    resume.linkedin && `LinkedIn: ${resume.linkedin.replace(/^(https?:\/\/)?(www\.)?/, '')}`,
    resume.portfolio && `Portfolio: ${resume.portfolio}`,
  ].filter(Boolean).join(" • ");

  // Extract 1–2 strongest project titles from rawText
  let projectTitles: string[] = [];
  const projectsSection = resume.rawText.match(/Projects([\s\S]*?)(?=Technical Skills|Soft Skills|$)/i);
  if (projectsSection) {
    projectTitles = projectsSection[1]
      .split(/\n\s*[A-Z][^•]/)
      .map(s => s.trim().split(/[-–—|•]/)[0]?.trim())
      .filter(s => s && s.length > 8 && !s.includes("http") && !s.includes("•"))
      .slice(0, 2);
  }

  const isStudentLike =
    resume.rawText.toLowerCase().includes("student") ||
    resume.rawText.includes("CGPA") ||
    resume.rawText.includes("B.Tech") ||
    resume.rawText.includes("Intern") ||
    !resume.rawText.toLowerCase().includes("years") ||
    matchResult.matchScore < 65;

  return {
    name,
    topMatched,
    additional,
    today,
    skillsList,
    contactLine,
    profilesLine,
    jobTitle,
    companyName,
    matchResult,
    projectTitles,
    isStudentLike,
  };
}

function politeSignOff(name: string, contact: string, profiles: string, templateId: string) {
  let closing = "Sincerely,";
  if (templateId === "creative") closing = "Warm regards,";
  if (templateId === "entry-level") closing = "Best regards,";
  if (templateId === "technical") closing = "Best regards,";

  return `
${contact ? `\nFeel free to contact me at ${contact}.` : ""}
${profiles ? `\n\nProfiles: ${profiles}` : ""}

${closing}
${name}`;
}

function generateProfessional(input: GeneratorInput): string {
  const h = getHelpers(input);
  return `${h.today}

Dear Hiring Manager,

I am writing to apply for the ${h.jobTitle} position at ${h.companyName}. With a strong match (${h.matchResult.matchScore}%) to your requirements and practical experience in ${h.skillsList}, I am confident I can contribute value to your team from the outset.

My background includes focused training and real-world application of technologies central to this role. I am particularly drawn to ${h.companyName}'s work in innovative and reliable engineering solutions, and I am eager to support your continued success.

${h.projectTitles.length > 0 ? `Key projects demonstrating my capabilities include:\n• ${h.projectTitles.join("\n• ")}\n` : ""}

I would welcome the opportunity to discuss how my skills and approach align with your current priorities.

${politeSignOff(h.name, h.contactLine, h.profilesLine, input.templateId)}`;
}

function generateTechnical(input: GeneratorInput): string {
  const h = getHelpers(input);
  return `${h.today}

Dear Hiring Manager,

I am excited to apply for the ${h.jobTitle} role at ${h.companyName}. My hands-on experience centers on ${h.skillsList} — skills that align closely (${h.matchResult.matchScore}%) with the technical demands of this position.

I bring:
• Production-level work with model training, optimization & deployment
• Clean, scalable code and system-level thinking
• Strong debugging, profiling and iterative improvement

${h.projectTitles.length > 0 ? `Recent projects that showcase these abilities:\n• ${h.projectTitles.join("\n• ")}\n` : ""}

${h.additional.length > 0 ? `I also offer complementary expertise in ${h.additional.join(", ")}, which often proves valuable in performance-critical and cross-functional settings.\n` : ""}

I look forward to the possibility of contributing to ${h.companyName}'s technical challenges and roadmap.

${politeSignOff(h.name, h.contactLine, h.profilesLine, input.templateId)}`;
}

function generateEntryLevel(input: GeneratorInput): string {
  const h = getHelpers(input);
  return `${h.today}

Dear Hiring Manager,

I am very enthusiastic about the ${h.jobTitle} opportunity at ${h.companyName}. As a Computer Science student with practical exposure to ${h.skillsList} and a solid ${h.matchResult.matchScore}% alignment with your requirements, I am eager to begin my career with a forward-thinking team.

Through dedicated academic projects and an AI/ML internship, I have gained real experience in model development, deployment, and continuous improvement — the exact kind of applied work I hope to deepen at ${h.companyName}.

${h.projectTitles.length > 0 ? `Projects I am especially proud of:\n• ${h.projectTitles.join("\n• ")}\n` : ""}

I am a quick learner, highly coachable, and genuinely passionate about applying my foundation in a collaborative, mission-driven setting.

I would greatly appreciate the chance to speak about how my energy, potential, and growing skill set can support your team's goals.

${politeSignOff(h.name, h.contactLine, h.profilesLine, input.templateId)}`;
}

function generateCreative(input: GeneratorInput): string {
  const h = getHelpers(input);
  return `${h.today}

Dear ${h.companyName} Team,

The ${h.jobTitle} opening at ${h.companyName} immediately caught my attention — not just as a job, but as a chance to combine my technical foundation in ${h.skillsList} with genuine creative energy.

I thrive where structure meets imagination. Whether building intelligent systems or solving complex problems, I bring both precision and fresh perspective to every challenge.

${h.projectTitles.length > 0 ? `Some of my favorite work includes:\n• ${h.projectTitles.join("\n• ")}\n` : ""}

${h.additional.length > 0 ? `Beyond the core requirements, I also bring experience in ${h.additional.join(", ")} — skills that let me approach problems from unexpected and valuable angles.\n` : ""}

I’d love the opportunity to show you what ${h.matchResult.matchScore}% skill alignment looks like when paired with enthusiasm and creative thinking.

Let’s build something remarkable together.

${politeSignOff(h.name, h.contactLine, h.profilesLine, input.templateId)}`;
}

function generateCareerChange(input: GeneratorInput): string {
  const h = getHelpers(input);
  return `${h.today}

Dear Hiring Manager,

I am writing with genuine enthusiasm for the ${h.jobTitle} position at ${h.companyName}. While my path may not be the most conventional, I bring a powerful combination of transferable skills — including ${h.skillsList} — and a proven ability to adapt quickly and deliver results.

My diverse experiences have taught me how to learn fast, connect seemingly unrelated concepts, and thrive in dynamic environments — qualities I believe are especially valuable in this role.

${h.projectTitles.length > 0 ? `Recent applied work that highlights my capabilities:\n• ${h.projectTitles.join("\n• ")}\n` : ""}

With a ${h.matchResult.matchScore}% skill match and strong motivation to contribute to ${h.companyName}, I am confident I can add meaningful value while continuing to grow.

I would welcome the chance to discuss how my unique background can support your team’s goals.

${politeSignOff(h.name, h.contactLine, h.profilesLine, input.templateId)}`;
}

function generateExecutive(input: GeneratorInput): string {
  const h = getHelpers(input);
  return `${h.today}

Dear Hiring Manager,

I am writing to express my interest in the ${h.jobTitle} position at ${h.companyName}. With deep expertise in ${h.skillsList} and a consistent record of delivering strategic, measurable outcomes, I am prepared to help drive your next phase of growth and innovation.

My approach combines technical depth with strong leadership: translating complex challenges into clear priorities, aligning teams around shared goals, and maintaining relentless focus on quality and impact.

${h.projectTitles.length > 0 ? `Notable achievements include:\n• ${h.projectTitles.join("\n• ")}\n` : ""}

${h.additional.length > 0 ? `My experience also extends to ${h.additional.join(", ")}, enabling a broader, more integrated perspective on organisational challenges.\n` : ""}

With ${h.matchResult.matchScore}% alignment to your requirements, I am confident I can accelerate ${h.companyName}'s objectives while building high-performing, innovative teams.

I would value the opportunity to explore this further.

${politeSignOff(h.name, h.contactLine, h.profilesLine, input.templateId)}`;
}

export function generateCoverLetter(input: GeneratorInput): string {
  const h = getHelpers(input);
  let templateId = input.templateId;

  // Auto-select student-friendly template if profile looks early-career
  if (h.isStudentLike && !["entry-level", "technical"].includes(templateId)) {
    templateId = "entry-level";
  }

  switch (templateId) {
    case "technical":     return generateTechnical(input);
    case "entry-level":   return generateEntryLevel(input);
    case "creative":      return generateCreative(input);
    case "career-change": return generateCareerChange(input);
    case "executive":     return generateExecutive(input);
    case "professional":
    default:              return generateProfessional(input);
  }
}