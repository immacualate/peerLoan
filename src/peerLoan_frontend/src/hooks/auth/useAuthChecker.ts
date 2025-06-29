
import { useState, useCallback } from 'react';
import { User } from '@/types/authTypes';
import { getCurrentUser } from '@/services/user/userService';

interface UseAuthCheckerProps {
  user: User;
  isLoading: boolean;
}

interface UseAuthCheckerReturn {
  isLoading: boolean;
  checkAuth: () => Promise<void>;
  setRedirectPath: (path: string | null) => void;
  isProcessing: boolean;
  setIsProcessing: (value: boolean) => void;
  setIsLoading: (value: boolean) => void;
}

export const useAuthChecker = ({ user, isLoading }: UseAuthCheckerProps): UseAuthCheckerReturn => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [internalIsLoading, setInternalIsLoading] = useState(isLoading);
  const [redirectPath, setRedirectPath] = useState<string | null>(null);

  const checkAuth = useCallback(async () => {
    try {
      setInternalIsLoading(true);
      await getCurrentUser();
    } catch (error) {
      console.error('Error checking auth:', error);
    } finally {
      setInternalIsLoading(false);
    }
  }, []);

  return {
    isLoading: internalIsLoading,
    checkAuth,
    setRedirectPath,
    isProcessing,
    setIsProcessing,
    setIsLoading: setInternalIsLoading
  };
};
