import { useState } from "react";
import { signIn, signUp } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, ArrowRight, Shield, Zap, BarChart3, Sparkles } from "lucide-react";

interface AuthFormProps {
  onSuccess: (mode: "signup" | "signin") => void;
}

const features = [
  { icon: <Zap className="w-5 h-5" />, title: "Smart Parsing", desc: "Extracts skills, LinkedIn, GitHub & contact info from any resume format" },
  { icon: <BarChart3 className="w-5 h-5" />, title: "Skill Matching", desc: "Scores your resume against any job description instantly" },
  { icon: <Sparkles className="w-5 h-5" />, title: "Multi-Format", desc: "Upload PDF, DOCX, or TXT — we handle them all" },
  { icon: <Shield className="w-5 h-5" />, title: "100% Private", desc: "All data stays on your device — nothing uploaded" },
];

const AuthForm = ({ onSuccess }: AuthFormProps) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (isSignUp) {
      if (!name.trim()) { setError("Please enter your name."); return; }
      const result = signUp(name.trim(), email.trim(), password);
      if (result.success) onSuccess("signup");
      else setError(result.error || "Sign up failed.");
    } else {
      const result = signIn(email.trim(), password);
      if (result.success) onSuccess("signin");
      else setError(result.error || "Sign in failed.");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left — branding panel */}
      <div className="hidden lg:flex lg:w-[55%] gradient-hero relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 right-20 w-72 h-72 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute bottom-20 left-10 w-56 h-56 rounded-full bg-accent/8 blur-2xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-accent/5" />

        <div className="relative z-10 flex flex-col justify-center px-16 py-12 w-full">
          <div className="max-w-lg">
            <div className="inline-flex items-center gap-2.5 mb-10">
              <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center glow-accent">
                <FileText className="w-5 h-5 text-accent" />
              </div>
              <span className="text-xl font-display text-accent-foreground tracking-tight font-bold">Resume Forge</span>
            </div>

            <h1 className="text-5xl font-display text-accent-foreground leading-tight mb-6 font-extrabold">
              Cover letters that<br />
              <span className="text-gradient">land interviews.</span>
            </h1>

            <p className="text-lg text-accent-foreground/60 font-body leading-relaxed mb-12 max-w-md">
              Upload your resume, paste a job description, and get a tailored cover letter in seconds — powered by intelligent skill matching.
            </p>

            <div className="space-y-5">
              {features.map((f, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent shrink-0">
                    {f.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-accent-foreground font-body">{f.title}</h3>
                    <p className="text-sm text-accent-foreground/50 font-body">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right — auth form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2.5 mb-10">
            <div className="w-9 h-9 rounded-xl gradient-hero flex items-center justify-center glow-accent">
              <FileText className="w-4.5 h-4.5 text-accent" />
            </div>
            <span className="text-xl font-display text-foreground tracking-tight font-bold">Resume Forge</span>
          </div>

          <h2 className="text-3xl font-display text-foreground mb-1.5 font-bold">
            {isSignUp ? "Create account" : "Welcome back"}
          </h2>
          <p className="text-muted-foreground mb-8 font-body text-sm">
            {isSignUp ? "Start generating professional cover letters" : "Sign in to continue where you left off"}
          </p>

          {error && (
            <div className="mb-5 p-3 rounded-lg bg-destructive/10 text-destructive text-sm font-body border border-destructive/20">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <Label htmlFor="name" className="font-body text-xs font-semibold uppercase tracking-wider text-muted-foreground">Full Name</Label>
                <Input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" className="mt-1.5 h-11" required />
              </div>
            )}
            <div>
              <Label htmlFor="email" className="font-body text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="mt-1.5 h-11" required />
            </div>
            <div>
              <Label htmlFor="password" className="font-body text-xs font-semibold uppercase tracking-wider text-muted-foreground">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="mt-1.5 h-11" required minLength={6} />
            </div>
            <Button type="submit" className="w-full h-11 gradient-hero text-accent-foreground hover:opacity-90 transition-opacity font-body font-semibold text-sm glow-accent">
              {isSignUp ? "Create Account" : "Sign In"}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-border text-center">
            <p className="text-sm text-muted-foreground font-body">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                onClick={() => { setIsSignUp(!isSignUp); setError(""); }}
                className="text-accent font-semibold hover:underline"
              >
                {isSignUp ? "Sign in" : "Sign up"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
