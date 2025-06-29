
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuthContext';
import { checkIfVerified } from '@/services/user/verification/verificationCore';

export function useVerificationStatus() {
  const { user, checkAuth } = useAuth();
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Direct check function that bypasses caching
  const checkVerificationStatus = useCallback(async (force = false): Promise<boolean> => {
    if (!user.principalId || user.principalId === 'guest-user') {
      setIsVerified(false);
      setIsLoading(false);
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Check for cached results first, unless force=true
      if (!force) {
        const cachedStatus = localStorage.getItem(`verification_status_${user.principalId}`);
        if (cachedStatus === 'true') {
          console.log("Using cached verification status: true");
          setIsVerified(true);
          setIsLoading(false);
          return true;
        }
      }

      // Directly check verification status
      console.log("Checking verification status for", user.principalId);
      const status = await checkIfVerified(user.principalId);
      console.log("Verification status check result:", status);
      
      // Update state and localStorage
      setIsVerified(status);
      if (status) {
        localStorage.setItem(`verification_status_${user.principalId}`, 'true');
        // Store the user ID for easier access
        localStorage.setItem('current_user_id', user.principalId);
      } else {
        // Remove cached status if verification failed
        localStorage.removeItem(`verification_status_${user.principalId}`);
      }
      
      // Refresh auth state if needed
      if (user.isVerified !== status) {
        console.log("Auth state out of sync, refreshing");
        await checkAuth();
      }
      
      setIsLoading(false);
      return status;
    } catch (err) {
      console.error("Error checking verification status:", err);
      setError("Failed to check verification status");
      setIsLoading(false);
      return false;
    }
  }, [user.principalId, user.isVerified, checkAuth]);

  // Check status on mount and when principalId changes
  useEffect(() => {
    let isMounted = true;
    
    const initialCheck = async () => {
      if (!user.principalId) {
        if (isMounted) {
          setIsVerified(false);
          setIsLoading(false);
        }
        return;
      }
      
      await checkVerificationStatus(true); // Force check on mount
    };
    
    initialCheck();
    
    return () => {
      isMounted = false;
    };
  }, [user.principalId, checkVerificationStatus]);

  return {
    isVerified,
    isLoading,
    error,
    checkVerificationStatus
  };
}
