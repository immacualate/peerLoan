
import { RepaymentSchedule } from "./types";

// Helper function to calculate interest rate
export const calculateInterestRate = (creditScore: number): number => {
  // Base rate of 5%
  let baseRate = 5;
  
  // Adjust based on credit score
  if (creditScore >= 800) {
    return baseRate + 0; // Prime rate
  } else if (creditScore >= 750) {
    return baseRate + 1; // 6%
  } else if (creditScore >= 700) {
    return baseRate + 2; // 7%
  } else if (creditScore >= 650) {
    return baseRate + 3; // 8%
  } else if (creditScore >= 600) {
    return baseRate + 5; // 10%
  } else {
    return baseRate + 7; // 12%
  }
};

// Generate repayment schedule
export const generateRepaymentSchedule = (
  amount: number, 
  durationMonths: number, 
  interestRate: number
): RepaymentSchedule[] => {
  const schedule: RepaymentSchedule[] = [];
  
  // Calculate monthly payment (simple interest for this example)
  const totalInterest = (amount * interestRate * durationMonths) / 100;
  const totalAmount = amount + totalInterest;
  const monthlyPayment = totalAmount / durationMonths;
  
  // Generate schedule
  const now = new Date();
  for (let i = 0; i < durationMonths; i++) {
    const dueDate = new Date(now);
    dueDate.setMonth(dueDate.getMonth() + i + 1);
    
    schedule.push({
      id: `REPAY-${i+1}`,
      amount: Math.round(monthlyPayment * 100) / 100, // Round to 2 decimal places
      dueDate: dueDate.toISOString(),
      isPaid: false
    });
  }
  
  return schedule;
};
