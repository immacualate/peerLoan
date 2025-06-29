
import { StudentInfo } from "@/types/authTypes";

export const REGISTRATION_KEY = 'adanfo_user_registrations';
export const LOAN_HISTORY_KEY = 'adanfo_loan_history';
export const STUDENT_VERIFICATION_KEY = 'adanfo_student_verifications';

export interface UserRegistration {
  role: "borrower" | "lender";
  name: string;
  registeredAt: string;
  creditScore?: number;
  isVerified: boolean;
  studentInfo?: StudentInfo;
}
