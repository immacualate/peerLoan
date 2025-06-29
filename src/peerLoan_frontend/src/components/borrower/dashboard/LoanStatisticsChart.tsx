
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import PerformanceChart from '@/components/shared/charts/PerformanceChart';
import { generateLoanPerformanceData, generateLoanDistributionData, generateRepaymentStatusData } from '@/utils/chartData';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface LoanStatisticsChartProps {
  variants?: any;
}

const LoanStatisticsChart: React.FC<LoanStatisticsChartProps> = ({ variants }) => {
  const [chartView, setChartView] = useState<'activity' | 'distribution' | 'status'>('activity');
  
  const chartData = generateLoanPerformanceData();
  const distributionData = generateLoanDistributionData();
  const statusData = generateRepaymentStatusData();
  
  return (
    <motion.div
      variants={variants || {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
      className="mb-8"
    >
      <Card className="shadow-md">
        <CardHeader className="pb-3">
          <CardTitle>Loan Activity</CardTitle>
          <CardDescription>Track your loan activity and financial statistics</CardDescription>
          <Tabs defaultValue="activity" className="w-full" value={chartView} onValueChange={(value) => setChartView(value as any)}>
            <TabsList className="grid grid-cols-3 w-full max-w-md">
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="distribution">Distribution</TabsTrigger>
              <TabsTrigger value="status">Status</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <div className="p-2">
            {chartView === 'activity' && (
              <PerformanceChart
                title=""
                description=""
                data={chartData}
                dataKeys={['funded', 'repaid', 'interest']}
                colors={['#0EA5E9', '#10B981', '#F97316']}
                type="bar"
                height={350}
              />
            )}
            
            {chartView === 'distribution' && (
              <PerformanceChart
                title=""
                description=""
                data={distributionData}
                dataKeys={['value']}
                colors={['#8B5CF6', '#10B981', '#0EA5E9', '#F97316']}
                type="pie"
                height={350}
                nameKey="name"
              />
            )}
            
            {chartView === 'status' && (
              <PerformanceChart
                title=""
                description=""
                data={statusData}
                dataKeys={['value']}
                colors={['#10B981', '#8B5CF6', '#F97316', '#EF4444']}
                type="pie"
                height={350}
                nameKey="name"
              />
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default LoanStatisticsChart;
