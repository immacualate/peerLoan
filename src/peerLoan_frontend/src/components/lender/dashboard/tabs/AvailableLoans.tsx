
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuthContext';
import { Loader2, Shield } from 'lucide-react';
import { getAvailableLoanRequests, fundLoanRequest } from '@/services/loanService';
import LoanCard from './LoanCard';

interface AvailableLoansProps {
  userId?: string;
}

const AvailableLoans: React.FC<AvailableLoansProps> = ({ userId }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [availableLoans, setAvailableLoans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLoan, setSelectedLoan] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchAvailableLoans = async () => {
      try {
        setIsLoading(true);
        const loans = await getAvailableLoanRequests();
        setAvailableLoans(loans);
      } catch (error) {
        console.error("Error fetching available loans:", error);
        toast({
          title: "Error",
          description: "Failed to load available loan requests.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAvailableLoans();
    
    // Refresh data every 30 seconds
    const intervalId = setInterval(fetchAvailableLoans, 30000);
    return () => clearInterval(intervalId);
  }, [toast]);
  
  const handleFundLoan = async (loanId: string) => {
    if (!user.principalId) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to fund loans.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setSelectedLoan(loanId);
      const success = await fundLoanRequest(user.principalId, loanId);
      
      if (success) {
        toast({
          title: "Funding Successful",
          description: "You have successfully funded this loan request. The borrower will be notified.",
        });
        
        // Update the loan status locally
        setAvailableLoans(prev => 
          prev.map(loan => 
            loan.id === loanId ? { ...loan, status: 'funded' } : loan
          )
        );
      } else {
        toast({
          title: "Funding Failed",
          description: "There was an error funding this loan. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error funding loan:", error);
      toast({
        title: "Funding Error",
        description: "An unexpected error occurred while funding the loan.",
        variant: "destructive"
      });
    } finally {
      setSelectedLoan(null);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Available Loan Requests</CardTitle>
        <CardDescription>
          Browse verified student loan requests that need funding
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : availableLoans.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Shield className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
            <p>No loan requests available at this time.</p>
            <p className="text-sm mt-2">Check back later for new requests.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {availableLoans.map((loan) => (
              <LoanCard 
                key={loan.id} 
                loan={loan} 
                handleFundLoan={handleFundLoan}
                isProcessing={selectedLoan === loan.id}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AvailableLoans;
