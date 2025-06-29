
import { VerificationStep } from "../types";

interface UseStepNavigationProps {
  verificationStep: VerificationStep;
  setVerificationStep: (step: VerificationStep) => void;
}

export function useStepNavigation({ 
  verificationStep, 
  setVerificationStep 
}: UseStepNavigationProps) {
  
  const proceedToNextStep = () => {
    if (verificationStep < 3) {
      setVerificationStep((verificationStep + 1) as VerificationStep);
    }
  };

  const goToPreviousStep = () => {
    if (verificationStep > 0) {
      setVerificationStep((verificationStep - 1) as VerificationStep);
    }
  };
  
  return {
    proceedToNextStep,
    goToPreviousStep
  };
}
