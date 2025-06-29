
import { useState, useEffect } from "react";
import { UseFormWatch } from "react-hook-form";
import { LoanRequestFormValues } from './schema';
import { calculateLoanDetails, calculateInterestRate } from './utils';
import { validateStudentEligibility } from '@/services/user';

export const useLoanFormCalculations = (
  watch: UseFormWatch<any>,
  creditScore: number = 650,
  studentInfo: any
) => {
  const [interestRate, setInterestRate] = useState(12);
  const [totalRepayment, setTotalRepayment] = useState(0);
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [eligibilityError, setEligibilityError] = useState<string | null>(null);

  // Check eligibility when duration changes
  useEffect(() => {
    const subscription = watch((value) => {
      if (studentInfo && value.duration) {
        const duration = parseInt(value.duration);
        const eligibility = validateStudentEligibility(studentInfo, duration);
        
        if (!eligibility.isEligible && eligibility.reason) {
          setEligibilityError(eligibility.reason);
        } else {
          setEligibilityError(null);
        }
      }
    });
    
    return () => subscription.unsubscribe();
  }, [watch, studentInfo]);
  
  // Update loan calculations when form values change
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "amount" || name === "duration" || name === undefined) {
        const amount = parseFloat(value.amount || "0");
        const duration = parseInt(value.duration || "0");
        
        if (!isNaN(amount) && !isNaN(duration) && duration > 0) {
          const rate = calculateInterestRate(creditScore, duration);
          setInterestRate(rate);
          
          const { monthlyPayment, totalRepayment } = calculateLoanDetails(amount, duration, rate);
          setMonthlyPayment(monthlyPayment);
          setTotalRepayment(totalRepayment);
        }
      }
    });
    
    return () => subscription.unsubscribe();
  }, [watch, creditScore]);

  return {
    interestRate,
    totalRepayment,
    monthlyPayment,
    eligibilityError
  };
};
