
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { LoanHistoryHeader } from './loan-history/LoanHistoryHeader';
import { LoanHistoryTable } from './loan-history/LoanHistoryTable';
import { LoadingState } from './loan-history/LoadingState';
import { EmptyState } from './loan-history/EmptyState';

interface LoanHistoryProps {
  loans: any[];
  creditScore: number;
  isLoading?: boolean;
}

const LoanHistory: React.FC<LoanHistoryProps> = ({ loans, creditScore, isLoading = false }) => {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <LoanHistoryHeader creditScore={creditScore} />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <LoadingState />
        ) : loans.length === 0 ? (
          <EmptyState />
        ) : (
          <LoanHistoryTable loans={loans} />
        )}
      </CardContent>
    </Card>
  );
};

export default LoanHistory;
