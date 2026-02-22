import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, X, Sparkles } from "lucide-react";

interface TourStep {
  targetId: string;
  title: string;
  description: string;
  position: "top" | "bottom" | "left" | "right";
}

const TOUR_STEPS: TourStep[] = [
  {
    targetId: "tour-logo",
    title: "Welcome to Resume Forge!",
    description: "Your intelligent cover letter forge. Upload any resume format and get tailored cover letters instantly.",
    position: "bottom",
  },
  {
    targetId: "tour-step-indicator",
    title: "Step Progress",
    description: "Track your progress through the 5-step workflow. Click on completed steps to go back and make changes.",
    position: "bottom",
  },
  {
    targetId: "tour-resume-section",
    title: "Resume Upload",
    description: "Upload a PDF, DOCX, or TXT file — or paste your resume text. We'll extract name, email, phone, GitHub, LinkedIn & portfolio automatically.",
    position: "top",
  },
  {
    targetId: "tour-theme-toggle",
    title: "Dark Mode",
    description: "Switch between light and dark themes for comfortable viewing anytime.",
    position: "bottom",
  },
  {
    targetId: "tour-help-btn",
    title: "Need Help?",
    description: "Click here anytime to replay the interactive tutorial with detailed feature explanations.",
    position: "bottom",
  },
  {
    targetId: "tour-user-badge",
    title: "Your Profile",
    description: "You're logged in! All your data is stored securely on your device — no cloud storage needed.",
    position: "bottom",
  },
];

interface SpotlightTourProps {
  onComplete: () => void;
}

const SpotlightTour = ({ onComplete }: SpotlightTourProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});
  const [spotlightStyle, setSpotlightStyle] = useState<React.CSSProperties>({});
  const [arrowClass, setArrowClass] = useState("");

  const positionTooltip = useCallback(() => {
    const step = TOUR_STEPS[currentStep];
    const el = document.getElementById(step.targetId);
    if (!el) {
      // Skip to next step if element not found
      if (currentStep < TOUR_STEPS.length - 1) {
        setCurrentStep((s) => s + 1);
      } else {
        onComplete();
      }
      return;
    }

    const rect = el.getBoundingClientRect();
    const padding = 8;

    setSpotlightStyle({
      top: rect.top - padding,
      left: rect.left - padding,
      width: rect.width + padding * 2,
      height: rect.height + padding * 2,
      borderRadius: "12px",
    });

    const tooltipWidth = 320;
    const tooltipOffset = 16;

    let style: React.CSSProperties = {};
    let arrow = "";

    switch (step.position) {
      case "bottom":
        style = {
          top: rect.bottom + tooltipOffset,
          left: Math.max(16, Math.min(rect.left + rect.width / 2 - tooltipWidth / 2, window.innerWidth - tooltipWidth - 16)),
        };
        arrow = "top";
        break;
      case "top":
        style = {
          bottom: window.innerHeight - rect.top + tooltipOffset,
          left: Math.max(16, Math.min(rect.left + rect.width / 2 - tooltipWidth / 2, window.innerWidth - tooltipWidth - 16)),
        };
        arrow = "bottom";
        break;
      case "left":
        style = {
          top: rect.top + rect.height / 2 - 60,
          right: window.innerWidth - rect.left + tooltipOffset,
        };
        arrow = "right";
        break;
      case "right":
        style = {
          top: rect.top + rect.height / 2 - 60,
          left: rect.right + tooltipOffset,
        };
        arrow = "left";
        break;
    }

    setTooltipStyle({ ...style, width: tooltipWidth });
    setArrowClass(arrow);
  }, [currentStep, onComplete]);

  useEffect(() => {
    positionTooltip();
    window.addEventListener("resize", positionTooltip);
    window.addEventListener("scroll", positionTooltip);
    return () => {
      window.removeEventListener("resize", positionTooltip);
      window.removeEventListener("scroll", positionTooltip);
    };
  }, [positionTooltip]);

  const step = TOUR_STEPS[currentStep];
  const isLast = currentStep === TOUR_STEPS.length - 1;

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Overlay with spotlight cutout */}
      <div className="absolute inset-0 bg-foreground/70 transition-all duration-300" />
      
      {/* Spotlight hole */}
      <div
        className="absolute border-2 border-accent shadow-accent bg-transparent transition-all duration-300 z-[101]"
        style={spotlightStyle}
      />
      
      {/* Mask pieces using box-shadow trick */}
      <svg className="absolute inset-0 w-full h-full z-[100] pointer-events-none">
        <defs>
          <mask id="spotlight-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            <rect
              x={spotlightStyle.left as number}
              y={spotlightStyle.top as number}
              width={spotlightStyle.width as number}
              height={spotlightStyle.height as number}
              rx="12"
              fill="black"
            />
          </mask>
        </defs>
        <rect x="0" y="0" width="100%" height="100%" fill="hsl(222 47% 11% / 0.7)" mask="url(#spotlight-mask)" />
      </svg>

      {/* Tooltip */}
      <div
        className="absolute z-[102] bg-card border border-border rounded-xl shadow-medium p-5 animate-fade-in"
        style={tooltipStyle}
      >
        {/* Arrow indicator */}
        {arrowClass === "top" && (
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 bg-card border-l border-t border-border" />
        )}
        {arrowClass === "bottom" && (
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 bg-card border-r border-b border-border" />
        )}

        {/* Close */}
        <button
          onClick={onComplete}
          className="absolute top-3 right-3 p-1 rounded-md hover:bg-secondary transition-colors"
        >
          <X className="w-3.5 h-3.5 text-muted-foreground" />
        </button>

        {/* Step counter */}
        <div className="flex items-center gap-1.5 mb-3">
          {TOUR_STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all ${
                i <= currentStep ? "gradient-accent" : "bg-secondary"
              }`}
            />
          ))}
        </div>

        <h3 className="text-sm font-display text-foreground mb-1">{step.title}</h3>
        <p className="text-xs text-muted-foreground font-body leading-relaxed mb-4">{step.description}</p>

        <div className="flex items-center justify-between">
          <span className="text-[10px] text-muted-foreground font-body">
            {currentStep + 1} / {TOUR_STEPS.length}
          </span>
          <div className="flex gap-2">
            {currentStep > 0 && (
              <Button variant="ghost" size="sm" onClick={() => setCurrentStep((s) => s - 1)} className="h-7 text-xs font-body">
                <ArrowLeft className="w-3 h-3 mr-1" /> Back
              </Button>
            )}
            <Button
              size="sm"
              onClick={() => (isLast ? onComplete() : setCurrentStep((s) => s + 1))}
              className={`h-7 text-xs font-body ${isLast ? "gradient-accent text-accent-foreground" : "gradient-hero text-primary-foreground"}`}
            >
              {isLast ? (
                <>
                  Start Building <Sparkles className="w-3 h-3 ml-1" />
                </>
              ) : (
                <>
                  Next <ArrowRight className="w-3 h-3 ml-1" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpotlightTour;
