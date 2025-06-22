
import { ICP_CONFIG, getICPHost } from '@/config/icp';
import { walletService } from '@/services/icp/walletService';

export const performDeploymentCheck = async () => {
  const results = {
    network: 'unknown',
    host: 'unknown',
    authClientStatus: 'pending',
    walletServiceStatus: 'pending',
    canisterConnectivity: 'pending',
    timestamp: new Date().toISOString()
  };

  try {
    // Check network configuration
    results.network = ICP_CONFIG.useMainnet ? 'mainnet' : 'local';
    results.host = getICPHost();
    
    // Test auth client creation
    try {
      const authClient = await walletService.createAuthClient();
      results.authClientStatus = authClient ? 'success' : 'failed';
    } catch (error) {
      console.error('Auth client test failed:', error);
      results.authClientStatus = 'failed';
    }
    
    // Test wallet service
    try {
      const balance = await walletService.getWalletBalance('test-principal');
      results.walletServiceStatus = typeof balance === 'number' ? 'success' : 'failed';
    } catch (error) {
      console.error('Wallet service test failed:', error);
      results.walletServiceStatus = 'failed';
    }
    
    // Test canister connectivity (basic network check)
    try {
      const response = await fetch(results.host + '/api/v2/status');
      results.canisterConnectivity = response.ok ? 'success' : 'failed';
    } catch (error) {
      console.error('Canister connectivity test failed:', error);
      results.canisterConnectivity = 'failed';
    }
    
  } catch (error) {
    console.error('Deployment check failed:', error);
  }

  return results;
};

export const logDeploymentStatus = async () => {
  console.log('🚀 AdanfoCash Deployment Check Starting...');
  const results = await performDeploymentCheck();
  
  console.log('📊 Deployment Check Results:');
  console.table(results);
  
  const allChecksPass = Object.values(results)
    .filter(value => typeof value === 'string' && ['success', 'failed', 'pending'].includes(value))
    .every(status => status === 'success');
  
  if (allChecksPass) {
    console.log('✅ All deployment checks passed! AdanfoCash is ready.');
  } else {
    console.log('⚠️ Some deployment checks failed. Please review the results above.');
  }
  
  return results;
};
