import { format, formatDistanceToNow, parseISO } from 'date-fns';

/**
 * Format a date string to readable format
 * @param {string} dateStr - ISO date string
 * @param {string} [fmt] - Date format pattern
 * @returns {string} Formatted date
 */
export const formatDate = (dateStr, fmt = 'dd MMM yyyy') => {
  if (!dateStr) return '—';
  try {
    return format(parseISO(dateStr), fmt);
  } catch {
    return '—';
  }
};

/**
 * Format date to relative time (e.g., "2 hours ago")
 * @param {string} dateStr - ISO date string
 * @returns {string}
 */
export const formatRelativeTime = (dateStr) => {
  if (!dateStr) return '—';
  try {
    return formatDistanceToNow(parseISO(dateStr), { addSuffix: true });
  } catch {
    return '—';
  }
};

/**
 * Format number as currency
 * @param {number} amount
 * @param {string} [currency='INR']
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = 'INR') => {
  if (amount == null || isNaN(amount)) return '—';
  
  const localeMap = {
    INR: 'en-IN',
    USD: 'en-US',
    EUR: 'de-DE',
    AED: 'ar-AE',
    GBP: 'en-GB',
  };

  return new Intl.NumberFormat(localeMap[currency] || 'en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format number with commas
 * @param {number} num
 * @returns {string}
 */
export const formatNumber = (num) => {
  if (num == null || isNaN(num)) return '—';
  return new Intl.NumberFormat('en-IN').format(num);
};

/**
 * Truncate text with ellipsis
 * @param {string} text
 * @param {number} maxLen
 * @returns {string}
 */
export const truncate = (text, maxLen = 50) => {
  if (!text) return '';
  return text.length > maxLen ? text.substring(0, maxLen) + '...' : text;
};

/**
 * Get status color class name
 * @param {string} status
 * @returns {string} Tailwind badge class
 */
export const getStatusColor = (status) => {
  const colors = {
    active: 'badge-success',
    completed: 'badge-success',
    delivered: 'badge-success',
    paid: 'badge-success',
    approved: 'badge-success',
    pending: 'badge-warning',
    processing: 'badge-warning',
    in_transit: 'badge-warning',
    partial: 'badge-warning',
    new: 'badge-info',
    draft: 'badge-info',
    booked: 'badge-info',
    cancelled: 'badge-danger',
    rejected: 'badge-danger',
    overdue: 'badge-danger',
    lost: 'badge-danger',
  };
  return colors[status?.toLowerCase()] || 'badge-info';
};
