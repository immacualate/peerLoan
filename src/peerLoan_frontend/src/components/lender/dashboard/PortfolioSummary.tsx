
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';

const PortfolioSummary: React.FC = () => {
  // Mock lender statistics
  const lenderStats = {
    funded: 12,
    totalInvested: 15600,
    averageInterest: 11.2,
    activeLoans: 8,
    repaid: 4,
    defaulted: 0,
    impactScore: 87
  };
  
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Your Lending Portfolio</CardTitle>
        <CardDescription>
          Overview of your loan investments and returns
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="font-medium mb-4">Loan Status Distribution</h4>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span>Active ({lenderStats.activeLoans})</span>
                  <span>{Math.round(lenderStats.activeLoans/lenderStats.funded*100)}%</span>
                </div>
                <Progress value={lenderStats.activeLoans/lenderStats.funded*100} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span>Repaid ({lenderStats.repaid})</span>
                  <span>{Math.round(lenderStats.repaid/lenderStats.funded*100)}%</span>
                </div>
                <Progress value={lenderStats.repaid/lenderStats.funded*100} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span>Defaulted ({lenderStats.defaulted})</span>
                  <span>{Math.round(lenderStats.defaulted/lenderStats.funded*100)}%</span>
                </div>
                <Progress value={lenderStats.defaulted/lenderStats.funded*100} className="h-2" />
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Return on Investment</h4>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Principal Invested:</span>
                <span className="font-medium">${lenderStats.totalInvested.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Interest Earned:</span>
                <span className="font-medium text-green-600">+${Math.round(lenderStats.totalInvested * lenderStats.averageInterest / 100).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Default Losses:</span>
                <span className="font-medium text-red-500">-$0</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between">
                <span className="font-medium">Net Return:</span>
                <span className="font-bold text-green-600">+${Math.round(lenderStats.totalInvested * lenderStats.averageInterest / 100).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PortfolioSummary;
