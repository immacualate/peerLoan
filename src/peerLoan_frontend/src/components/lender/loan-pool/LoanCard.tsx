
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { CheckCircle2, DollarSign } from 'lucide-react';
import { getICPtoGHSConversion } from '@/services/currencyService';
import DualCurrencyDisplay from '@/components/shared/DualCurrencyDisplay';

interface LoanCardProps {
  loan: any;
  handleFundLoan: (loanId: string) => void;
  isProcessing: boolean;
}

const LoanCard: React.FC<LoanCardProps> = ({ loan, handleFundLoan, isProcessing }) => {
  return (
    <div className="border rounded-lg overflow-hidden bg-card">
      <div className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <h3 className="font-medium flex items-center">
              <span className="truncate">{loan.purpose}</span>
              <Badge 
                variant="outline" 
                className="ml-2 text-xs" 
              >
                ID: {loan.id.substring(0, 8)}...
              </Badge>
            </h3>
            <p className="text-sm text-muted-foreground">
              Requested {new Date(loan.createdAt).toLocaleDateString()}
            </p>
          </div>
          <Badge 
            className={cn(
              "w-fit capitalize",
              loan.status === "pending" && "bg-amber-500/80 hover:bg-amber-500/70",
              loan.status === "funded" && "bg-green-500/80 hover:bg-green-500/70",
            )}
          >
            {loan.status}
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Amount</span>
            <DualCurrencyDisplay icpAmount={loan.amount} />
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Duration</span>
            <span className="font-medium">{loan.duration} months</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Interest Rate</span>
            <div className="flex items-center">
              <span className="font-medium">{loan.interestRate}%</span>
              {loan.interestRate >= 8 && (
                <Badge className="ml-2 bg-green-500/80 text-xs">High Yield</Badge>
              )}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Credit Score</span>
            <div className="flex items-center">
              <span className="font-medium">{loan.creditScore}</span>
              {loan.creditScore >= 700 ? (
                <Badge className="ml-2 bg-green-500/80 text-xs">Low Risk</Badge>
              ) : loan.creditScore < 600 ? (
                <Badge className="ml-2 bg-red-500/80 text-xs">High Risk</Badge>
              ) : null}
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Monthly Payment</span>
            <DualCurrencyDisplay icpAmount={loan.monthlyPayment} />
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Total Repayment</span>
            <DualCurrencyDisplay icpAmount={loan.totalRepayment} />
          </div>
        </div>
        
        <Separator className="my-3" />
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span className="text-sm">Verified Student</span>
          </div>
          
          <Button
            onClick={() => handleFundLoan(loan.id)}
            disabled={isProcessing}
            className="bg-adanfo-blue hover:bg-adanfo-blue/90"
          >
            {isProcessing ? (
              <>Processing...</>
            ) : (
              <>
                <DollarSign className="h-4 w-4 mr-1" />
                Fund Loan
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoanCard;
