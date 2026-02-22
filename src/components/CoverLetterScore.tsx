import { useMemo } from "react";
import { TrendingUp, CheckCircle2, AlertTriangle, Lightbulb } from "lucide-react";

interface CoverLetterScoreProps {
  content: string;
  jobDescription: string;
  jobTitle: string;
}

interface ScoreCategory {
  label: string;
  score: number;
  maxScore: number;
  tips: string[];
}

function analyzeCoverLetter(
  content: string,
  jobDescription: string,
  jobTitle: string
): ScoreCategory[] {
  const words = content.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const sentences = content.split(/[.!?]+/).filter((s) => s.trim());
  const paragraphs = content.split(/\n\n+/).filter((p) => p.trim());

  // 1. Length & Structure (25 pts)
  let lengthScore = 0;
  const lengthTips: string[] = [];
  if (wordCount >= 200 && wordCount <= 400) {
    lengthScore += 10;
  } else if (wordCount >= 150 && wordCount <= 500) {
    lengthScore += 6;
    lengthTips.push(wordCount < 200 ? "Add more detail — aim for 200-400 words" : "Consider trimming to under 400 words");
  } else {
    lengthScore += 2;
    lengthTips.push("Optimal cover letters are 200-400 words");
  }
  if (paragraphs.length >= 3 && paragraphs.length <= 5) {
    lengthScore += 8;
  } else {
    lengthScore += 4;
    lengthTips.push("Use 3-5 clear paragraphs for best readability");
  }
  if (sentences.length >= 8) {
    lengthScore += 7;
  } else {
    lengthScore += 3;
    lengthTips.push("Expand your letter with more detailed sentences");
  }

  // 2. Relevance & Keywords (25 pts)
  const jdWords = jobDescription.toLowerCase().split(/\s+/).filter((w) => w.length > 3);
  const uniqueJdWords = [...new Set(jdWords)];
  const contentLower = content.toLowerCase();
  const matchedKeywords = uniqueJdWords.filter((w) => contentLower.includes(w));
  const keywordRatio = uniqueJdWords.length > 0 ? matchedKeywords.length / uniqueJdWords.length : 0;
  let relevanceScore = Math.min(25, Math.round(keywordRatio * 40));
  const relevanceTips: string[] = [];
  if (relevanceScore < 15) {
    relevanceTips.push("Include more keywords from the job description");
  }
  if (!contentLower.includes(jobTitle.toLowerCase())) {
    relevanceScore = Math.max(0, relevanceScore - 3);
    relevanceTips.push(`Mention the job title "${jobTitle}" in your letter`);
  }

  // 3. Tone & Professionalism (25 pts)
  let toneScore = 15;
  const toneTips: string[] = [];
  const hasGreeting = /^(dear|to whom|hi |hello )/im.test(content);
  const hasClosing = /(sincerely|regards|best|thank you|looking forward)/im.test(content);
  if (hasGreeting) toneScore += 5;
  else toneTips.push("Start with a professional greeting (e.g., 'Dear Hiring Manager')");
  if (hasClosing) toneScore += 5;
  else toneTips.push("End with a professional closing (e.g., 'Sincerely')");

  const casualWords = ["gonna", "wanna", "stuff", "things", "cool", "awesome", "basically", "literally"];
  const hasCasual = casualWords.some((w) => contentLower.includes(w));
  if (hasCasual) {
    toneScore -= 5;
    toneTips.push("Remove casual language for a more professional tone");
  }

  // 4. Impact & Action (25 pts)
  let impactScore = 10;
  const impactTips: string[] = [];
  const actionVerbs = [
    "achieved", "delivered", "led", "managed", "developed", "created", "increased",
    "reduced", "improved", "designed", "built", "launched", "implemented", "optimized",
    "streamlined", "spearheaded"
  ];
  const usedActions = actionVerbs.filter((v) => contentLower.includes(v));
  impactScore += Math.min(8, usedActions.length * 2);
  if (usedActions.length < 3) {
    impactTips.push("Use more action verbs (achieved, delivered, led, etc.)");
  }

  const hasNumbers = /\d+%|\d+ (years?|projects?|clients?|team)/i.test(content);
  if (hasNumbers) impactScore += 7;
  else impactTips.push("Add quantifiable achievements (e.g., 'increased sales by 30%')");

  return [
    { label: "Structure", score: lengthScore, maxScore: 25, tips: lengthTips },
    { label: "Relevance", score: relevanceScore, maxScore: 25, tips: relevanceTips },
    { label: "Tone", score: toneScore, maxScore: 25, tips: toneTips },
    { label: "Impact", score: impactScore, maxScore: 25, tips: impactTips },
  ];
}

const CoverLetterScore = ({ content, jobDescription, jobTitle }: CoverLetterScoreProps) => {
  const categories = useMemo(
    () => analyzeCoverLetter(content, jobDescription, jobTitle),
    [content, jobDescription, jobTitle]
  );

  const totalScore = categories.reduce((sum, c) => sum + c.score, 0);
  const allTips = categories.flatMap((c) => c.tips).slice(0, 4);

  const gradeColor =
    totalScore >= 80 ? "text-success" :
    totalScore >= 60 ? "text-accent" :
    "text-destructive";

  const gradeLabel =
    totalScore >= 80 ? "Excellent" :
    totalScore >= 60 ? "Good" :
    totalScore >= 40 ? "Needs Work" :
    "Weak";

  return (
    <div className="p-5 rounded-xl bg-card shadow-soft border border-border space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider font-body flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-accent" /> Strength Score
        </h4>
        <div className="flex items-center gap-2">
          <span className={`text-3xl font-display ${gradeColor}`}>{totalScore}</span>
          <span className="text-xs text-muted-foreground font-body">/100</span>
        </div>
      </div>

      {/* Grade badge */}
      <div className="flex items-center gap-2">
        <span
          className={`text-xs font-body font-semibold px-2.5 py-1 rounded-full ${
            totalScore >= 80
              ? "bg-success/15 text-success"
              : totalScore >= 60
              ? "bg-accent/15 text-accent"
              : "bg-destructive/15 text-destructive"
          }`}
        >
          {gradeLabel}
        </span>
      </div>

      {/* Category bars */}
      <div className="space-y-3">
        {categories.map((cat) => (
          <div key={cat.label}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-body text-foreground font-medium">{cat.label}</span>
              <span className="text-xs font-body text-muted-foreground">
                {cat.score}/{cat.maxScore}
              </span>
            </div>
            <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  cat.score / cat.maxScore >= 0.7
                    ? "bg-success"
                    : cat.score / cat.maxScore >= 0.5
                    ? "bg-accent"
                    : "bg-destructive"
                }`}
                style={{ width: `${(cat.score / cat.maxScore) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Tips */}
      {allTips.length > 0 && (
        <div className="pt-2 border-t border-border space-y-2">
          <h5 className="text-xs font-body font-semibold text-muted-foreground flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-accent" /> Improvement Tips
          </h5>
          {allTips.map((tip, i) => (
            <div key={i} className="flex items-start gap-2">
              <AlertTriangle className="w-3 h-3 text-accent mt-0.5 shrink-0" />
              <span className="text-xs font-body text-muted-foreground leading-relaxed">
                {tip}
              </span>
            </div>
          ))}
        </div>
      )}

      {totalScore >= 80 && (
        <div className="flex items-center gap-2 pt-2 border-t border-border">
          <CheckCircle2 className="w-4 h-4 text-success" />
          <span className="text-xs font-body text-success font-medium">
            Your cover letter is ready to send!
          </span>
        </div>
      )}
    </div>
  );
};

export default CoverLetterScore;