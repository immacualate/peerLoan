
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';

interface UpcomingRepaymentsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const UpcomingRepayments: React.FC<UpcomingRepaymentsProps> = ({ activeTab, setActiveTab }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Repayments</CardTitle>
        <CardDescription>Schedule of upcoming loan repayments</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center items-center py-16 flex-col">
          <Clock className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium mb-2">No Upcoming Repayments</h3>
          <p className="text-muted-foreground mb-6 text-center max-w-md">
            When students begin repaying their loans, their payment schedule will appear here.
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

export default UpcomingRepayments;
