
import React from 'react';
import SuccessConfirmation from "./success/SuccessConfirmation";
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuthContext';

const SuccessConfirmationWrapper: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Extract first name from user.id if available
  const firstName = user?.id?.split(' ')?.[0] || "Student";

  // Handle redirect to borrower dashboard with improved stability
  const handleRedirect = () => {
    toast({
      title: "Success",
      description: "Redirecting to your borrower dashboard"
    });
    
    // Short delay to ensure the toast is shown
    setTimeout(() => {
      navigate('/borrower-dashboard');
    }, 300);
  };

  return <SuccessConfirmation onRedirect={handleRedirect} firstName={firstName} />;
};

export default SuccessConfirmationWrapper;
