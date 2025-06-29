
import React from 'react';

const LoadingState: React.FC = () => {
  return (
    <div className="py-8 flex flex-col items-center justify-center">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="h-12 w-12 rounded-full bg-muted"></div>
        <div className="h-4 w-48 bg-muted rounded"></div>
        <div className="h-3 w-32 bg-muted rounded"></div>
      </div>
    </div>
  );
};

export default LoadingState;
