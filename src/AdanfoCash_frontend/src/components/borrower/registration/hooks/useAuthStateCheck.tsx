
import { useEffect, useRef } from 'react';

export const useAuthStateCheck = ({
  user,
  checkAuth,
  navigate,
  initialCheckDone
}) => {
  // Use refs to avoid multiple redirects
  const redirectInProgress = useRef(false);
  
  // SIMPLIFIED: Only mark initial check as done, NO automatic redirects
  useEffect(() => {
    console.log("useAuthStateCheck: Checking user state", {
      isAuthenticated: user.isAuthenticated,
      role: user.role,
      redirectInProgress: redirectInProgress.current
    });
    
    // Mark initial check as done after first run
    if (!initialCheckDone.current) {
      initialCheckDone.current = true;
      console.log("useAuthStateCheck: Initial check marked as done");
    }
    
    // NO AUTOMATIC REDIRECTS - Let registration submit handle this
  }, [user.isAuthenticated, user.role]);
  
  // Clean up effect on unmount
  useEffect(() => {
    return () => {
      redirectInProgress.current = true; // Prevent redirects during unmount
    };
  }, []);
};
