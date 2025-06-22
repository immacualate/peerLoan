
import { useState, useEffect } from 'react';
import { getLoanHistory } from '@/services/loanService';

export const useLoanHistory = (borrowerId: string) => {
  const [loans, setLoans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLoans = async () => {
      if (!borrowerId || borrowerId === 'guest-user') {
        setLoans([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const loanData = await getLoanHistory(borrowerId);
        setLoans(loanData || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching loan history:', err);
        setError('Failed to load loan history');
        setLoans([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLoans();
  }, [borrowerId]);

  return { loans, isLoading, error };
};

export default useLoanHistory;
