
import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuthContext';
import { useToast } from "@/hooks/use-toast";
import { useLocation } from 'react-router-dom';
import { walletService } from '@/services/icp/walletService';

export const useWalletConnect = () => {
  const { user, isLoading, login, logout } = useAuth();
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);
  const [hasError, setHasError] = useState(false);
  const location = useLocation();
  const [connectionProgress, setConnectionProgress] = useState(0);
  const connectionProgressRef = useRef<NodeJS.Timeout | null>(null);
  const [startTime, setStartTime] = useState<number>(0);
  const [realTimeBalance, setRealTimeBalance] = useState<number>(0);
  
  const currentPath = useMemo(() => location.pathname, [location.pathname]);
  
  // Update balance in real-time when user is connected
  useEffect(() => {
    let balanceInterval: NodeJS.Timeout;
    
    if (user.isAuthenticated && user.principalId) {
      const updateBalance = async () => {
        try {
          const balance = await walletService.getWalletBalance(user.principalId);
          setRealTimeBalance(balance);
        } catch (error) {
          console.error('Error updating wallet balance:', error);
        }
      };
      
      // Initial balance fetch
      updateBalance();
      
      // Update balance every 10 seconds for real-time feel
      balanceInterval = setInterval(updateBalance, 10000);
    }
    
    return () => {
      if (balanceInterval) {
        clearInterval(balanceInterval);
      }
    };
  }, [user.isAuthenticated, user.principalId]);
  
  // Add a function to handle progress animation for better UX
  const startProgressAnimation = useCallback(() => {
    // Clear any existing interval
    if (connectionProgressRef.current) {
      clearInterval(connectionProgressRef.current);
    }
    
    // Reset progress
    setConnectionProgress(0);
    
    // Start new progress animation
    connectionProgressRef.current = setInterval(() => {
      setConnectionProgress(prev => {
        // Gradually slow down as it approaches 80%
        const increment = prev < 50 ? 8 : prev < 70 ? 4 : 2;
        const nextValue = prev + increment;
        
        // Cap at 80% until actual success
        return nextValue >= 80 ? 80 : nextValue;
      });
    }, 150);
    
    // Return a cleanup function
    return () => {
      if (connectionProgressRef.current) {
        clearInterval(connectionProgressRef.current);
        connectionProgressRef.current = null;
      }
    };
  }, []);
  
  // Complete the progress animation
  const completeProgressAnimation = useCallback((success: boolean) => {
    // Clear the animation interval
    if (connectionProgressRef.current) {
      clearInterval(connectionProgressRef.current);
      connectionProgressRef.current = null;
    }
    
    // Jump to appropriate value
    setConnectionProgress(success ? 100 : 0);
    
    // If successful, clear after a short delay
    if (success) {
      setTimeout(() => {
        setConnectionProgress(0);
      }, 1000);
    }
  }, []);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (connectionProgressRef.current) {
        clearInterval(connectionProgressRef.current);
        connectionProgressRef.current = null;
      }
    };
  }, []);
  
  const connectWallet = useCallback(async () => {
    if (isConnecting) return;
    
    try {
      setIsConnecting(true);
      setHasError(false);
      console.log("Starting Internet Identity connection process...");
      console.log(`Connecting to ICP network: ${walletService.isMainnet ? 'Mainnet' : 'Local'}`);
      
      // Record start time for ensuring minimum loading time
      const currentStartTime = Date.now();
      setStartTime(currentStartTime);
      
      // Start progress animation
      const cleanupProgress = startProgressAnimation();
      
      toast({
        title: "Connecting to ICP...",
        description: `Connecting to ${walletService.isMainnet ? 'ICP Mainnet' : 'Local Network'}. Internet Identity window will open.`,
      });
      
      console.log("Saving redirect path:", currentPath);
      
      // Minimum connection time for UI stability
      const minimumLoadingTime = new Promise(resolve => setTimeout(resolve, 2000));
      
      // Start the actual login process
      const loginPromise = login(currentPath);
      
      // Wait for both login process and minimum time
      const [success] = await Promise.all([loginPromise, minimumLoadingTime]);
      
      // Complete the progress animation
      completeProgressAnimation(success);
      
      if (success) {
        toast({
          title: "Connected to ICP",
          description: `Successfully connected to ${walletService.isMainnet ? 'ICP Mainnet' : 'Local Network'} with Internet Identity.`,
        });
      } else {
        setHasError(true);
        toast({
          title: "Connection Failed",
          description: "Failed to connect to ICP network. Please try again.",
          variant: "destructive"
        });
        console.error("Login process completed but was not successful");
      }
    } catch (error) {
      setHasError(true);
      console.error('Error connecting wallet:', error);
      toast({
        title: "Connection Error",
        description: "An unexpected error occurred while connecting to ICP.",
        variant: "destructive"
      });
      completeProgressAnimation(false);
    } finally {
      // Ensure we have at least 2s of loading time for UI stability
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime < 2000) {
        await new Promise(resolve => setTimeout(resolve, 2000 - elapsedTime));
      }
      setIsConnecting(false);
    }
  }, [toast, login, currentPath, isConnecting, startProgressAnimation, completeProgressAnimation, startTime]);
  
  const disconnectWallet = useCallback(async () => {
    try {
      await logout();
      setRealTimeBalance(0);
      toast({
        title: "Disconnected",
        description: "You've been logged out from ICP network.",
      });
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
      toast({
        title: "Disconnection Error",
        description: "An error occurred while logging out.",
        variant: "destructive"
      });
    }
  }, [logout, toast]);
  
  const firstName = useMemo(() => 
    user.isAuthenticated ? user.id.split(' ')[0] : '', 
    [user.isAuthenticated, user.id]
  );
  
  const principalId = useMemo(() => 
    user.isAuthenticated ? user.principalId : '', 
    [user.isAuthenticated, user.principalId]
  );
  
  const truncatedId = useMemo(() => 
    principalId ? `${principalId.substring(0, 5)}...${principalId.substring(principalId.length - 5)}` : '', 
    [principalId]
  );
  
  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(principalId);
    toast({
      title: "Copied",
      description: "Principal ID copied to clipboard",
    });
  }, [principalId, toast]);

  return {
    user,
    isLoading,
    isConnecting,
    hasError,
    connectionProgress,
    firstName,
    truncatedId,
    principalId,
    realTimeBalance,
    networkInfo: {
      isMainnet: walletService.isMainnet,
      host: walletService.host
    },
    connectWallet,
    disconnectWallet,
    copyToClipboard
  };
};
