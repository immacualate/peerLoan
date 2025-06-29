
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface LoanFiltersProps {
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
}

const LoanFilters: React.FC<LoanFiltersProps> = ({ activeFilter, setActiveFilter }) => {
  const filters = ['all', 'high-yield', 'low-risk', 'short-term'];
  
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 pt-1">
      {filters.map(filter => (
        <Badge
          key={filter}
          variant={activeFilter === filter ? 'default' : 'outline'}
          className={cn(
            'cursor-pointer capitalize whitespace-nowrap',
            activeFilter === filter && 'bg-adanfo-blue hover:bg-adanfo-blue/90'
          )}
          onClick={() => setActiveFilter(filter)}
        >
          {filter.replace('-', ' ')}
        </Badge>
      ))}
    </div>
  );
};

export default LoanFilters;
