
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getPendingLoans, fundLoan } from '@/services/smart-contract/loanContractService';
import { getICPtoGHSConversion } from '@/services/currencyService';
import { User } from '@/types/authTypes';

export const useLoanPool = (lenderId: string) => {
  const [loans, setLoans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLoan, setSelectedLoan] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [conversionRate, setConversionRate] = useState(56); // Default conversion rate
  const { toast } = useToast();

  // Load loans
  useEffect(() => {
    const fetchLoans = async () => {
      try {
        setIsLoading(true);
        const pendingLoans = await getPendingLoans();
        setLoans(pendingLoans);
        
        // Get conversion rate
        const rate = await getICPtoGHSConversion();
        if (rate) {
          setConversionRate(rate);
        }
      } catch (error) {
        console.error('Error loading loans:', error);
        toast({
          title: 'Failed to load loans',
          description: 'There was an error loading the loan requests.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchLoans();
    
    // Refresh loans every 30 seconds
    const interval = setInterval(fetchLoans, 30000);
    
    return () => clearInterval(interval);
  }, [toast]);

  // Fund a loan - create a User object from lenderId
  const handleFundLoan = async (loanId: string) => {
    try {
      setSelectedLoan(loanId);
      
      // Create a User object from the lenderId string
      const lenderUser: User = {
        id: "",
        principalId: lenderId,
        role: "lender",
        isAuthenticated: true
      };
      
      const result = await fundLoan(lenderUser, loanId);
      
      if (result.success) {
        toast({
          title: 'Loan Funded Successfully',
          description: 'You have successfully funded this loan.',
        });
        
        // Update loans list
        setLoans(prevLoans => 
          prevLoans.filter(loan => loan.id !== loanId)
        );
      } else {
        toast({
          title: 'Funding Failed',
          description: result.error || 'There was an error funding this loan.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error funding loan:', error);
      toast({
        title: 'Funding Error',
        description: 'There was an error processing your funding request.',
        variant: 'destructive',
      });
    } finally {
      setSelectedLoan(null);
    }
  };

  // Filter loans
  const filteredLoans = loans.filter(loan => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'high-yield' && loan.interestRate >= 8) return true;
    if (activeFilter === 'low-risk' && loan.creditScore >= 700) return true;
    if (activeFilter === 'short-term' && loan.duration <= 6) return true;
    return false;
  });

  return {
    loans,
    isLoading,
    selectedLoan,
    activeFilter,
    setActiveFilter,
    filteredLoans,
    conversionRate,
    handleFundLoan
  };
};
