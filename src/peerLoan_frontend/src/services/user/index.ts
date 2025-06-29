
// Re-export all user-related functions with explicit naming to avoid conflicts
export { 
  getCurrentUser, 
  registerUser, 
  updateCreditScore, 
  recordLoanRepayment, 
  updateVerificationStatus 
} from './userService';

export { 
  getRegistrations, 
  getRegistration, 
  getLoanHistory, 
  saveLoanHistory, 
  generateNameFromPrincipal 
} from './storageUtils';

export * from './userTypes';

export { 
  getStudentVerification as getStudentVerificationData,
  saveStudentVerification as saveStudentVerificationData,
  checkIfVerified,
  validateStudentEligibility 
} from './studentService';

export { 
  checkIfVerified as checkVerificationStatus,
  getStudentVerification as getVerificationCore
} from './verification/verificationCore';

export { 
  getStudentVerification as getStoredStudentVerification,
  saveStudentVerification as saveStoredStudentVerification,
  removeStudentVerification 
} from './verification/storageUtils';

export { 
  getStudentVerificationFromSupabase 
} from './verification/supabaseVerification';
