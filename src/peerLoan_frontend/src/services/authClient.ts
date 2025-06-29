
import { AuthClient } from "@dfinity/auth-client";
import { Identity } from "@dfinity/agent";

// Auth client singleton with proper type
let authClient: AuthClient | null = null;
let initializationPromise: Promise<AuthClient> | null = null;

// Initialize the auth client with error handling and retry mechanism
export const initAuth = async (): Promise<AuthClient> => {
  // Return existing client if already initialized
  if (authClient) {
    return authClient;
  }
  
  // Return existing initialization promise if in progress
  if (initializationPromise) {
    return initializationPromise;
  }
  
  // Create a new initialization promise
  initializationPromise = new Promise(async (resolve, reject) => {
    try {
      console.log("Creating new AuthClient instance for Internet Identity");
      const client = await AuthClient.create({
        idleOptions: {
          disableIdle: true, // Disable idle timeout for better UX
          disableDefaultIdleCallback: true
        },
        // Force Internet Identity to always create a new session
        identity: undefined // This ensures we don't reuse any cached identity
      });
      
      // Store the client and resolve the promise
      authClient = client;
      console.log("AuthClient created successfully");
      resolve(client);
    } catch (error) {
      console.error("Error initializing AuthClient:", error);
      
      // Clear initialization promise so future calls can retry
      initializationPromise = null;
      reject(error);
    }
  });
  
  return initializationPromise;
};

// Check if user is authenticated with proper error handling
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const client = await initAuth();
    return await client.isAuthenticated();
  } catch (error) {
    console.error("Error checking authentication status:", error);
    return false;
  }
};

// Get user identity with proper error handling
export const getIdentity = async (): Promise<Identity | undefined> => {
  try {
    const client = await initAuth();
    return client.getIdentity();
  } catch (error) {
    console.error("Error getting identity:", error);
    return undefined;
  }
};
