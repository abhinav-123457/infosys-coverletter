import { useState, useCallback } from "react";
import { Upload, FileText, CheckCircle, FileType } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { extractTextFromPDF, extractTextFromTXT, extractTextFromDOCX } from "@/lib/resumeParser";

interface ResumeUploadProps {
  onTextExtracted: (text: string) => void;
  resumeText: string;
}

const ACCEPTED_TYPES: Record<string, string> = {
  "application/pdf": "PDF",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "DOCX",
  "text/plain": "TXT",
};

const ResumeUpload = ({ onTextExtracted, resumeText }: ResumeUploadProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [mode, setMode] = useState<"upload" | "paste">("upload");

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.split(".").pop()?.toLowerCase();
    const isValid = file.type in ACCEPTED_TYPES || ["pdf", "docx", "txt", "doc"].includes(ext || "");

    if (!isValid) {
      alert("Please upload a PDF, DOCX, or TXT file.");
      return;
    }

    setIsLoading(true);
    setFileName(file.name);
    try {
      let text = "";
      if (file.type === "application/pdf" || ext === "pdf") {
        text = await extractTextFromPDF(file);
      } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || ext === "docx") {
        text = await extractTextFromDOCX(file);
      } else {
        text = await extractTextFromTXT(file);
      }
      onTextExtracted(text);
    } catch (err) {
      console.error("File extraction failed:", err);
      alert("Failed to extract text. Please try pasting your resume instead.");
    } finally {
      setIsLoading(false);
    }
  }, [onTextExtracted]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h3 className="text-2xl font-display text-foreground mb-2">Upload Your Resume</h3>
        <p className="text-muted-foreground font-body">Upload a PDF, DOCX, or TXT file — or paste your resume text to extract skills, profiles & experience.</p>
      </div>

      <div className="flex gap-2">
        <Button
          variant={mode === "upload" ? "default" : "outline"}
          size="sm"
          onClick={() => setMode("upload")}
          className={mode === "upload" ? "gradient-hero text-primary-foreground" : ""}
        >
          <Upload className="w-4 h-4 mr-1.5" /> Upload File
        </Button>
        <Button
          variant={mode === "paste" ? "default" : "outline"}
          size="sm"
          onClick={() => setMode("paste")}
          className={mode === "paste" ? "gradient-hero text-primary-foreground" : ""}
        >
          <FileText className="w-4 h-4 mr-1.5" /> Paste Text
        </Button>
      </div>

      {mode === "upload" ? (
        <label className="relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-accent transition-colors bg-card">
          <input
            type="file"
            accept=".pdf,.docx,.txt,.doc"
            onChange={handleFileUpload}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
          {isLoading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-muted-foreground font-body">Extracting text...</span>
            </div>
          ) : fileName && resumeText ? (
            <div className="flex flex-col items-center gap-2">
              <CheckCircle className="w-8 h-8 text-success" />
              <span className="text-sm font-medium text-foreground font-body">{fileName}</span>
              <span className="text-xs text-muted-foreground font-body">Resume extracted successfully</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                <Upload className="w-6 h-6 text-accent" />
              </div>
              <span className="text-sm text-muted-foreground font-body">
                Drop your file here or click to upload
              </span>
              <div className="flex gap-2">
                {["PDF", "DOCX", "TXT"].map((fmt) => (
                  <span key={fmt} className="px-2 py-0.5 rounded text-[10px] font-semibold font-body bg-secondary text-muted-foreground">
                    {fmt}
                  </span>
                ))}
              </div>
            </div>
          )}
        </label>
      ) : (
        <Textarea
          value={resumeText}
          onChange={(e) => onTextExtracted(e.target.value)}
          placeholder="Paste your full resume text here..."
          className="min-h-[200px] font-body text-sm"
        />
      )}

      {resumeText && (
        <div className="p-4 rounded-xl bg-success/10 border border-success/20">
          <p className="text-sm text-success font-medium font-body flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Resume content loaded — {resumeText.split(/\s+/).length} words extracted
          </p>
        </div>
      )}
    </div>
  );
};

export default ResumeUpload;
