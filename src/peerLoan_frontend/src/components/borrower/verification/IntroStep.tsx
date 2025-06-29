
import React from "react";
import { Shield, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface IntroStepProps {
  onNext: () => void;
}

const IntroStep: React.FC<IntroStepProps> = ({ onNext }) => {
  return (
    <div className="text-center py-6">
      <Shield className="h-16 w-16 mx-auto mb-4 text-adanfo-blue" />
      <h3 className="text-xl font-semibold mb-2">Student Identity Verification</h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        ZKPass verifies your student status and academic records without compromising your privacy, ensuring security and data protection.
      </p>
      <div className="space-y-4 mb-6">
        <div className="flex items-start gap-3 text-left">
          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
          <div>
            <p className="font-medium">Secure GPA Verification</p>
            <p className="text-sm text-muted-foreground">Your GPA is verified directly from academic sources</p>
          </div>
        </div>
        <div className="flex items-start gap-3 text-left">
          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
          <div>
            <p className="font-medium">Enhanced Data Security</p>
            <p className="text-sm text-muted-foreground">Your Ghana Card number is securely hashed before storage</p>
          </div>
        </div>
        <div className="flex items-start gap-3 text-left">
          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
          <div>
            <p className="font-medium">Improved Credit Rating</p>
            <p className="text-sm text-muted-foreground">Verified student borrowers receive better loan terms</p>
          </div>
        </div>
      </div>
      <Button onClick={onNext} className="w-full">Start Verification</Button>
    </div>
  );
};

export default IntroStep;
