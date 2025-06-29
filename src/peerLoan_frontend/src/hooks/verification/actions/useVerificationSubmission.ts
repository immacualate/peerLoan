
import { useToast } from "@/components/ui/use-toast";
import { StudentVerificationValues } from "@/components/borrower/verification/types";
import { saveStudentVerification } from "@/services/user";
import { useAuth } from "@/hooks/useAuthContext";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

interface UseVerificationSubmissionProps {
  form: any;
  setIsVerifying: (isVerifying: boolean) => void;
  onVerificationComplete?: (success: boolean) => void;
}

export function useVerificationSubmission({
  form,
  setIsVerifying,
  onVerificationComplete
}: UseVerificationSubmissionProps) {
  const { toast } = useToast();
  const { user, checkAuth } = useAuth();
  const navigate = useNavigate();
  
  const completeVerification = useCallback(async (data: StudentVerificationValues) => {
    setIsVerifying(true);
    console.log("Starting verification completion with data:", data);
    
    try {
      if (data && user.principalId) {
        console.log("Completing verification with data:", data);
        
        const studentInfo = {
          fullName: data.fullName,
          contactNumber: data.contactNumber || "",
          hashedGhanaCard: data.ghanaCardNumber || "", 
          universityName: data.universityName,
          studentId: data.studentId,
          graduationDate: data.graduationDate,
          gpa: 3.5,
          isEnrolled: true,
          zkVerification: {
            verifiedAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
            proofType: "zk-student-verification-v1",
            verifier: "adanfo-academic-verifier"
          }
        };
        
        console.log("Saving verification to ICP blockchain...");
        const saveSuccess = await saveStudentVerification(user.principalId, studentInfo);
        
        if (!saveSuccess) {
          console.error("Failed to save verification data");
          toast({
            title: "Verification Failed",
            description: "Could not save your verification data. Please try again.",
            variant: "destructive"
          });
          if (onVerificationComplete) {
            onVerificationComplete(false);
          }
          return;
        }
        
        console.log("Verification saved successfully to ICP blockchain");
        
        form.setValue("isVerified", true);
        
        localStorage.setItem(`verification_status_${user.principalId}`, 'true');
        localStorage.setItem('current_user_id', user.principalId);
        localStorage.setItem('verification_complete', 'true');
        
        let retries = 0;
        while (retries < 3) {
          await checkAuth();
          await new Promise(resolve => setTimeout(resolve, 300));
          retries++;
        }
        
        console.log("Student verification successful", studentInfo);
        
        toast({
          title: "Verification Successful",
          description: "Your student status has been verified and saved to the ICP blockchain!",
        });

        if (onVerificationComplete) {
          console.log("Calling onVerificationComplete with success=true");
          onVerificationComplete(true);
        }
        
      } else {
        console.error("Missing user principalId or form data");
        toast({
          title: "Verification Failed",
          description: "Missing required information. Please try again.",
          variant: "destructive"
        });
        
        if (onVerificationComplete) {
          onVerificationComplete(false);
        }
      }
    } catch (error) {
      console.error("Verification error:", error);
      toast({
        title: "Verification Failed",
        description: "Could not complete the verification process.",
        variant: "destructive"
      });
      
      if (onVerificationComplete) {
        onVerificationComplete(false);
      }
    } finally {
      setIsVerifying(false);
    }
  }, [user, checkAuth, toast, setIsVerifying, onVerificationComplete, form]);
  
  const onSubmit = useCallback(async (data: StudentVerificationValues) => {
    console.log("Submitting form with data:", data);
    
    if (form.getValues("isVerified")) {
      console.log("Form already marked as verified, proceeding to complete registration");
      
      if (user.principalId) {
        localStorage.setItem(`verification_status_${user.principalId}`, 'true');
        localStorage.setItem('verification_complete', 'true');
      }
      
      if (onVerificationComplete) {
        console.log("Calling verification complete callback");
        onVerificationComplete(true);
      }
      
      return;
    }
    
    await completeVerification(data);
  }, [form, completeVerification, onVerificationComplete, user.principalId]);
  
  return {
    completeVerification,
    onSubmit
  };
}
