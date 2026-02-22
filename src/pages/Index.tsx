import { useState, useEffect } from "react";
import { getSession, User } from "@/lib/auth";
import AuthForm from "@/components/AuthForm";
import Generator from "@/pages/Generator";

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(getSession());
    setLoading(false);
  }, []);

  const handleAuthSuccess = () => {
    setUser(getSession());
  };

  const handleLogout = () => {
    setUser(null);
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

  return <Generator user={user} onLogout={handleLogout} />;
};

export default Index;
