
import React from 'react';
import { motion } from 'framer-motion';
import { User } from '@/types/authTypes';
import ZKPassVerification from '../ZKPassVerification';
import LoanHistory from '../LoanHistory';
import VerificationStatus from './VerificationStatus';
import LoanRequestSection from './LoanRequestSection';

interface DashboardContentProps {
  isVerifyingStudent: boolean;
  handleVerificationComplete: (success: boolean) => void;
  verificationStatus: boolean;
  isLoadingVerification: boolean;
  setIsVerifyingStudent: (value: boolean) => void;
  loans: any[];
  isLoadingLoans: boolean;
  isRequestingLoan: boolean;
  setIsRequestingLoan: (value: boolean) => void;
  handleLoanRequested: () => void;
  user: User;
}

const DashboardContent: React.FC<DashboardContentProps> = ({
  isVerifyingStudent,
  handleVerificationComplete,
  verificationStatus,
  isLoadingVerification,
  setIsVerifyingStudent,
  loans,
  isLoadingLoans,
  isRequestingLoan,
  setIsRequestingLoan,
  handleLoanRequested,
  user
}) => {
  if (isVerifyingStudent) {
    return (
      <motion.div variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}>
        <ZKPassVerification onVerificationComplete={handleVerificationComplete} />
      </motion.div>
    );
  }
  
  return (
    <>
      <motion.div variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }} className="mb-6">
        <LoanHistory 
          loans={loans} 
          creditScore={user.creditScore || 0} 
          isLoading={isLoadingLoans}
        />
      </motion.div>
      
      {!verificationStatus && (
        <VerificationStatus 
          isVerified={verificationStatus} 
          isLoading={false}
          setIsVerifyingStudent={setIsVerifyingStudent} 
        />
      )}
      
      <LoanRequestSection 
        loans={loans}
        isRequestingLoan={isRequestingLoan}
        setIsRequestingLoan={setIsRequestingLoan}
        handleLoanRequested={handleLoanRequested}
        userInfo={user}
      />
    </>
  );
};

export default DashboardContent;
