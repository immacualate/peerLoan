
import React from "react";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { 
  UniversitySelector, 
  StudentIdField, 
  VerificationAlert, 
  VerificationButton,
  StudentInfoFields,
  UNIVERSITIES
} from "./components";

interface StudentInfoStepProps {
  form: UseFormReturn<any>;
  onBack: () => void;
  onNext: () => void;
  isVerifying: boolean;
  onVerify: () => void;
  verificationStatus: string | null;
}

const StudentInfoStep: React.FC<StudentInfoStepProps> = ({ 
  form, 
  onBack, 
  onNext,
  isVerifying,
  onVerify,
  verificationStatus
}) => {
  const university = form.watch("universityName");
  const studentId = form.watch("studentId");
  const canVerify = university && studentId && university !== "other";
  
  // Show the additional fields after successful verification
  const showVerifiedFields = verificationStatus === "success" || form.getValues("fullName");
  
  return (
    <div className="py-6">
      <h3 className="text-xl font-semibold mb-4">Student Information</h3>
      <p className="text-muted-foreground mb-6">
        Select your university and provide your index number to verify your student status.
      </p>
      
      <form className="space-y-4 mb-6">
        <UniversitySelector form={form} />
        <StudentIdField form={form} />
        
        <VerificationAlert verificationStatus={verificationStatus} />
        
        <VerificationButton 
          onVerify={onVerify}
          canVerify={canVerify}
          isVerifying={isVerifying}
          verificationStatus={verificationStatus}
        />
        
        {/* Show these fields after successful verification */}
        {showVerifiedFields && (
          <StudentInfoFields form={form} verificationStatus={verificationStatus} />
        )}
      </form>
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>Back</Button>
        <Button 
          onClick={onNext} 
          disabled={!showVerifiedFields}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default StudentInfoStep;
