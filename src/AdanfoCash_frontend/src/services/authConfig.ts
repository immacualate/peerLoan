
// ICP Network Configuration
const ICP_MAINNET_HOST = 'https://ic0.app';
const ICP_LOCAL_HOST = 'http://localhost:4943';

export const getHost = () => {
  // For production builds, always use mainnet
  if (import.meta.env.PROD) {
    return ICP_MAINNET_HOST;
  }
  
  // For development, check environment variable
  if (import.meta.env.VITE_ICP_ENABLED === 'true') {
    return ICP_MAINNET_HOST;
  }
  
  // Default to local for development
  return ICP_LOCAL_HOST;
};

export const isMainnet = () => {
  return getHost() === ICP_MAINNET_HOST;
};

export const getNetworkName = () => {
  return isMainnet() ? 'ICP Mainnet' : 'Local Network';
};

// Identity Provider Configuration
export const getIdentityProviderUrl = () => {
  return isMainnet() 
    ? 'https://identity.ic0.app'
    : `${ICP_LOCAL_HOST}?canisterId=rdmx6-jaaaa-aaaah-qdrpq-cai`;
};

export const getIdentityConnectionOptions = () => {
  return {
    maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000), // 7 days in nanoseconds
    derivationOrigin: isMainnet() ? 'https://rdmx6-jaaaa-aaaah-qdrpq-cai.ic0.app' : undefined
  };
};

export const getFallbackIdentityUrls = () => {
  return isMainnet() 
    ? ['https://identity.ic0.app', 'https://identity.internetcomputer.org']
    : [`${ICP_LOCAL_HOST}?canisterId=rdmx6-jaaaa-aaaah-qdrpq-cai`];
};
