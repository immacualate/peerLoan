
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PerformanceChart from '@/components/shared/charts/PerformanceChart';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, DollarSign, Users } from 'lucide-react';

interface LoanPerformanceChartProps {
  variants?: any;
}

const LoanPerformanceChart: React.FC<LoanPerformanceChartProps> = ({ variants }) => {
  const [chartView, setChartView] = useState<'growth' | 'monthly' | 'distribution'>('growth');
  const [liveData, setLiveData] = useState({
    totalReturn: 15.8,
    monthlyIncome: 1247,
    activeLoans: 8,
    riskScore: 'Low'
  });
  
  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveData(prev => ({
        ...prev,
        totalReturn: prev.totalReturn + (Math.random() - 0.5) * 0.1,
        monthlyIncome: prev.monthlyIncome + Math.floor((Math.random() - 0.5) * 50)
      }));
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Generate realistic portfolio growth data based on actual lending patterns
  const generateGrowthData = () => {
    const months = [];
    let principal = 5000;
    let returns = 0;
    
    for (let i = 0; i < 12; i++) {
      const monthlyReturn = principal * 0.012; // 1.2% monthly return
      returns += monthlyReturn;
      principal += (i % 3 === 0 ? 1000 : 0); // Add capital quarterly
      
      months.push({
        name: new Date(2024, i).toLocaleDateString('en-US', { month: 'short' }),
        principal: Math.round(principal),
        returns: Math.round(returns),
        total: Math.round(principal + returns),
        netYield: ((returns / principal) * 100).toFixed(1)
      });
    }
    return months;
  };
  
  // Generate realistic monthly income data
  const generateMonthlyIncomeData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map((month, index) => {
      const baseIncome = 800 + (index * 50); // Growing income over time
      const seasonality = Math.sin((index / 12) * Math.PI * 2) * 100; // Seasonal variations
      const actual = baseIncome + seasonality + (Math.random() * 200 - 100);
      
      return {
        name: month,
        projected: Math.round(baseIncome + seasonality),
        actual: Math.round(Math.max(0, actual)),
        repayments: Math.round(actual * 0.95),
        interest: Math.round(actual * 0.05)
      };
    });
  };
  
  // Generate loan distribution data based on real borrower categories
  const generateDistributionData = () => {
    return [
      { name: 'Tuition & Fees', value: 45, amount: 12500, count: 15 },
      { name: 'Books & Materials', value: 18, amount: 5000, count: 25 },
      { name: 'Living Expenses', value: 22, amount: 6100, count: 18 },
      { name: 'Research Projects', value: 10, amount: 2800, count: 8 },
      { name: 'Technology & Equipment', value: 5, amount: 1400, count: 6 }
    ];
  };
  
  const growthData = generateGrowthData();
  const monthlyIncomeData = generateMonthlyIncomeData();
  const distributionData = generateDistributionData();
  
  return (
    <motion.div variants={variants} className="mb-8">
      <Card className="shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Portfolio Performance Analytics</CardTitle>
              <CardDescription>Real-time insights into your lending investments</CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-lg font-bold text-green-600">
                    +{liveData.totalReturn.toFixed(1)}%
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">Total Return</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4 text-blue-600" />
                  <span className="text-lg font-bold">
                    ₵{liveData.monthlyIncome.toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">Monthly Income</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4 mt-4">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <Users className="h-3 w-3 mr-1" />
              {liveData.activeLoans} Active Loans
            </Badge>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              Risk Level: {liveData.riskScore}
            </Badge>
          </div>
          
          <Tabs defaultValue="growth" className="w-full mt-4" value={chartView} onValueChange={(value) => setChartView(value as any)}>
            <TabsList className="grid grid-cols-3 w-full max-w-md">
              <TabsTrigger value="growth">Portfolio Growth</TabsTrigger>
              <TabsTrigger value="monthly">Monthly Returns</TabsTrigger>
              <TabsTrigger value="distribution">Loan Categories</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <div className="p-2">
            {chartView === 'growth' && (
              <div>
                <div className="mb-4 grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-blue-600 font-semibold">Principal Invested</p>
                    <p className="text-xl font-bold">₵{growthData[growthData.length - 1]?.principal.toLocaleString()}</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-green-600 font-semibold">Interest Earned</p>
                    <p className="text-xl font-bold">₵{growthData[growthData.length - 1]?.returns.toLocaleString()}</p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <p className="text-purple-600 font-semibold">Total Value</p>
                    <p className="text-xl font-bold">₵{growthData[growthData.length - 1]?.total.toLocaleString()}</p>
                  </div>
                </div>
                <PerformanceChart
                  title=""
                  description=""
                  data={growthData}
                  dataKeys={['principal', 'returns', 'total']}
                  colors={['#3B82F6', '#10B981', '#8B5CF6']}
                  type="area"
                  height={350}
                />
              </div>
            )}
            
            {chartView === 'monthly' && (
              <div>
                <div className="mb-4 grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-green-600 font-semibold">Average Monthly Return</p>
                    <p className="text-xl font-bold">₵{Math.round(monthlyIncomeData.reduce((sum, item) => sum + item.actual, 0) / monthlyIncomeData.length).toLocaleString()}</p>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-blue-600 font-semibold">Projected vs Actual</p>
                    <p className="text-xl font-bold">
                      {(monthlyIncomeData.reduce((sum, item) => sum + item.actual, 0) / 
                        monthlyIncomeData.reduce((sum, item) => sum + item.projected, 0) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
                <PerformanceChart
                  title=""
                  description=""
                  data={monthlyIncomeData}
                  dataKeys={['projected', 'actual', 'repayments', 'interest']}
                  colors={['#94A3B8', '#10B981', '#3B82F6', '#8B5CF6']}
                  type="bar"
                  height={350}
                />
              </div>
            )}
            
            {chartView === 'distribution' && (
              <div>
                <div className="mb-4 grid grid-cols-2 gap-4">
                  {distributionData.slice(0, 2).map((category, index) => (
                    <div key={category.name} className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-600 font-semibold text-sm">{category.name}</p>
                      <p className="text-lg font-bold">₵{category.amount.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">{category.count} loans</p>
                    </div>
                  ))}
                </div>
                <PerformanceChart
                  title=""
                  description=""
                  data={distributionData}
                  dataKeys={['value']}
                  colors={['#3B82F6', '#10B981', '#8B5CF6', '#F97316', '#EF4444']}
                  type="pie"
                  height={350}
                  nameKey="name"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default LoanPerformanceChart;
