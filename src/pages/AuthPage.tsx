import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Loader2, Lock, Mail, ArrowRight } from 'lucide-react';

export const AuthPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || "/admin";

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isSignUp) {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        console.error("Signup Error:", error);
        alert(`Registration failed: ${error.message}`);
      } else if (data.user) {
        alert("Registration submitted! Please wait for an admin to approve your account before signing in.");
        setIsSignUp(false);
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        console.error("Login Error:", error);
        alert(`Login failed: ${error.message}`);
      } else {
        navigate(from, { replace: true });
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background-dark flex items-center justify-center p-6 pt-32">
      <div className="w-full max-w-md bg-white/5 border border-white/10 p-8 md:p-12 space-y-8 rounded-sm">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
             <div className="w-16 h-16 bg-primary/20 flex items-center justify-center rounded-sm">
                <Lock className="w-8 h-8 text-primary" />
             </div>
          </div>
          <h1 className="text-white text-3xl font-black uppercase tracking-tight">Admin Portal</h1>
          <p className="text-slate-400 text-sm">
            {isSignUp ? "Create a new admin account" : "Sign in to manage listings"}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-6">
          <div className="space-y-2">
            <label className="text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <Mail className="w-3 h-3 text-primary" /> Email Address
            </label>
            <input 
              required
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@shrinsinfra.com" 
              className="w-full bg-transparent border-b border-white/30 py-4 text-white focus:outline-none focus:border-primary transition-colors" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <Lock className="w-3 h-3 text-primary" /> Password
            </label>
            <input 
              required
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" 
              className="w-full bg-transparent border-b border-white/30 py-4 text-white focus:outline-none focus:border-primary transition-colors" 
            />
          </div>

          <button 
            disabled={loading}
            className="w-full bg-primary text-black font-bold py-5 flex items-center justify-center gap-2 hover:bg-primary/90 transition-all uppercase tracking-widest disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>{isSignUp ? "Register Admin" : "Sign In"} <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </form>

        <div className="text-center pt-4">
          <button 
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-slate-500 text-xs uppercase font-bold tracking-widest hover:text-primary transition-colors"
          >
            {isSignUp ? "Already have an account? Sign In" : "Need to register? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
};
