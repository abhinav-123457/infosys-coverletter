import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { exportToPDF, exportToDOCX } from "@/lib/exportUtils";
import { Download, File, Copy, CheckCircle, Pencil, Eye } from "lucide-react";

interface CoverLetterPreviewProps {
  content: string;
  onEdit: (content: string) => void;
}

const CoverLetterPreview = ({ content, onEdit }: CoverLetterPreviewProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h3 className="text-2xl font-display text-foreground mb-2">Your Cover Letter</h3>
        <p className="text-muted-foreground font-body">Review, edit, and export your tailored cover letter.</p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl bg-card shadow-soft border border-border">
        <Button onClick={() => exportToPDF(content)} size="sm" className="gradient-hero text-primary-foreground hover:opacity-90">
          <Download className="w-3.5 h-3.5 mr-1.5" /> PDF
        </Button>
        <Button onClick={() => exportToDOCX(content)} variant="outline" size="sm">
          <File className="w-3.5 h-3.5 mr-1.5" /> DOCX
        </Button>
        <div className="w-px h-6 bg-border mx-1" />
        <Button variant="outline" size="sm" onClick={handleCopy}>
          {copied ? <CheckCircle className="w-3.5 h-3.5 mr-1.5 text-success" /> : <Copy className="w-3.5 h-3.5 mr-1.5" />}
          {copied ? "Copied" : "Copy"}
        </Button>
        <Button variant={isEditing ? "default" : "outline"} size="sm" onClick={() => setIsEditing(!isEditing)} className={isEditing ? "gradient-accent text-accent-foreground" : ""}>
          {isEditing ? <><Eye className="w-3.5 h-3.5 mr-1.5" /> Preview</> : <><Pencil className="w-3.5 h-3.5 mr-1.5" /> Edit</>}
        </Button>
      </div>

      {/* Content */}
      {isEditing ? (
        <Textarea
          value={content}
          onChange={(e) => onEdit(e.target.value)}
          className="min-h-[500px] font-body text-sm leading-relaxed bg-card"
        />
      ) : (
        <div className="relative">
          {/* Paper effect */}
          <div className="absolute inset-0 rounded-xl bg-card shadow-medium border border-border translate-x-1 translate-y-1 opacity-30" />
          <div className="relative p-10 rounded-xl bg-card shadow-medium border border-border">
            <div className="max-w-none space-y-0">
              {content.split("\n").map((line, i) => (
                <p key={i} className={`font-body text-[13px] leading-[1.8] text-card-foreground ${!line.trim() ? "h-5" : ""}`}>
                  {line || "\u00A0"}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoverLetterPreview;
