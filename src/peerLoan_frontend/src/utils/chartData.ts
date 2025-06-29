
// Utility functions to generate chart data for loan statistics

// Sample data for loan performance over time
export const generateLoanPerformanceData = (months = 6) => {
  const currentDate = new Date();
  const data = [];

  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(currentDate);
    date.setMonth(currentDate.getMonth() - i);
    
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear().toString().substr(-2);

    data.push({
      name: `${month} '${year}`,
      funded: Math.floor(Math.random() * 5000) + 1000,
      repaid: Math.floor(Math.random() * 3000) + 800,
      interest: Math.floor(Math.random() * 500) + 200,
    });
  }

  return data;
};

// Sample data for loan distribution by type
export const generateLoanDistributionData = () => {
  return [
    { name: 'Tuition', value: 45 },
    { name: 'Books', value: 20 },
    { name: 'Living', value: 25 },
    { name: 'Other', value: 10 },
  ];
};

// Sample data for loan repayment status
export const generateRepaymentStatusData = () => {
  return [
    { name: 'Active', value: 65 },
    { name: 'Completed', value: 30 },
    { name: 'Late', value: 4 },
    { name: 'Default', value: 1 },
  ];
};

// Sample data for portfolio performance
export const generatePortfolioPerformanceData = (months = 12) => {
  const currentDate = new Date();
  const data = [];
  let principal = 10000;
  let returns = 0;
  
  for (let i = 0; i <= months; i++) {
    const date = new Date(currentDate);
    date.setMonth(currentDate.getMonth() - months + i);
    
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear().toString().substr(-2);
    
    // Simulate growth
    returns += principal * 0.01 * (Math.random() * 0.02 + 0.005);
    
    data.push({
      name: i === 0 ? 'Start' : `${month} '${year}`,
      principal: Math.round(principal),
      returns: Math.round(returns),
      total: Math.round(principal + returns)
    });
  }
  
  return data;
};

// Enhanced data for monthly income projections
export const generateMonthlyIncomeProjections = (months = 12) => {
  const currentDate = new Date();
  const data = [];
  
  for (let i = 0; i < months; i++) {
    const date = new Date(currentDate);
    date.setMonth(currentDate.getMonth() - Math.floor(months/2) + i);
    
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear().toString().substr(-2);
    
    // Past months have actual values, future months are projections
    const isPast = i < Math.floor(months/2);
    
    data.push({
      name: `${month} '${year}`,
      expected: Math.floor(Math.random() * 400) + 1200,
      actual: isPast ? Math.floor(Math.random() * 500) + 1100 : null,
      projected: !isPast ? Math.floor(Math.random() * 500) + 1200 : null,
    });
  }
  
  return data;
};

// Generate risk metrics for loan portfolio
export const generateRiskMetrics = () => {
  return [
    { name: 'Low Risk', value: 65 },
    { name: 'Medium Risk', value: 25 },
    { name: 'High Risk', value: 10 }
  ];
};

// Generate educational return on investment data
export const generateEducationROIData = (years = 5) => {
  const data = [];
  let baselineSalary = 40000;
  let educatedSalary = 40000;
  
  for (let i = 0; i <= years; i++) {
    baselineSalary += baselineSalary * 0.02; // 2% annual increase without education
    
    if (i === 0) {
      educatedSalary = baselineSalary;
    } else {
      educatedSalary += educatedSalary * (0.08 + (Math.random() * 0.04)); // 8-12% with education
    }
    
    data.push({
      name: `Year ${i}`,
      baseline: Math.round(baselineSalary),
      withEducation: Math.round(educatedSalary),
      difference: Math.round(educatedSalary - baselineSalary)
    });
  }
  
  return data;
};
