import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const generateId = () => {
  return Math.random().toString(36).substring(2, 9);
};

export const generateQuoteNumber = () => {
  const prefix = 'QT';
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${prefix}-${year}${month}-${random}`;
};

export const calculateQuotationTotals = (items, defaultTax = 0) => {
  const subtotal = items.reduce((sum, item) => {
    const itemTotal = (item.quantity || 0) * (item.price || 0);
    const discountAmount = itemTotal * ((item.discount || 0) / 100);
    return sum + itemTotal - discountAmount;
  }, 0);

  const totalDiscount = items.reduce((sum, item) => {
    const itemTotal = (item.quantity || 0) * (item.price || 0);
    return sum + itemTotal * ((item.discount || 0) / 100);
  }, 0);

  const taxAmount = subtotal * (defaultTax / 100);
  const grandTotal = subtotal + taxAmount;

  return {
    subtotal,
    totalDiscount,
    taxAmount,
    grandTotal,
  };
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone) => {
  const re = /^[\d\s\-\+\(\)]{10,}$/;
  return re.test(phone);
};

export const getStatusColor = (status) => {
  const colors = {
    draft: 'badge-gray',
    sent: 'badge-info',
    approved: 'badge-success',
    rejected: 'badge-danger',
    expired: 'badge-warning',
  };
  return colors[status] || 'badge-gray';
};

export const getStatusLabel = (status) => {
  const labels = {
    draft: 'Draft',
    sent: 'Sent',
    approved: 'Approved',
    rejected: 'Rejected',
    expired: 'Expired',
  };
  return labels[status] || status;
};
