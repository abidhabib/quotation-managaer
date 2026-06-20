import { create } from 'zustand';
import { STORAGE_KEYS, storage, generateId, defaultSettings } from '../utils/helpers';

const getUserId = () => {
  const user = storage.get(STORAGE_KEYS.CURRENT_USER);
  return user?.id;
};

export const useSettingsStore = create((set, get) => ({
  settings: null,
  theme: storage.get(STORAGE_KEYS.THEME) || 'light',
  isLoading: false,
  error: null,

  // Initialize settings
  initialize: () => {
    const userId = getUserId();
    if (!userId) return;
    
    const allSettings = storage.get(STORAGE_KEYS.SETTINGS) || {};
    const userSettings = allSettings[userId] || { ...defaultSettings };
    set({ settings: userSettings });
    
    // Apply theme
    const theme = userSettings.theme || 'light';
    document.documentElement.setAttribute('data-theme', theme);
    set({ theme });
  },

  // Get settings
  getSettings: () => {
    const userId = getUserId();
    if (!userId) return null;
    
    const allSettings = storage.get(STORAGE_KEYS.SETTINGS) || {};
    return allSettings[userId] || { ...defaultSettings };
  },

  // Update settings
  updateSettings: async (updates) => {
    set({ isLoading: true, error: null });
    
    try {
      const userId = getUserId();
      if (!userId) throw new Error('Not authenticated');
      
      const allSettings = storage.get(STORAGE_KEYS.SETTINGS) || {};
      const currentSettings = allSettings[userId] || { ...defaultSettings };
      
      const updatedSettings = {
        ...currentSettings,
        ...updates,
      };
      
      allSettings[userId] = updatedSettings;
      storage.set(STORAGE_KEYS.SETTINGS, allSettings);
      
      // Apply theme if changed
      if (updates.theme) {
        document.documentElement.setAttribute('data-theme', updates.theme);
        set({ theme: updates.theme });
        storage.set(STORAGE_KEYS.THEME, updates.theme);
      }
      
      set({ 
        settings: updatedSettings,
        isLoading: false 
      });
      
      return { success: true, settings: updatedSettings };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Set theme
  setTheme: (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    storage.set(STORAGE_KEYS.THEME, theme);
    set({ theme });
    
    // Also update in settings
    const userId = getUserId();
    if (userId) {
      const allSettings = storage.get(STORAGE_KEYS.SETTINGS) || {};
      if (allSettings[userId]) {
        allSettings[userId].theme = theme;
        storage.set(STORAGE_KEYS.SETTINGS, allSettings);
        set({ settings: { ...get().settings, theme } });
      }
    }
  },

  // Upload logo (convert to base64 for localStorage)
  uploadLogo: async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target.result;
        get().updateSettings({ companyLogo: base64 });
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },

  // Reset settings
  resetSettings: async () => {
    const userId = getUserId();
    if (!userId) return;
    
    const allSettings = storage.get(STORAGE_KEYS.SETTINGS) || {};
    allSettings[userId] = { ...defaultSettings };
    storage.set(STORAGE_KEYS.SETTINGS, allSettings);
    
    set({ settings: { ...defaultSettings } });
  },
}));

// Template definitions
export const templates = {
  luxury: {
    id: 'luxury',
    name: 'Luxury',
    description: 'Elegant design with ivory background and gold accents',
    colors: {
      primary: '#b08842',
      secondary: '#1a1612',
      accent: '#d4b876',
      background: '#f6f1e9',
    },
  },
  business: {
    id: 'business',
    name: 'Business',
    description: 'Clean corporate design with professional layout',
    colors: {
      primary: '#2563eb',
      secondary: '#0f172a',
      accent: '#3b82f6',
      background: '#ffffff',
    },
  },
  minimal: {
    id: 'minimal',
    name: 'Minimal',
    description: 'Simple and modern lightweight design',
    colors: {
      primary: '#171717',
      secondary: '#525252',
      accent: '#737373',
      background: '#ffffff',
    },
  },
  dark: {
    id: 'dark',
    name: 'Dark',
    description: 'Professional dark theme design',
    colors: {
      primary: '#3b82f6',
      secondary: '#f8fafc',
      accent: '#60a5fa',
      background: '#0f172a',
    },
  },
};
