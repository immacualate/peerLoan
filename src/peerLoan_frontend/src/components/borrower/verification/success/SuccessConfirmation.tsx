
import React from 'react';
import SuccessIcon from './components/SuccessIcon';
import SuccessHeader from './components/SuccessHeader';
import VerificationCard from './components/VerificationCard';
import ReadyCard from './components/ReadyCard';
import RedirectProgress from './components/RedirectProgress';

interface SuccessConfirmationProps {
  onRedirect?: () => void;
  firstName?: string;
}

const SuccessConfirmation: React.FC<SuccessConfirmationProps> = ({ 
  onRedirect,
  firstName = "Student"
}) => {
  const handleContinue = () => {
    if (onRedirect) {
      onRedirect();
    }
  };

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      <SuccessIcon />
      <SuccessHeader firstName={firstName} />
      <VerificationCard />
      <ReadyCard onRedirect={onRedirect} />
      <RedirectProgress onContinue={handleContinue} />
    </div>
  );
};

export default SuccessConfirmation;
