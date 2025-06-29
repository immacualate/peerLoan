
import { v4 as uuidv4 } from 'uuid';

interface Loan {
  id: string;
  amount: number;
  interestRate: number;
  term: number;
  status: 'pending' | 'approved' | 'rejected';
  borrowerId: string;
  createdAt: Date;
  purpose?: string;
}

interface LoanRequestParams {
  borrowerId: string;
  amount: number;
  duration: number;
  purpose: string;
  interestRate: number;
}

interface LoanRequestResult {
  success: boolean;
  message: string;
  loanId?: string;
}

// Function to generate a random number within a range
const getRandomNumber = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

// Function to generate a loan application
const generateLoanApplication = (borrowerId: string, params?: Partial<Omit<Loan, 'id' | 'borrowerId' | 'createdAt' | 'status'>>): Loan => {
  return {
    id: uuidv4(),
    amount: params?.amount || Math.floor(getRandomNumber(1000, 5000)), // Loan amount between $1000 and $5000
    interestRate: params?.interestRate || parseFloat(getRandomNumber(0.05, 0.15).toFixed(2)), // Interest rate between 5% and 15%
    term: params?.term || Math.floor(getRandomNumber(12, 60)), // Loan term between 12 and 60 months
    status: 'pending',
    borrowerId: borrowerId,
    createdAt: new Date(),
    purpose: params?.purpose
  };
};

// Function to simulate submitting a loan application
export const submitLoanApplication = async (borrowerId: string): Promise<Loan> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const newLoan = generateLoanApplication(borrowerId);

  // Save to local storage
  let loans = JSON.parse(localStorage.getItem('loans') || '[]') as Loan[];
  loans.push(newLoan);
  localStorage.setItem('loans', JSON.stringify(loans));

  return newLoan;
};

// Function to handle loan request submission
export const submitLoanRequest = async (params: LoanRequestParams): Promise<LoanRequestResult> => {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const newLoan = generateLoanApplication(params.borrowerId, {
      amount: params.amount,
      term: params.duration,
      interestRate: params.interestRate,
      purpose: params.purpose
    });

    // Save to local storage
    let loans = JSON.parse(localStorage.getItem('loans') || '[]') as Loan[];
    loans.push(newLoan);
    localStorage.setItem('loans', JSON.stringify(loans));

    return {
      success: true,
      message: `Loan request for $${params.amount} has been submitted successfully`,
      loanId: newLoan.id
    };
  } catch (error) {
    console.error("Error submitting loan request:", error);
    return {
      success: false,
      message: "Failed to submit loan request. Please try again later."
    };
  }
};

// Function to simulate fetching pending loan applications from local storage
const getPendingLoansFromStorage = async (options: any): Promise<Loan[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 300));

  let loans = JSON.parse(localStorage.getItem('loans') || '[]') as Loan[];
  // Filter loans by status === 'pending'
  loans = loans.filter(loan => loan.status === 'pending');

  return loans;
};

// Function to simulate fetching pending loan applications from ICP
const getIcpPendingLoans = async (options: any): Promise<Loan[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 300));

  // Placeholder for fetching loans from ICP
  console.log("Fetching pending loans from ICP...");
  return [];
};

// This is the fix for the error showing Expected 1 arguments, but got 0
export const getPendingLoans = async (options = {}) => {
  if (import.meta.env.VITE_USE_ICP_NETWORK === 'true') {
    return await getIcpPendingLoans(options);
  } else {
    return await getPendingLoansFromStorage(options);
  }
};

// Function to simulate fetching loan history from local storage
const getLoanHistoryFromStorage = async (borrowerId: string): Promise<Loan[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 300));

  let loans = JSON.parse(localStorage.getItem('loans') || '[]') as Loan[];
  // Filter loans by borrowerId
  loans = loans.filter(loan => loan.borrowerId === borrowerId);

  return loans;
};

// Function to simulate fetching loan history from ICP
const getIcpLoanHistory = async (borrowerId: string): Promise<Loan[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 300));

  // Placeholder for fetching loan history from ICP
  console.log(`Fetching loan history for borrower ${borrowerId} from ICP...`);
  return [];
};

// Function to fetch loan history
export const getLoanHistory = async (borrowerId: string): Promise<Loan[]> => {
  if (import.meta.env.VITE_USE_ICP_NETWORK === 'true') {
    return await getIcpLoanHistory(borrowerId);
  } else {
    return await getLoanHistoryFromStorage(borrowerId);
  }
};

// Function to fetch borrower loans
export const getBorrowerLoans = async (borrowerId: string): Promise<Loan[]> => {
  return getLoanHistory(borrowerId);
};

// Function to get available loan requests for lenders
export const getAvailableLoanRequests = async (options: any = {}): Promise<Loan[]> => {
  return getPendingLoans(options);
};

// Function to fund a loan request
export const fundLoanRequest = async (lenderId: string, loanId: string): Promise<{success: boolean; message: string}> => {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 600));

    let loans = JSON.parse(localStorage.getItem('loans') || '[]') as Loan[];
    const loanIndex = loans.findIndex(loan => loan.id === loanId);
    
    if (loanIndex === -1) {
      return {
        success: false,
        message: "Loan not found"
      };
    }
    
    // Update loan status to approved
    loans[loanIndex].status = 'approved';
    localStorage.setItem('loans', JSON.stringify(loans));
    
    return {
      success: true,
      message: `Loan ${loanId} has been funded successfully`
    };
  } catch (error) {
    console.error("Error funding loan:", error);
    return {
      success: false,
      message: "Failed to fund loan. Please try again later."
    };
  }
};
