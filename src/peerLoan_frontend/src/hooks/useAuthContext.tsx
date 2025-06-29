
import { useContext } from 'react';
import AuthContext from './AuthContext';

export { AuthProvider } from './AuthProvider';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
