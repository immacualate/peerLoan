
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, Loader2 } from 'lucide-react';

interface LoanFormActionsProps {
  isSubmitting: boolean;
  isDisabled: boolean;
  errorMessage?: string;
  noStudentInfo?: boolean;
  onCancel?: () => void;
}

const LoanFormActions: React.FC<LoanFormActionsProps> = ({
  isSubmitting,
  isDisabled,
  errorMessage,
  noStudentInfo,
  onCancel
}) => {
  return (
    <div className="flex flex-col space-y-4">
      {errorMessage && (
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-3 rounded-md flex items-start gap-2">
          <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
          <p className="text-sm text-amber-700 dark:text-amber-300">
            {errorMessage}
          </p>
        </div>
      )}
      
      {noStudentInfo && (
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-3 rounded-md flex items-start gap-2">
          <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
          <p className="text-sm text-amber-700 dark:text-amber-300">
            You must complete student verification before requesting a loan.
          </p>
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row justify-end gap-3">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
        
        <Button
          type="submit"
          disabled={isDisabled || isSubmitting}
          className="bg-adanfo-blue hover:bg-adanfo-blue/90"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit Loan Request'
          )}
        </Button>
      </div>
    </div>
  );
};

export default LoanFormActions;
