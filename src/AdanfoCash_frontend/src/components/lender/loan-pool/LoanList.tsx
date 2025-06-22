
import React from 'react';
import LoanCard from './LoanCard';

interface LoanListProps {
  loans: any[];
  handleFundLoan: (loanId: string) => void;
  selectedLoan: string | null;
}

const LoanList: React.FC<LoanListProps> = ({ loans, handleFundLoan, selectedLoan }) => {
  return (
    <div className="space-y-4">
      {loans.map(loan => (
        <LoanCard 
          key={loan.id}
          loan={loan}
          handleFundLoan={handleFundLoan}
          isProcessing={selectedLoan === loan.id}
        />
      ))}
    </div>
  );
};

export default LoanList;
