
import React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface ReadyCardProps {
  onRedirect?: () => void;
}

const ReadyCard: React.FC<ReadyCardProps> = ({ onRedirect }) => {
  const handleRedirect = () => {
    if (onRedirect) {
      onRedirect();
    } else {
      window.location.href = '/borrower-dashboard';
    }
  };

  return (
    <Card className="border-green-200 shadow-lg h-full">
      <CardContent className="pt-6">
        <h3 className="text-xl font-semibold mb-4">Ready to Apply for Loans</h3>
        <p className="text-muted-foreground mb-4">
          You're now eligible to apply for student loans on our platform. Your verification status unlocks access to:
        </p>
        
        <ul className="space-y-2 mb-6 list-disc pl-5">
          <li>Competitive interest rates for students</li>
          <li>Flexible repayment schedules</li>
          <li>Educational resources and support</li>
          <li>Exclusive student loan offerings</li>
        </ul>
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={handleRedirect}
          className="w-full flex items-center justify-center gap-2"
        >
          Go to Borrower Dashboard
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ReadyCard;
