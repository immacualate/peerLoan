
/**
 * Utility functions for loan calculations and validations
 */

/**
 * Calculate monthly payment, total repayment and other loan details
 */
export const calculateLoanDetails = (amount: number, duration: number, rate: number) => {
  const monthlyRate = rate / 100 / 12;
  const n = duration;
  const monthlyPayment = amount * (monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
  const totalRepayment = monthlyPayment * n;
  
  return {
    monthlyPayment: isNaN(monthlyPayment) ? 0 : monthlyPayment,
    totalRepayment: isNaN(totalRepayment) ? 0 : totalRepayment,
  };
};

/**
 * Calculate interest rate based on credit score and loan duration
 */
export const calculateInterestRate = (creditScore: number, duration: number): number => {
  let rate = 12; // Default rate
  
  if (creditScore >= 750) {
    rate = 8;
  } else if (creditScore >= 650) {
    rate = 10;
  } else {
    rate = 12;
  }
  
  // Add premium for longer durations
  if (duration > 24) {
    rate += 1;
  }
  
  return rate;
};
