
import React, { memo } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { EyeOff, Eye } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";

interface PrivacySettingsStepProps {
  form: UseFormReturn<any>;
  onBack: () => void;
  onNext: () => void;
}

const PrivacyItemRow = memo(({ icon, text, status }: { 
  icon: React.ReactNode, 
  text: string, 
  status: string 
}) => {
  const isPrivate = status.includes("Private") || status.includes("Hashed");
  const bgColor = isPrivate ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
  
  return (
    <div className="flex items-center justify-between p-3 border rounded-lg">
      <div className="flex items-center gap-2">
        {icon}
        <span>{text}</span>
      </div>
      <span className={`text-sm font-medium ${bgColor} px-2 py-1 rounded`}>{status}</span>
    </div>
  );
});

const PrivacySettingsStep: React.FC<PrivacySettingsStepProps> = ({ form, onBack, onNext }) => {
  // Memoize privacy items to prevent unnecessary re-renders
  const privacyItems = React.useMemo(() => [
    { icon: <EyeOff className="h-4 w-4 text-green-500" />, text: "Ghana Card Number", status: "Hashed" },
    { icon: <EyeOff className="h-4 w-4 text-green-500" />, text: "Contact Number", status: "Private" },
    { icon: <Eye className="h-4 w-4 text-blue-500" />, text: "Full Name", status: "Shared" },
    { icon: <Eye className="h-4 w-4 text-blue-500" />, text: "University & Student Status", status: "Shared" },
    { icon: <Eye className="h-4 w-4 text-blue-500" />, text: "Verified GPA", status: "Shared" },
    { icon: <Eye className="h-4 w-4 text-blue-500" />, text: "Credit Score", status: "Shared" },
  ], []);

  return (
    <div className="py-6">
      <h3 className="text-xl font-semibold mb-4">Privacy Settings</h3>
      <p className="text-muted-foreground mb-6">
        Control what information is shared with lenders.
      </p>
      
      <div className="space-y-4 mb-6">
        {privacyItems.map((item, index) => (
          <PrivacyItemRow 
            key={index}
            icon={item.icon}
            text={item.text}
            status={item.status}
          />
        ))}
      </div>
      
      <FormField
        control={form.control}
        name="consent"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 mb-6 p-4 border rounded-lg">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>I consent to student status verification</FormLabel>
              <FormDescription>
                You authorize ZKPass to verify your student status using the information provided.
                Your Ghana Card number will be securely hashed, and your GPA will be verified directly from academic sources.
              </FormDescription>
            </div>
          </FormItem>
        )}
      />
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>Back</Button>
        <Button 
          onClick={onNext}
          disabled={!form.getValues().consent}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default memo(PrivacySettingsStep);
