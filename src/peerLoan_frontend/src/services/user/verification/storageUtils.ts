
import { StudentInfo } from "@/types/authTypes";

const STUDENT_VERIFICATION_KEY = 'adanfo_student_verifications';

// Get all student verifications from localStorage
export const getStudentVerifications = (): Record<string, StudentInfo> => {
  try {
    const stored = localStorage.getItem(STUDENT_VERIFICATION_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error("Error getting student verifications:", error);
    return {};
  }
};

// Get student verification for a specific principal
export const getStudentVerification = (principalId: string): StudentInfo | null => {
  const verifications = getStudentVerifications();
  return verifications[principalId] || null;
};

// Save student verification for a principal
export const saveStudentVerification = (principalId: string, studentInfo: StudentInfo): boolean => {
  try {
    const verifications = getStudentVerifications();
    verifications[principalId] = {
      ...studentInfo,
      zkVerification: {
        verifiedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(), // 6 months
        proofType: "zk-student-verification-v1",
        verifier: "adanfo-academic-verifier"
      }
    };
    
    localStorage.setItem(STUDENT_VERIFICATION_KEY, JSON.stringify(verifications));
    console.log(`Student verification saved for ${principalId}`);
    return true;
  } catch (error) {
    console.error("Error saving student verification:", error);
    return false;
  }
};

// Remove student verification
export const removeStudentVerification = (principalId: string): boolean => {
  try {
    const verifications = getStudentVerifications();
    delete verifications[principalId];
    localStorage.setItem(STUDENT_VERIFICATION_KEY, JSON.stringify(verifications));
    
    // Also remove cached verification status
    localStorage.removeItem(`verification_status_${principalId}`);
    
    console.log(`Student verification removed for ${principalId}`);
    return true;
  } catch (error) {
    console.error("Error removing student verification:", error);
    return false;
  }
};
