import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { signOut, User } from "@/lib/auth";
import { parseResumeText, ParsedResume } from "@/lib/resumeParser";
import { extractJobSkills, matchSkills, MatchResult } from "@/lib/skillMatcher";
import { generateCoverLetter } from "@/lib/coverLetterGenerator";
import { polishCoverLetter } from "@/lib/coverLetterPolisher";
import ResumeUpload from "@/components/ResumeUpload";
import SkillAnalysis from "@/components/SkillAnalysis";
import CoverLetterPreview from "@/components/CoverLetterPreview";
import TemplateSelector from "@/components/TemplateSelector";
import InteractiveTutorial from "@/components/InteractiveTutorial";
import SpotlightTour from "@/components/SpotlightTour";
import ResumeHealthDashboard from "@/components/ResumeHealthDashboard";
import ThemeToggle from "@/components/ThemeToggle";
import { FileText, ArrowRight, ArrowLeft, LogOut, Sparkles, Check, HelpCircle } from "lucide-react";

interface GeneratorProps {
  user: User;
  onLogout: () => void;
  forceTourOnLoad?: boolean;
}

const getTutorialKey = (email: string) => `resumeforge_tutorial_seen:${email.toLowerCase()}`;
const getTourKey = (email: string) => `resumeforge_tour_seen:${email.toLowerCase()}`;

