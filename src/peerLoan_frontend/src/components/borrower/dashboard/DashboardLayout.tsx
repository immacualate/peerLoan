
import React, { ReactNode } from 'react';
import Navbar from '../../layout/Navbar';
import Footer from '../../layout/Footer';
import ParticleBackground from '../../shared/ParticleBackground';
import { motion } from 'framer-motion';
import DashboardHeader from './DashboardHeader';

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow relative">
        <ParticleBackground />
        
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.1 }
                }
              }}
              initial="hidden"
              animate="visible"
              className="max-w-6xl mx-auto"
            >
              <DashboardHeader 
                title={title} 
                subtitle={subtitle}
              />
              
              {children}
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default DashboardLayout;
