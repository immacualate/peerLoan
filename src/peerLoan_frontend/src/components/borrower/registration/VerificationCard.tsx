
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import EnhancedButton from '@/components/ui/enhanced-button';
import { Button } from '@/components/ui/button';
import { AlertCircle, GraduationCap, School } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAuth } from '@/hooks/useAuthContext';

interface VerificationCardProps {
  setIsVerifying: (value: boolean) => void;
  onSubmit: () => void;
  user: {
    isVerified?: boolean;
  };
  isLoading?: boolean;
}

const VerificationCard: React.FC<VerificationCardProps> = ({ 
  setIsVerifying, 
  onSubmit, 
  user,
  isLoading = false
}) => {
  return (
    <Card className="max-w-md mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-adanfo-blue" /> 
          Complete Student Verification
        </CardTitle>
        <CardDescription>
          Verify your student status to start your borrowing journey
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Important</AlertTitle>
          <AlertDescription>
            All student borrowers must complete ZKPass verification before applying for loans. This process verifies your student status and academic records securely.
          </AlertDescription>
        </Alert>
        
        <div className="space-y-6">
          <div className="pt-2">
            <Alert variant="destructive" className="bg-adanfo-blue/5 mt-4">
              <School className="h-4 w-4 text-adanfo-blue" />
              <AlertTitle>Student Verification Required</AlertTitle>
              <AlertDescription className="text-sm">
                Verification will check:
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>Current enrollment at a recognized university</li>
                  <li>GPA verification from academic records</li>
                  <li>Graduation date at least 5 months away</li>
                </ul>
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <EnhancedButton 
          onClick={() => setIsVerifying(true)}
          variant="default"
          className="w-full"
        >
          Verify Your Student Status with ZKPass
        </EnhancedButton>
        
        <Button 
          onClick={onSubmit} 
          className="w-full"
          disabled={!user.isVerified || isLoading}
        >
          {isLoading ? 'Processing...' : 'Register as Student Borrower'}
        </Button>
        
        {!user.isVerified && (
          <p className="text-xs text-amber-500 text-center">
            You must complete student verification before registration
          </p>
        )}
      </CardFooter>
    </Card>
  );
};

export default VerificationCard;
