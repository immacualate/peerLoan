
import { User } from "@/types/authTypes";
import { getAdanfoCashActor } from "../../icp/actor";

// Using dynamic import for Principal to avoid build errors
let Principal: any;

// Safely import Principal or provide a mock implementation
const getPrincipal = async () => {
  try {
    if (import.meta.env.VITE_ICP_ENABLED === 'true') {
      const module = await import('@dfinity/principal');
      Principal = module.Principal;
    } else {
      // Mock Principal for development
      Principal = {
        fromText: (text: string) => ({
          _isPrincipal: true,
          toString: () => text
        })
      };
    }
  } catch (e) {
    console.warn("Failed to import Principal, using mock implementation");
    // Mock Principal implementation
    Principal = {
      fromText: (text: string) => ({
        _isPrincipal: true,
        toString: () => text
      })
    };
  }
};

// Initialize Principal on module load
getPrincipal();

export const getIcpUserLoans = async (user: User) => {
  try {
    // Get the actor for our backend canister
    const actor = await getAdanfoCashActor();
    
    // Convert user ID to Principal, ensuring it's available
    await getPrincipal();
    const userPrincipal = Principal.fromText(user.principalId);
    
    // Call the backend canister to get user loans
    const loans = await actor.getUserLoans(userPrincipal);
    
    // Transform the data to match our frontend model if needed
    return loans.map(loan => ({
      ...loan,
      lender: loan.lender[0] ? loan.lender[0].toText() : null,
      repaymentSchedule: loan.repaymentSchedule.map(payment => ({
        ...payment,
        paidAt: payment.paidAt[0] || null,
        paidAmount: payment.paidAmount[0] || null,
      }))
    }));
  } catch (error) {
    console.error("Error getting ICP user loans:", error);
    return [];
  }
};

export const getIcpPendingLoans = async (options: {query?: string} = {}) => {
  try {
    // Get the actor for our backend canister
    const actor = await getAdanfoCashActor();
    
    // Call the backend canister to get pending loans
    const loans = await actor.getPendingLoans();
    
    // Transform the data to match our frontend model if needed
    const transformedLoans = loans.map(loan => ({
      ...loan,
      lender: loan.lender[0] ? loan.lender[0].toText() : null,
      repaymentSchedule: loan.repaymentSchedule.map(payment => ({
        ...payment,
        paidAt: payment.paidAt[0] || null,
        paidAmount: payment.paidAmount[0] || null,
      }))
    }));
    
    // Apply filtering if query is provided
    if (options.query && options.query !== 'all') {
      return transformedLoans.filter(loan => {
        // Implement filtering logic based on query
        if (options.query === 'lowRisk') {
          return loan.creditScore >= 700;
        } else if (options.query === 'mediumRisk') {
          return loan.creditScore >= 600 && loan.creditScore < 700;
        } else if (options.query === 'highRisk') {
          return loan.creditScore < 600;
        }
        return true;
      });
    }
    
    return transformedLoans;
  } catch (error) {
    console.error("Error getting ICP pending loans:", error);
    return [];
  }
};
