
import React from 'react';
import { BadgePercent, HelpCircle } from 'lucide-react';

interface InterestRateDisplayProps {
  interestRate: number;
  creditScore?: number;
}

const InterestRateDisplay: React.FC<InterestRateDisplayProps> = ({ 
  interestRate, 
  creditScore 
}) => {
  return (
    <div className="bg-secondary/30 p-4 rounded-lg space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BadgePercent className="h-5 w-5 text-adanfo-blue" />
          <span className="font-medium">Interest Rate</span>
        </div>
        <span className="font-medium">{interestRate}%</span>
      </div>
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Your personalized rate based on credit score: {creditScore || "N/A"}</p>
        <div className="flex items-center text-sm gap-2">
          <HelpCircle className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Improve your credit score to receive better rates</span>
        </div>
      </div>
    </div>
  );
};

export default InterestRateDisplay;
