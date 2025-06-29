
import { User } from "@/types/authTypes";

export interface LoanRequest {
  id?: string;
  borrowerId: string;
  amount: number;
  purpose: string;
  duration: number;
  interestRate: number;
  status?: string;
  createdAt?: string;
}

export interface LoanResponse {
  success: boolean;
  loanId?: string;
  message?: string;
}

export interface LocalStorageLoan {
  id: string;
  borrowerId: string;
  amount: number;
  purpose: string;
  duration: number;
  interestRate: number;
  status: string;
  createdAt: string;
  lenderId?: string;
  fundedAt?: string;
}
