import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Plane, ShieldCheck, FileText, Github, AlertCircle, Loader2 } from "lucide-react";
import { supabaseClient } from "../../../supabaseClient";

interface LoginPageProps {
  onLogin: () => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Check if already logged in (OAuth callback)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabaseClient.auth.getSession();
        if (session?.user) {
          console.log("✅ Already logged in:", session.user.email);
          onLogin();
        }
      } catch (err) {
        console.error("Auth check error:", err);
      }
    };
    checkAuth();
  }, [onLogin]);

  const handleGitHubLogin = async () => {
    setError("");
    setIsLoading(true);

    try {
      const redirectUrl = import.meta.env.VITE_OAUTH_REDIRECT_URL || window.location.origin;
      console.log("🔗 GitHub login redirect URL:", redirectUrl);

      const { data, error } = await supabaseClient.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: false
        }
      });

      if (error) {
        console.error("❌ GitHub login error:", error);
        setError(error.message || "Erreur de connexion avec GitHub");
        setIsLoading(false);
      } else {
        console.log("✅ GitHub login initiated, redirecting...");
      }
    } catch (err) {
      console.error("❌ GitHub login exception:", err);
      setError(err instanceof Error ? err.message : "Une erreur est survenue lors de la connexion");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" />
        <div className="absolute top-40 right-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-150" />
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-300" />
      </div>

      <Card className="w-full max-w-md shadow-2xl border-0 backdrop-blur-sm bg-white/90 relative z-10">
        <CardHeader className="text-center space-y-6 pb-8">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl transform hover:scale-105 transition-transform duration-200">
            <Plane className="w-10 h-10 text-white" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Visa Checklist
            </CardTitle>
            <CardDescription className="text-base text-slate-600">
              Besançon — Suivi de demande
            </CardDescription>
          </div>

          {/* Feature highlights */}
          <div className="grid grid-cols-2 gap-3 pt-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-3 border border-blue-200">
              <FileText className="w-6 h-6 text-blue-600 mb-2 mx-auto" />
              <p className="text-xs font-semibold text-blue-900">Suivi complet</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-3 border border-purple-200">
              <ShieldCheck className="w-6 h-6 text-purple-600 mb-2 mx-auto" />
              <p className="text-xs font-semibold text-purple-900">Sécurisé</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pb-8">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}
          <Button
            onClick={handleGitHubLogin}
            disabled={isLoading}
            className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Connexion en cours...
              </>
            ) : (
              <>
                <Github className="w-5 h-5 mr-2" />
                Se connecter avec GitHub
              </>
            )}
          </Button>
          <p className="text-xs text-center text-slate-500">
            Accès sécurisé et synchronisé via Supabase
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
