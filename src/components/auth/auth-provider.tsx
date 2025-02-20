import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/lib/store';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { setUser, setRoles, setUserRoles } = useAuthStore();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadUserData(session.user.id);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        await loadUserData(session.user.id);
        navigate('/dashboard');
      } else {
        navigate('/');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, setUser, setRoles, setUserRoles]);

  async function loadUserData(userId: string) {
    // Load roles
    const { data: roles } = await supabase
      .from('roles')
      .select('*');
    
    if (roles) {
      setRoles(roles);
    }

    // Load user roles
    const { data: userRoles } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', userId);
    
    if (userRoles) {
      setUserRoles(userRoles);
    }
  }

  return <>{children}</>;
}