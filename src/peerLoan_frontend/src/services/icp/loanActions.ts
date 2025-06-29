import { User } from "@/types/authTypes";
import { LoanActionResult, LoanContract } from "../smart-contract/types";
import { mockLoans, mockUserLoans, saveMockLoans, saveMockUserLoans, updateLoanRequestInPool, ICP_ENABLED } from "./storage";

// Fund a loan
export const fundLoan = async (
  lender: User,
  loanId: string
): Promise<LoanActionResult> => {
  try {
    const loan = mockLoans[loanId];
    if (!loan) return { success: false, error: "Loan not found" };
    if (loan.status !== "pending") return { success: false, error: "Loan is not available for funding" };
    if (ICP_ENABLED) {
      console.log("ICP integration not yet implemented");
    }
    loan.lender = lender.principalId;
    loan.status = "active";
    mockLoans[loanId] = loan;
    saveMockLoans();
    if (!mockUserLoans[lender.principalId]) mockUserLoans[lender.principalId] = [];
    mockUserLoans[lender.principalId].push(loanId);
    saveMockUserLoans();
    
    // Make sure we only update properties that exist on the LoanContract type
    updateLoanRequestInPool(loanId, {
      status: "active",
      lender: lender.principalId
    });
    
    return { success: true };
  } catch (error) {
    console.error("Error funding loan:", error);
    return { success: false, error: "Failed to fund loan" };
  }
};

// Make a loan repayment
export const makeRepayment = async (
  borrower: User,
  loanId: string,
  amount: number
): Promise<LoanActionResult> => {
  try {
    const loan = mockLoans[loanId];
    if (!loan) return { success: false, error: "Loan not found" };
    if (loan.borrower !== borrower.principalId) return { success: false, error: "Not authorized to repay this loan" };
    if (loan.status !== "active") return { success: false, error: "Loan is not active" };
    if (ICP_ENABLED) {
      console.log("ICP integration not yet implemented");
    }
    const nextRepaymentIndex = loan.repaymentSchedule.findIndex(r => !r.isPaid);
    if (nextRepaymentIndex === -1) return { success: false, error: "No pending repayments" };
    const nextRepayment = loan.repaymentSchedule[nextRepaymentIndex];
    const dueDate = new Date(nextRepayment.dueDate);
    const now = new Date();
    const isOnTime = now <= new Date(dueDate.getTime() + 3 * 24 * 60 * 60 * 1000);
    loan.repaymentSchedule[nextRepaymentIndex] = {
      ...nextRepayment,
      isPaid: true,
      paidAt: now.toISOString(),
      paidAmount: amount
    };
    const isComplete = loan.repaymentSchedule.every(r => r.isPaid);
    if (isComplete) {
      loan.status = "repaid";
    }
    mockLoans[loanId] = loan;
    saveMockLoans();
    return { 
      success: true, 
      creditScoreChange: isOnTime ? 5 : -10 
    };
  } catch (error) {
    console.error("Error making repayment:", error);
    return { success: false, error: "Failed to process repayment" };
  }
};
