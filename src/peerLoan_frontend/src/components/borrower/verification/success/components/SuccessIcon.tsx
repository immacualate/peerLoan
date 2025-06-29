
import React from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

const SuccessIcon: React.FC = () => (
  <motion.div
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ 
      type: "spring", 
      delay: 0.2,
      stiffness: 100
    }}
    className="w-24 h-24 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-4"
  >
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ 
        type: "spring", 
        delay: 0.4,
        stiffness: 120
      }}
    >
      <CheckCircle className="h-12 w-12 text-green-600" />
    </motion.div>
  </motion.div>
);

export default SuccessIcon;
