
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface NFIDWalletCardProps {
  walletAddress: string;
  balance: number;
  conversionRate: number;
  onDisconnect: () => void;
}

const NFIDWalletCard: React.FC<NFIDWalletCardProps> = ({
  walletAddress,
  balance,
  conversionRate,
  onDisconnect
}) => {
  // Format wallet address for display
  const shortAddress = `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`;

  return (
    <Card className="bg-[#0c2c57] bg-opacity-5 backdrop-blur-sm border-[#0c2c57]/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-5 w-5 bg-gradient-to-br from-[#2d88ff] to-[#2d63ff] rounded-full mr-2"></div>
            NFID Wallet
          </div>
          <Badge variant="outline" className="font-mono text-xs">
            {shortAddress}
          </Badge>
        </CardTitle>
        <CardDescription className="text-sm">
          Connected to your NFID wallet
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm font-semibold">Balance</div>
            <div className="text-2xl font-bold">{balance} ICP</div>
            <div className="text-xs text-muted-foreground">
              ≈ GHS {(balance * conversionRate).toFixed(2)}
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onDisconnect}
            className="h-8 px-2 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <LogOut className="h-4 w-4 mr-1" />
            Disconnect
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NFIDWalletCard;
