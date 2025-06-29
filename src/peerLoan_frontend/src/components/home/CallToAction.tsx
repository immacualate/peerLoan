
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import EnhancedButton from '../ui/enhanced-button';
import { useAuth } from '@/hooks/useAuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

const CallToAction: React.FC = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const handleButtonClick = async (userType: 'borrower' | 'lender') => {
    if (isButtonDisabled) return;
    
    setIsButtonDisabled(true);
    
    try {
      // If already authenticated, go directly to the appropriate registration/dashboard
      if (user.isAuthenticated) {
        if (user.role === 'unregistered') {
          // User is authenticated but not registered, go to registration
          if (userType === 'borrower') {
            navigate('/borrower-registration');
          } else {
            navigate('/lender-registration');
          }
        } else {
          // User is already registered, go to their dashboard
          if (user.role === 'borrower') {
            navigate('/borrower-dashboard');
          } else if (user.role === 'lender') {
            navigate('/lender-dashboard');
          }
        }
        return;
      }

      // User is not authenticated, need to login first
      toast({
        title: "Connecting...",
        description: "Please connect your wallet to continue.",
      });
      
      // Store the intended registration type for after login
      localStorage.setItem('intended_registration_type', userType);
      
      // Trigger login - the login process will handle navigation after authentication
      const loginSuccess = await login('/');
      
      if (!loginSuccess) {
        localStorage.removeItem('intended_registration_type');
        toast({
          title: "Connection Failed",
          description: "Please try again.",
          variant: "destructive"
        });
      }
      
    } catch (error) {
      console.error("CTA button error:", error);
      localStorage.removeItem('intended_registration_type');
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setTimeout(() => {
        setIsButtonDisabled(false);
      }, 1500);
    }
  };

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-adanfo-blue/10 via-transparent to-adanfo-purple/10 -z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-adanfo-blue/5 via-transparent to-transparent -z-10" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="p-10 rounded-2xl relative overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="absolute inset-0 -z-10">
              <div className="absolute inset-0 bg-gradient-to-r from-adanfo-blue/20 to-adanfo-purple/20 rounded-2xl blur-xl" />
              <div className="absolute inset-0 bg-gradient-to-br from-adanfo-blue/20 via-transparent to-adanfo-purple/20 rounded-2xl" />
            </div>
            
            <div className="glass-card p-8 text-center md:p-12">
              <motion.h2
                className="text-3xl md:text-4xl font-bold mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Ready to Transform Your Financial Future?
              </motion.h2>
              
              <motion.p
                className="text-lg mb-8 text-foreground/80 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                Whether you're looking for a loan or wanting to invest, peerLoan provides a secure, transparent platform to help you achieve your goals.
              </motion.p>
              
              <motion.div
                className="flex flex-col sm:flex-row justify-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <EnhancedButton
                  variant="gradient"
                  size="lg"
                  onClick={() => handleButtonClick('borrower')}
                  className="group min-w-[200px]"
                  disabled={isButtonDisabled}
                >
                  <span className="mr-2">Apply for a Loan</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </EnhancedButton>
                
                <EnhancedButton
                  variant="glass"
                  size="lg"
                  onClick={() => handleButtonClick('lender')}
                  className="group min-w-[200px]"
                  disabled={isButtonDisabled}
                >
                  <span className="mr-2">Start Lending</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </EnhancedButton>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
