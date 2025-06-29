
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { User, Clock, DollarSign, BookOpen } from 'lucide-react';

interface LoanCardProps {
  loan: any;
  handleFundLoan: (loanId: string) => void;
  isProcessing: boolean;
}

const LoanCard: React.FC<LoanCardProps> = ({ loan, handleFundLoan, isProcessing }) => {
  return (
    <Card className={`border ${loan.status === 'funded' ? 'border-green-200 bg-green-50' : ''}`}>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-semibold text-lg">${loan.amount.toFixed(2)}</h3>
            <p className="text-sm text-muted-foreground">{loan.purpose}</p>
          </div>
          <div className={`px-2 py-1 rounded text-xs ${loan.status === 'funded' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
            {loan.status === 'funded' ? 'Funded' : 'Pending'}
          </div>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-muted-foreground" />
            <span>Borrower: {loan.borrowerName || loan.borrowerId?.substring(0, 8) + '...' || 'Anonymous'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>Duration: {loan.duration} months</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span>Interest Rate: {loan.interestRate}%</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <BookOpen className="h-4 w-4 text-muted-foreground" />
            <span>Posted: {new Date(loan.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        
        {/* Risk and Reward Section */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">Risk</span>
            <span className={`font-medium ${loan.creditScore >= 700 ? 'text-green-600' : loan.creditScore >= 650 ? 'text-amber-600' : 'text-red-600'}`}>
              {loan.creditScore >= 700 ? 'Low' : loan.creditScore >= 650 ? 'Medium' : 'High'}
            </span>
          </div>
          <Progress value={Math.max(0, Math.min(100, (loan.creditScore - 550) / 2.5))} className="h-2" />
        </div>
        
        <Button 
          onClick={() => handleFundLoan(loan.id)}
          className="w-full bg-adanfo-blue hover:bg-adanfo-blue/90" 
          disabled={loan.status === 'funded' || isProcessing}
        >
          {loan.status === 'funded' ? 'Funded' : isProcessing ? 'Processing...' : 'Fund This Loan'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default LoanCard;
