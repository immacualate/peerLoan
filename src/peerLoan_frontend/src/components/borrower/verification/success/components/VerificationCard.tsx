
import React from "react";
import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";

const VerificationCard: React.FC = () => (
  <motion.div
    className="bg-soft-purple p-4 rounded-lg mb-6"
    initial={{ x: -20, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{ delay: 0.5, type: "spring" }}
  >
    <div className="flex items-center gap-2 mb-2">
      <GraduationCap className="h-5 w-5 text-adanfo-blue" />
      <h4 className="font-medium">Student Identity Confirmed</h4>
    </div>
    <p className="text-sm text-muted-foreground">
      Your status as a student is now verified and securely stored using zero-knowledge proofs.
    </p>
  </motion.div>
);

export default VerificationCard;
