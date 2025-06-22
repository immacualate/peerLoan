
export { 
  checkIfVerified,
  getStudentVerification as getStudentVerificationCore
} from './verificationCore';

export * from './validationUtils';

export { 
  getStudentVerifications,
  getStudentVerification as getStoredStudentVerification,
  saveStudentVerification as saveStoredStudentVerification,
  removeStudentVerification 
} from './storageUtils';

export { 
  getStudentVerificationFromSupabase 
} from './supabaseVerification';
