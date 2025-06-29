
import { LoanRequest, LocalStorageLoan, LoanResponse } from './types';

export const saveLoanToLocalStorage = (loan: LocalStorageLoan): LoanResponse => {
  try {
    const storedRequests = localStorage.getItem('loanRequests');
    let requests = storedRequests ? JSON.parse(storedRequests) : [];
    requests.push(loan);
    localStorage.setItem('loanRequests', JSON.stringify(requests));
    return { success: true, loanId: loan.id };
  } catch (e) {
    console.error("localStorage error:", e);
    return { success: false, message: "Failed to create loan request" };
  }
};

export const getPendingLoansFromStorage = (options: {query?: string} = {}): LocalStorageLoan[] => {
  try {
    const storedRequests = localStorage.getItem('loanRequests');
    if (!storedRequests) return [];
    const requests = JSON.parse(storedRequests);
    return requests.filter((req: LocalStorageLoan) => req.status === 'pending');
  } catch (error) {
    console.error("Error getting loans from storage:", error);
    return [];
  }
};

export const updateLoanInStorage = (
  loanId: string, 
  lenderId: string
): boolean => {
  try {
    const storedRequests = localStorage.getItem('loanRequests');
    if (!storedRequests) return false;
    
    let requests = JSON.parse(storedRequests);
    const updatedRequests = requests.map((req: LocalStorageLoan) => {
      if (req.id === loanId) {
        return {
          ...req,
          status: 'funded',
          lenderId,
          fundedAt: new Date().toISOString()
        };
      }
      return req;
    });
    
    localStorage.setItem('loanRequests', JSON.stringify(updatedRequests));
    return true;
  } catch (error) {
    console.error("Error updating loan in storage:", error);
    return false;
  }
};
