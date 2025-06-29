
import { StudentInfo } from '@/types/authTypes';
import { getStudentVerifications } from './storageUtils';

export const checkIfVerified = async (principalId: string): Promise<boolean> => {
  try {
    // Check cached status first
    const cachedStatus = localStorage.getItem(`verification_status_${principalId}`);
    if (cachedStatus === 'true') {
      console.log("User is verified (cached)");
      return true;
    }
    
    // Check stored verifications
    const verifications = getStudentVerifications();
    const userVerification = verifications[principalId];
    
    if (userVerification) {
      // Cache the result
      localStorage.setItem(`verification_status_${principalId}`, 'true');
      console.log("User is verified (stored)");
      return true;
    }
    
    console.log("User is not verified");
    return false;
  } catch (error) {
    console.error("Error checking verification status:", error);
    return false;
  }
};

export const getStudentVerification = async (principalId: string): Promise<StudentInfo | null> => {
  try {
    const verifications = getStudentVerifications();
    const userVerification = verifications[principalId];
    
    if (userVerification) {
      console.log("Found student verification for", principalId);
      return userVerification;
    }
    
    console.log("No student verification found for", principalId);
    return null;
  } catch (error) {
    console.error("Error getting student verification:", error);
    return null;
  }
};
