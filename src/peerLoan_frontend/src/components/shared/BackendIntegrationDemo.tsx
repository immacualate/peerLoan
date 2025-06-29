import React, { useState, useEffect } from 'react';
import { useBackendServiceContext } from '../../contexts/BackendServiceContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, CreditCard, DollarSign, Calendar, User } from 'lucide-react';

export const BackendIntegrationDemo: React.FC = () => {
  const {
    isAuthenticated,
    isLoading,
    currentPrincipal,
    login,
    logout,
    userLoans,
    pendingLoans,
    refreshUserLoans,
    refreshPendingLoans,
    createLoan,
    fundLoan,
    repayLoan,
    verifyStudent
  } = useBackendServiceContext();

  const [demoLoading, setDemoLoading] = useState(false);
  const [message, setMessage] = useState<string>('');

  // Demo functions
  const handleVerifyStudent = async () => {
    setDemoLoading(true);
    setMessage('');
    
    try {
      const studentData = {
        fullName: ['John Doe'],
        contactNumber: ['+233123456789'],
        hashedGhanaCard: ['demo_hash_123'],
        universityName: 'University of Ghana',
        studentId: 'UG2024001',
        gpa: 3.5,
        graduationDate: '2025-12-01',
        isEnrolled: true
      };

      const result = await verifyStudent(studentData);
      
      if (result.success) {
        setMessage('Student verified successfully!');
      } else {
        setMessage(`Verification failed: ${result.error}`);
      }
    } catch (error) {
      setMessage(`Error: ${error}`);
    } finally {
      setDemoLoading(false);
    }
  };

  const handleCreateLoan = async () => {
    setDemoLoading(true);
    setMessage('');
    
    try {
      const result = await createLoan(5000, 12, 'Tuition fees');
      
      if (result.success) {
        setMessage(`Loan created successfully! ID: ${result.loanId}`);
      } else {
        setMessage(`Loan creation failed: ${result.error}`);
      }
    } catch (error) {
      setMessage(`Error: ${error}`);
    } finally {
      setDemoLoading(false);
    }
  };

  const handleFundLoan = async (loanId: string) => {
    setDemoLoading(true);
    setMessage('');
    
    try {
      const result = await fundLoan(loanId);
      
      if (result.success) {
        setMessage('Loan funded successfully!');
        await refreshPendingLoans();
      } else {
        setMessage(`Funding failed: ${result.error}`);
      }
    } catch (error) {
      setMessage(`Error: ${error}`);
    } finally {
      setDemoLoading(false);
    }
  };

  const handleRepayLoan = async (loanId: string, amount: number) => {
    setDemoLoading(true);
    setMessage('');
    
    try {
      const result = await repayLoan(loanId, amount);
      
      if (result.success) {
        setMessage(`Payment successful! Credit score increased by ${result.creditScoreChange} points.`);
        await refreshUserLoans();
      } else {
        setMessage(`Repayment failed: ${result.error}`);
      }
    } catch (error) {
      setMessage(`Error: ${error}`);
    } finally {
      setDemoLoading(false);
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS'
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      active: 'bg-green-100 text-green-800',
      repaid: 'bg-blue-100 text-blue-800',
      defaulted: 'bg-red-100 text-red-800'
    };

    return (
      <Badge className={statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Initializing backend connection...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            peerLoan Backend Integration
          </CardTitle>
          <CardDescription>
            Demonstrating the connection between frontend and backend canister
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Authentication Status */}
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="font-medium">Authentication Status:</span>
              <Badge variant={isAuthenticated ? 'default' : 'secondary'}>
                {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
              </Badge>
            </div>
            <div className="flex gap-2">
              {!isAuthenticated ? (
                <Button onClick={login} disabled={demoLoading}>
                  Login with Internet Identity
                </Button>
              ) : (
                <Button variant="outline" onClick={logout} disabled={demoLoading}>
                  Logout
                </Button>
              )}
            </div>
          </div>

          {/* Principal Display */}
          {isAuthenticated && currentPrincipal && (
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground">Current Principal:</div>
              <div className="font-mono text-sm break-all">{currentPrincipal.toText()}</div>
            </div>
          )}

          {/* Demo Actions */}
          {isAuthenticated && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                onClick={handleVerifyStudent} 
                disabled={demoLoading}
                className="h-20 flex flex-col items-center justify-center"
              >
                {demoLoading ? <Loader2 className="h-4 w-4 animate-spin mb-1" /> : <User className="h-4 w-4 mb-1" />}
                Verify Student
              </Button>
              
              <Button 
                onClick={handleCreateLoan} 
                disabled={demoLoading}
                className="h-20 flex flex-col items-center justify-center"
              >
                {demoLoading ? <Loader2 className="h-4 w-4 animate-spin mb-1" /> : <DollarSign className="h-4 w-4 mb-1" />}
                Create Demo Loan
              </Button>
              
              <Button 
                onClick={() => Promise.all([refreshUserLoans(), refreshPendingLoans()])} 
                disabled={demoLoading}
                variant="outline"
                className="h-20 flex flex-col items-center justify-center"
              >
                {demoLoading ? <Loader2 className="h-4 w-4 animate-spin mb-1" /> : <Calendar className="h-4 w-4 mb-1" />}
                Refresh Data
              </Button>
            </div>
          )}

          {/* Status Message */}
          {message && (
            <div className={`p-4 rounded-lg ${message.includes('successfully') || message.includes('successful') 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
            }`}>
              {message}
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Loans */}
      {isAuthenticated && (
        <Card>
          <CardHeader>
            <CardTitle>Your Loans ({userLoans.length})</CardTitle>
            <CardDescription>Loans you have borrowed or funded</CardDescription>
          </CardHeader>
          <CardContent>
            {userLoans.length === 0 ? (
              <p className="text-muted-foreground">No loans found</p>
            ) : (
              <div className="space-y-4">
                {userLoans.map((loan) => (
                  <div key={loan.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{loan.id}</span>
                        {getStatusBadge(loan.status)}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {loan.interestRate}% interest
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Amount:</span>
                        <div className="font-medium">{formatAmount(loan.amount)}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Monthly Payment:</span>
                        <div className="font-medium">{formatAmount(loan.monthlyPayment)}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Duration:</span>
                        <div className="font-medium">{loan.duration} months</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Purpose:</span>
                        <div className="font-medium">{loan.purpose}</div>
                      </div>
                    </div>

                    {loan.status === 'active' && (
                      <div className="mt-4 pt-4 border-t">
                        <Button
                          size="sm"
                          onClick={() => handleRepayLoan(loan.id, loan.monthlyPayment)}
                          disabled={demoLoading}
                        >
                          Make Payment ({formatAmount(loan.monthlyPayment)})
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Pending Loans */}
      <Card>
        <CardHeader>
          <CardTitle>Available Loans ({pendingLoans.length})</CardTitle>
          <CardDescription>Loans available for funding</CardDescription>
        </CardHeader>
        <CardContent>
          {pendingLoans.length === 0 ? (
            <p className="text-muted-foreground">No pending loans</p>
          ) : (
            <div className="space-y-4">
              {pendingLoans.map((loan) => (
                <div key={loan.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{loan.id}</span>
                      {getStatusBadge(loan.status)}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Credit Score: {loan.creditScore}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                    <div>
                      <span className="text-muted-foreground">Amount:</span>
                      <div className="font-medium">{formatAmount(loan.amount)}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Interest Rate:</span>
                      <div className="font-medium">{loan.interestRate}%</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Duration:</span>
                      <div className="font-medium">{loan.duration} months</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Purpose:</span>
                      <div className="font-medium">{loan.purpose}</div>
                    </div>
                  </div>

                  <div className="text-sm text-muted-foreground mb-3">
                    {loan.description}
                  </div>

                  {isAuthenticated && (
                    <Button
                      size="sm"
                      onClick={() => handleFundLoan(loan.id)}
                      disabled={demoLoading}
                    >
                      Fund This Loan
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BackendIntegrationDemo;
