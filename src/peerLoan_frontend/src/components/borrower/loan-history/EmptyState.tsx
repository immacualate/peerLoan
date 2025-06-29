
import React from 'react';

export const EmptyState: React.FC = () => {
  return (
    <div className="text-center py-6 text-muted-foreground">
      <p>No loan history yet. Start by requesting your first loan.</p>
    </div>
  );
};
