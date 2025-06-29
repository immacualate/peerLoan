
import { StudentVerificationValues } from "@/components/borrower/verification/types";

export type VerificationStep = number;
export type VerificationStatus = "idle" | "pending" | "success" | "error";

export interface UseVerificationStateReturn {
  verificationStep: VerificationStep;
  totalSteps: number;
  progress: number;
  isVerifying: boolean;
  verificationStatus: VerificationStatus;
  setVerificationStep: (step: VerificationStep) => void;
  setIsVerifying: (isVerifying: boolean) => void;
  setVerificationStatus: (status: VerificationStatus) => void;
}

export interface UseVerificationActionsReturn {
  startVerification: () => void;
  proceedToNextStep: () => void;
  goToPreviousStep: () => void;
  verifyStudent: () => void;
  completeVerification: (data: StudentVerificationValues) => Promise<void>;
  onSubmit: (data: StudentVerificationValues) => void;
}
