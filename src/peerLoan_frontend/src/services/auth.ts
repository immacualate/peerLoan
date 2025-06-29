
// Re-export everything from refactored files
import { anonymousUser } from "../types/authTypes";
import { getHost } from "./authConfig";
import { isAuthenticated, getIdentity } from "./authClient";
import { 
  getCurrentUser, 
  updateCreditScore, 
  recordLoanRepayment, 
  validateStudentEligibility, 
  saveStudentVerification,
  getStudentVerification,
  checkIfVerified // Make sure this import is from studentService via index.ts
} from "./user";
import { login, logout } from "./authOperations";
import { useAuth } from "../hooks/useAuthContext";
import { AuthProvider } from "../hooks/AuthProvider";

// Export all auth-related functionality
export {
  // Values
  anonymousUser,
  
  // Auth status and identity
  isAuthenticated,
  getIdentity,
  
  // User data
  getCurrentUser,
  updateCreditScore,
  recordLoanRepayment,
  
  // Student verification
  validateStudentEligibility,
  saveStudentVerification,
  getStudentVerification,
  checkIfVerified,
  
  // Auth operations
  login,
  logout,
  
  // Auth hooks and provider
  useAuth,
  AuthProvider,
  
  // Config
  getHost
};

// Re-export User and UserRole types
export type { User, UserRole } from "../types/authTypes";
