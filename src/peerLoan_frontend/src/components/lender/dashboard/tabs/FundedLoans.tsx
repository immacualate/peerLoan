
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bookmark } from 'lucide-react';

interface FundedLoansProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const FundedLoans: React.FC<FundedLoansProps> = ({ activeTab, setActiveTab }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Funded Loans</CardTitle>
        <CardDescription>Loans you have funded that are currently active</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center items-center py-16 flex-col">
          <Bookmark className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium mb-2">No Active Loans</h3>
          <p className="text-muted-foreground mb-6 text-center max-w-md">
            When you fund a student loan, it will appear here for you to track its repayment status.
          </p>
          <Button 
            onClick={() => setActiveTab('available')} 
            variant="outline"
          >
            Browse Available Loans
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FundedLoans;
