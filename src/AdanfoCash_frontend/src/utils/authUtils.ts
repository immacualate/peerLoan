
import { User } from '@/types/authTypes';

// Helper function to get the appropriate dashboard route for a user
export const getDashboardRoute = (user: User): string => {
  if (!user.isAuthenticated) {
    return '/wallet-connection';
  }
  
  if (user.role === 'unregistered') {
    return '/borrower-registration';
  }
  
  if (user.role === 'borrower') {
    return '/borrower-dashboard';
  }
  
  if (user.role === 'lender') {
    return '/lender-dashboard';
  }
  
  return '/';
};

// Check if a route is public (doesn't require authentication)
export const isPublicRoute = (pathname: string): boolean => {
  const publicRoutes = ['/', '/wallet-connection', '/resources/faq'];
  return publicRoutes.includes(pathname);
};

// Check if user has access to a specific route
export const hasRouteAccess = (pathname: string, user: User): boolean => {
  // Public routes are always accessible
  if (isPublicRoute(pathname)) {
    return true;
  }

  // Must be authenticated for protected routes
  if (!user.isAuthenticated) {
    return false;
  }

  // Registration page is accessible to unregistered users
  if (pathname === '/borrower-registration' && user.role === 'unregistered') {
    return true;
  }

  // Role-based access
  if (user.role === 'borrower' && pathname === '/borrower-dashboard') {
    return true;
  }

  if (user.role === 'lender' && pathname === '/lender-dashboard') {
    return true;
  }

  return false;
};
