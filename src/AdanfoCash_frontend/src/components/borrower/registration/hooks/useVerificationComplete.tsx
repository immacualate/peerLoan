
import { useCallback, useRef } from 'react';

export const useVerificationComplete = ({
  setIsVerifying,
  toast,
  redirectAttempted,
  onSubmit
}) => {
  const completionInProgress = useRef(false);
  
  return useCallback(async (success: boolean) => {
    if (completionInProgress.current) {
      console.log("Verification completion already in progress, skipping");
      return;
    }
    
    completionInProgress.current = true;
    console.log("Verification complete, success:", success);
    
    if (success) {
      toast({
        title: "Verification Successful",
        description: "Your student status has been verified. Completing registration...",
      });
      
      try {
        // Submit registration and let the registration submit handle redirection
        console.log("Starting registration submission...");
        await onSubmit();
        
      } catch (error) {
        console.error("Registration submission failed:", error);
        
        toast({
          title: "Registration Issue",
          description: "There was an issue completing registration. Please try again.",
          variant: "destructive"
        });
      }
    } else {
      console.log("Verification failed, resetting state");
      redirectAttempted.current = false;
      completionInProgress.current = false;
    }
    
    setIsVerifying(false);
  }, [toast, onSubmit, setIsVerifying, redirectAttempted]);
};
