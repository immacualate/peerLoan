
import { User } from "@/types/authTypes";
import { LoanContract } from "../smart-contract/types";
import { mockLoans, mockUserLoans, ICP_ENABLED } from "./storage";

// Get loans for a specific user
export const getUserLoans = async (user: User): Promise<LoanContract[]> => {
  if (ICP_ENABLED) {
    console.log("ICP integration not yet implemented");
  }
  const loanIds = mockUserLoans[user.principalId] || [];
  const userLoanContracts = loanIds.map(id => mockLoans[id]).filter(Boolean);
  return userLoanContracts;
};

// Get all pending loans - make sure to accept the options parameter
export const getPendingLoans = async (options: {query?: string} = {}): Promise<LoanContract[]> => {
  if (ICP_ENABLED) {
    console.log("ICP integration not yet implemented");
  }
  // Can use options.query for filtering if needed
  console.log("Query options:", options);
  const pendingLoans = Object.values(mockLoans).filter(loan => loan.status === "pending");
  return pendingLoans;
};
