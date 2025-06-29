
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuthContext';
import { StudentInfo } from '@/types/authTypes';
import { checkIfVerified, getStudentVerification } from '@/services/user/verification/verificationCore';

export const useStudentData = () => {
  const { user, checkAuth } = useAuth();
  const [verificationStatus, setVerificationStatus] = useState(user.isVerified || false);
  const [studentInfo, setStudentInfo] = useState<StudentInfo | undefined>(user.studentInfo);
  const [isLoadingVerification, setIsLoadingVerification] = useState(true);
  
  // Fetch user data from ICP blockchain when dashboard loads or user connects
  useEffect(() => {
    let isMounted = true;
    
    const fetchUserData = async () => {
      console.log("useStudentData: Fetching user data from ICP blockchain...");
      
      setIsLoadingVerification(true);
      
      try {
        // Call auth refresh to make sure we have the latest user data
        await checkAuth();
        
        if (user.principalId && isMounted) {
          console.log("Checking verification status on ICP for:", user.principalId);
          
          try {
            // Check if user is verified first
            const isVerified = await checkIfVerified(user.principalId);
            console.log("ICP verification check result:", isVerified);
            
            if (isMounted) {
              setVerificationStatus(isVerified);
            }
            
            // If verified, get the full student info
            if (isVerified) {
              console.log("User is verified, fetching student info from ICP...");
              const info = await getStudentVerification(user.principalId);
              
              if (isMounted && info) {
                console.log("Retrieved student info from ICP:", info);
                setStudentInfo(info);
                
                // Force an auth check to update the global state with this info
                await checkAuth();
              }
            }
          } catch (error) {
            console.error("Error checking verification with ICP:", error);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        if (isMounted) {
          setIsLoadingVerification(false);
        }
      }
    };
    
    fetchUserData();
    
    return () => {
      isMounted = false;
    };
  }, [user.principalId, checkAuth]);

  // Use combined student info from state or user object
  const effectiveStudentInfo = studentInfo || user.studentInfo;
  const effectiveUser = {
    ...user,
    studentInfo: effectiveStudentInfo,
    isVerified: verificationStatus
  };

  return {
    verificationStatus,
    setVerificationStatus,
    isLoadingVerification,
    setIsLoadingVerification,
    effectiveUser
  };
};
