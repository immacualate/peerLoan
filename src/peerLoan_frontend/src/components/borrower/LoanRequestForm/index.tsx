
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { useAuth } from "@/hooks/useAuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Coins } from "lucide-react";

// Import components and hooks
import StudentInfoDisplay from './StudentInfoDisplay';
import LoanCalculator from './LoanCalculator';
import InterestRateDisplay from './InterestRateDisplay';
import FormFields from './FormFields';
import FormAlerts from './FormAlerts';
import LoanFormActions from './LoanFormActions';
import { useLoanFormCalculations } from './useLoanFormCalculations';
import { useLoanSubmission } from './hooks/useLoanSubmission';
import { loanRequestSchema, type LoanRequestFormProps } from './schema';

const LoanRequestForm: React.FC<LoanRequestFormProps> = ({ 
  onSubmit: propOnSubmit,
  onCancel,
  isSubmitting: propIsSubmitting,
  onSubmitSuccess,
  onRequestSubmitted,
  studentInfo,
  borrowerId,
  borrowerName,
  creditScore
}) => {
  const { user } = useAuth();
  const form = useForm({
    resolver: zodResolver(loanRequestSchema),
    defaultValues: {
      amount: "2000",
      purpose: "",
      duration: "6",
      description: "",
    },
  });

  // Use custom hooks for calculations and submission
  const { 
    interestRate, 
    totalRepayment, 
    monthlyPayment, 
    eligibilityError 
  } = useLoanFormCalculations(form.watch, user.creditScore || 650, user.studentInfo);

  // Use the direct submission handler from the props if provided
  const handleSubmit = propOnSubmit 
    ? (data: any) => propOnSubmit(data) 
    : useLoanSubmission(onSubmitSuccess, onRequestSubmitted).handleSubmit;

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Coins className="h-5 w-5 text-adanfo-blue" />
          Student Loan Request
        </CardTitle>
        <CardDescription>
          Fill out the form below to request a student loan
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Student Info Display */}
        <StudentInfoDisplay studentInfo={user.studentInfo} />
        
        {/* Alert Messages */}
        <FormAlerts 
          eligibilityError={eligibilityError} 
          hasStudentInfo={!!user.studentInfo}
        />
        
        <FormProvider {...form}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              {/* Loan Form Fields */}
              <FormFields />
              
              {/* Interest Rate Display */}
              <InterestRateDisplay 
                interestRate={interestRate} 
                creditScore={user.creditScore} 
              />
              
              {/* Loan Calculator Display */}
              <LoanCalculator 
                monthlyPayment={monthlyPayment} 
                totalRepayment={totalRepayment} 
              />
              
              {/* Form Action Buttons */}
              <LoanFormActions 
                isSubmitting={propIsSubmitting}
                isDisabled={!user.studentInfo || !!eligibilityError}
                errorMessage={eligibilityError}
                noStudentInfo={!user.studentInfo}
                onCancel={onCancel}
              />
            </form>
          </Form>
        </FormProvider>
      </CardContent>
    </Card>
  );
};

export default LoanRequestForm;
