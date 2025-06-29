
// This function doesn't take any parameters
export const isIcpEnabled = (): boolean => {
  return import.meta.env.VITE_ICP_ENABLED === 'true' || import.meta.env.PROD;
};

// Add a helper function to determine if we should use ICP
export const shouldUseIcp = (): boolean => {
  // Check if ICP is enabled and if we're in the right environment
  return import.meta.env.VITE_ICP_ENABLED === 'true' || import.meta.env.PROD;
};
