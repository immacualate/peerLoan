
import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { Rocket, Coins, Users } from 'lucide-react';
import { Button } from '../ui/button';
import EnhancedButton from '../ui/enhanced-button';
import { useAuth } from '@/hooks/useAuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

const Hero: React.FC = () => {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  
  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [controls, isInView]);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 70, damping: 15 }
    }
  };
  
  const floatingIcons = [
    { Icon: Rocket, delay: 0, x: '15%', y: '25%' },
    { Icon: Coins, delay: 1, x: '80%', y: '55%' },
  ];

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
    <section className="relative overflow-hidden pt-20 pb-24 md:pt-28 md:pb-32">
      {isInView && floatingIcons.map(({ Icon, delay, x, y }, index) => (
        <motion.div
          key={index}
          className="absolute text-adanfo-blue/20 dark:text-adanfo-blue/10 will-change-transform"
          style={{ left: x, top: y }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: 0.8, 
            scale: 1,
            y: [0, -10, 0],
          }}
          transition={{
            delay: delay,
            y: {
              repeat: Infinity,
              duration: 4,
              ease: "easeInOut",
              repeatDelay: 0
            },
            scale: {
              duration: 0.7,
              ease: "easeOut",
            }
          }}
        >
          <Icon size={40} />
        </motion.div>
      ))}
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          <motion.div
            variants={itemVariants}
            className="inline-block backdrop-blur-sm bg-adanfo-blue/10 dark:bg-adanfo-blue/20 border border-adanfo-blue/20 rounded-full px-4 py-1 text-sm text-adanfo-blue"
          >
            Decentralized Student Lending
          </motion.div>
          
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent"
          >
            Financial Freedom for Students, Powered by Blockchain
          </motion.h1>
          
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-foreground/70 max-w-2xl"
          >
            AdanfoCash connects students who need loans with investors looking for returns, all without banks or middlemen. Fast, transparent, and secure.
          </motion.p>
          
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 mt-4"
          >
            <EnhancedButton
              variant="gradient"
              size="lg"
              onClick={() => handleButtonClick('borrower')}
              className="sm:min-w-[180px] justify-center"
              disabled={isButtonDisabled}
            >
              Get Started
            </EnhancedButton>
            <Button
              variant="outline"
              size="lg"
              onClick={() => handleButtonClick('lender')}
              className="sm:min-w-[180px] justify-center"
              disabled={isButtonDisabled}
            >
              Start Lending
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default React.memo(Hero);
