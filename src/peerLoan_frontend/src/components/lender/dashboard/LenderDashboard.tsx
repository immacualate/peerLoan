
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import ParticleBackground from '@/components/shared/ParticleBackground';
import { useAuth } from '@/hooks/useAuthContext';
import LenderDashboardHeader from './LenderDashboardHeader';
import ConnectionStatus from './ConnectionStatus';
import LenderStats from './LenderStats';
import PortfolioSummary from './PortfolioSummary';
import LoanPerformanceChart from './LoanPerformanceChart';
import LoanTabs from './LoanTabs';
import ResourcesSection from './ResourcesSection';

const LenderDashboard: React.FC = () => {
  const { user } = useAuth();
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow relative">
        <ParticleBackground />
        
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="max-w-6xl mx-auto"
            >
              <LenderDashboardHeader variants={itemVariants} />
              
              <motion.div variants={itemVariants}>
                <ConnectionStatus />
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <LenderStats />
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <PortfolioSummary />
              </motion.div>
              
              <LoanPerformanceChart variants={itemVariants} />
              
              <motion.div variants={itemVariants}>
                <LoanTabs userId={user?.principalId} />
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <ResourcesSection />
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default LenderDashboard;
