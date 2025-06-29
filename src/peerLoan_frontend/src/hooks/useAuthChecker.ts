
import { useState, useCallback } from 'react';
import { NavigateFunction } from 'react-router-dom';
import { User } from '../types/authTypes';
import { getCurrentUser } from '../services/user/userService';

export const useAuthChecker = (
  setUser: React.Dispatch<React.SetStateAction<User>>,
  setIsRegistered: React.Dispatch<React.SetStateAction<boolean>>,
  navigate: NavigateFunction
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [redirectPath, setRedirectPathState] = useState<string | null>(null);

  const checkAuth = useCallback(async () => {
    try {
      setIsLoading(true);
      const user = await getCurrentUser();
      setUser(user);
      setIsRegistered(user.role !== 'unregistered');
    } catch (error) {
      console.error('Error checking auth:', error);
    } finally {
      setIsLoading(false);
    }
  }, [setUser, setIsRegistered]);

  const setRedirectPath = useCallback((path: string | null) => {
    setRedirectPathState(path);
  }, []);

  return {
    isLoading,
    checkAuth,
    setRedirectPath,
    isProcessing,
    setIsProcessing,
    setIsLoading
  };
};
