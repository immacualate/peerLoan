
import React from 'react';
import { User, Wallet, LogOut, ExternalLink, AlertCircle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ConnectedWalletProps {
  firstName: string;
  truncatedId: string;
  principalId: string;
  userRole: string;
  isVerified: boolean;
  copyToClipboard: () => void;
  disconnectWallet: () => Promise<void>;
}

const ConnectedWallet: React.FC<ConnectedWalletProps> = ({
  firstName,
  truncatedId,
  principalId,
  userRole,
  isVerified,
  copyToClipboard,
  disconnectWallet
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center space-x-2 cursor-pointer">
          <div className="flex items-center">
            <Badge variant="outline" className="gap-1 px-2 py-1 bg-secondary/80">
              <User className="h-3 w-3 text-adanfo-blue" />
              <span>{firstName}</span>
            </Badge>
            {userRole === 'borrower' && (
              <Badge 
                variant={isVerified ? "secondary" : "outline"} 
                className={`ml-2 gap-1 px-2 py-1 ${isVerified ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : ""}`}
              >
                {isVerified ? (
                  <>
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>Verified</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-3 w-3 text-orange-500" />
                    <span>Unverified</span>
                  </>
                )}
              </Badge>
            )}
          </div>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-8 h-8 rounded-full bg-gradient-to-r from-adanfo-blue/20 to-adanfo-purple/20 flex items-center justify-center"
          >
            <Wallet className="h-4 w-4 text-adanfo-blue" />
          </motion.div>
        </div>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-56 backdrop-blur-lg bg-background/95 border-border/50">
        <DropdownMenuLabel className="flex flex-col gap-1">
          <span className="text-sm font-medium">Internet Identity</span>
          <span className="text-xs text-muted-foreground font-mono">{truncatedId}</span>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem className="flex items-center gap-2" onClick={copyToClipboard}>
          <Badge variant="outline" className="h-5 gap-1 px-1.5 text-xs">
            <span>Copy Principal ID</span>
          </Badge>
        </DropdownMenuItem>
        
        <DropdownMenuItem className="flex items-center gap-2">
          <ExternalLink className="h-4 w-4 text-adanfo-purple" />
          <span>View on IC Dashboard</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          className="flex items-center gap-2 text-red-500 focus:text-red-500 focus:bg-red-50 dark:focus:bg-red-950/30"
          onClick={disconnectWallet}
        >
          <LogOut className="h-4 w-4" />
          <span>Disconnect</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ConnectedWallet;
