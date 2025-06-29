
import { RepaymentSchedule } from "../smart-contract/types";

// Calculate interest rate based on credit score
export const calculateInterestRate = (creditScore: number): number => {
  if (creditScore >= 800) return 5.5;
  if (creditScore >= 750) return 6.5;
  if (creditScore >= 700) return 7.5;
  if (creditScore >= 650) return 8.5;
  if (creditScore >= 600) return 10.0;
  return 12.0;
};

// Generate repayment schedule
export const generateRepaymentSchedule = (
  amount: number, 
  duration: number, 
  interestRate: number
): RepaymentSchedule[] => {
  const totalInterest = (amount * interestRate * duration) / 100;
  const totalAmount = amount + totalInterest;
  const monthlyPayment = totalAmount / duration;
  
  const schedule: RepaymentSchedule[] = [];
  let dueDate = new Date();
  
  for (let i = 0; i < duration; i++) {
    dueDate.setMonth(dueDate.getMonth() + 1);
    schedule.push({
      id: `payment-${i + 1}`,
      amount: monthlyPayment,
      dueDate: new Date(dueDate).toISOString(),
      isPaid: false
    });
  }
  
  return schedule;
};
