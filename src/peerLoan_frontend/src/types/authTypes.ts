
// User types for our application
export type UserRole = "borrower" | "lender" | "unregistered";

export interface User {
  id: string;
  principalId: string;
  role: UserRole;
  isAuthenticated: boolean;
  creditScore?: number;
  isVerified?: boolean;
  studentInfo?: StudentInfo;
}

// Define the zkVerification interface
export interface ZkVerification {
  verifiedAt: string;
  expiresAt: string;
  proofType: string;
  verifier: string;
}

export interface StudentInfo {
  fullName?: string;
  contactNumber?: string;
  hashedGhanaCard?: string;
  universityName: string;
  studentId: string;
  gpa: number;
  graduationDate: string;
  isEnrolled: boolean;
  zkVerification?: ZkVerification;
}

// Initial state for unauthenticated users
export const anonymousUser: User = {
  id: "",
  principalId: "",
  role: "unregistered",
  isAuthenticated: false,
  creditScore: 0,
  isVerified: false
};
