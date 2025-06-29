
import { useCallback } from 'react';
import { NavigateFunction } from 'react-router-dom';
import { User } from '../../types/authTypes';
import { useToast } from "@/hooks/use-toast";
import { login as authLogin } from '../../services/authOperations';
import { getCurrentUser } from '../../services/user/userService';
import { getDashboardRoute } from '@/utils/authUtils';

export const useAuthLogin = (
  setUser: React.Dispatch<React.SetStateAction<User>>,
  setIsRegistered: React.Dispatch<React.SetStateAction<boolean>>,
  navigate: NavigateFunction,
  isProcessing: boolean,
  setIsProcessing: (value: boolean) => void,
  setIsLoading: (value: boolean) => void,
  setRedirectPath: (path: string | null) => void,
  redirectPath: string | null
) => {
  const { toast } = useToast();

  const handleLogin = useCallback(async (currentPath?: string): Promise<boolean> => {
    if (isProcessing) return false;
    
    setIsProcessing(true);
    setIsLoading(true);
    
    try {
      console.log("Starting login process...");
      
      if (currentPath && currentPath !== '/wallet-connection') {
        setRedirectPath(currentPath);
        console.log("Stored redirect path:", currentPath);
      }
      
      const loginSuccess = await authLogin();
      
      if (loginSuccess) {
        const user = await getCurrentUser();
        
        if (user && user.isAuthenticated) {
          console.log("Login successful, user data:", user);
          setUser(user);
          
          const isUserRegistered = user.role !== 'unregistered';
          setIsRegistered(isUserRegistered);
          
          toast({
            title: "Connection Successful",
            description: `Welcome${user.id ? `, ${user.id.split(' ')[0]}` : ''}! You're now connected.`,
          });
          
          const intendedRegistrationType = localStorage.getItem('intended_registration_type');
          
          let targetRoute = '/';
          
          if (isUserRegistered) {
            targetRoute = getDashboardRoute(user);
            console.log(`Registered user, redirecting to dashboard: ${targetRoute}`);
          } else {
            // Handle unregistered users with intended registration type
            if (intendedRegistrationType === 'borrower') {
              targetRoute = '/borrower-registration';
              console.log("Unregistered user with borrower intent, redirecting to borrower registration");
            } else if (intendedRegistrationType === 'lender') {
              targetRoute = '/lender-registration';
              console.log("Unregistered user with lender intent, redirecting to lender registration");
            } else {
              targetRoute = '/borrower-registration';
              console.log("Unregistered user, redirecting to default registration");
            }
          }
          
          if (redirectPath && isUserRegistered && !intendedRegistrationType) {
            if ((user.role === 'borrower' && redirectPath === '/borrower-dashboard') ||
                (user.role === 'lender' && redirectPath === '/lender-dashboard')) {
              targetRoute = redirectPath;
              console.log("Using stored redirect path:", redirectPath);
            }
          }
          
          if (intendedRegistrationType) {
            localStorage.removeItem('intended_registration_type');
          }
          
          setTimeout(() => {
            navigate(targetRoute, { replace: true });
          }, 100);
          
          setRedirectPath(null);
          
          return true;
        } else {
          console.error("Login failed - could not get user data after login");
          toast({
            title: "Connection Failed",
            description: "Unable to retrieve user data after authentication. Please try again.",
            variant: "destructive"
          });
          return false;
        }
      } else {
        console.error("Login failed - Internet Identity login unsuccessful");
        toast({
          title: "Connection Failed",
          description: "Unable to authenticate with Internet Identity. Please try again.",
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      localStorage.removeItem('intended_registration_type');
      toast({
        title: "Connection Error",
        description: "An error occurred during authentication. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
      setIsProcessing(false);
    }
  }, [
    navigate, 
    toast, 
    isProcessing, 
    setUser, 
    setIsRegistered, 
    setIsProcessing, 
    setIsLoading,
    setRedirectPath,
    redirectPath
  ]);

  return { handleLogin };
};
