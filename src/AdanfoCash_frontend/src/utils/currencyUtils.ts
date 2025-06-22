
// Fixed exchange rate for ICP to GHS (can be replaced with API call later)
const ICP_TO_GHS_RATE = 312.50;

/**
 * Convert ICP amount to GHS
 */
export const convertICPToGHS = (icpAmount: number): number => {
  if (isNaN(icpAmount) || icpAmount === null) return 0;
  return icpAmount * ICP_TO_GHS_RATE;
};

/**
 * Format ICP amount with symbol
 */
export const formatICP = (amount: number): string => {
  if (isNaN(amount) || amount === null) return "0 ICP";
  return `${amount.toFixed(2)} ICP`;
};

/**
 * Format GHS amount with symbol
 */
export const formatGHS = (amount: number): string => {
  if (isNaN(amount) || amount === null) return "GHS 0.00";
  return `GHS ${amount.toFixed(2)}`;
};

/**
 * Format currency with the appropriate symbol based on currency code
 */
export const formatCurrency = (amount: number, currency: 'ICP' | 'GHS'): string => {
  if (currency === 'ICP') {
    return formatICP(amount);
  } else {
    return formatGHS(amount);
  }
};

/**
 * Convert and format from ICP to GHS
 */
export const convertAndFormatGHS = (icpAmount: number): string => {
  return formatGHS(convertICPToGHS(icpAmount));
};
