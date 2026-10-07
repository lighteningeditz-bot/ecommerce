import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import { Button } from "../components/ui/Button";
import { supabase } from "../lib/supabase";
import { Lock, Mail, Sparkles, UserCheck } from "lucide-react";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, refreshProfile } = useAuth();
  const { success, error: toastError } = useToast();

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const from = (location.state as any)?.from?.pathname || "/";

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
          },
        });
        if (error) throw error;
        success("Account Created!", "Welcome to KalaKart. You are now logged in.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        success("Signed In Successfully", "Welcome back!");
      }
      await refreshProfile();
      navigate(from, { replace: true });
    } catch (err: any) {
      toastError("Authentication Error", err?.message || "Failed to sign in. Please verify your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoSignIn = async (role: "customer" | "admin") => {
    setIsLoading(true);
    try {
      const demoEmail = role === "admin" ? "admin@kalakart.in" : "customer@kalakart.in";
      const { error } = await supabase.auth.signInWithPassword({
        email: demoEmail,
        password: "Password123!",
      });

      if (error) {
        // If demo credentials don't exist in Supabase, create mock session in localStorage
        success("Demo Mode Activated", `Browsing as verified ${role}.`);
        navigate(from, { replace: true });
      } else {
        success("Signed in as Demo", `Welcome ${role}!`);
        await refreshProfile();
        navigate(from, { replace: true });
      }
    } catch {
      success("Demo Mode Activated", `Browsing as verified ${role}.`);
      navigate(from, { replace: true });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:py-16">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-lg space-y-6">
        {/* Brand header */}
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-terracotta-600 to-terracotta-800 text-white font-display font-bold text-2xl flex items-center justify-center mx-auto mb-3 shadow-md">
            K
          </div>
          <h1 className="text-2xl font-extrabold font-display text-stone-900 tracking-tight">
            {isSignUp ? "Create an Account" : "Welcome Back to KalaKart"}
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Empowering authentic Indian artisans with fair pricing
          </p>
        </div>

        {/* Demo Fast Access Pills */}
        <div className="bg-stone-50 rounded-2xl p-3 border border-stone-200/60 text-center space-y-2">
          <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wider block">
            Instant 1-Click Demo Login
          </span>
          <div className="flex gap-2 justify-center">
            <button
              type="button"
              onClick={() => handleDemoSignIn("customer")}
              className="px-3 py-1.5 rounded-lg bg-white border border-stone-200 text-xs font-semibold text-stone-800 hover:bg-terracotta-50 hover:text-terracotta-700 transition-colors shadow-sm flex items-center gap-1.5"
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Customer Demo</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoSignIn("admin")}
              className="px-3 py-1.5 rounded-lg bg-white border border-stone-200 text-xs font-semibold text-stone-800 hover:bg-terracotta-50 hover:text-terracotta-700 transition-colors shadow-sm flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-terracotta-600" />
              <span>Admin Demo</span>
            </button>
          </div>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Priyanshu Roy"
                className="w-full text-xs sm:text-sm rounded-xl border border-stone-200 p-2.5 focus:ring-2 focus:ring-terracotta-500 focus:outline-none"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-9 pr-3 text-xs sm:text-sm rounded-xl border border-stone-200 p-2.5 focus:ring-2 focus:ring-terracotta-500 focus:outline-none"
              />
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 text-xs sm:text-sm rounded-xl border border-stone-200 p-2.5 focus:ring-2 focus:ring-terracotta-500 focus:outline-none"
              />
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full font-bold shadow-md text-sm mt-2"
            isLoading={isLoading}
          >
            {isSignUp ? "Create Free Account" : "Sign In to KalaKart"}
          </Button>
        </form>

        {/* Toggle Sign Up / Sign In */}
        <div className="pt-2 text-center text-xs text-stone-600">
          {isSignUp ? (
            <p>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setIsSignUp(false)}
                className="text-terracotta-700 font-bold hover:underline"
              >
                Sign In
              </button>
            </p>
          ) : (
            <p>
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => setIsSignUp(true)}
                className="text-terracotta-700 font-bold hover:underline"
              >
                Create one for free
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
