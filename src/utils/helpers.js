import { v4 as uuidv4 } from 'uuid';

// LocalStorage keys
export const STORAGE_KEYS = {
  USERS: 'quotation_users',
  CURRENT_USER: 'quotation_current_user',
  COMPANIES: 'quotation_companies',
  CUSTOMERS: 'quotation_customers',
  PRODUCTS: 'quotation_products',
  QUOTATIONS: 'quotation_quotations',
  TEMPLATES: 'quotation_templates',
  NOTIFICATIONS: 'quotation_notifications',
  ACTIVITY_LOGS: 'quotation_activity_logs',
  SETTINGS: 'quotation_settings',
  THEME: 'quotation_theme',
};

// Generate unique ID
export const generateId = () => uuidv4();

// Generate quotation number
export const generateQuotationNumber = (count) => {
  const year = new Date().getFullYear();
  const num = String(count + 1).padStart(5, '0');
  return `QT-${year}-${num}`;
};

// Format currency
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Format date
export const formatDate = (date, format = 'short') => {
  const d = new Date(date);
  if (format === 'short') {
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
  if (format === 'long') {
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  }
  if (format === 'time') {
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }
  return d.toLocaleDateString('en-US');
};

// Calculate quotation totals
export const calculateQuotationTotals = (items, taxRate = 0, discountRate = 0) => {
  const subtotal = items.reduce((sum, item) => {
    const itemTotal = (item.price || 0) * (item.quantity || 1);
    return sum + itemTotal;
  }, 0);
  
  const discountAmount = subtotal * (discountRate / 100);
  const afterDiscount = subtotal - discountAmount;
  const taxAmount = afterDiscount * (taxRate / 100);
  const total = afterDiscount + taxAmount;
  
  return {
    subtotal: Math.round(subtotal * 100) / 100,
    discountAmount: Math.round(discountAmount * 100) / 100,
    taxAmount: Math.round(taxAmount * 100) / 100,
    total: Math.round(total * 100) / 100,
  };
};

// Validate email
export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Validate phone
export const isValidPhone = (phone) => {
  const regex = /^[\d\s\-\+\(\)]{10,}$/;
  return regex.test(phone);
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Status colors mapping
export const statusColors = {
  draft: { bg: 'var(--bg-tertiary)', text: 'var(--text-secondary)', border: 'var(--border-color)' },
  sent: { bg: 'var(--info-light)', text: 'var(--info)', border: 'var(--info)' },
  approved: { bg: 'var(--success-light)', text: 'var(--success)', border: 'var(--success)' },
  rejected: { bg: 'var(--danger-light)', text: 'var(--danger)', border: 'var(--danger)' },
  expired: { bg: 'var(--warning-light)', text: 'var(--warning)', border: 'var(--warning)' },
};

// Quotation statuses
export const QUOTATION_STATUSES = ['draft', 'sent', 'approved', 'rejected', 'expired'];

// Default settings
export const defaultSettings = {
  companyName: '',
  companyAddress: '',
  companyPhone: '',
  companyEmail: '',
  companyLogo: null,
  currency: 'USD',
  defaultTaxRate: 0,
  defaultValidityDays: 30,
  defaultTerms: 'Payment due within 30 days of invoice date.',
  theme: 'light',
  defaultTemplate: 'business',
};

// Local storage helpers
export const storage = {
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Error writing to localStorage:', error);
      return false;
    }
  },
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing from localStorage:', error);
      return false;
    }
  },
};
