
import React from 'react';

// Completely static background with no animation 
// to maximize performance
const AnimatedGradients: React.FC = () => {
  return (
    <div 
      className="fixed inset-0 z-[-2] pointer-events-none bg-gradient-to-br from-blue-50/5 via-purple-50/5 to-indigo-50/5 dark:from-blue-950/5 dark:via-indigo-950/5 dark:to-purple-950/5" 
      aria-hidden="true"
    />
  );
};

// Use React.memo to prevent any re-renders
export default React.memo(AnimatedGradients);
