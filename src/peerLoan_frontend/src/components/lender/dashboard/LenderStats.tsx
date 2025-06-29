
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { DollarSign, TrendingUp, BookOpen, Award } from 'lucide-react';

const LenderStats: React.FC = () => {
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
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <DollarSign className="h-8 w-8 mx-auto mb-2 text-adanfo-blue" />
            <h3 className="text-2xl font-bold">${lenderStats.totalInvested.toLocaleString()}</h3>
            <p className="text-sm text-muted-foreground">Total Invested</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-adanfo-blue" />
            <h3 className="text-2xl font-bold">{lenderStats.averageInterest}%</h3>
            <p className="text-sm text-muted-foreground">Average Interest</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <BookOpen className="h-8 w-8 mx-auto mb-2 text-adanfo-blue" />
            <h3 className="text-2xl font-bold">{lenderStats.funded}</h3>
            <p className="text-sm text-muted-foreground">Students Funded</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <Award className="h-8 w-8 mx-auto mb-2 text-adanfo-blue" />
            <h3 className="text-2xl font-bold">{lenderStats.impactScore}/100</h3>
            <p className="text-sm text-muted-foreground">Impact Score</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LenderStats;
