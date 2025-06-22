
import React from 'react';
import { CreditCard } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { CardTitle } from '@/components/ui/card';

interface LoanHistoryHeaderProps {
  creditScore: number;
}

export const LoanHistoryHeader: React.FC<LoanHistoryHeaderProps> = ({ creditScore }) => {
  return (
    <CardTitle className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <CreditCard className="h-5 w-5 text-adanfo-blue" />
        <span>Loan History & Credit</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm">Credit Score:</span>
        <Badge variant={creditScore > 700 ? "success" : creditScore > 500 ? "default" : "destructive"}>
          {creditScore}
        </Badge>
      </div>
    </CardTitle>
  );
};
