
import { useState, useCallback, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { getICPtoGHSConversion } from '@/services/currencyService';

export const useNFIDWallet = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [balance, setBalance] = useState(0);
  const [conversionRate, setConversionRate] = useState(56); // Default rate
  const { toast } = useToast();
  
  // Get conversion rate on mount
  useEffect(() => {
    const getRate = async () => {
      const rate = await getICPtoGHSConversion();
      setConversionRate(rate);
    };
    getRate();
  }, []);

  const connectNFIDWallet = useCallback(async () => {
    if (isConnecting) return;
    
    try {
      setIsConnecting(true);
      
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate mock address and balance
      const mockAddress = 'nfid-' + Math.random().toString(36).substring(2, 10);
      const mockBalance = parseFloat((Math.random() * 10 + 1).toFixed(3));
      
      setWalletAddress(mockAddress);
      setBalance(mockBalance);
      setIsConnected(true);
      
      toast({
        title: "NFID Wallet Connected",
        description: "Your NFID wallet has been successfully connected.",
      });
    } catch (error) {
      console.error('Error connecting NFID wallet:', error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect your NFID wallet. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
    }
  }, [toast, isConnecting]);

  const disconnectWallet = useCallback(() => {
    setIsConnected(false);
    setWalletAddress('');
    setBalance(0);
    
    toast({
      title: "Wallet Disconnected",
      description: "Your NFID wallet has been disconnected.",
    });
  }, [toast]);

  return {
    isConnected,
    isConnecting,
    walletAddress,
    balance,
    conversionRate,
    connectNFIDWallet,
    disconnectWallet
  };
};
