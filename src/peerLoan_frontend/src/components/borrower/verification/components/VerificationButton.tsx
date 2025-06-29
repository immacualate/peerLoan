
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface VerificationButtonProps {
  onVerify: () => void;
  canVerify: boolean;
  isVerifying: boolean;
  verificationStatus: string | null;
}

const VerificationButton: React.FC<VerificationButtonProps> = ({ 
  onVerify, 
  canVerify, 
  isVerifying, 
  verificationStatus 
}) => {
  return (
    <div className="flex justify-center">
      <Button 
        type="button" 
        onClick={onVerify} 
        disabled={!canVerify || isVerifying || verificationStatus === "success"}
        variant="outline" 
        className="w-full mb-4"
      >
        {isVerifying ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Verifying through university portal...
          </>
        ) : verificationStatus === "success" ? (
          "Verified ✓"
        ) : (
          'Verify Student ID'
        )}
      </Button>
    </div>
  );
};

export default VerificationButton;
