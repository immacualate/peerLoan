
import { useState } from 'react';
import { NavigateFunction } from 'react-router-dom';
import { User } from '../types/authTypes';
import { useAuthChecker } from './useAuthChecker';
import { useAuthLogin } from './auth/useAuthLogin';
import { useAuthLogout } from './auth/useAuthLogout';
import { useAuthRegistration } from './auth/useAuthRegistration';

export const useAuthActions = (
  setUser: React.Dispatch<React.SetStateAction<User>>,
  setIsRegistered: React.Dispatch<React.SetStateAction<boolean>>,
  navigate: NavigateFunction
) => {
  const {
    isLoading,
    checkAuth,
    setRedirectPath,
    isProcessing,
    setIsProcessing,
    setIsLoading
  } = useAuthChecker(setUser, setIsRegistered, navigate);

  const [redirectPath, setRedirectPathState] = useState<string | null>(null);
  
  // Set up the redirectPath state
  const handleSetRedirectPath = (path: string | null) => {
    setRedirectPath(path);
    setRedirectPathState(path);
  };

  const { handleLogin } = useAuthLogin(
    setUser,
    setIsRegistered,
    navigate,
    isProcessing,
    setIsProcessing,
    setIsLoading,
    handleSetRedirectPath,
    redirectPath
  );

  const { handleLogout } = useAuthLogout(
    setUser,
    setIsRegistered,
    navigate,
    isProcessing,
    setIsProcessing,
    setIsLoading
  );

  const { registerUserHandler } = useAuthRegistration(
    setUser,
    isProcessing,
    setIsProcessing,
    checkAuth
  );

  return { 
    isLoading, 
    checkAuth, 
    handleLogin, 
    handleLogout, 
    registerUserHandler 
  };
};
