import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

const AUTHORIZED_ADMINS = [
  'info@shrinsinfra.com',
  'shrinsinframarketing@gmail.com',
  'admin@shrinsinfra.com' // Keeping placeholder just in case
];

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user?.email) {
        const userEmail = session.user.email.toLowerCase();
        const isMasterAdmin = AUTHORIZED_ADMINS.includes(userEmail);
        
        // 1. Check if they are a hardcoded master admin
        if (isMasterAdmin) {
          setAuthenticated(true);
          setAuthorized(true);
          setLoading(false);
          return;
        }

        // 2. Otherwise check the profiles table for approval
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('is_approved')
          .eq('id', session.user.id)
          .single();

        if (profileError || !profile?.is_approved) {
          // If authenticated but not approved, sign them out
          await supabase.auth.signOut();
          setAuthenticated(false);
          setAuthorized(false);
          alert(profileError ? "Error verifying account." : "Access Denied: Your account is pending admin approval.");
        } else {
          setAuthenticated(true);
          setAuthorized(true);
        }
      } else {
        setAuthenticated(false);
        setAuthorized(false);
      }
      
      setLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user?.email) {
        const userEmail = session.user.email.toLowerCase();
        if (AUTHORIZED_ADMINS.includes(userEmail)) {
          setAuthenticated(true);
          setAuthorized(true);
        } else {
          // Check approval for non-master admins
          const { data: profile } = await supabase
            .from('profiles')
            .select('is_approved')
            .eq('id', session.user.id)
            .single();

          if (profile?.is_approved) {
            setAuthenticated(true);
            setAuthorized(true);
          } else {
            await supabase.auth.signOut();
            setAuthenticated(false);
            setAuthorized(false);
          }
        }
      } else {
        setAuthenticated(false);
        setAuthorized(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background-dark">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (!authenticated || !authorized) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
