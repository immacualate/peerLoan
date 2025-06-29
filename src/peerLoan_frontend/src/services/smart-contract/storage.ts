
import { LoanContract } from "./types";

// Storage helpers
export const getStoredLoans = (): Record<string, LoanContract> => {
  const storedLoans = localStorage.getItem('peerloan_loans');
  return storedLoans ? JSON.parse(storedLoans) : {};
};

export const getStoredUserLoans = (): Record<string, string[]> => {
  const storedUserLoans = localStorage.getItem('peerloan_user_loans');
  return storedUserLoans ? JSON.parse(storedUserLoans) : {};
};

// Helper function to store loan request for the LoanPool
export const storeLoanRequest = (loan: LoanContract): void => {
  try {
    // Get existing loan requests
    const storedRequests = localStorage.getItem('loanRequests');
    let requests = storedRequests ? JSON.parse(storedRequests) : [];
    
    // Add new request to the list
    requests.push(loan);
    
    // Store updated list
    localStorage.setItem('loanRequests', JSON.stringify(requests));
  } catch (error) {
    console.error("Error storing loan request:", error);
  }
};

export const updateLoanRequestStatus = (
  loanId: string, 
  status: "pending" | "funded" | "active" | "repaid" | "defaulted", 
  lenderId?: string
): void => {
  try {
    // Get existing loan requests
    const storedRequests = localStorage.getItem('loanRequests');
    if (!storedRequests) return;
    
    let requests = JSON.parse(storedRequests);
    
    // Update the status of the matching loan
    requests = requests.map((loan: any) => {
      if (loan.id === loanId) {
        return {
          ...loan,
          status,
          fundedBy: lenderId,
          fundedAt: new Date().toISOString()
        };
      }
      return loan;
    });
    
    // Store updated list
    localStorage.setItem('loanRequests', JSON.stringify(requests));
  } catch (error) {
    console.error("Error updating loan request status:", error);
  }
};
