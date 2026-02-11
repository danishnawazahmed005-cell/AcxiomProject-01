import { create } from 'zustand';

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  role: 'ADMIN' | 'VENDOR' | 'USER';
}

interface AuthStore {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  setUser: (user: AuthUser | null) => void;
  setToken: (token: string | null) => void;
  setIsLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isLoading: false,
  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  logout: () => set({ user: null, token: null }),
}));
