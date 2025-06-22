
import React, { memo, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { useVerificationStatus } from '@/hooks/useVerificationStatus';
import { useAuth } from '@/hooks/useAuthContext';

interface VerificationStatusProps {
  isVerified: boolean;
  isLoading?: boolean;
  setIsVerifyingStudent: (value: boolean) => void;
}

const VerificationStatus: React.FC<VerificationStatusProps> = memo(({ 
  isVerified: propIsVerified, 
  isLoading = false,
  setIsVerifyingStudent 
}) => {
  const { user } = useAuth();
  const { isVerified: hookIsVerified, checkVerificationStatus } = useVerificationStatus();
  
  // Animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };
  
  // Check verification on mount and when user changes
  useEffect(() => {
    if (user.principalId && user.principalId !== 'guest-user') {
      checkVerificationStatus(true); // Force check
    }
  }, [user.principalId, checkVerificationStatus]);
  
  // Determine final verification status by checking multiple sources
  const isUserVerified = propIsVerified || hookIsVerified || user.isVerified;
  
  useEffect(() => {
    console.log("VerificationStatus: Props verified:", propIsVerified);
    console.log("VerificationStatus: Hook verified:", hookIsVerified);
    console.log("VerificationStatus: User verified:", user.isVerified);
    console.log("VerificationStatus: Final status:", isUserVerified);
  }, [propIsVerified, hookIsVerified, user.isVerified, isUserVerified]);

  // Return null if user is verified through any means
  if (isUserVerified) {
    console.log("User is verified, not showing verification card");
    return null;
  }

  // Skip loading state and immediately show content
  return (
    <motion.div 
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      layout
      className="mb-6"
    >
      <Card className="p-6 border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="bg-amber-100 dark:bg-amber-900/50 rounded-full p-4 flex-shrink-0">
            <Shield size={40} className="text-amber-600 dark:text-amber-400" />
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-xl font-semibold mb-2">Student Verification Required</h3>
            <p className="text-muted-foreground mb-4">
              You need to verify your student status with ZKPass before you can request loans.
            </p>
            <Button 
              onClick={() => setIsVerifyingStudent(true)} 
              className="w-full md:w-auto"
              aria-label="Start student verification process"
            >
              Verify Student Status
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
});

VerificationStatus.displayName = 'VerificationStatus';

export default VerificationStatus;
