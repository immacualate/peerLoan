
import { Actor, ActorSubclass, HttpAgent, Identity } from "@dfinity/agent";
import { idlFactory } from "./candid/adanfocash_backend.did.js";
import { getIdentity } from "../authClient";
import { getHost } from "../authConfig";

// Using dynamic import for Principal to avoid build errors
let Principal: any;

// Safely import Principal or provide a mock implementation
const loadPrincipal = async () => {
  try {
    if (import.meta.env.VITE_ICP_ENABLED === 'true') {
      const module = await import('@dfinity/principal');
      Principal = module.Principal;
      return Principal;
    } else {
      // Mock Principal for development
      Principal = {
        fromText: (text: string) => ({
          _isPrincipal: true,
          toString: () => text
        })
      };
      return Principal;
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
    return Principal;
  }
};

// Initialize Principal on module load
loadPrincipal();

// Interface for our backend canister
export interface AdanfoCashBackend {
  createLoan: (borrower: any, amount: number, duration: number, purpose: string) => Promise<{ 'Ok': string } | { 'Err': string }>;
  fundLoan: (lender: any, loanId: string) => Promise<{ 'Ok': boolean } | { 'Err': string }>;
  repayLoan: (borrower: any, loanId: string, amount: number) => Promise<{ 'Ok': { creditScoreChange: number } } | { 'Err': string }>;
  getUserLoans: (user: any) => Promise<Array<any>>;
  getPendingLoans: () => Promise<Array<any>>;
  verifyStudent: (principal: any, studentData: any) => Promise<{ 'Ok': boolean } | { 'Err': string }>;
}

// Canister ID for our backend
const BACKEND_CANISTER_ID = process.env.BACKEND_CANISTER_ID || "rrkah-fqaaa-aaaaa-aaaaq-cai"; // Default local canister ID

// Initialize actor
let adanfoCashActor: ActorSubclass<AdanfoCashBackend> | null = null;

// Create agent with identity
export const createAgent = async (): Promise<HttpAgent> => {
  const identity = await getIdentity() as Identity;
  const host = getHost();
  
  const agent = new HttpAgent({ identity, host });
  
  // Only fetch root key when in development
  if (host.includes("localhost") || host.includes("127.0.0.1")) {
    await agent.fetchRootKey();
  }
  
  return agent;
};

// Get actor instance
export const getAdanfoCashActor = async (): Promise<ActorSubclass<AdanfoCashBackend>> => {
  if (!adanfoCashActor) {
    const agent = await createAgent();
    adanfoCashActor = Actor.createActor<AdanfoCashBackend>(idlFactory, {
      agent,
      canisterId: BACKEND_CANISTER_ID
    });
  }
  return adanfoCashActor;
};

// Reset actor (after logout)
export const resetActor = () => {
  adanfoCashActor = null;
};
