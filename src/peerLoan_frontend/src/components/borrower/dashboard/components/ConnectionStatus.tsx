
import React from 'react';
import { motion } from 'framer-motion';

interface ConnectionStatusProps {
  supabaseConnected: boolean | null;
  icpConnected: boolean;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  supabaseConnected,
  icpConnected
}) => {
  if (supabaseConnected === null) return null;

  return (
    <motion.div 
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
      initial="hidden"
      animate="visible"
      className="flex flex-col md:flex-row gap-4 mb-6"
    >
      <div className={`text-sm px-4 py-2 rounded-md ${supabaseConnected ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'} flex-1`}>
        {supabaseConnected 
          ? "✅ Verification: Connected to Supabase" 
          : "⚠️ Verification: Using local storage"}
      </div>
      
      <div className={`text-sm px-4 py-2 rounded-md ${icpConnected ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'} flex-1`}>
        {icpConnected 
          ? "✅ Loans: Connected to ICP blockchain" 
          : "⚠️ Loans: Using local storage (ICP pending)"}
      </div>
    </motion.div>
  );
};

export default ConnectionStatus;
