
import { useState, useCallback, useEffect } from 'react';
import { useAuth } from './useAuthContext';
import { useToast } from '@/hooks/use-toast';

export interface WalletInfo {
  type: 'internet-identity' | 'nfid' | 'plug' | 'stoic';
  isConnected: boolean;
  address: string;
  balance: number;
  isConnecting: boolean;
}

export const useWalletManager = () => {
  const { user, login, logout } = useAuth();
  const { toast } = useToast();
  
  const [wallets, setWallets] = useState<Record<string, WalletInfo>>({
    'internet-identity': {
      type: 'internet-identity',
      isConnected: user.isAuthenticated,
      address: user.principalId || '',
      balance: 0,
      isConnecting: false
    },
    'nfid': {
      type: 'nfid',
      isConnected: false,
      address: '',
      balance: 0,
      isConnecting: false
    },
    'plug': {
      type: 'plug',
      isConnected: false,
      address: '',
      balance: 0,
      isConnecting: false
    },
    'stoic': {
      type: 'stoic',
      isConnected: false,
      address: '',
      balance: 0,
      isConnecting: false
    }
  });

  // Update Internet Identity wallet when auth state changes
  useEffect(() => {
    setWallets(prev => ({
      ...prev,
      'internet-identity': {
        ...prev['internet-identity'],
        isConnected: user.isAuthenticated,
        address: user.principalId || ''
      }
    }));
  }, [user.isAuthenticated, user.principalId]);

  const connectWallet = useCallback(async (walletType: string) => {
    setWallets(prev => ({
      ...prev,
      [walletType]: { ...prev[walletType], isConnecting: true }
    }));

    try {
      let success = false;
      let address = '';
      let balance = 0;

      switch (walletType) {
        case 'internet-identity':
          success = await login();
          if (success) {
            address = user.principalId || '';
            balance = 42.89; // Mock balance
          }
          break;
          
        case 'nfid':
          // Mock NFID connection
          await new Promise(resolve => setTimeout(resolve, 1500));
          address = 'nfid-' + Math.random().toString(36).substring(2, 10);
          balance = parseFloat((Math.random() * 10 + 1).toFixed(3));
          success = true;
          break;
          
        case 'plug':
          // Mock Plug Wallet connection
          await new Promise(resolve => setTimeout(resolve, 1200));
          address = 'plug-' + Math.random().toString(36).substring(2, 10);
          balance = parseFloat((Math.random() * 5 + 2).toFixed(3));
          success = true;
          break;
          
        case 'stoic':
          // Mock Stoic Wallet connection
          await new Promise(resolve => setTimeout(resolve, 1000));
          address = 'stoic-' + Math.random().toString(36).substring(2, 10);
          balance = parseFloat((Math.random() * 8 + 1).toFixed(3));
          success = true;
          break;
      }

      if (success) {
        setWallets(prev => ({
          ...prev,
          [walletType]: {
            ...prev[walletType],
            isConnected: true,
            address,
            balance,
            isConnecting: false
          }
        }));

        toast({
          title: "Wallet Connected",
          description: `${walletType.charAt(0).toUpperCase() + walletType.slice(1).replace('-', ' ')} wallet connected successfully.`,
        });
      } else {
        throw new Error('Connection failed');
      }
    } catch (error) {
      console.error(`Error connecting ${walletType}:`, error);
      
      setWallets(prev => ({
        ...prev,
        [walletType]: { ...prev[walletType], isConnecting: false }
      }));

      toast({
        title: "Connection Failed",
        description: `Failed to connect ${walletType.replace('-', ' ')} wallet. Please try again.`,
        variant: "destructive"
      });
    }
  }, [login, user.principalId, toast]);

  const disconnectWallet = useCallback(async (walletType: string) => {
    try {
      if (walletType === 'internet-identity') {
        await logout();
      }

      setWallets(prev => ({
        ...prev,
        [walletType]: {
          ...prev[walletType],
          isConnected: false,
          address: '',
          balance: 0
        }
      }));

      toast({
        title: "Wallet Disconnected",
        description: `${walletType.charAt(0).toUpperCase() + walletType.slice(1).replace('-', ' ')} wallet disconnected.`,
      });
    } catch (error) {
      console.error(`Error disconnecting ${walletType}:`, error);
      toast({
        title: "Disconnection Failed",
        description: "Failed to disconnect wallet. Please try again.",
        variant: "destructive"
      });
    }
  }, [logout, toast]);

  const getConnectedWallets = useCallback(() => {
    return Object.values(wallets).filter(wallet => wallet.isConnected);
  }, [wallets]);

  const getTotalBalance = useCallback(() => {
    return Object.values(wallets)
      .filter(wallet => wallet.isConnected)
      .reduce((total, wallet) => total + wallet.balance, 0);
  }, [wallets]);

  return {
    wallets,
    connectWallet,
    disconnectWallet,
    getConnectedWallets,
    getTotalBalance
  };
};
