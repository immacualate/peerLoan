
import { createContext } from 'react';
import { AuthContextType } from './authTypes';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default AuthContext;
