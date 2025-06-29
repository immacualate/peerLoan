
import { z } from "zod";

export const loanRequestSchema = z.object({
  amount: z.string().min(1, "Amount is required").refine(val => {
    const num = Number(val);
    return !isNaN(num) && num > 0;
  }, "Amount must be a positive number"),
  purpose: z.string().min(1, "Purpose is required"),
  duration: z.string().min(1, "Duration is required"),
  description: z.string().optional(),
  disbursementMethod: z.string().optional(),
});

export type LoanRequestFormValues = z.infer<typeof loanRequestSchema>;

export interface LoanRequestFormProps {
  onSubmit?: (data: LoanRequestFormValues) => Promise<void>;
  onCancel?: () => void;
  isSubmitting?: boolean;
  onSubmitSuccess?: () => void;
  onRequestSubmitted?: () => void;
  studentInfo?: any;
  borrowerId?: string;
  borrowerName?: string;
  creditScore?: number;
}
