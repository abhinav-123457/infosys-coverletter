import { ParsedResume } from "@/lib/resumeParser";
import { MatchResult } from "@/lib/skillMatcher";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Phone, Github, Linkedin, Globe, CheckCircle, XCircle, TrendingUp } from "lucide-react";

interface SkillAnalysisProps {
  resume: ParsedResume;
  matchResult: MatchResult;
}

const SkillAnalysis = ({ resume, matchResult }: SkillAnalysisProps) => {
  const scoreColor = matchResult.matchScore >= 70 ? "text-success" : matchResult.matchScore >= 40 ? "text-accent" : "text-destructive";

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h3 className="text-2xl font-display text-foreground mb-2 font-bold">Analysis Results</h3>
        <p className="text-muted-foreground font-body">Here's what we extracted from your resume and how it matches the job.</p>
      </div>

      {/* Contact Info */}
      <div className="p-5 rounded-xl bg-card shadow-soft border border-border">
        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 font-body">Extracted Contact & Profiles</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {resume.name && (
            <div className="flex items-center gap-2 text-sm font-body">
              <User className="w-4 h-4 text-accent" /> {resume.name}
            </div>
          )}
          {resume.email && (
            <div className="flex items-center gap-2 text-sm font-body">
              <Mail className="w-4 h-4 text-accent" /> {resume.email}
            </div>
          )}
          {resume.phone && (
            <div className="flex items-center gap-2 text-sm font-body">
              <Phone className="w-4 h-4 text-accent" /> {resume.phone}
            </div>
          )}
          {resume.github && (
            <div className="flex items-center gap-2 text-sm font-body">
              <Github className="w-4 h-4 text-accent" />
              <a href={`https://${resume.github}`} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                {resume.github}
              </a>
            </div>
          )}
          {resume.linkedin && (
            <div className="flex items-center gap-2 text-sm font-body">
              <Linkedin className="w-4 h-4 text-accent" />
              <a href={`https://${resume.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                {resume.linkedin}
              </a>
            </div>
          )}
          {resume.portfolio && (
            <div className="flex items-center gap-2 text-sm font-body">
              <Globe className="w-4 h-4 text-accent" />
              <a href={resume.portfolio} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline truncate">
                {resume.portfolio}
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Match Score */}
      <div className="p-5 rounded-xl bg-card shadow-soft border border-border">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider font-body">Skill Match Score</h4>
          <div className={`text-3xl font-display font-bold ${scoreColor}`}>
            {matchResult.matchScore}%
          </div>
        </div>
        <div className="w-full h-3 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full gradient-accent rounded-full transition-all duration-1000"
            style={{ width: `${matchResult.matchScore}%` }}
          />
        </div>
      </div>

      {/* Matched Skills */}
      <div className="p-5 rounded-xl bg-card shadow-soft border border-border">
        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 font-body flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-success" /> Matched Skills ({matchResult.matchedSkills.length})
        </h4>
        <div className="flex flex-wrap gap-2">
          {matchResult.matchedSkills.map((skill) => (
            <Badge key={skill} className="bg-success/10 text-success border-success/20 font-body">
              {skill}
            </Badge>
          ))}
          {matchResult.matchedSkills.length === 0 && (
            <p className="text-sm text-muted-foreground font-body">No direct skill matches found.</p>
          )}
        </div>
      </div>

      {/* Missing Skills */}
      {matchResult.unmatchedJobSkills.length > 0 && (
        <div className="p-5 rounded-xl bg-card shadow-soft border border-border">
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 font-body flex items-center gap-2">
            <XCircle className="w-4 h-4 text-destructive" /> Skills to Develop ({matchResult.unmatchedJobSkills.length})
          </h4>
          <div className="flex flex-wrap gap-2">
            {matchResult.unmatchedJobSkills.map((skill) => (
              <Badge key={skill} variant="outline" className="text-destructive border-destructive/20 font-body">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Additional Skills */}
      {matchResult.additionalCandidateSkills.length > 0 && (
        <div className="p-5 rounded-xl bg-card shadow-soft border border-border">
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 font-body flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-accent" /> Your Additional Skills
          </h4>
          <div className="flex flex-wrap gap-2">
            {matchResult.additionalCandidateSkills.map((skill) => (
              <Badge key={skill} variant="secondary" className="font-body">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillAnalysis;
