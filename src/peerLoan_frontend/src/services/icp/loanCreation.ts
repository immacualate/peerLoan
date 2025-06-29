
import { User } from "@/types/authTypes";
import { LoanContract, LoanCreationResult } from "../smart-contract/types";
import { calculateInterestRate, generateRepaymentSchedule } from "./calculations";
import { mockLoans, mockUserLoans, saveMockLoans, saveMockUserLoans, storeLoanRequest, ICP_ENABLED } from "./storage";

// Create a new loan request
export const createLoanRequest = async (
  borrower: User,
  amount: number,
  duration: number,
  purpose: string
): Promise<LoanCreationResult> => {
  try {
    console.log(`Creating loan request for ${borrower.id}, amount: ${amount}, duration: ${duration} months`);
    if (ICP_ENABLED) {
      console.log("ICP integration not yet implemented");
    }
    // Calculate interest rate
    const interestRate = calculateInterestRate(borrower.creditScore || 650);
    const loanId = `LOAN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const totalInterest = (amount * interestRate * duration) / 100;
    const totalAmount = amount + totalInterest;
    const monthlyPayment = totalAmount / duration;
    const loan: LoanContract = {
      id: loanId,
      borrower: borrower.principalId,
      borrowerName: borrower.id || borrower.principalId?.substring(0, 8),
      lender: null,
      amount,
      duration,
      purpose,
      interestRate,
      monthlyPayment: Math.round(monthlyPayment * 100) / 100,
      totalRepayment: Math.round(totalAmount * 100) / 100,
      creditScore: borrower.creditScore || 650,
      status: "pending",
      createdAt: new Date().toISOString(),
      description: `Loan for ${purpose} requested by a verified student borrower.`,
      repaymentSchedule: generateRepaymentSchedule(amount, duration, interestRate)
    };
    mockLoans[loanId] = loan;
    saveMockLoans();
    if (!mockUserLoans[borrower.principalId]) mockUserLoans[borrower.principalId] = [];
    mockUserLoans[borrower.principalId].push(loanId);
    saveMockUserLoans();
    storeLoanRequest(loan);
    return { success: true, loanId };
  } catch (error) {
    console.error("Error creating loan request:", error);
    return { success: false, error: "Failed to create loan request" };
  }
};
