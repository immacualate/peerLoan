import { useState, useEffect, useCallback } from 'react';
import { Principal } from '@dfinity/principal';
import backendService, { Loan, StudentInfo } from '../services/backendService';

export interface UseBackendServiceReturn {
  // Authentication state
  isAuthenticated: boolean;
  isLoading: boolean;
  currentPrincipal: Principal | null;
  
  // Authentication methods
  login: () => Promise<boolean>;
  logout: () => Promise<void>;
  
  // Student verification
  verifyStudent: (studentData: StudentInfo) => Promise<{ success: boolean; error?: string }>;
  
  // Loan management
  createLoan: (amount: number, duration: number, purpose: string) => Promise<{ success: boolean; loanId?: string; error?: string }>;
  fundLoan: (loanId: string) => Promise<{ success: boolean; error?: string }>;
  repayLoan: (loanId: string, amount: number) => Promise<{ success: boolean; creditScoreChange?: number; error?: string }>;
  
  // Data retrieval
  getUserLoans: () => Promise<{ success: boolean; loans?: Loan[]; error?: string }>;
  getPendingLoans: () => Promise<{ success: boolean; loans?: Loan[]; error?: string }>;
  
  // Data state
  userLoans: Loan[];
  pendingLoans: Loan[];
  
  // Refresh methods
  refreshUserLoans: () => Promise<void>;
  refreshPendingLoans: () => Promise<void>;
}

export const useBackendService = (): UseBackendServiceReturn => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPrincipal, setCurrentPrincipal] = useState<Principal | null>(null);
  const [userLoans, setUserLoans] = useState<Loan[]>([]);
  const [pendingLoans, setPendingLoans] = useState<Loan[]>([]);

  // Initialize the backend service
  useEffect(() => {
    const initializeService = async () => {
      try {
        setIsLoading(true);
        await backendService.init();
        
        const authenticated = await backendService.isAuthenticated();
        setIsAuthenticated(authenticated);
        
        if (authenticated) {
          const principal = await backendService.getCurrentPrincipal();
          setCurrentPrincipal(principal);
          
          // Load initial data
          await Promise.all([
            refreshUserLoans(),
            refreshPendingLoans()
          ]);
        }
      } catch (error) {
        console.error('Failed to initialize backend service:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeService();
  }, []);

  // Authentication methods
  const login = useCallback(async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      const success = await backendService.login();
      
      if (success) {
        setIsAuthenticated(true);
        const principal = await backendService.getCurrentPrincipal();
        setCurrentPrincipal(principal);
        
        // Load user data after login
        await Promise.all([
          refreshUserLoans(),
          refreshPendingLoans()
        ]);
      }
      
      return success;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      await backendService.logout();
      setIsAuthenticated(false);
      setCurrentPrincipal(null);
      setUserLoans([]);
      setPendingLoans([]);
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Data refresh methods
  const refreshUserLoans = useCallback(async (): Promise<void> => {
    if (!isAuthenticated) return;
    
    try {
      const result = await backendService.getUserLoans();
      if (result.success && result.loans) {
        setUserLoans(result.loans);
      }
    } catch (error) {
      console.error('Failed to refresh user loans:', error);
    }
  }, [isAuthenticated]);

  const refreshPendingLoans = useCallback(async (): Promise<void> => {
    try {
      const result = await backendService.getPendingLoans();
      if (result.success && result.loans) {
        setPendingLoans(result.loans);
      }
    } catch (error) {
      console.error('Failed to refresh pending loans:', error);
    }
  }, []);

  // Student verification
  const verifyStudent = useCallback(async (studentData: StudentInfo) => {
    const result = await backendService.verifyStudent(studentData);
    return result;
  }, []);

  // Loan management methods
  const createLoan = useCallback(async (amount: number, duration: number, purpose: string) => {
    const result = await backendService.createLoan(amount, duration, purpose);
    
    if (result.success) {
      // Refresh data after successful loan creation
      await Promise.all([
        refreshUserLoans(),
        refreshPendingLoans()
      ]);
    }
    
    return result;
  }, [refreshUserLoans, refreshPendingLoans]);

  const fundLoan = useCallback(async (loanId: string) => {
    const result = await backendService.fundLoan(loanId);
    
    if (result.success) {
      // Refresh data after successful funding
      await Promise.all([
        refreshUserLoans(),
        refreshPendingLoans()
      ]);
    }
    
    return result;
  }, [refreshUserLoans, refreshPendingLoans]);

  const repayLoan = useCallback(async (loanId: string, amount: number) => {
    const result = await backendService.repayLoan(loanId, amount);
    
    if (result.success) {
      // Refresh data after successful repayment
      await refreshUserLoans();
    }
    
    return result;
  }, [refreshUserLoans]);

  // Direct backend service methods
  const getUserLoans = useCallback(async () => {
    const result = await backendService.getUserLoans();
    if (result.success && result.loans) {
      setUserLoans(result.loans);
    }
    return result;
  }, []);

  const getPendingLoans = useCallback(async () => {
    const result = await backendService.getPendingLoans();
    if (result.success && result.loans) {
      setPendingLoans(result.loans);
    }
    return result;
  }, []);

  return {
    // Authentication state
    isAuthenticated,
    isLoading,
    currentPrincipal,
    
    // Authentication methods
    login,
    logout,
    
    // Student verification
    verifyStudent,
    
    // Loan management
    createLoan,
    fundLoan,
    repayLoan,
    
    // Data retrieval
    getUserLoans,
    getPendingLoans,
    
    // Data state
    userLoans,
    pendingLoans,
    
    // Refresh methods
    refreshUserLoans,
    refreshPendingLoans,
  };
};

export default useBackendService;
