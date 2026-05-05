import { useState, useEffect } from "react";
import { LoginPage } from "./components/LoginPage";
import { DashboardLayout } from "./components/DashboardLayout";
import { useChecklistAuth } from "./hooks/useChecklistAuth";

export default function App() {
  const { user, loading } = useChecklistAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Sync login state with user auth state
  useEffect(() => {
    if (!loading) {
      setIsLoggedIn(!!user);
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
  }

  return <DashboardLayout onLogout={() => setIsLoggedIn(false)} />;
}