
// Re-export all loan contract functions from their respective modules
import { createLoanRequest } from './loanCreation';
import { fundLoan, makeRepayment } from './loanActions';
import { getUserLoans, getPendingLoans } from './loanQueries';
import { calculateInterestRate, generateRepaymentSchedule } from './calculations';
import { 
  getStoredLoans, 
  getStoredUserLoans, 
  storeLoanRequest, 
  updateLoanRequestStatus 
} from './storage';

// Export types properly
export type { 
  LoanContract, 
  RepaymentSchedule, 
  LoanCreationResult, 
  LoanActionResult 
} from './types';

export {
  // Loan creation
  createLoanRequest,
  
  // Loan actions
  fundLoan,
  makeRepayment,
  
  // Loan queries
  getUserLoans,
  getPendingLoans,
  
  // Calculations
  calculateInterestRate,
  generateRepaymentSchedule,
  
  // Storage utilities
  getStoredLoans,
  getStoredUserLoans,
  storeLoanRequest,
  updateLoanRequestStatus
};
