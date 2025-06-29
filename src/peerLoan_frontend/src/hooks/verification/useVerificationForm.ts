
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { studentVerificationSchema, StudentVerificationValues } from "@/components/borrower/verification/types";
import { useVerificationState } from "./useVerificationState";
import { useVerificationActions } from "./useVerificationActions";

export function useVerificationForm(onVerificationComplete?: (success: boolean) => void) {
  const {
    verificationStep,
    totalSteps,
    progress,
    isVerifying,
    verificationStatus,
    setVerificationStep,
    setIsVerifying,
    setVerificationStatus
  } = useVerificationState();
  
  const form = useForm<StudentVerificationValues>({
    resolver: zodResolver(studentVerificationSchema),
    defaultValues: {
      fullName: "",
      contactNumber: "",
      ghanaCardNumber: "",
      universityName: "",
      studentId: "",
      graduationDate: "",
      consent: false,
      isVerified: false,
    },
  });
  
  const {
    startVerification,
    proceedToNextStep,
    goToPreviousStep,
    verifyStudent,
    completeVerification,
    onSubmit
  } = useVerificationActions({
    verificationStep,
    setVerificationStep,
    setIsVerifying,
    setVerificationStatus,
    form,
    onVerificationComplete
  });

  return {
    form,
    verificationStep,
    totalSteps,
    progress,
    isVerifying,
    verificationStatus,
    startVerification,
    proceedToNextStep,
    goToPreviousStep,
    verifyStudent,
    onSubmit
  };
}
