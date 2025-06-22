
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle,
  User,
  Loader2,
  Wallet,
  CircleCheck,
  LockKeyhole
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuthContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ParticleBackground from '@/components/shared/ParticleBackground';
import { Separator } from '@/components/ui/separator';
import ICPWalletConnect from '@/components/shared/ICPWalletConnect';

const WalletConnection: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    // If already authenticated, redirect to appropriate dashboard
    if (user.isAuthenticated) {
      if (user.role === 'unregistered') {
        navigate('/borrower-registration');
      } else if (user.role === 'borrower') {
        navigate('/borrower-dashboard');
      } else if (user.role === 'lender') {
        navigate('/lender-dashboard');
      }
    }
  }, [user, navigate]);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };
  
  return (
    <>
      <Navbar />
      
      <div className="min-h-screen relative overflow-hidden">
        <ParticleBackground />
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="container max-w-6xl mx-auto px-4 pt-20 pb-20"
        >
          <motion.div 
            variants={itemVariants}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-adanfo-blue to-adanfo-purple">
                ICP Wallet
              </span> Connection
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Connect your preferred Internet Computer Protocol wallet to access all features
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <motion.div variants={itemVariants}>
              <ICPWalletConnect />
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Tabs defaultValue="borrower" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-muted/70 backdrop-blur-sm">
                  <TabsTrigger value="borrower">For Borrowers</TabsTrigger>
                  <TabsTrigger value="lender">For Lenders</TabsTrigger>
                </TabsList>
                
                <TabsContent value="borrower" className="mt-6">
                  <Card className="border-adanfo-blue/20">
                    <CardHeader className="bg-adanfo-blue/5 border-b border-border/50">
                      <CardTitle>Access Capital for Your Education</CardTitle>
                      <CardDescription>
                        Get loans directly from lenders with fair rates
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6">
                      <div className="flex items-start gap-3">
                        <div className="bg-adanfo-blue/10 rounded-full p-2">
                          <ShieldCheck className="h-4 w-4 text-adanfo-blue" />
                        </div>
                        <div>
                          <h3 className="font-medium">Fast Verification</h3>
                          <p className="text-sm text-muted-foreground">
                            Complete ZKPass verification to access loans quickly
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="bg-adanfo-blue/10 rounded-full p-2">
                          <ShieldCheck className="h-4 w-4 text-adanfo-blue" />
                        </div>
                        <div>
                          <h3 className="font-medium">Collateral-Free Options</h3>
                          <p className="text-sm text-muted-foreground">
                            Build your credit score to access larger loans
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="bg-adanfo-blue/10 rounded-full p-2">
                          <ShieldCheck className="h-4 w-4 text-adanfo-blue" />
                        </div>
                        <div>
                          <h3 className="font-medium">Smart Contract Protection</h3>
                          <p className="text-sm text-muted-foreground">
                            Secure loans with clear terms and automatic processing
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="lender" className="mt-6">
                  <Card className="border-adanfo-purple/20">
                    <CardHeader className="bg-adanfo-purple/5 border-b border-border/50">
                      <CardTitle>Earn Returns on Your Capital</CardTitle>
                      <CardDescription>
                        Fund loans and earn competitive interest rates
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6">
                      <div className="flex items-start gap-3">
                        <div className="bg-adanfo-purple/10 rounded-full p-2">
                          <ShieldCheck className="h-4 w-4 text-adanfo-purple" />
                        </div>
                        <div>
                          <h3 className="font-medium">Diversified Portfolio</h3>
                          <p className="text-sm text-muted-foreground">
                            Fund multiple borrowers based on risk tolerance
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="bg-adanfo-purple/10 rounded-full p-2">
                          <ShieldCheck className="h-4 w-4 text-adanfo-purple" />
                        </div>
                        <div>
                          <h3 className="font-medium">Transparent Scoring</h3>
                          <p className="text-sm text-muted-foreground">
                            Make informed decisions with our auto credit scoring
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="bg-adanfo-purple/10 rounded-full p-2">
                          <ShieldCheck className="h-4 w-4 text-adanfo-purple" />
                        </div>
                        <div>
                          <h3 className="font-medium">Automated Returns</h3>
                          <p className="text-sm text-muted-foreground">
                            Receive repayments automatically through smart contracts
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
              
              <div className="mt-6 bg-amber-50 dark:bg-amber-950/30 p-4 rounded-lg border border-amber-200 dark:border-amber-950">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-amber-800 dark:text-amber-400">Important Notice</h3>
                    <p className="text-sm text-amber-700 dark:text-amber-500 mt-1">
                      After connecting your wallet, you'll need to register as either a 
                      borrower or lender to use the platform. This registration will be permanently 
                      linked to your wallet.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <Separator className="mb-4" />
                <h3 className="text-sm font-medium mb-2">ICP Wallet Benefits</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-foreground/80">
                    <CircleCheck className="h-4 w-4 text-adanfo-blue" />
                    <span>Decentralized ownership</span>
                  </div>
                  <div className="flex items-center gap-2 text-foreground/80">
                    <CircleCheck className="h-4 w-4 text-adanfo-blue" />
                    <span>Multiple wallet support</span>
                  </div>
                  <div className="flex items-center gap-2 text-foreground/80">
                    <CircleCheck className="h-4 w-4 text-adanfo-blue" />
                    <span>Cross-platform compatibility</span>
                  </div>
                  <div className="flex items-center gap-2 text-foreground/80">
                    <CircleCheck className="h-4 w-4 text-adanfo-blue" />
                    <span>Enhanced security features</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
      
      <Footer />
    </>
  );
};

export default WalletConnection;
