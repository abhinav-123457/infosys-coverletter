import { useState, useEffect } from "react";
import { getSession, User } from "@/lib/auth";
import AuthForm from "@/components/AuthForm";
import Generator from "@/pages/Generator";

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [forceTourOnLoad, setForceTourOnLoad] = useState(false);

  useEffect(() => {
    const sessionUser = getSession();
    setUser(sessionUser);
    setLoading(false);
  }, []); // only on mount

  const handleAuthSuccess = (mode: "signup" | "signin") => {
    const newUser = getSession();
    setUser(newUser);
    setForceTourOnLoad(mode === "signup");
  };

  const handleLogout = () => {
    setUser(null);
    setForceTourOnLoad(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <AuthForm onSuccess={handleAuthSuccess} />;
  }

  return <Generator user={user} onLogout={handleLogout} forceTourOnLoad={forceTourOnLoad} />;
};

export default Index;