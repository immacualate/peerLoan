
import React from 'react';
import { Calculator } from 'lucide-react';

interface LoanCalculatorProps {
  monthlyPayment: number;
  totalRepayment: number;
}

const LoanCalculator: React.FC<LoanCalculatorProps> = ({ 
  monthlyPayment, 
  totalRepayment 
}) => {
  return (
    <div className="bg-secondary/30 p-4 rounded-lg space-y-4">
      <h3 className="font-medium flex items-center gap-2">
        <Calculator className="h-5 w-5 text-adanfo-blue" />
        Loan Calculator
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="border rounded-lg p-3">
          <p className="text-sm text-muted-foreground">Monthly Payment</p>
          <p className="text-lg font-medium">${monthlyPayment.toFixed(2)}</p>
        </div>
        
        <div className="border rounded-lg p-3">
          <p className="text-sm text-muted-foreground">Total Repayment</p>
          <p className="text-lg font-medium">${totalRepayment.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default LoanCalculator;
