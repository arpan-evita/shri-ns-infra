import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

const SUPER_ADMINS = [
  'arpansadhu13@gmail.com',
  'shrinsinframarketing@gmail.com',
  'info@shrinsinfra.com'
];

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let mounted = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      
      console.log(`Auth event: ${event}`, session?.user?.email);

      try {
        if (session?.user?.email) {
          const userEmail = session.user.email.toLowerCase();
          const isSuperAdmin = SUPER_ADMINS.includes(userEmail);

          if (isSuperAdmin) {
            setAuthenticated(true);
            setAuthorized(true);
            setLoading(false);
            return;
          }

          // Check profiles for all other administrators
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('is_approved')
            .eq('id', session.user.id)
            .single();

          if (error || !profile?.is_approved) {
            console.warn("Unauthorized or unapproved access attempt.");
            setAuthenticated(false);
            setAuthorized(false);
            // We don't sign out automatically here to avoid loops, 
            // the Navigate below will take them to /auth
          } else {
            setAuthenticated(true);
            setAuthorized(true);
          }
        } else {
          setAuthenticated(false);
          setAuthorized(false);
        }
      } catch (err) {
        console.error("Auth listener error:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
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
