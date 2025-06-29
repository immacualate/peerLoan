
import { z } from "zod";

export const studentVerificationSchema = z.object({
  universityName: z.string().min(1, { message: "University selection is required" }),
  studentId: z.string().min(2, { message: "Student ID is required" }),
  fullName: z.string().min(2, { message: "Full name is required" }),
  contactNumber: z.string().min(10, { message: "Valid contact number is required" }).optional(),
  ghanaCardNumber: z.string().min(8, { message: "Ghana Card number is required" }),
  graduationDate: z.string().refine(date => {
    const graduationDate = new Date(date);
    const fiveMonthsFromNow = new Date();
    fiveMonthsFromNow.setMonth(fiveMonthsFromNow.getMonth() + 5);
    return graduationDate >= fiveMonthsFromNow;
  }, { message: "Graduation date must be at least 5 months away" }),
  consent: z.boolean().refine(val => val === true, {
    message: "You must consent to verification",
  }),
  isVerified: z.boolean().optional(),
});

export type StudentVerificationValues = z.infer<typeof studentVerificationSchema>;

export interface VerificationStepProps {
  step: number;
  totalSteps: number;
  progress: number;
}
