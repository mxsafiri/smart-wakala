/**
 * Utility functions for formatting data in the Smart Wakala application
 */

/**
 * Format a number as currency in Tanzanian Shillings (TZS)
 * @param amount - The amount to format
 * @param includeCurrency - Whether to include the currency symbol
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number, includeCurrency = true): string => {
  const formatter = new Intl.NumberFormat('sw-TZ', {
    style: includeCurrency ? 'currency' : 'decimal',
    currency: 'TZS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  
  return formatter.format(amount);
};

/**
 * Format a date as a readable string
 * @param dateString - ISO date string to format
 * @returns Formatted date string
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('sw-TZ', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

/**
 * Format a percentage value
 * @param value - The percentage value (0-100)
 * @returns Formatted percentage string
 */
export const formatPercentage = (value: number): string => {
  return `${Math.round(value)}%`;
};

/**
 * Format a number with thousand separators
 * @param value - The number to format
 * @returns Formatted number string
 */
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('sw-TZ').format(value);
};

/**
 * Calculate time remaining until a date and return a human-readable string
 * @param dateString - ISO date string to calculate time until
 * @returns Human-readable time remaining string
 */
export const getTimeRemaining = (dateString: string): string => {
  const targetDate = new Date(dateString);
  const now = new Date();
  const diffMs = targetDate.getTime() - now.getTime();
  
  if (diffMs <= 0) {
    return 'Overdue';
  }
  
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays > 30) {
    const diffMonths = Math.floor(diffDays / 30);
    return `${diffMonths} month${diffMonths > 1 ? 's' : ''}`;
  } else if (diffDays > 0) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
  } else {
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    return `${diffHours} hour${diffHours > 1 ? 's' : ''}`;
  }
};
