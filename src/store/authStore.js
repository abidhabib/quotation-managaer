import { create } from 'zustand';
import { STORAGE_KEYS, storage, generateId, isValidEmail, isValidPhone, defaultSettings } from '../utils/helpers';

export const useAuthStore = create((set, get) => ({
  user: storage.get(STORAGE_KEYS.CURRENT_USER),
  users: storage.get(STORAGE_KEYS.USERS) || [],
  isAuthenticated: !!storage.get(STORAGE_KEYS.CURRENT_USER),
  isLoading: false,
  error: null,

  // Register new user
  register: async (userData) => {
    set({ isLoading: true, error: null });
    
    try {
      const { email, password, name, company } = userData;
      
      // Validation
      if (!email || !password || !name) {
        throw new Error('Name, email and password are required');
      }
      
      if (!isValidEmail(email)) {
        throw new Error('Invalid email address');
      }
      
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }
      
      const users = get().users;
      
      // Check if email exists
      if (users.find(u => u.email === email)) {
        throw new Error('Email already registered');
      }
      
      // Create user
      const newUser = {
        id: generateId(),
        name,
        email,
        password, // In production, this would be hashed
        company: company || '',
        createdAt: new Date().toISOString(),
        profileImage: null,
      };
      
      // Save user
      const updatedUsers = [...users, newUser];
      storage.set(STORAGE_KEYS.USERS, updatedUsers);
      
      // Set as current user
      const { password: _, ...userWithoutPassword } = newUser;
      storage.set(STORAGE_KEYS.CURRENT_USER, userWithoutPassword);
      
      // Initialize company settings for new user
      const settings = storage.get(STORAGE_KEYS.SETTINGS) || {};
      if (!settings[newUser.id]) {
        settings[newUser.id] = { ...defaultSettings, companyName: company || '' };
        storage.set(STORAGE_KEYS.SETTINGS, settings);
      }
      
      set({ 
        user: userWithoutPassword, 
        users: updatedUsers,
        isAuthenticated: true,
        isLoading: false 
      });
      
      return { success: true };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Login
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    
    try {
      const users = get().users;
      const user = users.find(u => u.email === email && u.password === password);
      
      if (!user) {
        throw new Error('Invalid email or password');
      }
      
      const { password: _, ...userWithoutPassword } = user;
      storage.set(STORAGE_KEYS.CURRENT_USER, userWithoutPassword);
      
      set({ 
        user: userWithoutPassword, 
        isAuthenticated: true,
        isLoading: false 
      });
      
      return { success: true };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Logout
  logout: () => {
    storage.remove(STORAGE_KEYS.CURRENT_USER);
    set({ 
      user: null, 
      isAuthenticated: false,
      error: null 
    });
  },

  // Update profile
  updateProfile: async (updates) => {
    set({ isLoading: true, error: null });
    
    try {
      const currentUser = get().user;
      if (!currentUser) throw new Error('Not authenticated');
      
      const updatedUser = { ...currentUser, ...updates };
      storage.set(STORAGE_KEYS.CURRENT_USER, updatedUser);
      
      // Update in users array
      const users = get().users.map(u => 
        u.id === currentUser.id ? { ...u, ...updates } : u
      );
      storage.set(STORAGE_KEYS.USERS, users);
      
      set({ user: updatedUser, users, isLoading: false });
      return { success: true };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Clear error
  clearError: () => set({ error: null }),
}));
