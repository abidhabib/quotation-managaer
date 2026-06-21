import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      
      login: (email, password) => {
        // Simulated login - in production, this would call an API
        const user = {
          id: '1',
          name: 'John Doe',
          email,
          company: 'Acme Inc',
          role: 'admin',
        };
        set({ user, isAuthenticated: true });
        return { success: true };
      },
      
      register: (data) => {
        const user = {
          id: generateId(),
          ...data,
          role: 'admin',
        };
        set({ user, isAuthenticated: true });
        return { success: true };
      },
      
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
      
      updateUser: (updates) => {
        set((state) => ({
          user: { ...state.user, ...updates },
        }));
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

const generateId = () => Math.random().toString(36).substring(2, 9);
