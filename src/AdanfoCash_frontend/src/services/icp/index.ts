
// Re-export ICP services
export { walletService } from './walletService';
import { getHost, isMainnet, getNetworkName } from '../authConfig';

// Export the imported functions
export { getHost, isMainnet, getNetworkName };

// ICP Connection Status
export const getICPConnectionStatus = () => {
  const host = getHost();
  const mainnet = isMainnet();
  
  return {
    host,
    isMainnet: mainnet,
    networkName: getNetworkName(),
    canisterIds: {
      // Add your canister IDs here when deployed
      adanfoCash: mainnet ? 'YOUR_MAINNET_CANISTER_ID' : 'YOUR_LOCAL_CANISTER_ID'
    }
  };
};

// ICP Configuration
export const ICP_ENABLED = import.meta.env.VITE_ICP_ENABLED === 'true' || import.meta.env.PROD;
