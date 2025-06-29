
import { useState } from "react";
import { UseVerificationStateReturn, VerificationStatus, VerificationStep } from "./types";

export function useVerificationState(): UseVerificationStateReturn {
  const [verificationStep, setVerificationStep] = useState<VerificationStep>(0);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>("idle");
  
  const totalSteps = 3;
  const progress = (verificationStep / totalSteps) * 100;
  
  return {
    verificationStep,
    totalSteps,
    progress,
    isVerifying,
    verificationStatus,
    setVerificationStep,
    setIsVerifying,
    setVerificationStatus
  };
}
