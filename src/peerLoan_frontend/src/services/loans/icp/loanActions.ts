
import { User } from "@/types/authTypes";
import { getPeerLoanActor } from "../../icp/actor";
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

export const fundIcpLoan = async (user: User, loanId: string) => {
  try {
    // Get the actor for our backend canister
    const actor = await getPeerLoanActor();
    
    // Convert user ID to Principal, ensuring it's available
    await getPrincipal();
    const userPrincipal = Principal.fromText(user.principalId);
    
    // Call the backend canister to fund the loan
    const result = await actor.fundLoan(userPrincipal, loanId);
    
    if ('Ok' in result) {
      return {
        success: true,
        message: `Loan ${loanId} successfully funded`
      };
    } else {
      return {
        success: false,
        message: `Error funding loan: ${result.Err}`
      };
    }
  } catch (error) {
    console.error("Error funding ICP loan:", error);
    return {
      success: false,
      message: "Failed to connect to ICP network. Please try again later."
    };
  }
};

export const makeIcpRepayment = async (user: User, loanId: string, amount: number) => {
  try {
    // Get the actor for our backend canister
    const actor = await getPeerLoanActor();
    
    // Convert user ID to Principal, ensuring it's available
    await getPrincipal();
    const userPrincipal = Principal.fromText(user.principalId);
    
    // Call the backend canister to repay the loan
    const result = await actor.repayLoan(userPrincipal, loanId, amount);
    
    if ('Ok' in result) {
      return {
        success: true,
        message: `Payment of ${amount} successfully made on loan ${loanId}`,
        creditScoreChange: result.Ok.creditScoreChange
      };
    } else {
      return {
        success: false,
        message: `Error making payment: ${result.Err}`
      };
    }
  } catch (error) {
    console.error("Error making ICP loan repayment:", error);
    return {
      success: false,
      message: "Failed to connect to ICP network. Please try again later."
    };
  }
};
