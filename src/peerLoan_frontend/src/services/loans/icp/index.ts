
// Re-export all loan-related functions from the ICP integration
export * from './types';
export * from './loanCreation';
export * from './loanQueries';
export * from './loanActions';
export * from './utils';

// Export a constant to check if ICP is enabled globally
export const isIcpEnabled = (): boolean => {
  // Check if ICP integration is enabled based on environment variables
  return import.meta.env.VITE_ICP_ENABLED === 'true';
};
