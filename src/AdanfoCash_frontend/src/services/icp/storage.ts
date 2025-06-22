
import { LoanContract } from "../smart-contract/types";

// Enable ICP integration for production use
export const ICP_ENABLED = true;

// Mock storage for development - will be replaced with ICP calls
export let mockLoans: Record<string, LoanContract> = {};
export let mockUserLoans: Record<string, string[]> = {};

// Initialize from localStorage if available
(() => {
  try {
    const storedLoans = localStorage.getItem('adanfocash_loans');
    if (storedLoans) mockLoans = JSON.parse(storedLoans);
    const storedUserLoans = localStorage.getItem('adanfocash_user_loans');
    if (storedUserLoans) mockUserLoans = JSON.parse(storedUserLoans);
  } catch (e) {
    console.error("Error initializing mock loans:", e);
  }
})();

// Storage helpers
export const saveMockLoans = () => {
  localStorage.setItem('adanfocash_loans', JSON.stringify(mockLoans));
};
export const saveMockUserLoans = () => {
  localStorage.setItem('adanfocash_user_loans', JSON.stringify(mockUserLoans));
};

// Helper for loanRequests in LoanPool component (temporary)
export const storeLoanRequest = (loan: LoanContract) => {
  try {
    const storedRequests = localStorage.getItem('loanRequests');
    let requests = storedRequests ? JSON.parse(storedRequests) : [];
    requests.push(loan);
    localStorage.setItem('loanRequests', JSON.stringify(requests));
  } catch (error) {
    console.error("Error storing loan request locally:", error);
  }
};

// Helper for updating loanRequests
export const updateLoanRequestInPool = (loanId: string, update: Partial<LoanContract>) => {
  try {
    const storedRequests = localStorage.getItem('loanRequests');
    if (storedRequests) {
      let requests = JSON.parse(storedRequests);
      requests = requests.map((req: any) => (req.id === loanId ? { ...req, ...update } : req));
      localStorage.setItem('loanRequests', JSON.stringify(requests));
    }
  } catch (error) {
    console.error("Error updating loan request status locally:", error);
  }
};
