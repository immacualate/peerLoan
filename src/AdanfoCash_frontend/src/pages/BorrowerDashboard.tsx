
import React, { useEffect } from 'react';
import { useAuth } from '../hooks/useAuthContext';
import { useLoanHistory } from '../hooks/useLoanHistory';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '../components/borrower/dashboard/DashboardLayout';
import DashboardContent from '../components/borrower/dashboard/DashboardContent';
import ConnectionStatus from '../components/borrower/dashboard/components/ConnectionStatus';
import DashboardWallet from '../components/borrower/dashboard/components/DashboardWallet';
import LoanStatisticsChart from '../components/borrower/dashboard/LoanStatisticsChart';
import { useDashboardState } from '@/components/borrower/dashboard/hooks/useDashboardState';
import { useStudentData } from '@/components/borrower/dashboard/hooks/useStudentData';

const BorrowerDashboard: React.FC = () => {
  const { user, checkAuth } = useAuth();
  const { toast } = useToast();
  const { loans, isLoading: isLoadingLoans } = useLoanHistory(user.principalId || 'guest-user');
  
  const {
    isRequestingLoan,
    setIsRequestingLoan,
    isVerifyingStudent,
    setIsVerifyingStudent,
    isLoadingVerification,
    setIsLoadingVerification,
    supabaseConnected,
    icpConnected
  } = useDashboardState();
  
  const {
    verificationStatus,
    setVerificationStatus,
    isLoadingVerification: isLoadingStudentVerification,
    effectiveUser
  } = useStudentData();
  
  // Handle users who just completed registration
  useEffect(() => {
    const handleRecentRegistration = async () => {
      const hasRecentRegistration = localStorage.getItem('recent_registration') === 'true';
      const verificationComplete = localStorage.getItem('verification_complete') === 'true';
      
      if (hasRecentRegistration || verificationComplete) {
        console.log("Recent registration detected, refreshing auth state");
        
        // Clear temporary flags
        localStorage.removeItem('verification_complete');
        
        // Refresh auth state to get updated user info
        await checkAuth();
        
        // Set verification status if user just completed verification
        if (verificationComplete) {
          setVerificationStatus(true);
          setIsLoadingVerification(false);
        }
        
        toast({
          title: "Welcome to AdanfoCash!",
          description: "Your dashboard is ready. You can now explore loan options.",
        });
      }
    };
    
    handleRecentRegistration();
  }, [checkAuth, setVerificationStatus, setIsLoadingVerification, toast]);
  
  // Force load verification data faster for better UX
  useEffect(() => {
    const quickCheck = setTimeout(() => {
      if (isLoadingStudentVerification) {
        setIsLoadingVerification(false);
      }
    }, 1000);
    
    return () => clearTimeout(quickCheck);
  }, [isLoadingStudentVerification, setIsLoadingVerification]);

  const handleLoanRequested = () => {
    setIsRequestingLoan(false);
    toast({
      title: "Loan Requested",
      description: "Your loan request has been submitted successfully."
    });
  };
  
  const handleVerificationComplete = async (success: boolean) => {
    console.log("Verification complete, success:", success);
    setIsVerifyingStudent(false);
    
    if (success) {
      setVerificationStatus(true);
      
      toast({
        title: "Verification Successful",
        description: "Your student status has been verified and saved to the ICP blockchain!",
      });
      
      // Refresh user data from ICP
      await checkAuth();
    } else {
      toast({
        title: "Verification Failed",
        description: "There was an issue with your verification. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Create enhanced user object with proper fallbacks and registration details
  const dashboardUser = {
    ...effectiveUser,
    id: effectiveUser.id || user.id || user.studentInfo?.fullName || "Student User",
    principalId: effectiveUser.principalId || user.principalId,
    role: effectiveUser.role !== 'unregistered' ? effectiveUser.role : 'borrower',
    isAuthenticated: true,
    creditScore: effectiveUser.creditScore || user.creditScore || 650,
    isVerified: verificationStatus || effectiveUser.isVerified || user.isVerified,
    studentInfo: effectiveUser.studentInfo || user.studentInfo || {
      fullName: user.studentInfo?.fullName || user.id || "Student User",
      universityName: user.studentInfo?.universityName || "University of Ghana",
      studentId: user.studentInfo?.studentId || "ST12345",
      graduationDate: user.studentInfo?.graduationDate || "2025-06-01",
      gpa: user.studentInfo?.gpa || 3.5,
      isEnrolled: true
    }
  };

  return (
    <DashboardLayout
      title="Student Borrower Dashboard"
      subtitle={`Welcome back, ${dashboardUser.studentInfo?.fullName || dashboardUser.id}!`}
    >
      <ConnectionStatus 
        supabaseConnected={supabaseConnected}
        icpConnected={icpConnected}
      />
      
      <DashboardWallet user={dashboardUser} />
      
      {/* Add Statistics Chart */}
      <LoanStatisticsChart />
      
      <DashboardContent
        isVerifyingStudent={isVerifyingStudent}
        handleVerificationComplete={handleVerificationComplete}
        verificationStatus={verificationStatus || dashboardUser.isVerified}
        isLoadingVerification={false} // Force this to false to skip loading state
        setIsVerifyingStudent={setIsVerifyingStudent}
        loans={loans}
        isLoadingLoans={isLoadingLoans}
        isRequestingLoan={isRequestingLoan}
        setIsRequestingLoan={setIsRequestingLoan}
        handleLoanRequested={handleLoanRequested}
        user={dashboardUser}
      />
    </DashboardLayout>
  );
};

export default BorrowerDashboard;
