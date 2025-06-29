
import React from 'react';
import { motion } from 'framer-motion';
import ZKPassVerification from '@/components/borrower/ZKPassVerification';
import { PageHeader, VerificationCard } from '@/components/borrower/registration';

interface RegistrationContentProps {
  isVerifying: boolean;
  setIsVerifying: (value: boolean) => void;
  onSubmit: () => void;
  user: any;
  isRegistering: boolean;
  handleVerificationComplete: (success: boolean) => void;
}

const RegistrationContent: React.FC<RegistrationContentProps> = ({
  isVerifying,
  setIsVerifying,
  onSubmit,
  user,
  isRegistering,
  handleVerificationComplete
}) => {
  return (
    <>
      <PageHeader />
      
      {isVerifying ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          <ZKPassVerification onVerificationComplete={handleVerificationComplete} />
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          <VerificationCard 
            setIsVerifying={setIsVerifying} 
            onSubmit={onSubmit} 
            user={user}
            isLoading={isRegistering}
          />
        </motion.div>
      )}
    </>
  );
};

export default RegistrationContent;
