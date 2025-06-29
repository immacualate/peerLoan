
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { User, Calendar } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

interface StudentInfoFieldsProps {
  form: UseFormReturn<any>;
  verificationStatus: string | null;
}

const StudentInfoFields: React.FC<StudentInfoFieldsProps> = ({ form, verificationStatus }) => {
  // Guard against form being undefined
  if (!form || !form.control) {
    console.error("Form or form.control is undefined in StudentInfoFields");
    return null;
  }

  return (
    <>
      <FormField
        control={form.control}
        name="fullName"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              <User className="h-4 w-4 text-adanfo-blue" />
              Full Name
            </FormLabel>
            <FormControl>
              <Input placeholder="Enter your full legal name" {...field} readOnly={verificationStatus === "success"} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="graduationDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-adanfo-blue" />
              Expected Graduation Date
            </FormLabel>
            <FormControl>
              <Input type="date" {...field} readOnly={verificationStatus === "success"} />
            </FormControl>
            <FormDescription>
              Your graduation date from the university records
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default StudentInfoFields;
