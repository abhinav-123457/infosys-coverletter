import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Briefcase,
  BarChart3,
  Palette,
  Download,
  ArrowRight,
  ArrowLeft,
  X,
  Sparkles,
  Upload,
  Target,
  Zap,
  Shield,
  CheckCircle2,
} from "lucide-react";

interface TutorialStep {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
  features: { icon: React.ReactNode; text: string }[];
  illustration: React.ReactNode;
}

const STEPS: TutorialStep[] = [
  {
    icon: <Sparkles className="w-5 h-5" />,
    title: "Welcome to Resume Forge",
    subtitle: "Your intelligent cover letter forge",
    description:
      "Resume Forge analyses your resume and the job description to generate tailored, professional cover letters in seconds. Supports PDF, DOCX & TXT formats.",
    features: [
      { icon: <Zap className="w-4 h-4" />, text: "Smart skill matching & analysis" },
      { icon: <Palette className="w-4 h-4" />, text: "6 professional templates for any role" },
      { icon: <Shield className="w-4 h-4" />, text: "100% private — data stays on your device" },
      { icon: <Download className="w-4 h-4" />, text: "Export to PDF or DOCX instantly" },
    ],
    illustration: (
      <div className="relative w-full h-48 flex items-center justify-center">
        <div className="absolute w-24 h-24 rounded-2xl gradient-hero opacity-20 animate-pulse" />
        <div className="relative w-20 h-20 rounded-2xl gradient-accent flex items-center justify-center shadow-accent">
          <FileText className="w-10 h-10 text-accent-foreground" />
        </div>
      </div>
    ),
  },
  {
    icon: <Upload className="w-5 h-5" />,
    title: "Step 1: Upload Your Resume",
    subtitle: "PDF, DOCX, or TXT — or paste text",
    description:
      "Start by uploading your resume in any format (PDF, DOCX, TXT), or paste the text directly. Our parser automatically extracts your contact info, skills, GitHub, LinkedIn profiles & portfolio links.",
    features: [
      { icon: <FileText className="w-4 h-4" />, text: "PDF, DOCX & TXT file parsing" },
      { icon: <CheckCircle2 className="w-4 h-4" />, text: "Auto-detects name, email & phone" },
      { icon: <CheckCircle2 className="w-4 h-4" />, text: "Finds GitHub & LinkedIn profiles" },
      { icon: <CheckCircle2 className="w-4 h-4" />, text: "Extracts technical & soft skills" },
    ],
    illustration: (
      <div className="relative w-full h-48 flex items-center justify-center gap-4">
        <div className="w-32 h-40 rounded-lg border-2 border-dashed border-accent/40 flex flex-col items-center justify-center gap-2 bg-accent/5">
          <Upload className="w-8 h-8 text-accent" />
          <span className="text-xs font-body text-muted-foreground">Drop PDF</span>
        </div>
        <ArrowRight className="w-5 h-5 text-muted-foreground" />
        <div className="space-y-2">
          {["Name", "Email", "Skills"].map((label) => (
            <div key={label} className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-card border border-border">
              <CheckCircle2 className="w-3 h-3 text-accent" />
              <span className="text-xs font-body text-foreground">{label}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    icon: <Briefcase className="w-5 h-5" />,
    title: "Step 2: Enter Job Details",
    subtitle: "Paste the job description",
    description:
      "Enter the job title, company name, and paste the full job description. CoverCraft will extract required skills and qualifications automatically.",
    features: [
      { icon: <Target className="w-4 h-4" />, text: "Extracts required skills from JD" },
      { icon: <CheckCircle2 className="w-4 h-4" />, text: "Identifies key qualifications" },
      { icon: <CheckCircle2 className="w-4 h-4" />, text: "Captures industry-specific terms" },
      { icon: <CheckCircle2 className="w-4 h-4" />, text: "Works for any role or industry" },
    ],
    illustration: (
      <div className="relative w-full h-48 flex items-center justify-center">
        <div className="w-56 rounded-lg bg-card border border-border p-4 space-y-3 shadow-soft">
          <div className="h-3 w-32 rounded bg-foreground/10" />
          <div className="h-3 w-24 rounded bg-foreground/10" />
          <div className="h-16 w-full rounded bg-accent/10 border border-accent/20 flex items-center justify-center">
            <span className="text-xs text-accent font-body font-medium">Job Description</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    icon: <BarChart3 className="w-5 h-5" />,
    title: "Step 3: Skill Analysis",
    subtitle: "See how your profile matches",
    description:
      "View a detailed breakdown of how your skills match the job requirements. See matched skills, missing skills, and your overall match score at a glance.",
    features: [
      { icon: <BarChart3 className="w-4 h-4" />, text: "Visual match score percentage" },
      { icon: <CheckCircle2 className="w-4 h-4" />, text: "Matched skills highlighted" },
      { icon: <CheckCircle2 className="w-4 h-4" />, text: "Gap analysis for improvement" },
      { icon: <CheckCircle2 className="w-4 h-4" />, text: "Prioritised relevance ranking" },
    ],
    illustration: (
      <div className="relative w-full h-48 flex items-center justify-center">
        <div className="w-56 rounded-lg bg-card border border-border p-4 space-y-3 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-body text-muted-foreground">Match Score</span>
            <span className="text-sm font-body font-bold text-accent">78%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-secondary">
            <div className="h-full w-[78%] rounded-full gradient-accent" />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {["React", "TypeScript", "Node.js"].map((s) => (
              <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-accent/15 text-accent font-body font-medium">{s}</span>
            ))}
            {["Go"].map((s) => (
              <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-destructive/15 text-destructive font-body font-medium">{s}</span>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    icon: <Palette className="w-5 h-5" />,
    title: "Step 4: Choose a Template",
    subtitle: "6 styles for every situation",
    description:
      "Pick from Professional Classic, Technical Expert, Creative & Bold, Career Changer, Executive Leadership, or Fresh Graduate templates — each optimised for different roles.",
    features: [
      { icon: <Briefcase className="w-4 h-4" />, text: "Professional & Technical styles" },
      { icon: <Sparkles className="w-4 h-4" />, text: "Creative & Executive options" },
      { icon: <CheckCircle2 className="w-4 h-4" />, text: "Career changer template" },
      { icon: <CheckCircle2 className="w-4 h-4" />, text: "Fresh graduate template" },
    ],
    illustration: (
      <div className="relative w-full h-48 flex items-center justify-center gap-3">
        {[
          { label: "Professional", active: true },
          { label: "Technical", active: false },
          { label: "Creative", active: false },
        ].map((t) => (
          <div
            key={t.label}
            className={`w-16 h-24 rounded-lg border-2 flex flex-col items-center justify-center gap-1 transition-all ${
              t.active ? "border-accent bg-accent/10 shadow-accent" : "border-border bg-card"
            }`}
          >
            <FileText className={`w-5 h-5 ${t.active ? "text-accent" : "text-muted-foreground"}`} />
            <span className={`text-[9px] font-body font-medium ${t.active ? "text-accent" : "text-muted-foreground"}`}>{t.label}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: <Download className="w-5 h-5" />,
    title: "Step 5: Review & Export",
    subtitle: "Edit, copy, or download",
    description:
      "Review and edit your generated cover letter inline. When you're happy, export it as a polished PDF or DOCX document, or simply copy it to your clipboard.",
    features: [
      { icon: <FileText className="w-4 h-4" />, text: "Inline editing with live preview" },
      { icon: <Download className="w-4 h-4" />, text: "Export as PDF or DOCX" },
      { icon: <CheckCircle2 className="w-4 h-4" />, text: "One-click clipboard copy" },
      { icon: <CheckCircle2 className="w-4 h-4" />, text: "Start new letters anytime" },
    ],
    illustration: (
      <div className="relative w-full h-48 flex items-center justify-center">
        <div className="w-56 rounded-lg bg-card border border-border shadow-soft overflow-hidden">
          <div className="px-3 py-2 border-b border-border flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-destructive/60" />
            <div className="w-2 h-2 rounded-full bg-warning/60" />
            <div className="w-2 h-2 rounded-full bg-success/60" />
          </div>
          <div className="p-3 space-y-2">
            <div className="h-2 w-full rounded bg-foreground/10" />
            <div className="h-2 w-3/4 rounded bg-foreground/10" />
            <div className="h-2 w-5/6 rounded bg-foreground/10" />
            <div className="h-2 w-2/3 rounded bg-foreground/10" />
          </div>
          <div className="px-3 py-2 border-t border-border flex gap-2">
            <div className="h-6 w-14 rounded gradient-accent" />
            <div className="h-6 w-14 rounded bg-secondary" />
          </div>
        </div>
      </div>
    ),
  },
];

interface InteractiveTutorialProps {
  onComplete: () => void;
}

const InteractiveTutorial = ({ onComplete }: InteractiveTutorialProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const step = STEPS[currentStep];
  const isLast = currentStep === STEPS.length - 1;
  const isFirst = currentStep === 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg mx-4 rounded-2xl bg-card border border-border shadow-medium overflow-hidden">
        {/* Close button */}
        <button
          onClick={onComplete}
          className="absolute top-4 right-4 z-10 p-1.5 rounded-lg hover:bg-secondary transition-colors"
          aria-label="Skip tutorial"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>

        {/* Progress bar */}
        <div className="flex gap-1 px-6 pt-5">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                i <= currentStep ? "gradient-accent" : "bg-secondary"
              }`}
            />
          ))}
        </div>

        {/* Step badge */}
        <div className="px-6 pt-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-body font-semibold">
            {step.icon}
            {isFirst ? "Getting Started" : `Step ${currentStep} of ${STEPS.length - 1}`}
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pt-3 pb-2">
          <h2 className="text-xl font-display text-foreground">{step.title}</h2>
          <p className="text-sm text-accent font-body font-medium mt-0.5">{step.subtitle}</p>
          <p className="text-sm text-muted-foreground font-body mt-3 leading-relaxed">{step.description}</p>
        </div>

        {/* Illustration */}
        <div className="px-6">{step.illustration}</div>

        {/* Features */}
        <div className="px-6 pb-4">
          <div className="grid grid-cols-2 gap-2">
            {step.features.map((f, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/50">
                <span className="text-accent">{f.icon}</span>
                <span className="text-xs font-body text-foreground">{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="px-6 pb-6 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentStep((s) => s - 1)}
            disabled={isFirst}
            className="font-body"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>

          <div className="flex gap-2">
            {!isLast && (
              <Button variant="ghost" size="sm" onClick={onComplete} className="text-muted-foreground font-body">
                Skip
              </Button>
            )}
            <Button
              size="sm"
              onClick={() => (isLast ? onComplete() : setCurrentStep((s) => s + 1))}
              className={isLast ? "gradient-accent text-accent-foreground shadow-accent font-body" : "gradient-hero text-primary-foreground font-body"}
            >
              {isLast ? (
                <>
                  Get Started <Sparkles className="w-4 h-4 ml-1" />
                </>
              ) : (
                <>
                  Next <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveTutorial;
