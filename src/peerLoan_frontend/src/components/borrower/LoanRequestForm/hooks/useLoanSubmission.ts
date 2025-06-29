
import { useToast } from "@/hooks/use-toast";
import { submitLoanRequest } from "@/services/loanService";
import { useAuth } from "@/hooks/useAuthContext";

export const useLoanSubmission = (
  onSubmitSuccess?: () => void,
  onRequestSubmitted?: () => void
) => {
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async (formData: { amount: string; duration: string; purpose: string }) => {
    try {
      const amount = parseFloat(formData.amount);
      const duration = parseInt(formData.duration);
      
      if (isNaN(amount) || isNaN(duration)) {
        throw new Error("Invalid amount or duration");
      }

      const result = await submitLoanRequest({
        borrowerId: user.principalId,
        amount,
        duration,
        purpose: formData.purpose,
        interestRate: 12.0 // Adding the missing interestRate property
      });

      if (result.success) {
        toast({
          title: "Loan Request Submitted",
          description: `Your loan request for $${amount} has been submitted.`
        });

        if (onSubmitSuccess) onSubmitSuccess();
        if (onRequestSubmitted) onRequestSubmitted();
      } else {
        toast({
          title: "Submission Error",
          description: result.message || "There was a problem creating your loan request.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error in loan request submission:", error);
      toast({
        title: "Submission Error",
        description: "There was a problem submitting your loan request. Please try again.",
        variant: "destructive"
      });
    }
  };

  return { handleSubmit };
};
