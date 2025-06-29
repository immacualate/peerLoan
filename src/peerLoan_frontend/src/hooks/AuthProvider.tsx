
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, anonymousUser } from '../types/authTypes';
import AuthContext from './AuthContext';
import { useAuthActions } from './useAuthActions';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(anonymousUser);
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { 
    isLoading, 
    checkAuth, 
    handleLogin, 
    handleLogout, 
    registerUserHandler 
  } = useAuthActions(setUser, setIsRegistered, navigate);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    user,
    isLoading,
    login: handleLogin,
    logout: handleLogout,
    checkAuth,
    isRegistered,
    setIsRegistered,
    registerUser: registerUserHandler
  }), [user, isLoading, handleLogin, handleLogout, checkAuth, isRegistered, registerUserHandler]);

  // Only check auth on mount, don't handle routing here
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
