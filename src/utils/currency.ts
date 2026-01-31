/**
 * Odysseus Bank - Currency Formatting Utilities
 * Universal functions for consistent number and currency formatting
 */

/**
 * Format a number with thousand separators
 * @param value - The number to format
 * @param decimals - Number of decimal places (default: 0)
 * @returns Formatted string with commas as thousand separators
 */
export function formatNumber(value: number, decimals = 0): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Format a number as Malaysian Ringgit currency
 * @param value - The amount to format
 * @param showSymbol - Whether to include "RM" prefix (default: true)
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted currency string (e.g., "RM 1,234.56")
 */
export function formatCurrency(
  value: number,
  showSymbol = true,
  decimals = 2
): string {
  const formatted = formatNumber(value, decimals);
  return showSymbol ? `RM ${formatted}` : formatted;
}

/**
 * Format a number as compact currency (e.g., 1.2K, 1.5M)
 * @param value - The amount to format
 * @param showSymbol - Whether to include "RM" prefix (default: true)
 * @returns Compact formatted string
 */
export function formatCompactCurrency(
  value: number,
  showSymbol = true
): string {
  const absValue = Math.abs(value);
  let formatted: string;

  if (absValue >= 1_000_000) {
    formatted = `${(value / 1_000_000).toFixed(1)}M`;
  } else if (absValue >= 1_000) {
    formatted = `${(value / 1_000).toFixed(1)}K`;
  } else {
    formatted = formatNumber(value, 2);
  }

  return showSymbol ? `RM ${formatted}` : formatted;
}

/**
 * Parse a currency string back to number
 * @param value - The currency string to parse
 * @returns The numeric value
 */
export function parseCurrency(value: string): number {
  const cleaned = value.replace(/[^0-9.-]/g, '');
  return parseFloat(cleaned) || 0;
}

/**
 * Format a raw input string with thousand separators while preserving decimals
 * Used for live display while user is typing
 * @param value - The raw input string (e.g., "1234.5")
 * @returns Formatted string with commas (e.g., "1,234.5")
 */
export function formatInputDisplay(value: string): string {
  if (!value || value === '') {
    return '0';
  }

  // Split into integer and decimal parts
  const parts = value.split('.');
  const integerPart = parts[0] || '0';
  const decimalPart = parts[1];

  // Add thousand separators to integer part
  const formattedInteger = parseInt(integerPart, 10).toLocaleString('en-US');

  // Reconstruct with decimal if present
  if (decimalPart !== undefined) {
    return `${formattedInteger}.${decimalPart}`;
  }

  // If original had trailing dot, preserve it
  if (value.endsWith('.')) {
    return `${formattedInteger}.`;
  }

  return formattedInteger;
}
