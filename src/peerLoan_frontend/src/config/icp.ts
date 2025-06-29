
// ICP Configuration for peerLoan
export const ICP_CONFIG = {
  // Network Configuration
  MAINNET_HOST: 'https://ic0.app',
  LOCAL_HOST: 'http://localhost:4943',
  
  // Canister IDs (to be updated when deployed)
  CANISTERS: {
    ADANFO_CASH: {
      mainnet: 'rdmx6-jaaaa-aaaah-qdrpq-cai', // Example ID - replace with actual
      local: 'rrkah-fqaaa-aaaah-qcuva-cai'    // Example ID - replace with actual
    }
  },
  
  // Wallet Configuration
  SUPPORTED_WALLETS: [
    'internet-identity',
    'nfid',
    'plug',
    'stoic'
  ],
  
  // Currency Configuration
  DEFAULT_CURRENCY: 'GHS',
  ICP_DECIMALS: 8,
  
  // Transaction Configuration
  DEFAULT_TRANSACTION_FEE: 10000, // 0.0001 ICP in e8s
  
  // Development Configuration
  isDevelopment: import.meta.env.MODE === 'development',
  isProduction: import.meta.env.MODE === 'production',
  useMainnet: import.meta.env.VITE_ICP_ENABLED === 'true' || import.meta.env.MODE === 'production'
};

export const getICPHost = () => {
  return ICP_CONFIG.useMainnet ? ICP_CONFIG.MAINNET_HOST : ICP_CONFIG.LOCAL_HOST;
};

export const getCanisterId = (canisterName: keyof typeof ICP_CONFIG.CANISTERS) => {
  const canister = ICP_CONFIG.CANISTERS[canisterName];
  return ICP_CONFIG.useMainnet ? canister.mainnet : canister.local;
};
