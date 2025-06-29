
import React, { memo } from 'react';
import { formatICP, formatGHS, convertICPToGHS } from '@/utils/currencyUtils';

interface DualCurrencyDisplayProps {
  icpAmount: number;
  showConversionSymbol?: boolean;
  className?: string;
}

const DualCurrencyDisplay: React.FC<DualCurrencyDisplayProps> = ({
  icpAmount,
  showConversionSymbol = true,
  className = ""
}) => {
  const ghsAmount = convertICPToGHS(icpAmount);
  
  return (
    <div className={`flex flex-col ${className}`}>
      <span className="text-lg font-medium">{formatICP(icpAmount)}</span>
      <div className="flex items-center gap-1 text-sm text-muted-foreground">
        {showConversionSymbol && <span>≈</span>}
        <span>{formatGHS(ghsAmount)}</span>
      </div>
    </div>
  );
};

export default memo(DualCurrencyDisplay);
