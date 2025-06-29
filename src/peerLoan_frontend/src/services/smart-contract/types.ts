
// Types for loan contract interaction
export interface LoanContract {
  id: string;
  borrower: string;
  borrowerName: string;
  lender: string | null;
  amount: number;
  duration: number;
  purpose: string;
  interestRate: number;
  monthlyPayment: number;
  totalRepayment: number;
  creditScore: number;
  status: "pending" | "funded" | "active" | "repaid" | "defaulted";
  createdAt: string;
  description: string;
  repaymentSchedule: RepaymentSchedule[];
}

export interface RepaymentSchedule {
  id: string;
  amount: number;
  dueDate: string;
  isPaid: boolean;
  paidAt?: string;
  paidAmount?: number;
}

export interface LoanCreationResult {
  success: boolean;
  loanId?: string;
  error?: string;
}

export interface LoanActionResult {
  success: boolean;
  error?: string;
  creditScoreChange?: number;
}
