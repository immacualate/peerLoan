
import { UseVerificationActionsReturn, VerificationStep, VerificationStatus } from "./types";
import { 
  useStartVerification,
  useStepNavigation,
  useStudentVerification, 
  useVerificationSubmission
} from "./actions";
import { StudentVerificationValues } from "@/components/borrower/verification/types";

interface UseVerificationActionsProps {
  verificationStep: VerificationStep;
  setVerificationStep: (step: VerificationStep) => void;
  setIsVerifying: (isVerifying: boolean) => void;
  setVerificationStatus: (status: VerificationStatus) => void;
  form: any; // Using any here as we're just passing the form through
  onVerificationComplete?: (success: boolean) => void;
}

export function useVerificationActions({
  verificationStep,
  setVerificationStep,
  setIsVerifying,
  setVerificationStatus,
  form,
  onVerificationComplete
}: UseVerificationActionsProps): UseVerificationActionsReturn {
  // Use the separate action hooks
  const { startVerification } = useStartVerification({ 
    setVerificationStep 
  });
  
  const { proceedToNextStep, goToPreviousStep } = useStepNavigation({ 
    verificationStep, 
    setVerificationStep 
  });
  
  const { verifyStudent } = useStudentVerification({ 
    form, 
    setVerificationStatus, 
    setIsVerifying 
  });
  
  const { completeVerification, onSubmit } = useVerificationSubmission({ 
    form, 
    setIsVerifying, 
    onVerificationComplete 
  });

  // Return all the actions
  return {
    startVerification,
    proceedToNextStep,
    goToPreviousStep,
    verifyStudent,
    completeVerification,
    onSubmit
  };
}
