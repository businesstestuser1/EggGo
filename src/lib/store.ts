import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { User } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

type Role = Database['public']['Tables']['roles']['Row'];
type UserRole = Database['public']['Tables']['user_roles']['Row'];

interface AuthState {
  user: User | null;
  roles: Role[];
  userRoles: UserRole[];
  setUser: (user: User | null) => void;
  setRoles: (roles: Role[]) => void;
  setUserRoles: (userRoles: UserRole[]) => void;
  hasRole: (roleName: string) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      roles: [],
      userRoles: [],
      setUser: (user) => set({ user }),
      setRoles: (roles) => set({ roles }),
      setUserRoles: (userRoles) => set({ userRoles }),
      hasRole: (roleName) => {
        const { roles, userRoles, user } = get();
        if (!user) return false;

        const role = roles.find((r) => r.name === roleName);
        if (!role) return false;

        return userRoles.some((ur) => ur.role_id === role.id && ur.user_id === user.id);
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);