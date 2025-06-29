
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface RedirectProgressProps {
  onContinue: () => void;
}

const RedirectProgress: React.FC<RedirectProgressProps> = ({ onContinue }) => {
  // Use refs to track if redirect has already been triggered
  const hasRedirected = useRef(false);
  const [progress, setProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(true);
  
  // Directly navigate to dashboard as a failsafe
  const forceDashboardRedirect = () => {
    if (hasRedirected.current) return;
    
    console.log("Manual redirect: Navigating to dashboard");
    hasRedirected.current = true;
    onContinue();
  };
  
  // Auto-trigger progress and redirect
  useEffect(() => {
    // Only show progress bar for minimum 3 seconds to avoid UI jank
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 4; // Will complete in ~25 steps (100/4) = ~3s with a 120ms interval
      });
    }, 120);

    // After progress is complete, redirect with a slight delay
    const redirectTimeout = setTimeout(() => {
      if (!hasRedirected.current) {
        console.log("Auto-redirecting to dashboard after progress completion");
        hasRedirected.current = true;
        setShowProgress(false);
        onContinue();
      }
    }, 3500); // Slightly longer than progress animation
    
    return () => {
      clearInterval(progressInterval);
      clearTimeout(redirectTimeout);
    };
  }, [onContinue]);
  
  return (
    <div className="relative space-y-4">
      {showProgress && (
        <div className="mb-6">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Completing registration</span>
            <span>{Math.min(100, Math.round(progress))}%</span>
          </div>
          <Progress 
            value={progress} 
            className="h-2 transition-all" 
            indicatorClassName="transition-all duration-300 ease-in-out"
          />
        </div>
      )}
    
      <Button 
        onClick={forceDashboardRedirect}
        className="w-full bg-adanfo-blue hover:bg-adanfo-blue/90"
      >
        <span className="relative z-10">Complete Registration</span>
      </Button>
      
      {showProgress && (
        <p className="text-sm text-muted-foreground text-center">
          Redirecting to dashboard...
        </p>
      )}
    </div>
  );
};

export default React.memo(RedirectProgress);
