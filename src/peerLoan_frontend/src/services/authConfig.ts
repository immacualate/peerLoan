
// ICP Network Configuration
const ICP_MAINNET_HOST = 'https://ic0.app';
const ICP_LOCAL_HOST = 'http://localhost:4943';

// Force use of mainnet Internet Identity for peerLoan deployment
const FORCE_MAINNET_IDENTITY = true;

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

// Identity Provider Configuration - Always use public Internet Identity
export const getIdentityProviderUrl = () => {
  // Always use the public Internet Identity service
  if (FORCE_MAINNET_IDENTITY) {
    return 'https://identity.ic0.app';
  }
  
  return isMainnet() 
    ? 'https://identity.ic0.app'
    : `${ICP_LOCAL_HOST}?canisterId=rdmx6-jaaaa-aaaah-qdrpq-cai`;
};

export const getIdentityConnectionOptions = () => {
  // Frontend canister ID for derivation origin
  const frontendCanisterId = 'u6s2n-gx777-77774-qaaba-cai';
  
  // For Internet Identity, we need to determine the correct derivation origin:
  // The derivation origin MUST match the URL where the app is actually running
  
  let derivationOrigin;
  
  // Get the current window location
  const currentOrigin = window.location.origin;
  const currentHost = window.location.hostname;
  const currentPort = window.location.port;
  
  console.log('Current location:', {
    origin: currentOrigin,
    hostname: currentHost,
    port: currentPort,
    href: window.location.href
  });
  
  if (currentHost === 'localhost' || currentHost.includes('localhost')) {
    // Local development - use the exact origin where the app is running
    derivationOrigin = currentOrigin;
  } else if (currentHost.includes('.localhost')) {
    // DFX local canister URL (e.g., u6s2n-gx777-77774-qaaba-cai.localhost:4943)
    derivationOrigin = currentOrigin;
  } else if (currentHost.includes('.ic0.app')) {
    // Production mainnet canister
    derivationOrigin = currentOrigin;
  } else if (isMainnet()) {
    // Fallback for mainnet
    derivationOrigin = `https://${frontendCanisterId}.ic0.app`;
  } else {
    // Fallback for any other environment
    derivationOrigin = currentOrigin;
  }
  
  console.log('Using derivation origin for Internet Identity:', derivationOrigin);
  
  return {
    maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000), // 7 days in nanoseconds
    derivationOrigin,
    windowOpenerFeatures: `
      left=${Math.round(window.screen.width / 2 - 525 / 2)},
      top=${Math.round(window.screen.height / 2 - 705 / 2)},
      toolbar=0,location=0,menubar=0,width=525,height=705,resizable=1,scrollbars=1
    `,
  };
};

export const getFallbackIdentityUrls = () => {
  // Always provide public Internet Identity as primary and fallback
  return ['https://identity.ic0.app', 'https://identity.internetcomputer.org'];
};
