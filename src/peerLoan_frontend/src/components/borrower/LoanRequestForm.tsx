
import React from 'react';
import LoanRequestFormComponent from './LoanRequestForm/index';
import { useAuth } from '@/hooks/useAuthContext';
import { useToast } from '@/hooks/use-toast';
import { submitLoanRequest } from '@/services/loanService';
import { LoanRequestFormValues } from './LoanRequestForm/schema';

const LoanRequestForm: React.FC<{
  onSubmit?: (data: LoanRequestFormValues) => Promise<void>;
  isSubmitting?: boolean;
  onCancel?: () => void;
  onSubmitSuccess?: () => void;
  onRequestSubmitted?: () => void;
}> = ({
  onSubmit: propOnSubmit,
  isSubmitting: propIsSubmitting = false, 
  onCancel: propOnCancel,
  onSubmitSuccess,
  onRequestSubmitted
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (data: LoanRequestFormValues) => {
    // If external submit handler is provided, use it
    if (propOnSubmit) {
      return propOnSubmit(data);
    }
    
    try {
      setIsSubmitting(true);
      
      const response = await submitLoanRequest({
        borrowerId: user.principalId,
        amount: Number(data.amount),
        duration: Number(data.duration),
        purpose: data.purpose,
        interestRate: 12.0 // Default interest rate
      });
      
      if (response.success) {
        toast({
          title: "Success",
          description: "Your loan request has been submitted successfully",
        });
        
        // Call the success callback if provided
        if (onSubmitSuccess) {
          onSubmitSuccess();
        }
        
        // Call the submitted callback if provided
        if (onRequestSubmitted) {
          onRequestSubmitted();
        }
        
        // Redirect to borrower dashboard after successful submission
        setTimeout(() => {
          window.location.href = "/borrower-dashboard";
        }, 1500);
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to submit loan request",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error submitting loan request:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onCancel = () => {
    if (propOnCancel) {
      propOnCancel();
    } else {
      window.history.back();
    }
  };

  return (
    <LoanRequestFormComponent
      onSubmit={handleSubmit}
      isSubmitting={propIsSubmitting || isSubmitting}
      onCancel={onCancel}
      onSubmitSuccess={onSubmitSuccess}
      onRequestSubmitted={onRequestSubmitted}
    />
  );
};

export default LoanRequestForm;
