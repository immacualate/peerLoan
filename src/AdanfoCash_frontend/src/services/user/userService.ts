
import { User, UserRole, anonymousUser, StudentInfo } from "@/types/authTypes";
import { getIdentity, isAuthenticated } from "../authClient";
import { getRegistration, getRegistrations, generateNameFromPrincipal } from "./storageUtils";
import { REGISTRATION_KEY } from "./userTypes";
import { getStudentVerification, checkIfVerified } from "./studentService";

// Get current user information
export const getCurrentUser = async (): Promise<User> => {
  if (!(await isAuthenticated())) {
    return anonymousUser;
  }

  const identity = await getIdentity();
  
  if (!identity) {
    return anonymousUser;
  }
  
  // Get principal ID from identity
  const principalId = identity.getPrincipal().toString();
  
  // Check if user is registered FIRST
  const registrationData = getRegistration(principalId);
  
  // If user is registered, use the stored verification status - NO RE-CHECKING
  if (registrationData) {
    console.log(`getCurrentUser: User ${principalId} is registered, using stored verification status`);
    return {
      id: registrationData.name || generateNameFromPrincipal(principalId),
      principalId,
      role: registrationData.role,
      isAuthenticated: true,
      creditScore: registrationData.role === "borrower" ? registrationData.creditScore || 0 : 0,
      isVerified: registrationData.isVerified || true, // Force true for registered users
      studentInfo: registrationData.studentInfo || undefined
    };
  }
  
  // Only check verification for unregistered users
  let studentInfo: StudentInfo | null = null;
  try {
    studentInfo = await getStudentVerification(principalId);
  } catch (error) {
    console.error("Error getting student verification:", error);
  }
  
  // Direct check for verification status from student verification data
  const isVerified = !!studentInfo || await checkIfVerified(principalId);
  console.log(`getCurrentUser: Verification status for unregistered user ${principalId}:`, isVerified);
  
  // User is authenticated but not registered
  return {
    id: studentInfo?.fullName || generateNameFromPrincipal(principalId),
    principalId,
    role: "unregistered",
    isAuthenticated: true,
    creditScore: 0,
    isVerified,
    studentInfo: studentInfo || undefined
  };
};

// Register user as borrower or lender with permanent verification lock
export const registerUser = async (principalId: string, role: "borrower" | "lender", name: string): Promise<boolean> => {
  try {
    const registrations = getRegistrations();
    
    // Get student info for borrowers
    let studentInfo = null;
    if (role === "borrower") {
      try {
        studentInfo = await getStudentVerification(principalId);
      } catch (error) {
        console.error("Error getting student verification during registration:", error);
      }
    }
    
    // Use real name from student verification if available for borrowers
    const displayName = (role === "borrower" && studentInfo?.fullName) 
      ? studentInfo.fullName 
      : name || generateNameFromPrincipal(principalId);
    
    // Start credit score at 650 for borrowers with verified student status
    const initialCreditScore = role === "borrower" ? 650 : 0;
    
    // For borrowers, final verification check
    const isVerified = role === "borrower" ? (!!studentInfo || await checkIfVerified(principalId)) : false;
    
    console.log(`Registration: Final verification check: ${isVerified}`);
    
    if (role === "borrower" && !isVerified) {
      console.error("Cannot register unverified borrower");
      return false;
    }
    
    // Store registration with PERMANENT verification status
    registrations[principalId] = {
      role,
      name: displayName,
      registeredAt: new Date().toISOString(),
      creditScore: initialCreditScore,
      isVerified: true, // ALWAYS true for registered users - PERMANENT LOCK
      studentInfo: studentInfo || undefined
    };
    
    localStorage.setItem(REGISTRATION_KEY, JSON.stringify(registrations));
    
    // Set permanent verification cache
    localStorage.setItem(`verification_status_${principalId}`, 'true');
    localStorage.setItem(`user_registered_${principalId}`, 'true');
    
    console.log(`User ${principalId} registered as ${role} with PERMANENT verification status`);
    return true;
  } catch (error) {
    console.error("Error registering user:", error);
    return false;
  }
};

// Update user credit score
export const updateCreditScore = (principalId: string, newScore: number): boolean => {
  try {
    const registrations = getRegistrations();
    
    if (registrations[principalId]) {
      registrations[principalId].creditScore = newScore;
      localStorage.setItem(REGISTRATION_KEY, JSON.stringify(registrations));
      console.log(`Credit score updated for ${principalId}: ${newScore}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("Error updating credit score:", error);
    return false;
  }
};

// Record loan repayment and update credit score
export const recordLoanRepayment = (principalId: string, amount: number, isOnTime: boolean): boolean => {
  try {
    const registrations = getRegistrations();
    
    if (registrations[principalId] && registrations[principalId].role === "borrower") {
      const currentScore = registrations[principalId].creditScore || 650;
      
      // Adjust credit score based on repayment
      let adjustment = 0;
      if (isOnTime) {
        adjustment = Math.min(10, amount / 100); // Up to 10 points for on-time payment
      } else {
        adjustment = -Math.min(50, amount / 50); // Penalty for late payment
      }
      
      const newScore = Math.max(300, Math.min(850, currentScore + adjustment));
      registrations[principalId].creditScore = newScore;
      
      localStorage.setItem(REGISTRATION_KEY, JSON.stringify(registrations));
      console.log(`Loan repayment recorded for ${principalId}: ${amount}, on-time: ${isOnTime}, new score: ${newScore}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("Error recording loan repayment:", error);
    return false;
  }
};

// Update verification status
export const updateVerificationStatus = (principalId: string, isVerified: boolean): boolean => {
  try {
    const registrations = getRegistrations();
    
    if (registrations[principalId]) {
      registrations[principalId].isVerified = isVerified;
      localStorage.setItem(REGISTRATION_KEY, JSON.stringify(registrations));
      
      // Also update localStorage cache
      if (isVerified) {
        localStorage.setItem(`verification_status_${principalId}`, 'true');
      } else {
        localStorage.removeItem(`verification_status_${principalId}`);
      }
      
      console.log(`Verification status updated for ${principalId}: ${isVerified}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("Error updating verification status:", error);
    return false;
  }
};
