import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: (email, password) => {
        // Simulated login - replace with actual API call
        const user = {
          id: '1',
          name: 'Demo User',
          email: email,
          company: 'Demo Company',
          role: 'admin',
        };
        set({ user, isAuthenticated: true });
        return { success: true };
      },

      register: (data) => {
        const user = {
          id: Date.now().toString(),
          name: data.name,
          email: data.email,
          company: data.company,
          role: 'owner',
        };
        set({ user, isAuthenticated: true });
        return { success: true };
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      updateProfile: (updates) => {
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
