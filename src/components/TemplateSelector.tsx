import { TEMPLATES, TemplateInfo } from "@/lib/coverLetterGenerator";
import { Briefcase, Code, Palette, RefreshCw, Crown, GraduationCap, Check } from "lucide-react";

interface TemplateSelectorProps {
  selectedId: string;
  onSelect: (id: string) => void;
}

const iconMap: Record<string, React.ReactNode> = {
  Briefcase: <Briefcase className="w-5 h-5" />,
  Code: <Code className="w-5 h-5" />,
  Palette: <Palette className="w-5 h-5" />,
  RefreshCw: <RefreshCw className="w-5 h-5" />,
  Crown: <Crown className="w-5 h-5" />,
  GraduationCap: <GraduationCap className="w-5 h-5" />,
};

const TemplateSelector = ({ selectedId, onSelect }: TemplateSelectorProps) => {
  return (
    <div className="space-y-4 animate-fade-in">
      <div>
        <h3 className="text-2xl font-display text-foreground mb-2">Choose a Template</h3>
        <p className="text-muted-foreground font-body">Select the style that best fits the role you're applying for.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {TEMPLATES.map((t) => {
          const isSelected = selectedId === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onSelect(t.id)}
              className={`relative text-left p-5 rounded-xl border-2 transition-all duration-200 ${
                isSelected
                  ? "border-accent bg-accent/5 shadow-accent"
                  : "border-border bg-card hover:border-accent/40 hover:shadow-soft"
              }`}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 w-6 h-6 rounded-full gradient-accent flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 text-accent-foreground" />
                </div>
              )}
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${isSelected ? "gradient-accent text-accent-foreground" : "bg-secondary text-muted-foreground"}`}>
                {iconMap[t.icon]}
              </div>
              <h4 className="font-body font-semibold text-foreground text-sm mb-1">{t.name}</h4>
              <p className="text-xs text-muted-foreground font-body leading-relaxed mb-3">{t.description}</p>
              <div className="flex flex-wrap gap-1.5">
                {t.bestFor.map((tag) => (
                  <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground font-body font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TemplateSelector;
