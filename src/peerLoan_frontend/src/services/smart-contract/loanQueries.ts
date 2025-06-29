
import { User } from "@/types/authTypes";
import { LoanContract } from "./types";
import { getStoredLoans, getStoredUserLoans } from "./storage";

// Get loans for a specific user
export const getUserLoans = (user: User): Promise<LoanContract[]> => {
  return new Promise((resolve) => {
    const userLoans = getStoredUserLoans();
    const loans = getStoredLoans();
    
    const loanIds = userLoans[user.principalId] || [];
    const userLoanContracts = loanIds.map(id => loans[id]).filter(Boolean);
    
    resolve(userLoanContracts);
  });
};

// Get all pending loans
export const getPendingLoans = (): Promise<LoanContract[]> => {
  return new Promise((resolve) => {
    const loans = getStoredLoans();
    const pendingLoans = Object.values(loans).filter(loan => loan.status === "pending");
    
    resolve(pendingLoans);
  });
};
