
import { VerificationStep } from "../types";

interface UseStartVerificationProps {
  setVerificationStep: (step: VerificationStep) => void;
}

export function useStartVerification({ setVerificationStep }: UseStartVerificationProps) {
  const startVerification = () => {
    setVerificationStep(1);
  };
  
  return { startVerification };
}
