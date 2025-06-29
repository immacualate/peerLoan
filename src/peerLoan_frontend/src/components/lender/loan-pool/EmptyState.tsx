
import React from 'react';
import { Button } from '@/components/ui/button';
import { Package } from 'lucide-react';
import { motion } from 'framer-motion';

interface EmptyStateProps {
  setActiveFilter: (filter: string) => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ setActiveFilter }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="py-12 text-center"
    >
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
        <Package className="h-10 w-10 text-primary" />
      </div>
      
      <h3 className="text-xl font-medium mb-3">No Loan Requests Found</h3>
      
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        There are currently no loan requests matching your filter criteria. 
        Loan requests will appear here once students submit their applications.
      </p>
      
      <div className="space-y-2">
        <Button
          variant="default"
          onClick={() => setActiveFilter('all')}
          className="mx-auto"
        >
          View All Requests
        </Button>
        
        <p className="text-xs text-muted-foreground mt-4">
          Tip: Check back regularly as new student loan requests are added frequently
        </p>
      </div>
    </motion.div>
  );
};

export default EmptyState;
