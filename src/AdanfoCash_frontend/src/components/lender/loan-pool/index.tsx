
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useLoanPool } from './useLoanPool';
import LoanFilters from './LoanFilters';
import LoanList from './LoanList';
import EmptyState from './EmptyState';
import LoadingState from './LoadingState';

const LoanPool: React.FC<{ lenderId: string }> = ({ lenderId }) => {
  const { toast } = useToast();
  const { 
    loans, 
    isLoading,
    filteredLoans, 
    activeFilter, 
    setActiveFilter,
    handleFundLoan,
    selectedLoan
  } = useLoanPool(lenderId);

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex justify-between items-center">
          <span>Available Loan Requests</span>
          <Badge variant="outline" className="ml-2">
            {filteredLoans.length} {filteredLoans.length === 1 ? 'request' : 'requests'}
          </Badge>
        </CardTitle>
        
        <LoanFilters 
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <LoadingState />
        ) : filteredLoans.length === 0 ? (
          <EmptyState setActiveFilter={setActiveFilter} />
        ) : (
          <LoanList 
            loans={filteredLoans}
            handleFundLoan={handleFundLoan}
            selectedLoan={selectedLoan}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default LoanPool;
