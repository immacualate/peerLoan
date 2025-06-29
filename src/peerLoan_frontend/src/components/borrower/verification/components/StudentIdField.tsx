
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Hash } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

interface StudentIdFieldProps {
  form: UseFormReturn<any>;
}

const StudentIdField: React.FC<StudentIdFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="studentId"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-2">
            <Hash className="h-4 w-4 text-adanfo-blue" />
            Index Number (Student ID)
          </FormLabel>
          <FormControl>
            <Input placeholder="Enter your student index number" {...field} />
          </FormControl>
          <FormDescription>
            Your student ID as shown on your school ID card
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default StudentIdField;
