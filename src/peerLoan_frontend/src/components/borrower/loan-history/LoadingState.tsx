
import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingState: React.FC = () => {
  return (
    <div className="flex justify-center items-center py-8">
      <Loader2 className="h-8 w-8 text-muted-foreground animate-spin mr-2" />
      <span className="text-muted-foreground">Loading loan history...</span>
    </div>
  );
};
