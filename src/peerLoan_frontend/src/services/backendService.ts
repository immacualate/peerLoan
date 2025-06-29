import { Actor, HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { AuthClient } from '@dfinity/auth-client';
import { idlFactory } from '../../../declarations/peerLoan_backend/peerLoan_backend.did.js';
import type { 
  _SERVICE as BackendService,
  Loan,
  StudentInfo 
} from '../../../declarations/peerLoan_backend/peerLoan_backend.did.d.ts';

// Backend canister ID
const BACKEND_CANISTER_ID = process.env.CANISTER_ID_PEERLOAN_BACKEND || 'v56tl-sp777-77774-qaahq-cai';

class PeerLoanBackendService {
  private actor: BackendService | null = null;
  private authClient: AuthClient | null = null;

  async init() {
    this.authClient = await AuthClient.create();
    await this.createActor();
  }

  private async createActor() {
    const identity = this.authClient?.getIdentity();
    
    const agent = new HttpAgent({
      host: process.env.DFX_NETWORK === 'local' ? 'http://127.0.0.1:4943' : 'https://ic0.app',
      identity,
    });

    // Fetch root key for local development
    if (process.env.DFX_NETWORK === 'local') {
      await agent.fetchRootKey();
    }

    this.actor = Actor.createActor(idlFactory, {
      agent,
      canisterId: BACKEND_CANISTER_ID,
    });
  }

  // Authentication
  async login(): Promise<boolean> {
    if (!this.authClient) {
      await this.init();
    }

    return new Promise((resolve) => {
      this.authClient?.login({
        identityProvider: process.env.DFX_NETWORK === 'local' 
          ? `http://127.0.0.1:4943/?canisterId=rdmx6-jaaaa-aaaaa-aaadq-cai#authorize`
          : 'https://identity.ic0.app/#authorize',
        onSuccess: async () => {
          await this.createActor();
          resolve(true);
        },
        onError: () => {
          resolve(false);
        },
      });
    });
  }

  async logout(): Promise<void> {
    await this.authClient?.logout();
    await this.createActor();
  }

  async isAuthenticated(): Promise<boolean> {
    if (!this.authClient) {
      await this.init();
    }
    return await this.authClient!.isAuthenticated();
  }

  async getCurrentPrincipal(): Promise<Principal> {
    if (!this.authClient) {
      await this.init();
    }
    return this.authClient!.getIdentity().getPrincipal();
  }

  // Student Verification
  async verifyStudent(studentData: StudentInfo): Promise<{ success: boolean; error?: string }> {
    try {
      if (!this.actor) {
        throw new Error('Actor not initialized');
      }

      const principal = await this.getCurrentPrincipal();
      const result = await this.actor.verifyStudent(principal, studentData);

      if ('Ok' in result) {
        return { success: true };
      } else {
        return { success: false, error: result.Err };
      }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Loan Management
  async createLoan(amount: number, duration: number, purpose: string): Promise<{ success: boolean; loanId?: string; error?: string }> {
    try {
      if (!this.actor) {
        throw new Error('Actor not initialized');
      }

      const principal = await this.getCurrentPrincipal();
      const result = await this.actor.createLoan(principal, amount, duration, purpose);

      if ('Ok' in result) {
        return { success: true, loanId: result.Ok };
      } else {
        return { success: false, error: result.Err };
      }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async fundLoan(loanId: string): Promise<{ success: boolean; error?: string }> {
    try {
      if (!this.actor) {
        throw new Error('Actor not initialized');
      }

      const principal = await this.getCurrentPrincipal();
      const result = await this.actor.fundLoan(principal, loanId);

      if ('Ok' in result) {
        return { success: true };
      } else {
        return { success: false, error: result.Err };
      }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async repayLoan(loanId: string, amount: number): Promise<{ success: boolean; creditScoreChange?: number; error?: string }> {
    try {
      if (!this.actor) {
        throw new Error('Actor not initialized');
      }

      const principal = await this.getCurrentPrincipal();
      const result = await this.actor.repayLoan(principal, loanId, amount);

      if ('Ok' in result) {
        return { success: true, creditScoreChange: result.Ok.creditScoreChange };
      } else {
        return { success: false, error: result.Err };
      }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Data Retrieval
  async getUserLoans(): Promise<{ success: boolean; loans?: Loan[]; error?: string }> {
    try {
      if (!this.actor) {
        throw new Error('Actor not initialized');
      }

      const principal = await this.getCurrentPrincipal();
      const loans = await this.actor.getUserLoans(principal);

      return { success: true, loans };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async getPendingLoans(): Promise<{ success: boolean; loans?: Loan[]; error?: string }> {
    try {
      if (!this.actor) {
        throw new Error('Actor not initialized');
      }

      const loans = await this.actor.getPendingLoans();
      return { success: true, loans };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}

// Export singleton instance
export const backendService = new PeerLoanBackendService();
export default backendService;

// Export types for use in components
export type { Loan, StudentInfo, RepaymentScheduleItem } from '../../../declarations/peerLoan_backend/peerLoan_backend.did.d.ts';
