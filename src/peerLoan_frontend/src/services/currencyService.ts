
// Currently using a fixed rate, but this would be replaced with a real API call
// to a service like CoinGecko in production

const FIXED_ICP_TO_GHS_RATE = 56; // 1 ICP = 56 GHS (estimate)

/**
 * Get the conversion rate from ICP to GHS
 * @returns The conversion rate (1 ICP = X GHS)
 */
export const getICPtoGHSConversion = async (): Promise<number> => {
  try {
    // In a real implementation, this would call an API
    // For example: const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=internet-computer&vs_currencies=ghs');
    
    // For now, we'll use a fixed rate for demonstration
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return FIXED_ICP_TO_GHS_RATE;
  } catch (error) {
    console.error('Error getting ICP to GHS conversion rate:', error);
    return FIXED_ICP_TO_GHS_RATE; // Fallback to fixed rate on error
  }
};

/**
 * Convert an ICP amount to GHS
 * @param icpAmount The amount in ICP
 * @returns The equivalent amount in GHS
 */
export const convertICPtoGHS = async (icpAmount: number): Promise<number> => {
  const rate = await getICPtoGHSConversion();
  return icpAmount * rate;
};

/**
 * Format an ICP amount with GHS conversion
 * @param icpAmount The amount in ICP
 * @returns A formatted string with both ICP and GHS amounts
 */
export const formatICPwithGHS = async (icpAmount: number): Promise<string> => {
  const ghsAmount = await convertICPtoGHS(icpAmount);
  return `${icpAmount.toFixed(2)} ICP ≈ GHS ${ghsAmount.toFixed(2)}`;
};
