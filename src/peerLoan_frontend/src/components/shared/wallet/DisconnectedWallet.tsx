
import React from 'react';
import { Button } from '@/components/ui/button';
import { Wallet, AlertCircle, Loader2 } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import WalletProgress from './WalletProgress';

interface DisconnectedWalletProps {
  isLoading: boolean;
  isConnecting: boolean;
  hasError: boolean;
  connectionProgress: number;
  connectWallet: () => Promise<void>;
}

const DisconnectedWallet: React.FC<DisconnectedWalletProps> = ({
  isLoading,
  isConnecting,
  hasError,
  connectionProgress,
  connectWallet
}) => {
  return (
    <div className="flex flex-col">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="sm"
              onClick={connectWallet}
              disabled={isLoading || isConnecting}
              className="group relative overflow-hidden flex items-center justify-center whitespace-nowrap"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-adanfo-blue/20 to-adanfo-purple/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md"></div>
              <div className="flex items-center relative z-10">
                {isLoading || isConnecting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin text-adanfo-blue" />
                ) : hasError ? (
                  <AlertCircle className="mr-2 h-4 w-4 text-red-500" />
                ) : (
                  <Wallet className="mr-2 h-4 w-4 text-adanfo-blue" />
                )}
                <span>{isLoading || isConnecting ? 'Connecting...' : hasError ? 'Retry' : 'Connect Internet Identity'}</span>
              </div>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {hasError 
              ? "There was an issue connecting. Click to try again."
              : "Connect with Internet Identity to access all features"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      {/* Fixed height container for progress bar to prevent layout shifts */}
      <div className="h-1.5 min-h-[0.375rem] w-full">
        <WalletProgress connectionProgress={connectionProgress} />
      </div>
    </div>
  );
};

export default DisconnectedWallet;
