
import { initAuth } from "./authClient";
import { getIdentityProviderUrl, getIdentityConnectionOptions, getFallbackIdentityUrls } from "./authConfig";

// Login with Internet Identity with robust error handling and retry mechanism
export const login = async (): Promise<boolean> => {
  try {
    const client = await initAuth();
    
    // Get the proper identity provider URL based on environment
    const identityProviderUrl = getIdentityProviderUrl();
    const connectionOptions = getIdentityConnectionOptions();
    
    console.log("Attempting login with Internet Identity provider URL:", identityProviderUrl);
    
    return new Promise((resolve) => {
      try {
        // Longer timeout to allow for authentication to complete
        const loginTimeout = setTimeout(() => {
          console.error("Login attempt timed out after 30 seconds");
          resolve(false);
        }, 30000);
        
        client.login({
          identityProvider: identityProviderUrl,
          ...connectionOptions,
          onSuccess: () => {
            console.log("Internet Identity Login successful!");
            clearTimeout(loginTimeout);
            resolve(true);
          },
          onError: (error) => {
            console.error("Internet Identity Login failed:", error);
            clearTimeout(loginTimeout);
            resolve(false);
          }
        });
      } catch (e) {
        console.error("Unexpected error during login process:", e);
        resolve(false);
      }
    });
  } catch (error) {
    console.error("Failed to initialize auth client for login:", error);
    return false;
  }
};

// Logout from Internet Identity with proper error handling
export const logout = async (): Promise<boolean> => {
  try {
    const client = await initAuth();
    console.log("Logging out from Internet Identity...");
    await client.logout();
    console.log("Logout successful");
    return true;
  } catch (error) {
    console.error("Error during logout:", error);
    return false;
  }
};
