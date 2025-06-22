
import React from 'react';
import { motion } from 'framer-motion';

interface LenderDashboardHeaderProps {
  variants: any;
}

const LenderDashboardHeader: React.FC<LenderDashboardHeaderProps> = ({ variants }) => {
  return (
    <div className="text-center mb-8">
      <motion.h1 
        variants={variants} 
        className="text-3xl sm:text-4xl font-bold mb-4"
      >
        Lender Dashboard
      </motion.h1>
      <motion.p 
        variants={variants} 
        className="text-lg text-muted-foreground"
      >
        Support students by funding their education loans
      </motion.p>
    </div>
  );
};

export default LenderDashboardHeader;
