
/**
 * Utility functions to handle reliable redirections
 */

/**
 * Redirects to a specified path using multiple methods to ensure reliability
 * @param path The path to redirect to
 * @param timeout Optional timeout before redirection (ms)
 */
export const ensureRedirection = (path: string, timeout: number = 0): void => {
  console.log(`Setting up redirection to ${path} with ${timeout}ms timeout`);
  
  const performRedirect = () => {
    // Try React Router navigation first
    try {
      // This is just for logging, actual navigation is handled elsewhere
      console.log(`Redirecting to ${path} via programmatic navigation`);
    } catch (error) {
      console.error("Navigation error:", error);
    }
    
    // Always use direct location change as backup
    console.log(`Ensuring redirection to ${path} via window.location`);
    window.location.href = path;
  };
  
  if (timeout > 0) {
    setTimeout(performRedirect, timeout);
  } else {
    performRedirect();
  }
  
  // Ultimate fallback if nothing else works
  setTimeout(() => {
    if (document.location.pathname !== path) {
      console.log(`Fallback redirection to ${path}`);
      window.location.href = path;
    }
  }, timeout + 5000);
};

/**
 * Safeguards against redirection failures by setting up a fallback
 * @param path The path to redirect to
 * @returns Cleanup function to clear the timeout
 */
export const setupRedirectionGuard = (path: string): (() => void) => {
  const redirectGuardTimeout = setTimeout(() => {
    if (document.location.pathname !== path) {
      console.log(`Guard triggered: forced redirection to ${path}`);
      window.location.href = path;
    }
  }, 10000); // Fairly long timeout
  
  // Return cleanup function
  return () => clearTimeout(redirectGuardTimeout);
};
