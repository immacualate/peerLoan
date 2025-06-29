
import { User } from "@/types/authTypes";
import { LoanContract, LoanCreationResult } from "./types";
import { calculateInterestRate, generateRepaymentSchedule } from "./calculations";
import { getStoredLoans, getStoredUserLoans, storeLoanRequest } from "./storage";

// Create loan request
export const createLoanRequest = async (
  borrower: User,
  amount: number,
  duration: number,
  purpose: string
): Promise<LoanCreationResult> => {
  try {
    console.log(`Creating loan request for ${borrower.id}, amount: ${amount}, duration: ${duration} months`);
    
    // Calculate interest rate based on borrower's credit score
    const interestRate = calculateInterestRate(borrower.creditScore || 650);
    
    // Generate loan ID
    const loanId = `LOAN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    // Calculate monthly payment and total repayment
    const totalInterest = (amount * interestRate * duration) / 100;
    const totalAmount = amount + totalInterest;
    const monthlyPayment = totalAmount / duration;
    
    // Create loan contract with correct status type
    const loan: LoanContract = {
      id: loanId,
      borrower: borrower.principalId,
      borrowerName: borrower.id || borrower.principalId?.substring(0, 8),
      lender: null,
      amount: amount,
      duration: duration,
      purpose: purpose,
      interestRate: interestRate,
      monthlyPayment: Math.round(monthlyPayment * 100) / 100,
      totalRepayment: Math.round(totalAmount * 100) / 100,
      creditScore: borrower.creditScore || 650,
      status: "pending",
      createdAt: new Date().toISOString(),
      description: `Loan for ${purpose} requested by a verified student borrower.`,
      repaymentSchedule: generateRepaymentSchedule(amount, duration, interestRate)
    };
    
    // Store loan contract in localStorage
    const loans = getStoredLoans();
    loans[loanId] = loan;
    
    localStorage.setItem('peerloan_loans', JSON.stringify(loans));
    
    // Add loan to user's loans
    const userLoans = getStoredUserLoans();
    if (!userLoans[borrower.principalId]) {
      userLoans[borrower.principalId] = [];
    }
    userLoans[borrower.principalId].push(loanId);
    localStorage.setItem('peerloan_user_loans', JSON.stringify(userLoans));
    
    // Also store in loanRequests for the LoanPool component
    storeLoanRequest(loan);
    
    return { success: true, loanId };
  } catch (error) {
    console.error("Error creating loan request:", error);
    return { success: false, error: "Failed to create loan request" };
  }
};
