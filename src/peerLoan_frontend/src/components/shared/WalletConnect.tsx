
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { ConnectedWallet, DisconnectedWallet, useWalletConnect } from './wallet';

const WalletConnect: React.FC = () => {
  const {
    user,
    isLoading,
    isConnecting,
    hasError,
    connectionProgress,
    firstName,
    truncatedId,
    principalId,
    connectWallet,
    disconnectWallet,
    copyToClipboard
  } = useWalletConnect();
  
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="w-max" // Ensures the component takes only the width it needs
    >
      {!user.isAuthenticated ? (
        <DisconnectedWallet 
          isLoading={isLoading}
          isConnecting={isConnecting}
          hasError={hasError}
          connectionProgress={connectionProgress}
          connectWallet={connectWallet}
        />
      ) : (
        <ConnectedWallet 
          firstName={firstName}
          truncatedId={truncatedId}
          principalId={principalId}
          userRole={user.role}
          isVerified={user.isVerified}
          copyToClipboard={copyToClipboard}
          disconnectWallet={disconnectWallet}
        />
      )}
    </motion.div>
  );
};

export default React.memo(WalletConnect);
