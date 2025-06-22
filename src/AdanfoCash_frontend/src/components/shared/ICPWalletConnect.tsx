
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Wallet, ExternalLink, Copy, Check, AlertCircle, Loader2, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuthContext';
import { useWalletManager } from '@/hooks/useWalletManager';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface ICPWalletConnectProps {
  variant?: 'compact' | 'full';
}

const ICPWalletConnect: React.FC<ICPWalletConnectProps> = ({ variant = 'compact' }) => {
  const { user } = useAuth();
  const { wallets, connectWallet, disconnectWallet, getTotalBalance } = useWalletManager();
  const { toast } = useToast();
  const [copiedId, setCopiedId] = useState<string>('');
  const [balances, setBalances] = useState<Record<string, number>>({});
  const [conversionRate, setConversionRate] = useState(56.43); // ICP to GHS rate

  // Simulate real-time balance updates
  useEffect(() => {
    const updateBalances = () => {
      const newBalances: Record<string, number> = {};
      Object.entries(wallets).forEach(([key, wallet]) => {
        if (wallet.isConnected) {
          // Simulate small balance fluctuations
          const baseBalance = wallet.balance || 0;
          const fluctuation = (Math.random() - 0.5) * 0.001;
          newBalances[key] = Math.max(0, baseBalance + fluctuation);
        }
      });
      setBalances(newBalances);
    };

    updateBalances();
    const interval = setInterval(updateBalances, 5000);
    return () => clearInterval(interval);
  }, [wallets]);

  // Get real-time ICP price
  useEffect(() => {
    const fetchICPPrice = async () => {
      try {
        // In a real app, you'd fetch from a crypto API
        // For now, simulate price fluctuations
        const baseRate = 56.43;
        const fluctuation = (Math.random() - 0.5) * 2;
        setConversionRate(baseRate + fluctuation);
      } catch (error) {
        console.error('Error fetching ICP price:', error);
      }
    };

    fetchICPPrice();
    const interval = setInterval(fetchICPPrice, 30000);
    return () => clearInterval(interval);
  }, []);

  const copyToClipboard = async (text: string, walletType: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(walletType);
      toast({
        title: "Copied",
        description: "Wallet address copied to clipboard",
      });
      setTimeout(() => setCopiedId(''), 2000);
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard",
        variant: "destructive"
      });
    }
  };

  const handleConnect = async (walletType: string) => {
    await connectWallet(walletType);
  };

  const handleDisconnect = async (walletType: string) => {
    await disconnectWallet(walletType);
  };

  const openICPDashboard = (address: string) => {
    const dashboardUrl = `https://dashboard.internetcomputer.org/account/${address}`;
    window.open(dashboardUrl, '_blank');
  };

  const formatBalance = (balance: number) => {
    return balance.toFixed(4);
  };

  const formatAddress = (address: string) => {
    return `${address.substring(0, 8)}...${address.substring(address.length - 6)}`;
  };

  if (variant === 'compact') {
    const internetIdentityWallet = wallets['internet-identity'];
    
    if (!internetIdentityWallet?.isConnected) {
      return (
        <Card className="bg-gradient-to-r from-adanfo-blue/5 to-adanfo-purple/5 border-adanfo-blue/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-adanfo-blue/20 to-adanfo-purple/20 flex items-center justify-center">
                  <Wallet className="h-5 w-5 text-adanfo-blue" />
                </div>
                <div>
                  <p className="font-medium">Internet Identity</p>
                  <p className="text-sm text-muted-foreground">Not connected</p>
                </div>
              </div>
              <Button 
                onClick={() => handleConnect('internet-identity')}
                disabled={internetIdentityWallet?.isConnecting}
                size="sm"
              >
                {internetIdentityWallet?.isConnecting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  'Connect'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    const currentBalance = balances['internet-identity'] || internetIdentityWallet.balance;
    
    return (
      <Card className="bg-gradient-to-r from-green-50/50 to-blue-50/50 border-green-200/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-500/20 to-blue-500/20 flex items-center justify-center">
                <Wallet className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">Internet Identity</p>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Connected
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {formatBalance(currentBalance)} ICP (₵{(currentBalance * conversionRate).toFixed(2)})
                </p>
              </div>
            </div>
            <Button 
              onClick={() => handleDisconnect('internet-identity')}
              variant="outline"
              size="sm"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          ICP Wallet Integration
        </CardTitle>
        <CardDescription>
          Connect and manage your Internet Computer wallets
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          {Object.entries(wallets).map(([key, wallet]) => (
            <motion.div
              key={key}
              layout
              className="border rounded-lg p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                    wallet.isConnected 
                      ? 'bg-gradient-to-br from-green-500/20 to-blue-500/20' 
                      : 'bg-gradient-to-br from-gray-300/20 to-gray-500/20'
                  }`}>
                    <Wallet className={`h-5 w-5 ${
                      wallet.isConnected ? 'text-green-600' : 'text-gray-500'
                    }`} />
                  </div>
                  <div>
                    <h4 className="font-medium capitalize">
                      {wallet.type.replace('-', ' ')}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {wallet.isConnected ? 'Connected' : 'Not connected'}
                    </p>
                  </div>
                </div>
                
                {!wallet.isConnected ? (
                  <Button 
                    onClick={() => handleConnect(key)}
                    disabled={wallet.isConnecting}
                    size="sm"
                  >
                    {wallet.isConnecting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      'Connect'
                    )}
                  </Button>
                ) : (
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Connected
                    </Badge>
                    <Button 
                      onClick={() => handleDisconnect(key)}
                      variant="outline"
                      size="sm"
                    >
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              
              <AnimatePresence>
                {wallet.isConnected && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2"
                  >
                    <Separator />
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Balance</p>
                        <p className="font-mono font-medium">
                          {formatBalance(balances[key] || wallet.balance)} ICP
                        </p>
                        <p className="text-xs text-muted-foreground">
                          ≈ ₵{((balances[key] || wallet.balance) * conversionRate).toFixed(2)}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-muted-foreground">Address</p>
                        <div className="flex items-center gap-1">
                          <code className="text-xs bg-muted px-1 rounded">
                            {formatAddress(wallet.address)}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => copyToClipboard(wallet.address, key)}
                          >
                            {copiedId === key ? (
                              <Check className="h-3 w-3 text-green-600" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openICPDashboard(wallet.address)}
                        className="flex-1"
                      >
                        <ExternalLink className="mr-2 h-3 w-3" />
                        View on IC Dashboard
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
        
        {Object.values(wallets).some(w => w.isConnected) && (
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Total Portfolio Value</p>
                <p className="text-2xl font-bold">
                  {formatBalance(getTotalBalance())} ICP
                </p>
                <p className="text-sm text-muted-foreground">
                  ≈ ₵{(getTotalBalance() * conversionRate).toFixed(2)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">ICP/GHS Rate</p>
                <p className="font-mono">₵{conversionRate.toFixed(2)}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ICPWalletConnect;
