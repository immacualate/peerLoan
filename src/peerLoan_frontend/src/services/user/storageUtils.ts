
import { REGISTRATION_KEY, LOAN_HISTORY_KEY, STUDENT_VERIFICATION_KEY, UserRegistration } from './userTypes';

// Helper function to get all registrations
export const getRegistrations = (): Record<string, UserRegistration> => {
  const registrationsJson = localStorage.getItem(REGISTRATION_KEY);
  return registrationsJson ? JSON.parse(registrationsJson) : {};
};

// Helper function to get registration for a principal
export const getRegistration = (principalId: string): UserRegistration | undefined => {
  const registrations = getRegistrations();
  return registrations[principalId];
};

// Helper functions for loan history
export const getLoanHistory = (borrowerId: string): any[] => {
  try {
    const historyJson = localStorage.getItem(LOAN_HISTORY_KEY);
    const allHistory = historyJson ? JSON.parse(historyJson) : {};
    return allHistory[borrowerId] || [];
  } catch (error) {
    console.error("Error getting loan history:", error);
    return [];
  }
};

export const saveLoanHistory = (borrowerId: string, history: any[]): void => {
  try {
    const historyJson = localStorage.getItem(LOAN_HISTORY_KEY);
    const allHistory = historyJson ? JSON.parse(historyJson) : {};
    allHistory[borrowerId] = history;
    localStorage.setItem(LOAN_HISTORY_KEY, JSON.stringify(allHistory));
  } catch (error) {
    console.error("Error saving loan history:", error);
  }
};

// Helper function for student verifications
export const getStudentVerifications = (): Record<string, any> => {
  const verificationsJson = localStorage.getItem(STUDENT_VERIFICATION_KEY);
  return verificationsJson ? JSON.parse(verificationsJson) : {};
};

// Generate a realistic name based on the principal or use real name if available
export const generateNameFromPrincipal = (principalId: string): string => {
  const localNames = [
    "Anon Student",
    "Mystery Borrower",
    "Crypto Learner",
    "Web3 Scholar",
    "Blockchain User",
    "Digital Student",
    "Crypto Explorer",
    "DeFi Scholar",
    "Anonymous Learner",
    "Tech Student"
  ];

  // Use the principalId to deterministically select a name
  const nameIndex = Array.from(principalId).reduce((sum, char) => sum + char.charCodeAt(0), 0) % localNames.length;
  return localNames[nameIndex];
};
