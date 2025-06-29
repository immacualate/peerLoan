
import { AuthClient } from '@dfinity/auth-client';
import { Actor, HttpAgent } from '@dfinity/agent';
import { getHost } from '../authConfig';

// ICP Network Configuration
const ICP_MAINNET_HOST = 'https://ic0.app';

export const createWalletService = () => {
  const host = getHost();
  console.log(`ICP Wallet Service: Using host ${host}`);
  
  return {
    host,
    isMainnet: host === ICP_MAINNET_HOST,
    
    async createAuthClient() {
      return await AuthClient.create({
        idleOptions: {
          disableIdle: true,
          disableDefaultIdleCallback: true
        }
      });
    },
    
    async createAgent(identity?: any) {
      const agent = new HttpAgent({
        host,
        identity
      });
      
      // Only fetch root key for local development
      if (host !== ICP_MAINNET_HOST) {
        await agent.fetchRootKey();
      }
      
      return agent;
    },
    
    async getWalletBalance(principalId: string): Promise<number> {
      try {
        // For mainnet, we would query the ICP ledger canister
        // For now, return a simulated balance that updates realistically
        const baseBalance = 42.89;
        const fluctuation = (Math.random() - 0.5) * 0.05; // Smaller, more realistic fluctuations
        return Math.max(0, baseBalance + fluctuation);
      } catch (error) {
        console.error('Error fetching wallet balance:', error);
        return 0;
      }
    }
  };
};

export const walletService = createWalletService();
