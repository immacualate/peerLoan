
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface FormAlertsProps {
  eligibilityError: string | null;
  hasStudentInfo: boolean;
}

const FormAlerts: React.FC<FormAlertsProps> = ({ 
  eligibilityError,
  hasStudentInfo
}) => {
  if (!eligibilityError && hasStudentInfo) return null;
  
  return (
    <>
      {/* Eligibility Error Alert */}
      {eligibilityError && (
        <Alert className="mb-4" variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Eligibility Warning</AlertTitle>
          <AlertDescription>{eligibilityError}</AlertDescription>
        </Alert>
      )}
      
      {/* Verification Required Alert */}
      {!hasStudentInfo && (
        <Alert className="mb-4" variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Verification Required</AlertTitle>
          <AlertDescription>
            You must complete student verification before you can request a loan.
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default FormAlerts;
