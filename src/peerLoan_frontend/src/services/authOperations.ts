
import { initAuth } from "./authClient";
import { getIdentityProviderUrl, getIdentityConnectionOptions, getFallbackIdentityUrls } from "./authConfig";

// Login with Internet Identity with robust error handling and retry mechanism
export const login = async (): Promise<boolean> => {
  try {
    const client = await initAuth();
    
    // Get the proper identity provider URL based on environment
    const identityProviderUrl = getIdentityProviderUrl();
    const connectionOptions = getIdentityConnectionOptions();
    const fallbackUrls = getFallbackIdentityUrls();
    
    console.log("Attempting login with Internet Identity provider URL:", identityProviderUrl);
    console.log("Identity connection options:", connectionOptions);
    
    // Try primary URL first, then fallbacks
    const urlsToTry = [identityProviderUrl, ...fallbackUrls.filter(url => url !== identityProviderUrl)];
    
    for (let i = 0; i < urlsToTry.length; i++) {
      const currentUrl = urlsToTry[i];
      console.log(`Attempt ${i + 1}: Trying URL ${currentUrl}`);
      
      const loginResult = await attemptLoginWithUrl(client, currentUrl, connectionOptions);
      
      if (loginResult) {
        console.log(`Internet Identity Login successful with URL: ${currentUrl}`);
        return true;
      }
      
      if (i < urlsToTry.length - 1) {
        console.log(`Attempt ${i + 1} failed, trying next URL...`);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Brief delay between attempts
      }
    }
    
    console.error("All login attempts failed");
    return false;
    
  } catch (error) {
    console.error("Failed to initialize auth client for login:", error);
    return false;
  }
};

// Helper function to attempt login with a specific URL
const attemptLoginWithUrl = (client: any, identityProviderUrl: string, connectionOptions: any): Promise<boolean> => {
  return new Promise((resolve) => {
    try {
      // Longer timeout to allow for authentication to complete
      const loginTimeout = setTimeout(() => {
        console.error(`Login attempt with ${identityProviderUrl} timed out after 30 seconds`);
        resolve(false);
      }, 30000);
      
      client.login({
        identityProvider: identityProviderUrl,
        ...connectionOptions,
        onSuccess: () => {
          console.log(`Internet Identity Login successful with ${identityProviderUrl}!`);
          clearTimeout(loginTimeout);
          resolve(true);
        },
        onError: (error: any) => {
          console.error(`Internet Identity Login failed with ${identityProviderUrl}:`, error);
          clearTimeout(loginTimeout);
          resolve(false);
        }
      });
    } catch (e) {
      console.error(`Unexpected error during login process with ${identityProviderUrl}:`, e);
      resolve(false);
    }
  });
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
