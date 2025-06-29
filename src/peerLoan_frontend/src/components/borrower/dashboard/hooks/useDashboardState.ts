
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { checkSupabaseConnection } from '@/lib/supabase';
import { isIcpEnabled } from '@/services/loans/icp/utils';

export const useDashboardState = () => {
  const { toast } = useToast();
  const [isRequestingLoan, setIsRequestingLoan] = useState(false);
  const [isVerifyingStudent, setIsVerifyingStudent] = useState(false);
  const [isLoadingVerification, setIsLoadingVerification] = useState(true);
  const [supabaseConnected, setSupabaseConnected] = useState<boolean | null>(null);
  const [icpConnected, setIcpConnected] = useState<boolean>(isIcpEnabled());

  useEffect(() => {
    let isMounted = true;
    
    const checkConnection = async () => {
      try {
        const connected = await checkSupabaseConnection();
        
        if (isMounted) {
          setSupabaseConnected(connected);
          
          if (connected) {
            toast({
              title: "Verification DB Connected",
              description: "Successfully connected to Supabase for student verification.",
            });
          } else {
            toast({
              title: "Using Local Storage",
              description: "Could not connect to verification database. Using local storage instead.",
            });
          }
        }
      } catch (error) {
        console.error("Error checking Supabase connection:", error);
        if (isMounted) {
          setSupabaseConnected(false);
          toast({
            title: "Using Local Storage",
            description: "Database connection error. Using local storage instead.",
          });
        }
      }
      
      const icpEnabled = isIcpEnabled();
      if (isMounted) {
        setIcpConnected(icpEnabled);
        
        if (icpEnabled) {
          toast({
            title: "ICP Blockchain Connected",
            description: "Successfully connected to ICP blockchain for loan operations.",
          });
        } else {
          toast({
            title: "Using Local Storage for Loans",
            description: "Using local storage for loan operations. ICP integration pending.",
            variant: "default"
          });
        }
      }
    };
    
    checkConnection();
    
    return () => {
      isMounted = false;
    };
  }, [toast]);

  return {
    isRequestingLoan,
    setIsRequestingLoan,
    isVerifyingStudent,
    setIsVerifyingStudent,
    isLoadingVerification,
    setIsLoadingVerification,
    supabaseConnected,
    icpConnected
  };
};
