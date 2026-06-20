import { useEffect, useState } from 'react';

const THEME_KEY = 'quotation-saas-theme';

const themeStyles = {
  'light-business': {
    '--bg-primary': '#ffffff',
    '--bg-secondary': '#f8fafc',
    '--bg-hover': '#f1f5f9',
    '--text-primary': '#0f172a',
    '--text-secondary': '#475569',
    '--text-muted': '#94a3b8',
    '--border-color': '#e2e8f0',
    '--border-light': '#f1f5f9',
    '--primary': '#2563eb',
    '--primary-dark': '#1d4ed8',
    '--primary-light': '#dbeafe',
    '--secondary': '#64748b',
    '--success': '#10b981',
    '--success-dark': '#059669',
    '--success-light': '#d1fae5',
    '--warning': '#f59e0b',
    '--warning-dark': '#d97706',
    '--warning-light': '#fef3c7',
    '--danger': '#ef4444',
    '--danger-dark': '#dc2626',
    '--danger-light': '#fee2e2',
  },
  'dark-mode': {
    '--bg-primary': '#0f172a',
    '--bg-secondary': '#1e293b',
    '--bg-hover': '#334155',
    '--text-primary': '#f8fafc',
    '--text-secondary': '#cbd5e1',
    '--text-muted': '#64748b',
    '--border-color': '#334155',
    '--border-light': '#1e293b',
    '--primary': '#3b82f6',
    '--primary-dark': '#2563eb',
    '--primary-light': '#1e3a8a',
    '--secondary': '#94a3b8',
    '--success': '#34d399',
    '--success-dark': '#10b981',
    '--success-light': '#064e3b',
    '--warning': '#fbbf24',
    '--warning-dark': '#f59e0b',
    '--warning-light': '#451a03',
    '--danger': '#f87171',
    '--danger-dark': '#ef4444',
    '--danger-light': '#450a0a',
  },
  'premium-luxury': {
    '--bg-primary': '#1a1a1a',
    '--bg-secondary': '#242424',
    '--bg-hover': '#2d2d2d',
    '--text-primary': '#ffffff',
    '--text-secondary': '#d4af37',
    '--text-muted': '#888888',
    '--border-color': '#3d3d3d',
    '--border-light': '#2d2d2d',
    '--primary': '#d4af37',
    '--primary-dark': '#b8941f',
    '--primary-light': '#2d2410',
    '--secondary': '#888888',
    '--success': '#2ecc71',
    '--success-dark': '#27ae60',
    '--success-light': '#0d3320',
    '--warning': '#f39c12',
    '--warning-dark': '#d68910',
    '--warning-light': '#3d2706',
    '--danger': '#e74c3c',
    '--danger-dark': '#c0392b',
    '--danger-light': '#3d0f0f',
  },
  'minimal': {
    '--bg-primary': '#fafafa',
    '--bg-secondary': '#ffffff',
    '--bg-hover': '#f5f5f5',
    '--text-primary': '#171717',
    '--text-secondary': '#525252',
    '--text-muted': '#a3a3a3',
    '--border-color': '#e5e5e5',
    '--border-light': '#f5f5f5',
    '--primary': '#171717',
    '--primary-dark': '#404040',
    '--primary-light': '#f5f5f5',
    '--secondary': '#737373',
    '--success': '#16a34a',
    '--success-dark': '#15803d',
    '--success-light': '#dcfce7',
    '--warning': '#ca8a04',
    '--warning-dark': '#a16207',
    '--warning-light': '#fef9c3',
    '--danger': '#dc2626',
    '--danger-dark': '#b91c1c',
    '--danger-light': '#fee2e2',
  },
};

export const useTheme = () => {
  const [theme, setThemeState] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(THEME_KEY) || 'light-business';
    }
    return 'light-business';
  });

  useEffect(() => {
    const root = document.documentElement;
    const styles = themeStyles[theme] || themeStyles['light-business'];

    Object.entries(styles).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    localStorage.setItem(THEME_KEY, theme);
    root.setAttribute('data-theme', theme);
  }, [theme]);

  const setTheme = (newTheme) => {
    if (themeStyles[newTheme]) {
      setThemeState(newTheme);
    }
  };

  return { theme, setTheme };
};
