
import { useCallback } from 'react';
import { User } from '../../types/authTypes';
import { useToast } from "@/hooks/use-toast";
import { registerUser as registerUserService } from '../../services/user/userService';
import { checkIfVerified } from '../../services/user/verification/verificationCore';

export const useAuthRegistration = (
  setUser: React.Dispatch<React.SetStateAction<User>>,
  isProcessing: boolean,
  setIsProcessing: (value: boolean) => void,
  checkAuth: () => Promise<void>
) => {
  const { toast } = useToast();

  const registerUserHandler = useCallback(async (role: "borrower" | "lender", name: string) => {
    if (isProcessing) {
      console.log("Registration already in progress");
      return false;
    }
    
    setIsProcessing(true);
    
    try {
      console.log(`Starting registration as ${role} with name: ${name}`);
      
      const currentUser = await import('../../services/user/userService').then(m => m.getCurrentUser());
      
      if (!currentUser.isAuthenticated || !currentUser.principalId) {
        toast({
          title: "Registration Error",
          description: "You must be logged in to register.",
          variant: "destructive"
        });
        return false;
      }
      
      // For borrowers, ensure they're verified before registration
      if (role === "borrower" && !currentUser.isVerified) {
        console.error("Verification required for borrower registration");
        toast({
          title: "Verification Required",
          description: "You must complete student verification before registering as a borrower.",
          variant: "destructive"
        });
        return false;
      }
      
      console.log("Calling registerUserService");
      const success = await registerUserService(currentUser.principalId, role, name);
      
      if (success) {
        console.log("Registration successful, setting completion flags");
        
        // Set registration completion flags
        localStorage.setItem('recent_registration', 'true');
        localStorage.setItem('registration_complete', 'true');
        localStorage.setItem(`user_registered_${currentUser.principalId}`, 'true');
        
        // Clear the flags after delay to prevent indefinite access
        setTimeout(() => {
          localStorage.removeItem('recent_registration');
        }, 30000); // 30 seconds
        
        // Refresh auth state
        await checkAuth();
        
        toast({
          title: "Registration Successful",
          description: `You are now registered as a ${role === "borrower" ? "student borrower" : "lender"}.`,
        });
        
        return true;
      } else {
        console.error("Registration service returned failure");
        toast({
          title: "Registration Failed",
          description: "Could not complete registration.",
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Error",
        description: "There was a problem during the registration process.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsProcessing(false);
    }
  }, [toast, checkAuth, isProcessing, setIsProcessing]);

  return { registerUserHandler };
};
