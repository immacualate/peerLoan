
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface VerificationAlertProps {
  verificationStatus: string | null;
}

const VerificationAlert: React.FC<VerificationAlertProps> = ({ verificationStatus }) => {
  if (!verificationStatus) return null;
  
  return (
    <Alert className={verificationStatus === "success" ? "bg-green-50 border-green-200" : 
                      verificationStatus === "error" ? "bg-red-50 border-red-200" : 
                      "bg-amber-50 border-amber-200"}>
      <AlertDescription>
        {verificationStatus === "success" ? 
          "✅ Student verification successful! Please complete the remaining fields." : 
          verificationStatus === "error" ? 
          "❌ Verification failed. Please check your student ID and university." :
          "⏳ Verifying student information... A popup window will open to the university portal."}
      </AlertDescription>
    </Alert>
  );
};

export default VerificationAlert;
