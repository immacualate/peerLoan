
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import EnhancedParticleBackground from '@/components/shared/EnhancedParticleBackground';

interface RegistrationLayoutProps {
  children: React.ReactNode;
}

const RegistrationLayout: React.FC<RegistrationLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow relative">
        <EnhancedParticleBackground />
        
        <AnimatePresence mode="wait">
          <motion.section 
            className="py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="container px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {children}
              </motion.div>
            </div>
          </motion.section>
        </AnimatePresence>
      </main>
      
      <Footer />
    </div>
  );
};

export default RegistrationLayout;
