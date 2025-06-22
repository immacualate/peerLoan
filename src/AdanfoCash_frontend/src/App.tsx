
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuthContext';
import { Toaster } from '@/components/ui/toaster';
import { logDeploymentStatus } from '@/utils/deploymentCheck';
import Home from './pages/Index';
import WalletConnection from './pages/WalletConnection';
import BorrowerRegistration from './pages/BorrowerRegistration';
import LenderRegistration from './pages/LenderRegistration';
import BorrowerDashboard from './pages/BorrowerDashboard';
import LenderDashboard from './pages/LenderDashboard';
import FAQ from './pages/resources/FAQ';
import ProtectedRoute from './components/shared/ProtectedRoute';
import ParticleBackground from './components/shared/ParticleBackground';

function App() {
  // Run deployment check on app start
  useEffect(() => {
    if (import.meta.env.DEV) {
      logDeploymentStatus();
    }
  }, []);

  return (
    <Router>
      <AuthProvider>
        <div className="relative min-h-screen">
          <ParticleBackground />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/wallet-connection" element={<WalletConnection />} />
            <Route path="/resources/faq" element={<FAQ />} />
            
            <Route 
              path="/borrower-registration" 
              element={
                <ProtectedRoute requireAuth={true} allowUnregistered={true}>
                  <BorrowerRegistration />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/lender-registration" 
              element={
                <ProtectedRoute requireAuth={true} allowUnregistered={true}>
                  <LenderRegistration />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/borrower-dashboard" 
              element={
                <ProtectedRoute requireAuth={true} requiredRole="borrower">
                  <BorrowerDashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/lender-dashboard" 
              element={
                <ProtectedRoute requireAuth={true} requiredRole="lender">
                  <LenderDashboard />
                </ProtectedRoute>
              } 
            />
          </Routes>
          <Toaster />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
