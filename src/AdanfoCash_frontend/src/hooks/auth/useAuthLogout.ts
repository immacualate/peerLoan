
import { useCallback } from 'react';
import { NavigateFunction } from 'react-router-dom';
import { User } from '../../types/authTypes';
import { useToast } from "@/components/ui/use-toast";
import { logout as authLogout } from '../../services/authOperations';

export const useAuthLogout = (
  setUser: React.Dispatch<React.SetStateAction<User>>,
  setIsRegistered: React.Dispatch<React.SetStateAction<boolean>>,
  navigate: NavigateFunction,
  isProcessing: boolean,
  setIsProcessing: (value: boolean) => void,
  setIsLoading: (value: boolean) => void
) => {
  const { toast } = useToast();

  const handleLogout = useCallback(async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    setIsLoading(true);
    
    try {
      await authLogout();
      setUser((prevUser) => ({ ...prevUser, isAuthenticated: false, role: "unregistered" }));
      setIsRegistered(false);
      toast({
        title: "Logged Out",
        description: "You've been successfully signed out of Internet Identity.",
      });
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Logout Error",
        description: "There was a problem during the logout process.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setIsProcessing(false);
    }
  }, [navigate, toast, isProcessing, setUser, setIsRegistered, setIsProcessing, setIsLoading]);

  return { handleLogout };
};
