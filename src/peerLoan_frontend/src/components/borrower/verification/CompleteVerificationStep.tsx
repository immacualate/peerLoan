
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { StudentInfoFields } from './components';
import { UseFormReturn } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from 'react-router-dom';

interface CompleteVerificationStepProps {
  form: UseFormReturn<any>;
  onBack: () => void;
  onSubmit: () => void;
  isVerifying: boolean;
  isVerified: boolean;
  studentName: string;
}

const CompleteVerificationStep: React.FC<CompleteVerificationStepProps> = ({ 
  form,
  onBack,
  onSubmit,
  isVerifying,
  isVerified,
  studentName
}) => {
  const navigate = useNavigate();
  
  const handleSubmitWithFeedback = () => {
    console.log("Complete Verification button clicked");
    // Show immediate feedback
    toast({
      title: "Processing Verification",
      description: "Please wait while we complete your verification...",
    });
    
    // Call the submit function from props
    onSubmit();
    
    // Save verification status to localStorage first for immediate feedback
    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      userData.isVerified = true;
      localStorage.setItem('user', JSON.stringify(userData));
      console.log("Updated user verification status in localStorage");
    } catch (e) {
      console.error("Error updating localStorage:", e);
    }
    
    // Force a direct navigation after a short delay to ensure the onSubmit has time to process
    setTimeout(() => {
      console.log("Forced navigation to dashboard triggered");
      
      // Try React Router first
      try {
        navigate('/borrower-dashboard');
      } catch (e) {
        console.error("Navigation error:", e);
      }
      
      // Also use window.location as a guaranteed backup with delayed execution
      setTimeout(() => {
        window.location.href = '/borrower-dashboard';
      }, 100);
    }, 300);
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold mb-4">Complete Your Student Verification</h2>
        <p className="text-muted-foreground mb-6">
          Please confirm your student information to complete verification.
        </p>
        
        <Separator className="my-6" />
        
        {isVerified ? (
          <div className="text-center py-4">
            <p className="text-lg font-medium text-green-600 mb-2">Verification Successful!</p>
            <p className="text-muted-foreground">
              Thank you, {studentName}. Your student status has been verified.
            </p>
          </div>
        ) : (
          <StudentInfoFields 
            form={form}
            verificationStatus={isVerified ? "success" : null}
          />
        )}
        
        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={onBack} disabled={isVerifying}>
            Back
          </Button>
          <Button 
            onClick={handleSubmitWithFeedback} 
            disabled={isVerifying}
            className="relative bg-adanfo-blue hover:bg-adanfo-blue/90"
          >
            {isVerifying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : "Complete Verification"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompleteVerificationStep;
