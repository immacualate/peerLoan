
import { ICP_ENABLED } from "../..";

// This function doesn't take any parameters
export const isIcpEnabled = (): boolean => {
  return ICP_ENABLED;
};

// Add a helper function to determine if we should use ICP
export const shouldUseIcp = (): boolean => {
  // Check if ICP is enabled and if we're in the right environment
  return ICP_ENABLED && import.meta.env.VITE_ICP_ENABLED === 'true';
};
