import { ParsedResume } from "@/lib/resumeParser";
import {
  User,
  Mail,
  Phone,
  Github,
  Shield,
  FileText,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from "lucide-react";

interface ResumeHealthDashboardProps {
  resume: ParsedResume;
}

interface HealthItem {
  label: string;
  icon: React.ReactNode;
  present: boolean;
  weight: number;
  tip: string;
}

const ResumeHealthDashboard = ({ resume }: ResumeHealthDashboardProps) => {
  const items: HealthItem[] = [
    { 
      label: "Full Name", 
      icon: <User className="w-3.5 h-3.5" />, 
      present: !!resume.name, 
      weight: 15, 
      tip: "Include your full name at the top of your resume" 
    },
    { 
      label: "Email Address", 
      icon: <Mail className="w-3.5 h-3.5" />, 
      present: !!resume.email, 
      weight: 15, 
      tip: "Add a professional email address" 
    },
    { 
      label: "Phone Number", 
      icon: <Phone className="w-3.5 h-3.5" />, 
      present: !!resume.phone, 
      weight: 10, 
      tip: "Include a contact phone number" 
    },
    { 
      label: "GitHub Profile", 
      icon: <Github className="w-3.5 h-3.5" />, 
      present: !!resume.github, 
      weight: 10, 
      tip: "Add your GitHub URL to showcase projects" 
    },
    { 
      label: "Technical Skills (3+)", 
      icon: <Shield className="w-3.5 h-3.5" />, 
      present: resume.skills.length >= 3, 
      weight: 25,  // slightly increased to compensate for removed items
      tip: "List at least 3 relevant technical skills" 
    },
    { 
      label: "Detailed Content (100+ words)", 
      icon: <FileText className="w-3.5 h-3.5" />, 
      present: resume.rawText.split(/\s+/).length >= 100, 
      weight: 25,  // slightly increased
      tip: "Provide more detail — aim for 100+ words" 
    },
  ];

  const totalHealth = items.reduce((sum, item) => sum + (item.present ? item.weight : 0), 0);
  const displayedScore = Math.min(100, totalHealth);
  const missingItems = items.filter((i) => !i.present);

  const healthColor =
    totalHealth >= 80 ? "text-success" : totalHealth >= 50 ? "text-accent" : "text-destructive";
  const healthLabel =
    totalHealth >= 80 ? "ATS Ready" : totalHealth >= 50 ? "Needs Improvement" : "Incomplete";
  const healthBg =
    totalHealth >= 80 ? "bg-success/15 text-success" : totalHealth >= 50 ? "bg-accent/15 text-accent" : "bg-destructive/15 text-destructive";

  // Keyword density
  const wordCount = resume.rawText.split(/\s+/).filter(Boolean).length;
  const skillDensity = wordCount > 0 ? ((resume.skills.length / wordCount) * 100).toFixed(1) : "0";

  return (
    <div className="p-5 rounded-xl bg-card shadow-soft border border-border space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider font-body flex items-center gap-2">
          <Shield className="w-4 h-4 text-accent" /> Resume Health
        </h4>
        <span className={`text-xs font-body font-semibold px-2.5 py-1 rounded-full ${healthBg}`}>
          {healthLabel}
        </span>
      </div>

      {/* Score circle */}
      <div className="flex items-center gap-5">
        <div className="relative w-20 h-20 shrink-0">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            <circle cx="50" cy="50" r="42" fill="none" className="stroke-secondary" strokeWidth="8" />
            <circle
              cx="50" cy="50" r="42"
              fill="none"
              className={displayedScore >= 80 ? "stroke-success" : totalHealth >= 50 ? "stroke-accent" : "stroke-destructive"}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${(displayedScore / 100) * 264} 264`}
              style={{ transition: "stroke-dasharray 1s ease" }}
            />
          </svg>
          <span className={`absolute inset-0 flex items-center justify-center text-lg font-display ${healthColor}`}>
            {displayedScore}%
          </span>
        </div>
        <div className="space-y-1.5">
          <div className="text-xs font-body text-muted-foreground">
            <span className="font-semibold text-foreground">{resume.skills.length}</span> skills detected
          </div>
          <div className="text-xs font-body text-muted-foreground">
            <span className="font-semibold text-foreground">{wordCount}</span> words total
          </div>
          <div className="text-xs font-body text-muted-foreground">
            <span className="font-semibold text-foreground">{skillDensity}%</span> keyword density
          </div>
        </div>
      </div>

      {/* Checklist */}
      <div className="space-y-1.5">
        {items.map((item) => (
          <div 
            key={item.label} 
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-body ${item.present ? "bg-success/5" : "bg-destructive/5"}`}
          >
            <span className={item.present ? "text-success" : "text-destructive"}>
              {item.present ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
            </span>
            <span className={item.present ? "text-foreground" : "text-muted-foreground"}>
              {item.icon}
            </span>
            <span className={`flex-1 ${item.present ? "text-foreground" : "text-muted-foreground"}`}>{item.label}</span>
            <span className="text-muted-foreground font-medium">+{item.weight}%</span>
          </div>
        ))}
      </div>

      {/* Missing tips */}
      {missingItems.length > 0 && (
        <div className="pt-2 border-t border-border space-y-1.5">
          <h5 className="text-xs font-body font-semibold text-muted-foreground flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-accent" /> To improve your score
          </h5>
          {missingItems.slice(0, 3).map((item) => (
            <p key={item.label} className="text-xs font-body text-muted-foreground pl-5">• {item.tip}</p>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResumeHealthDashboard;