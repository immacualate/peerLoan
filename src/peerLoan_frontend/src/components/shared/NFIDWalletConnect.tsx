
import React from 'react';
import { motion } from 'framer-motion';
import { NFIDConnectButton, NFIDWalletCard, useNFIDWallet } from './nfid-wallet';

const NFIDWalletConnect: React.FC = () => {
  const {
    isConnected,
    isConnecting,
    walletAddress,
    balance,
    conversionRate,
    connectNFIDWallet,
    disconnectWallet
  } = useNFIDWallet();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full" // Ensure it takes full width of parent container
    >
      {!isConnected ? (
        <NFIDConnectButton 
          isConnecting={isConnecting}
          onConnect={connectNFIDWallet}
        />
      ) : (
        <NFIDWalletCard 
          walletAddress={walletAddress}
          balance={balance}
          conversionRate={conversionRate}
          onDisconnect={disconnectWallet}
        />
      )}
    </motion.div>
  );
};

export default React.memo(NFIDWalletConnect);
