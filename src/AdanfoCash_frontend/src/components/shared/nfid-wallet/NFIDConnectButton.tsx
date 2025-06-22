
import React from 'react';
import { Button } from '@/components/ui/button';
import { Wallet, Loader2 } from 'lucide-react';

interface NFIDConnectButtonProps {
  isConnecting: boolean;
  onConnect: () => Promise<void>;
}

const NFIDConnectButton: React.FC<NFIDConnectButtonProps> = ({ 
  isConnecting, 
  onConnect 
}) => {
  return (
    <Button 
      onClick={onConnect}
      disabled={isConnecting}
      variant="outline"
      className="w-full"
      size="sm"
    >
      {isConnecting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          <span className="whitespace-nowrap">Connecting NFID Wallet...</span>
        </>
      ) : (
        <>
          <Wallet className="mr-2 h-4 w-4" />
          <span className="whitespace-nowrap">Connect NFID Wallet</span>
        </>
      )}
    </Button>
  );
};

export default NFIDConnectButton;
