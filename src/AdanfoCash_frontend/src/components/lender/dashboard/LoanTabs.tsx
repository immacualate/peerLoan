
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AvailableLoans from './tabs/AvailableLoans';
import FundedLoans from './tabs/FundedLoans';
import UpcomingRepayments from './tabs/UpcomingRepayments';

interface LoanTabsProps {
  userId?: string;
}

const LoanTabs: React.FC<LoanTabsProps> = ({ userId }) => {
  const [activeTab, setActiveTab] = useState('available');
  
  return (
    <div className="mb-8">
      <Tabs defaultValue="available" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="available">Available Loans</TabsTrigger>
          <TabsTrigger value="funded">Your Funded Loans</TabsTrigger>
          <TabsTrigger value="repayments">Upcoming Repayments</TabsTrigger>
        </TabsList>
        
        <TabsContent value="available">
          <AvailableLoans userId={userId} />
        </TabsContent>
        
        <TabsContent value="funded">
          <FundedLoans activeTab={activeTab} setActiveTab={setActiveTab} />
        </TabsContent>
        
        <TabsContent value="repayments">
          <UpcomingRepayments activeTab={activeTab} setActiveTab={setActiveTab} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LoanTabs;
