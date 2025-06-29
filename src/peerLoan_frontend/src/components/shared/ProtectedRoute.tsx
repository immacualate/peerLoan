
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  allowUnregistered?: boolean;
  requiredRole?: string;
}

const ProtectedRoute = ({ 
  children, 
  requireAuth = true, 
  allowUnregistered = false, 
  requiredRole 
}: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  
  console.log("ProtectedRoute: Current user state:", {
    isAuthenticated: user.isAuthenticated,
    role: user.role,
    isVerified: user.isVerified,
    path: location.pathname,
    isLoading
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-adanfo-blue/50 mb-4"></div>
          <div className="h-4 w-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  // Handle dashboard access for registered users and recent registrations
  if (location.pathname.startsWith('/borrower-dashboard')) {
    const hasRecentRegistration = localStorage.getItem('recent_registration') === 'true';
    const registrationComplete = localStorage.getItem('registration_complete') === 'true';
    const userRegistered = localStorage.getItem(`user_registered_${user.principalId}`) === 'true';
    
    if (user.isAuthenticated && (
      user.role === 'borrower' || 
      hasRecentRegistration || 
      registrationComplete || 
      userRegistered
    )) {
      console.log("ProtectedRoute: Allowing borrower dashboard access");
      return <>{children}</>;
    }
  }

  if (location.pathname.startsWith('/lender-dashboard')) {
    if (user.isAuthenticated && user.role === 'lender') {
      console.log("ProtectedRoute: Allowing lender dashboard access");
      return <>{children}</>;
    }
  }

  // If authentication is required but user is not authenticated
  if (requireAuth && !user.isAuthenticated) {
    console.log("ProtectedRoute: User not authenticated, redirecting to wallet connection");
    return <Navigate to="/wallet-connection" replace />;
  }
  
  // If user is authenticated but unregistered and registration not allowed
  if (user.isAuthenticated && user.role === 'unregistered' && !allowUnregistered) {
    // Don't redirect if they're already on a dashboard - let the dashboard handle it
    if (location.pathname.includes('dashboard')) {
      console.log("ProtectedRoute: Unregistered user on dashboard, allowing access");
      return <>{children}</>;
    }
    
    console.log("ProtectedRoute: Unregistered user, redirecting to registration");
    return <Navigate to="/borrower-registration" replace />;
  }
  
  // If a specific role is required and user doesn't have it
  if (requiredRole && user.role !== requiredRole && !location.pathname.includes('dashboard')) {
    console.log(`ProtectedRoute: User role ${user.role} doesn't match required role ${requiredRole}`);
    
    if (user.role === 'lender') {
      return <Navigate to="/lender-dashboard" replace />;
    } else if (user.role === 'borrower') {
      return <Navigate to="/borrower-dashboard" replace />;
    } else {
      return <Navigate to="/borrower-registration" replace />;
    }
  }

  // User meets all requirements
  console.log(`ProtectedRoute: User authorized, rendering protected content`);
  return <>{children}</>;
};

export default ProtectedRoute;
