
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuthContext';

export const useRegistrationState = () => {
  const { user, checkAuth, registerUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isVerifying, setIsVerifying] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const redirectAttempted = useRef(false);
  const initialCheckDone = useRef(false);
  
  return {
    user,
    registerUser,
    checkAuth,
    navigate,
    toast,
    isVerifying,
    setIsVerifying,
    isRegistering,
    setIsRegistering,
    redirectAttempted,
    initialCheckDone
  };
};
