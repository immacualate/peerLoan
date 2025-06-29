
// This file serves as a bridge to the refactored user services
// It re-exports everything from the services/user folder

import { 
  getCurrentUser, 
  registerUser, 
  updateVerificationStatus 
} from './user/userService';

import {
  saveStudentVerification,
  getStudentVerification,
  validateStudentEligibility,
  checkIfVerified
} from './user/studentService';

import { 
  verifyStudentByIdAndUniversity 
} from './user/studentVerificationService';

import { 
  updateCreditScore,
  recordLoanRepayment
} from './user/creditService';

export {
  // User service
  getCurrentUser,
  registerUser,
  updateVerificationStatus,
  
  // Student service
  saveStudentVerification,
  getStudentVerification,
  validateStudentEligibility,
  checkIfVerified,
  
  // Student verification service
  verifyStudentByIdAndUniversity,
  
  // Credit service
  updateCreditScore,
  recordLoanRepayment
};
