
import { User } from "@/types/authTypes";
import { LoanActionResult } from "./types";
import { getStoredLoans, getStoredUserLoans, updateLoanRequestStatus } from "./storage";

// Fund loan
export const fundLoan = async (
  lender: User,
  loanId: string
): Promise<LoanActionResult> => {
  try {
    // Get loan contract
    const loans = getStoredLoans();
    const loan = loans[loanId];
    
    if (!loan) {
      return { success: false, error: "Loan not found" };
    }
    
    if (loan.status !== "pending") {
      return { success: false, error: "Loan is not available for funding" };
    }
    
    // Update loan with lender and change status
    loan.lender = lender.principalId;
    loan.status = "active";
    loans[loanId] = loan;
    
    localStorage.setItem('adanfocash_loans', JSON.stringify(loans));
    
    // Add loan to lender's funded loans
    const userLoans = getStoredUserLoans();
    if (!userLoans[lender.principalId]) {
      userLoans[lender.principalId] = [];
    }
    userLoans[lender.principalId].push(loanId);
    localStorage.setItem('adanfocash_user_loans', JSON.stringify(userLoans));
    
    // Also update the loan in loanRequests
    updateLoanRequestStatus(loanId, "funded", lender.principalId);
    
    return { success: true };
  } catch (error) {
    console.error("Error funding loan:", error);
    return { success: false, error: "Failed to fund loan" };
  }
};

// Make repayment
export const makeRepayment = async (
  borrower: User,
  loanId: string,
  amount: number
): Promise<LoanActionResult> => {
  try {
    // Get loan contract
    const loans = getStoredLoans();
    const loan = loans[loanId];
    
    if (!loan) {
      return { success: false, error: "Loan not found" };
    }
    
    if (loan.borrower !== borrower.principalId) {
      return { success: false, error: "Not authorized to repay this loan" };
    }
    
    if (loan.status !== "active") {
      return { success: false, error: "Loan is not active" };
    }
    
    // Find the next unpaid repayment
    const nextRepaymentIndex = loan.repaymentSchedule.findIndex(r => !r.isPaid);
    if (nextRepaymentIndex === -1) {
      return { success: false, error: "No pending repayments" };
    }
    
    const nextRepayment = loan.repaymentSchedule[nextRepaymentIndex];
    const dueDate = new Date(nextRepayment.dueDate);
    const now = new Date();
    
    // Check if payment is on time (within 3 days of due date)
    const isOnTime = now <= new Date(dueDate.getTime() + 3 * 24 * 60 * 60 * 1000);
    
    // Update repayment
    loan.repaymentSchedule[nextRepaymentIndex] = {
      ...nextRepayment,
      isPaid: true,
      paidAt: now.toISOString(),
      paidAmount: amount
    };
    
    // Check if all repayments are complete
    const isComplete = loan.repaymentSchedule.every(r => r.isPaid);
    if (isComplete) {
      loan.status = "repaid";
    }
    
    // Update loan in storage
    loans[loanId] = loan;
    localStorage.setItem('adanfocash_loans', JSON.stringify(loans));
    
    // Record payment history for credit scoring
    const { recordLoanRepayment } = await import('@/services/user/creditService');
    recordLoanRepayment(borrower.principalId, loanId, isOnTime);
    
    return { success: true, creditScoreChange: isOnTime ? 5 : -10 };
  } catch (error) {
    console.error("Error making repayment:", error);
    return { success: false, error: "Failed to process repayment" };
  }
};
