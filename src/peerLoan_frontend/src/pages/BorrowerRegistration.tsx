
import React, { memo } from 'react';
import RegistrationLayout from '@/components/borrower/registration/RegistrationLayout';
import RegistrationContent from '@/components/borrower/registration/RegistrationContent';
import {
  useRegistrationState,
  useAuthStateCheck,
  useRegistrationSubmit,
  useVerificationComplete
} from '@/components/borrower/registration/hooks';

// Memoize the component to prevent unnecessary re-renders
const BorrowerRegistration: React.FC = memo(() => {
  // Get registration state and hooks
  const {
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
    initialCheckDone,
  } = useRegistrationState();
  
  // Set up auth state checking
  useAuthStateCheck({
    user,
    checkAuth,
    navigate,
    initialCheckDone
  });
  
  // Set up submission handler
  const onSubmit = useRegistrationSubmit({
    isRegistering,
    setIsRegistering,
    user,
    registerUser,
    toast,
    navigate,
    checkAuth,
    redirectAttempted
  });
  
  // Set up verification completion handler
  const handleVerificationComplete = useVerificationComplete({
    setIsVerifying,
    toast,
    redirectAttempted,
    onSubmit
  });

  return (
    <RegistrationLayout>
      <RegistrationContent
        isVerifying={isVerifying}
        setIsVerifying={setIsVerifying}
        onSubmit={onSubmit}
        user={user}
        isRegistering={isRegistering}
        handleVerificationComplete={handleVerificationComplete}
      />
    </RegistrationLayout>
  );
});

export default BorrowerRegistration;
