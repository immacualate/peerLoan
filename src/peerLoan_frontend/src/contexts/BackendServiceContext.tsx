import React, { createContext, useContext, ReactNode } from 'react';
import { useBackendService, UseBackendServiceReturn } from '../hooks/useBackendService';

const BackendServiceContext = createContext<UseBackendServiceReturn | undefined>(undefined);

export interface BackendServiceProviderProps {
  children: ReactNode;
}

export const BackendServiceProvider: React.FC<BackendServiceProviderProps> = ({ children }) => {
  const backendService = useBackendService();

  return (
    <BackendServiceContext.Provider value={backendService}>
      {children}
    </BackendServiceContext.Provider>
  );
};

export const useBackendServiceContext = (): UseBackendServiceReturn => {
  const context = useContext(BackendServiceContext);
  if (context === undefined) {
    throw new Error('useBackendServiceContext must be used within a BackendServiceProvider');
  }
  return context;
};

export default BackendServiceProvider;
