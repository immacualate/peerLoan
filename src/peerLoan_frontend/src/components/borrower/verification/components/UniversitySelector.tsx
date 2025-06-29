
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { School, ExternalLink } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

export const UNIVERSITIES = [
  { id: "ug", name: "University of Ghana (UG)", portal: "https://ienabler.ug.edu.gh" },
  { id: "knust", name: "Kwame Nkrumah University of Science and Technology (KNUST)", portal: "https://apps.knust.edu.gh" },
  { id: "upsa", name: "University of Professional Studies, Accra (UPSA)", portal: "https://upsasip.com" },
  { id: "other", name: "Other Institution", portal: "" }
];

interface UniversitySelectorProps {
  form: UseFormReturn<any>;
}

const UniversitySelector: React.FC<UniversitySelectorProps> = ({ form }) => {
  const university = form.watch("universityName");
  const selectedUniversity = UNIVERSITIES.find(uni => uni.id === university);
  const portalUrl = selectedUniversity?.portal || "";
  
  return (
    <>
      <FormField
        control={form.control}
        name="universityName"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              <School className="h-4 w-4 text-adanfo-blue" />
              University/College Name
            </FormLabel>
            <FormControl>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your institution" />
                </SelectTrigger>
                <SelectContent>
                  {UNIVERSITIES.map(uni => (
                    <SelectItem key={uni.id} value={uni.id}>
                      {uni.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {portalUrl && (
        <div className="text-sm text-muted-foreground flex items-center gap-1">
          <ExternalLink className="h-3 w-3" />
          <span>Portal: </span>
          <a 
            href={portalUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-adanfo-blue hover:underline"
          >
            {portalUrl}
          </a>
        </div>
      )}
    </>
  );
};

export default UniversitySelector;
