
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Wallet, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface NFIDConnectProps {
  className?: string;
}

const NFIDConnect: React.FC<NFIDConnectProps> = ({ className = '' }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const { toast } = useToast();

  // Mock connection - in a real app, this would connect to NFID.one
  const connectNFID = useCallback(async () => {
    try {
      setIsConnecting(true);
      
      toast({
        title: "Connecting to NFID",
        description: "Please wait while we connect to your NFID wallet..."
      });
      
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate a mock wallet address
      const mockAddress = 'nfid_' + Math.random().toString(36).substring(2, 10);
      setWalletAddress(mockAddress);
      setIsConnected(true);
      
      toast({
        title: "NFID Connected",
        description: "Your NFID wallet has been connected successfully.",
      });
    } catch (error) {
      console.error("Error connecting to NFID:", error);
      toast({
        title: "Connection Failed",
        description: "Could not connect to NFID wallet. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
    }
  }, [toast]);

  const disconnectNFID = useCallback(() => {
    setIsConnected(false);
    setWalletAddress('');
    toast({
      title: "NFID Disconnected",
      description: "Your NFID wallet has been disconnected."
    });
  }, [toast]);

  return (
    <Card className={`border-border/50 shadow-sm ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Wallet className="h-5 w-5 text-adanfo-blue" />
          NFID Wallet
        </CardTitle>
        <CardDescription>
          Connect your NFID wallet to manage transactions
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {isConnected ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="px-3 py-1 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800">
                Connected
              </Badge>
              <Badge variant="outline" className="font-mono text-xs">
                {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </Badge>
            </div>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">
            <p>Connect your NFID wallet to:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Access decentralized services</li>
              <li>Make secure transactions</li>
              <li>Manage your digital assets</li>
            </ul>
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        {isConnected ? (
          <Button 
            variant="outline" 
            className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
            onClick={disconnectNFID}
          >
            Disconnect Wallet
          </Button>
        ) : (
          <motion.div className="w-full" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button 
              className="w-full bg-adanfo-blue hover:bg-adanfo-blue/90"
              onClick={connectNFID}
              disabled={isConnecting}
            >
              {isConnecting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Wallet className="mr-2 h-4 w-4" />
                  Connect NFID Wallet
                </>
              )}
            </Button>
          </motion.div>
        )}
      </CardFooter>
    </Card>
  );
};

export default React.memo(NFIDConnect);
