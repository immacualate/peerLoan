
import React from 'react';
import { Progress } from "@/components/ui/progress";

interface WalletProgressProps {
  connectionProgress: number;
}

const WalletProgress: React.FC<WalletProgressProps> = ({ connectionProgress }) => {
  if (connectionProgress <= 0) return null;
  
  return (
    <div className="space-y-1 w-full">
      <div className="flex justify-between items-center text-xs">
        <span className="text-muted-foreground">Connection progress</span>
        <span className="font-medium">{connectionProgress}%</span>
      </div>
      <Progress 
        value={connectionProgress} 
        className="h-1.5 transition-all duration-300" 
      />
    </div>
  );
};

export default WalletProgress;
