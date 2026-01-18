import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: number;
  email: string;
  name: string;
  role: 'CLIENT' | 'SUPPLIER' | 'ADMIN';
  phoneNumber: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: (user, token) => {
        set({ user, token });
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', token);
        }
      },
      logout: () => {
        set({ user: null, token: null });
        if (typeof window !== 'undefined') {
          localStorage.removeItem('teranga-auth-v2');
          localStorage.removeItem('token');
        }
      },
    }),
    {
      name: 'teranga-auth-v2',
    }
  )
);
