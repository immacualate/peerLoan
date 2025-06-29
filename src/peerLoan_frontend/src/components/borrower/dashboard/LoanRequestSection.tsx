
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import LoanRequestForm from '../LoanRequestForm/index';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { createLoanRequest } from '@/services/smart-contract/loanContractService';
import { useToast } from '@/hooks/use-toast';
import { LoanRequestFormValues } from '../LoanRequestForm/schema';
import { storeLoanRequest } from '@/services/smart-contract/storage';
import { LoanContract } from '@/services/smart-contract/types';

interface LoanRequestSectionProps {
  loans: any[];
  isRequestingLoan: boolean;
  setIsRequestingLoan: (value: boolean) => void;
  handleLoanRequested: () => void;
  userInfo: any;
}

const LoanRequestSection: React.FC<LoanRequestSectionProps> = ({
  loans,
  isRequestingLoan,
  setIsRequestingLoan,
  handleLoanRequested,
  userInfo
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const handleSubmit = async (data: LoanRequestFormValues) => {
    try {
      setIsSubmitting(true);
      console.log("Submitting loan request:", data);
      
      const result = await createLoanRequest(
        userInfo,
        Number(data.amount),
        Number(data.duration),
        data.purpose
      );
      
      if (result.success) {
        toast({
          title: "Loan Request Created",
          description: `Your loan request for $${data.amount} has been submitted successfully.`,
        });
        
        // Make the loan immediately available for lenders to see
        if (result.loanId) {
          // Calculate values for the required fields
          const amount = Number(data.amount);
          const duration = Number(data.duration);
          const interestRate = 12.0; // Default interest rate
          const totalInterest = (amount * interestRate * duration) / 100;
          const totalRepayment = amount + totalInterest;
          const monthlyPayment = totalRepayment / duration;
          
          // Ensure the loan is properly stored for lenders to see with all required fields
          const loanToStore: LoanContract = {
            id: result.loanId,
            borrower: userInfo.principalId,
            borrowerName: userInfo.studentInfo?.fullName || 'Anonymous Student',
            lender: null, // Initially null as no lender has funded yet
            amount: amount,
            duration: duration,
            purpose: data.purpose,
            interestRate: interestRate,
            monthlyPayment: Math.round((monthlyPayment + Number.EPSILON) * 100) / 100,
            totalRepayment: Math.round((totalRepayment + Number.EPSILON) * 100) / 100,
            creditScore: userInfo.creditScore || 650,
            status: "pending",
            createdAt: new Date().toISOString(),
            description: data.description || `Loan for ${data.purpose}`,
            repaymentSchedule: []
          };
          
          storeLoanRequest(loanToStore);
        }
        
        // Add a delay before resetting the form to show success feedback
        setTimeout(() => {
          setIsSubmitting(false);
          handleLoanRequested();
        }, 500);
      } else {
        toast({
          title: "Loan Request Failed",
          description: result.error || "There was an error creating your loan request.",
          variant: "destructive"
        });
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Error submitting loan request:", error);
      toast({
        title: "Loan Request Failed",
        description: "There was an error creating your loan request.",
        variant: "destructive"
      });
      setIsSubmitting(false);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mt-6"
    >
      {isRequestingLoan ? (
        <div className="w-full">
          <LoanRequestForm 
            onSubmit={handleSubmit} 
            onCancel={() => setIsRequestingLoan(false)}
            isSubmitting={isSubmitting}
            onSubmitSuccess={() => {}}
            onRequestSubmitted={() => {}}
          />
        </div>
      ) : (
        <div className="flex justify-center">
          <Button 
            onClick={() => setIsRequestingLoan(true)}
            className="w-full max-w-md bg-adanfo-blue hover:bg-adanfo-blue/90"
            size="lg"
          >
            <Plus className="mr-2 h-4 w-4" /> Request a New Loan
          </Button>
        </div>
      )}
    </motion.div>
  );
};

export default LoanRequestSection;
