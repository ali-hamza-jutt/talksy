import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  setUser: (user: User) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user:  null,
      token: null,
      setUser:  (user)  => set({ user }),
      clearUser: ()     => set({ user: null, token: null }),
    }),
    { name: 'talksy-auth' }
  )
);
