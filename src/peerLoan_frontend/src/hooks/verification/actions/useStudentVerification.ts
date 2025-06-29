
import { useToast } from "@/components/ui/use-toast";
import { verifyStudentByIdAndUniversity } from "@/services/user/studentVerificationService";
import { VerificationStatus } from "../types";

interface UseStudentVerificationProps {
  form: any;
  setVerificationStatus: (status: VerificationStatus) => void;
  setIsVerifying: (isVerifying: boolean) => void;
}

export function useStudentVerification({
  form,
  setVerificationStatus,
  setIsVerifying
}: UseStudentVerificationProps) {
  const { toast } = useToast();
  
  const verifyStudent = async () => {
    setIsVerifying(true);
    setVerificationStatus("pending");
    
    try {
      const universityId = form.getValues("universityName");
      const studentId = form.getValues("studentId");
      
      if (!universityId || !studentId) {
        setVerificationStatus("error");
        toast({
          title: "Verification Failed",
          description: "Please provide both university and student ID",
          variant: "destructive"
        });
        setIsVerifying(false);
        return;
      }
      
      toast({
        title: "Verification Started",
        description: "Connecting to university portal. Please complete verification in the popup window.",
      });
      
      // Call the verification API that will open a popup to the university portal
      const studentInfo = await verifyStudentByIdAndUniversity(studentId, universityId);
      
      if (!studentInfo) {
        setVerificationStatus("error");
        toast({
          title: "Verification Failed",
          description: "Student ID not found or verification cancelled. Please check your details and try again.",
          variant: "destructive"
        });
        setIsVerifying(false);
        return;
      }
      
      // Check for minimum GPA requirement
      if (studentInfo.gpa < 1.5) {
        setVerificationStatus("error");
        toast({
          title: "Verification Failed",
          description: "Your academic records show a GPA below 1.5, which is below our minimum requirement.",
          variant: "destructive"
        });
        setIsVerifying(false);
        return;
      }
      
      // Check graduation date is at least 5 months away
      const graduationDate = new Date(studentInfo.graduationDate);
      const fiveMonthsFromNow = new Date();
      fiveMonthsFromNow.setMonth(fiveMonthsFromNow.getMonth() + 5);
      
      if (graduationDate < fiveMonthsFromNow) {
        setVerificationStatus("error");
        toast({
          title: "Verification Failed",
          description: "Your graduation date must be at least 5 months away.",
          variant: "destructive"
        });
        setIsVerifying(false);
        return;
      }
      
      // Pre-fill the form with verified data
      form.setValue("fullName", studentInfo.fullName);
      form.setValue("contactNumber", studentInfo.contactNumber || "");
      form.setValue("graduationDate", studentInfo.graduationDate);
      form.setValue("isVerified", true); // Set verification flag to true
      
      // Success verification
      setVerificationStatus("success");
      toast({
        title: "Verification Successful",
        description: `Hello ${studentInfo.fullName}, your student details were verified successfully.`
      });
      
    } catch (error) {
      console.error("Verification error:", error);
      setVerificationStatus("error");
      toast({
        title: "Verification Error",
        description: "An unexpected error occurred during verification.",
        variant: "destructive"
      });
    } finally {
      setIsVerifying(false);
    }
  };
  
  return { verifyStudent };
}
