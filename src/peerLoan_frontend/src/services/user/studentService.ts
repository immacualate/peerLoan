
import { StudentInfo } from "@/types/authTypes";
import { getStudentVerification as getStoredVerification, saveStudentVerification as saveStoredVerification } from "./verification/storageUtils";
import { checkIfVerified as checkVerificationStatus } from "./verification/verificationCore";

// Get student verification data
export const getStudentVerification = async (principalId: string): Promise<StudentInfo | null> => {
  try {
    // Try to get from storage first
    const stored = getStoredVerification(principalId);
    if (stored) {
      return stored;
    }
    
    // TODO: Add ICP canister call here when backend is ready
    // const actor = await getPeerLoanActor();
    // const result = await actor.getStudentVerification(Principal.fromText(principalId));
    
    return null;
  } catch (error) {
    console.error("Error getting student verification:", error);
    return null;
  }
};

// Save student verification data
export const saveStudentVerification = async (principalId: string, studentInfo: StudentInfo): Promise<boolean> => {
  try {
    // Save to localStorage first
    const success = saveStoredVerification(principalId, studentInfo);
    
    if (success) {
      // Cache verification status
      localStorage.setItem(`verification_status_${principalId}`, 'true');
      
      // TODO: Add ICP canister call here when backend is ready
      // const actor = await getPeerLoanActor();
      // const result = await actor.saveStudentVerification(Principal.fromText(principalId), studentInfo);
      
      console.log("Student verification saved successfully");
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("Error saving student verification:", error);
    return false;
  }
};

// Check if student is verified
export const checkIfVerified = async (principalId: string): Promise<boolean> => {
  return checkVerificationStatus(principalId);
};

// Updated validate student eligibility function with correct signature
export const validateStudentEligibility = (studentInfo: StudentInfo, loanDurationMonths?: number): { isEligible: boolean; reason?: string } => {
  // Basic validation rules
  if (!studentInfo.universityName || !studentInfo.studentId) {
    return { isEligible: false, reason: "Missing university name or student ID" };
  }
  
  if (!studentInfo.isEnrolled) {
    return { isEligible: false, reason: "Student must be currently enrolled" };
  }
  
  if (studentInfo.gpa < 2.0) {
    return { isEligible: false, reason: "Minimum GPA of 2.0 required" };
  }
  
  // Check graduation date is in the future
  const graduationDate = new Date(studentInfo.graduationDate);
  const now = new Date();
  if (graduationDate <= now) {
    return { isEligible: false, reason: "Graduation date must be in the future" };
  }
  
  // If loan duration is provided, check if it's reasonable given graduation timeline
  if (loanDurationMonths) {
    const monthsUntilGraduation = Math.ceil((graduationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30));
    if (loanDurationMonths > monthsUntilGraduation + 6) {
      return { 
        isEligible: false, 
        reason: `Loan duration (${loanDurationMonths} months) exceeds time until graduation plus 6 months grace period` 
      };
    }
  }
  
  return { isEligible: true };
};
