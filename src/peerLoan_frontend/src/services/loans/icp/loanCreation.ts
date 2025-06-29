
import { User } from "@/types/authTypes";
import { LoanResponse } from '../types';
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

export const createIcpLoanRequest = async (
  user: User,
  amount: number,
  duration: number,
  purpose: string
): Promise<LoanResponse> => {
  try {
    // Get the actor for our backend canister
    const actor = await getPeerLoanActor();
    
    // Convert user ID to Principal, ensuring it's available
    await getPrincipal();
    const userPrincipal = Principal.fromText(user.principalId);
    
    // Call the backend canister to create a loan
    const result = await actor.createLoan(userPrincipal, amount, duration, purpose);
    
    if ('Ok' in result) {
      return {
        success: true,
        message: `Loan request for $${amount} successfully created`,
        loanId: result.Ok
      };
    } else {
      return {
        success: false,
        message: `Error creating loan request: ${result.Err}`
      };
    }
  } catch (error) {
    console.error("Error creating ICP loan request:", error);
    return {
      success: false,
      message: "Failed to connect to ICP network. Please try again later."
    };
  }
};
