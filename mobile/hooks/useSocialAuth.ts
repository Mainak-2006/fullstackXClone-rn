import { useOAuth } from "@clerk/clerk-expo";
import { useState } from "react";
import { Alert } from "react-native";

export const useSocialAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { startOAuthFlow: startGoogleOAuth } = useOAuth({ strategy: "oauth_google" });
  const { startOAuthFlow: startAppleOAuth } = useOAuth({ strategy: "oauth_apple" });

  const handleSocialAuth = async (strategy: "oauth_google" | "oauth_apple") => {
    setIsLoading(true);
    try {
      const startOAuthFlow = strategy === "oauth_google" ? startGoogleOAuth : startAppleOAuth;
      
      const { createdSessionId, setActive } = await startOAuthFlow();
      
      if (createdSessionId && typeof setActive === "function") {
        await setActive({ session: createdSessionId });
        console.log("OAuth successful, session created");
      } else if (createdSessionId) {
        console.log("OAuth completed, session created, but setActive is unavailable");
      } else {
        console.log("OAuth completed but no session created");
      }
    } catch (err: any) {
      console.log("Error in social auth:", err);
      const provider = strategy === "oauth_google" ? "Google" : "Apple";
      Alert.alert("Error", `Failed to sign in with ${provider}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };
  
  return { isLoading, handleSocialAuth };
};