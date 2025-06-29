
import { useCallback, useRef } from 'react';

export const useRegistrationSubmit = ({
  isRegistering,
  setIsRegistering,
  user,
  registerUser,
  toast,
  navigate,
  checkAuth,
  redirectAttempted
}) => {
  const submissionInProgress = useRef(false);
  
  const handleSubmit = useCallback(async () => {
    if (isRegistering || redirectAttempted.current || submissionInProgress.current) {
      console.log("Registration: Already in progress or redirect attempted, skipping");
      return;
    }
    
    submissionInProgress.current = true;
    setIsRegistering(true);
    
    try {
      console.log("Registration: Starting registration submission");
      
      // Verify user is authenticated and verified
      if (!user.isAuthenticated) {
        console.log("Registration: User not authenticated");
        toast({
          title: "Authentication Required",
          description: "Please connect your wallet first.",
          variant: "destructive"
        });
        return;
      }
      
      if (!user.isVerified) {
        console.log("Registration: User not verified, cannot proceed");
        toast({
          title: "Verification Required",
          description: "You must complete student verification before registering.",
          variant: "destructive"
        });
        return;
      }
      
      const fullName = user.studentInfo?.fullName || user.id || 'Student User';
      console.log("Registration: Registering with name:", fullName);
      
      const success = await registerUser('borrower', fullName);
      
      if (success) {
        console.log("Registration: SUCCESS - User registered successfully");
        redirectAttempted.current = true;
        
        // Set completion flags for ProtectedRoute
        localStorage.setItem('recent_registration', 'true');
        localStorage.setItem('registration_complete', 'true');
        localStorage.setItem(`user_registered_${user.principalId}`, 'true');
        
        toast({
          title: "Registration Successful!",
          description: "Welcome to peerLoan! Redirecting to your dashboard...",
        });
        
        // Refresh auth state to get updated user role
        console.log("Registration: Refreshing auth state");
        await checkAuth();
        
        // Wait a moment for auth state to update, then redirect
        setTimeout(() => {
          console.log("Registration: Executing dashboard redirect");
          navigate('/borrower-dashboard', { replace: true });
        }, 2000);
        
      } else {
        console.error("Registration: Failed to register user");
        toast({
          title: "Registration Failed",
          description: "There was an error during registration. Please try again.",
          variant: "destructive"
        });
        redirectAttempted.current = false;
      }
    } catch (error) {
      console.error('Registration: Error during submission:', error);
      toast({
        title: "Registration Failed",
        description: "There was an error during registration. Please try again.",
        variant: "destructive"
      });
      redirectAttempted.current = false;
    } finally {
      setIsRegistering(false);
      submissionInProgress.current = false;
    }
  }, [user, registerUser, toast, navigate, isRegistering, setIsRegistering, redirectAttempted, checkAuth]);
  
  return handleSubmit;
};
