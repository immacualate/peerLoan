
import { getLoanHistory, saveLoanHistory, getRegistrations } from "./storageUtils";
import { REGISTRATION_KEY } from "./userTypes";

// Update borrower credit score
export const updateCreditScore = (principalId: string, newScore: number): boolean => {
  try {
    const registrations = getRegistrations();
    if (registrations[principalId] && registrations[principalId].role === "borrower") {
      registrations[principalId].creditScore = newScore;
      localStorage.setItem(REGISTRATION_KEY, JSON.stringify(registrations));
      return true;
    }
    return false;
  } catch (error) {
    console.error("Credit score update error:", error);
    return false;
  }
};

// Record loan repayment for credit score calculation
export const recordLoanRepayment = (
  borrowerId: string, 
  loanId: string, 
  onTime: boolean
): boolean => {
  try {
    // Get borrower's registration
    const registrations = getRegistrations();
    const borrower = registrations[borrowerId];
    
    if (!borrower || borrower.role !== "borrower") {
      return false;
    }
    
    // Get loan repayment history
    const loanHistory = getLoanHistory(borrowerId);
    
    // Add this repayment to history
    loanHistory.push({
      loanId,
      repaymentDate: new Date().toISOString(),
      onTime,
    });
    
    // Save history
    saveLoanHistory(borrowerId, loanHistory);
    
    // Calculate new credit score based on payment history
    const newScore = calculateCreditScore(borrower.creditScore || 650, loanHistory);
    
    // Update borrower's credit score
    borrower.creditScore = newScore;
    registrations[borrowerId] = borrower;
    localStorage.setItem(REGISTRATION_KEY, JSON.stringify(registrations));
    
    return true;
  } catch (error) {
    console.error("Loan repayment recording error:", error);
    return false;
  }
};

// Calculate credit score based on repayment history
export const calculateCreditScore = (baseScore: number, repaymentHistory: any[]): number => {
  if (repaymentHistory.length === 0) {
    return baseScore;
  }
  
  // Calculate on-time payment percentage
  const totalPayments = repaymentHistory.length;
  const onTimePayments = repaymentHistory.filter(payment => payment.onTime).length;
  const onTimePercentage = onTimePayments / totalPayments;
  
  // Determine score adjustments
  let scoreAdjustment = 0;
  
  // Reward for perfect payment history
  if (onTimePercentage === 1 && totalPayments >= 3) {
    scoreAdjustment += 30;
  } 
  // Good payment history (85%+ on time)
  else if (onTimePercentage >= 0.85) {
    scoreAdjustment += 15;
  } 
  // Average payment history (70-85% on time)
  else if (onTimePercentage >= 0.7) {
    scoreAdjustment += 0;
  } 
  // Poor payment history (below 70% on time)
  else {
    scoreAdjustment -= 25;
  }
  
  // Recent payment behavior has more weight
  const recentPayments = repaymentHistory.slice(-3);
  const recentOnTimePayments = recentPayments.filter(payment => payment.onTime).length;
  
  if (recentPayments.length === 3) {
    if (recentOnTimePayments === 3) {
      scoreAdjustment += 10; // All recent payments on time
    } else if (recentOnTimePayments === 0) {
      scoreAdjustment -= 20; // All recent payments late
    }
  }
  
  // Calculate new score with limits
  let newScore = baseScore + scoreAdjustment;
  
  // Cap score between 300 and 850 (typical credit score range)
  newScore = Math.max(300, Math.min(850, newScore));
  
  return newScore;
};
