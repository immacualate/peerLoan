
import { User } from "@/types/authTypes";
import { LoanRequest, LoanResponse } from '../types';

export interface IcpLoanRequest {
  amount: number;
  duration: number;
  purpose: string;
  user: User;
}

export type { LoanRequest, LoanResponse };
