
import { User } from '../types/authTypes';

export interface AuthContextType {
  user: User;
  isLoading: boolean;
  login: (redirectPath?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  isRegistered: boolean;
  setIsRegistered: (value: boolean) => void;
  registerUser: (role: "borrower" | "lender", name: string) => Promise<boolean>;
}