const Generator = ({ user, onLogout, forceTourOnLoad = false }: GeneratorProps) => {
  const [step, setStep] = useState(0);
  const [resumeText, setResumeText] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [parsedResume, setParsedResume] = useState<ParsedResume | null>(null);
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [isPolishing, setIsPolishing] = useState(false);
  const [polishError, setPolishError] = useState<string | null>(null);
  const [templateId, setTemplateId] = useState("professional");
  const [showTutorial, setShowTutorial] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const tutorialKey = getTutorialKey(user.email);
  const tourKey = getTourKey(user.email);

  useEffect(() => {
    const tutorialSeen = localStorage.getItem(tutorialKey) === "true";
    const tourSeen = localStorage.getItem(tourKey) === "true";

    if (forceTourOnLoad && !tourSeen) {
      setShowTutorial(false);
      setShowTour(true);
      return;
    }

    if (!tutorialSeen) {
      setShowTutorial(true);
      return;
    }

    if (!tourSeen) {
      setShowTour(true);
    }
  }, [forceTourOnLoad, tutorialKey, tourKey]);

  const handleTutorialComplete = () => {
    setShowTutorial(false);
    localStorage.setItem(tutorialKey, "true");
    if (localStorage.getItem(tourKey) !== "true") {
      setTimeout(() => setShowTour(true), 400);
    }
  };

  const handleTourComplete = () => {
    setShowTour(false);
    localStorage.setItem(tourKey, "true");
  };

  const steps = ["Resume", "Job Details", "Analysis", "Template", "Cover Letter"];

  const handleAnalyze = () => {
    const parsed = parseResumeText(resumeText);
    setParsedResume(parsed);
    const jobSkills = extractJobSkills(jobDescription);
    const result = matchSkills(parsed.skills, jobSkills);
    setMatchResult(result);
    setStep(2);
  };

  const handleGenerate = async () => {
    if (!parsedResume || !matchResult) return;
    
    // Generate the initial cover letter using templates
    const draftLetter = generateCoverLetter({
      resume: parsedResume,
      jobTitle,
      companyName,
      jobDescription,
      matchResult,
      templateId,
    });
    
    setCoverLetter(draftLetter);
    setStep(4);
    setPolishError(null);
    
    // Attempt to polish the cover letter with LLM
    try {
      setIsPolishing(true);
      const result = await polishCoverLetter({
        draftLetter,
        jobDescription,
        resumeSkills: parsedResume.skills
      });
      
      if (result.success && result.polishedLetter !== draftLetter) {
        setCoverLetter(result.polishedLetter);
      } else if (result.error) {
        setPolishError(result.error);
      }
    } catch (error) {
      setPolishError('Polishing failed');
    } finally {
      setIsPolishing(false);
    }
  };

  const handleLogout = () => {
    signOut();
    onLogout();
  };

  return (
    <div className="min-h-screen bg-background">
      {showTutorial && <InteractiveTutorial onComplete={handleTutorialComplete} />}
      {showTour && <SpotlightTour onComplete={handleTourComplete} />}

      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-10">
        <div className="container max-w-5xl mx-auto flex items-center justify-between h-14 px-4">
          <div id="tour-logo" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg gradient-hero flex items-center justify-center glow-accent">
              <FileText className="w-4 h-4 text-accent" />
            </div>
            <span className="text-lg font-display text-foreground tracking-tight font-bold">Resume Forge</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div id="tour-user-badge" className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary mr-1">
              <div className="w-6 h-6 rounded-full gradient-accent flex items-center justify-center text-[10px] font-bold text-accent-foreground font-body">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm text-foreground font-body font-medium">{user.name}</span>
            </div>
            <ThemeToggle />
            <Button id="tour-help-btn" variant="ghost" size="icon" onClick={() => setShowTutorial(true)} className="h-8 w-8" title="View Tutorial">
              <HelpCircle className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout} className="h-8 w-8">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container max-w-5xl mx-auto px-4 py-8">
        {/* Step indicator */}
        <nav id="tour-step-indicator" className="flex items-center justify-center mb-10">
          <div className="flex items-center gap-1">
            {steps.map((label, i) => (
              <div key={label} className="flex items-center">
                <button
                  onClick={() => { if (i < step) setStep(i); }}
                  disabled={i > step}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold font-body transition-all duration-200 ${
                    i === step
                      ? "gradient-accent text-accent-foreground shadow-accent"
                      : i < step
                      ? "bg-accent/10 text-accent cursor-pointer hover:bg-accent/20"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {i < step ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] bg-current/10">
                      {i + 1}
                    </span>
                  )}
                  <span className="hidden sm:inline">{label}</span>
                </button>
                {i < steps.length - 1 && (
                  <div className={`w-6 h-px mx-1 ${i < step ? "bg-accent" : "bg-border"}`} />
                )}
              </div>
            ))}
          </div>
        </nav>

        {/* Step 0: Resume */}
        {step === 0 && (
          <div id="tour-resume-section" className="max-w-2xl mx-auto">
            <ResumeUpload resumeText={resumeText} onTextExtracted={setResumeText} />

            {resumeText.trim() && (
              <div className="mt-6 animate-fade-in">
                <ResumeHealthDashboard resume={parseResumeText(resumeText)} />
              </div>
            )}

            <div className="mt-8 flex justify-end">
              <Button
                onClick={() => setStep(1)}
                disabled={!resumeText.trim()}
                className="gradient-hero text-accent-foreground hover:opacity-90 px-6 glow-accent"
              >
                Next: Job Details <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 1: Job Details */}
        {step === 1 && (
          <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
            <div>
              <h3 className="text-2xl font-display text-foreground mb-2 font-bold">Job Details</h3>
              <p className="text-muted-foreground font-body">Provide the job information so we can match your profile against it.</p>
            </div>
            <div className="p-6 rounded-xl bg-card shadow-soft border border-border space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="font-body text-sm font-medium">Job Title</Label>
                  <Input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="e.g. Senior Frontend Developer" className="mt-1.5" />
                </div>
                <div>
                  <Label className="font-body text-sm font-medium">Company Name</Label>
                  <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="e.g. Acme Corp" className="mt-1.5" />
                </div>
              </div>
              <div>
                <Label className="font-body text-sm font-medium">Job Description</Label>
                <Textarea value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} placeholder="Paste the full job description here — we'll extract required skills automatically..." className="mt-1.5 min-h-[220px]" />
              </div>
            </div>
            <div className="flex justify-between pt-2">
              <Button variant="outline" onClick={() => setStep(0)}>
                <ArrowLeft className="mr-2 w-4 h-4" /> Back
              </Button>
              <Button onClick={handleAnalyze} disabled={!jobTitle.trim() || !companyName.trim() || !jobDescription.trim()} className="gradient-hero text-accent-foreground hover:opacity-90 px-6 glow-accent">
                Analyse Skills <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Analysis */}
        {step === 2 && parsedResume && matchResult && (
          <div className="max-w-2xl mx-auto">
            <SkillAnalysis resume={parsedResume} matchResult={matchResult} />
            <div className="mt-8 flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>
                <ArrowLeft className="mr-2 w-4 h-4" /> Back
              </Button>
              <Button onClick={() => setStep(3)} className="gradient-hero text-accent-foreground hover:opacity-90 px-6 glow-accent">
                Choose Template <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Template */}
        {step === 3 && (
          <div className="max-w-3xl mx-auto">
            <TemplateSelector selectedId={templateId} onSelect={setTemplateId} />
            <div className="mt-8 flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)}>
                <ArrowLeft className="mr-2 w-4 h-4" /> Back
              </Button>
              <Button onClick={handleGenerate} className="gradient-accent text-accent-foreground hover:opacity-90 shadow-accent px-6 glow-accent">
                <Sparkles className="mr-2 w-4 h-4" /> Generate Cover Letter
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Cover Letter Preview (no scoring) */}
        {step === 4 && coverLetter && (
          <div className="max-w-4xl mx-auto">
            {/* Polishing Status */}
            {isPolishing && (
              <div className="mb-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                    Polishing your cover letter with AI...
                  </span>
                </div>
              </div>
            )}
            
            {polishError && (
              <div className="mb-6 p-4 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
                <div className="flex items-start gap-3">
                  <div className="w-4 h-4 rounded-full bg-amber-500 mt-0.5"></div>
                  <div>
                    <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                      AI polishing unavailable
                    </p>
                    <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                      {polishError}. Using template-generated version.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <CoverLetterPreview content={coverLetter} onEdit={setCoverLetter} />

            <div className="mt-10 flex flex-col sm:flex-row justify-between gap-4">
              <Button variant="outline" onClick={() => setStep(3)}>
                <ArrowLeft className="mr-2 w-4 h-4" /> Back to Templates
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setStep(0);
                  setResumeText("");
                  setJobTitle("");
                  setCompanyName("");
                  setJobDescription("");
                  setParsedResume(null);
                  setMatchResult(null);
                  setCoverLetter("");
                  setTemplateId("professional");
                  setIsPolishing(false);
                  setPolishError(null);
                }}
              >
                Start New Letter
              </Button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-auto py-6">
        <div className="container max-w-5xl mx-auto px-4 text-center">
          <p className="text-xs text-muted-foreground font-body">
            Resume Forge — Intelligent cover letter generation. All data stored locally on your device.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Generator;