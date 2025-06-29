
import React, { Suspense, lazy } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Hero from '../components/home/Hero';
import BackendIntegrationDemo from '../components/shared/BackendIntegrationDemo';

// Lazy load less critical components for better initial load time
const Features = lazy(() => import('../components/home/Features'));
const HowItWorks = lazy(() => import('../components/home/HowItWorks'));
const LenderIncentives = lazy(() => import('../components/home/LenderIncentives'));
const CallToAction = lazy(() => import('../components/home/CallToAction'));

// Simple loading fallback
const LoadingFallback = () => <div className="py-12 bg-gray-50 animate-pulse"></div>;

const Index: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <BackendIntegrationDemo />
        <Suspense fallback={<LoadingFallback />}>
          <Features />
          <HowItWorks />
          <LenderIncentives />
          <CallToAction />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

export default React.memo(Index);
