
import React from "react";
import { motion } from "framer-motion";

interface SuccessHeaderProps {
  firstName?: string;
}

const SuccessHeader: React.FC<SuccessHeaderProps> = ({ firstName = "Student" }) => (
  <>
    <motion.h3 
      className="text-2xl font-semibold mb-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      Verification Successful!
    </motion.h3>
    
    <motion.p 
      className="text-muted-foreground mb-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
    >
      Congratulations {firstName}, your student status has been verified.
    </motion.p>
  </>
);

export default SuccessHeader;
