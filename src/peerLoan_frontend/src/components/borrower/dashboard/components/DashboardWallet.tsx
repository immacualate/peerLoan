
import React from 'react';
import { motion } from 'framer-motion';
import ICPWalletConnect from '@/components/shared/ICPWalletConnect';
import { User } from '@/types/authTypes';

interface DashboardWalletProps {
  user: User;
}

const DashboardWallet: React.FC<DashboardWalletProps> = ({ user }) => {
  return (
    <motion.div 
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
      className="mb-6"
    >
      <ICPWalletConnect variant="compact" />
    </motion.div>
  );
};

export default DashboardWallet;
