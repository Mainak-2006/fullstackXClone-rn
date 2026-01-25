import { useOAuth } from "@clerk/clerk-expo";
import { Alert } from "react-native";

export const useSocialAuth = () => {
  const { startOAuthFlow: startGoogleOAuth } = useOAuth({ strategy: "oauth_google" });
  const { startOAuthFlow: startAppleOAuth } = useOAuth({ strategy: "oauth_apple" });
  const { startOAuthFlow: startFacebookOAuth } = useOAuth({ strategy: "oauth_facebook" });

  const handleSocialAuth = async (
    strategy: "oauth_google" | "oauth_apple" | "oauth_facebook"
  ) => {
    try {
      const startOAuthFlow =
        strategy === "oauth_google"
          ? startGoogleOAuth
          : strategy === "oauth_apple"
            ? startAppleOAuth
            : startFacebookOAuth;

      const { createdSessionId, setActive } = await startOAuthFlow();

      if (createdSessionId && typeof setActive === "function") {
        await setActive({ session: createdSessionId });
      }
    } catch (err: any) {
      const provider =
        strategy === "oauth_google" ? "Google" : strategy === "oauth_apple" ? "Apple" : "Facebook";
      Alert.alert("Error", `Failed to sign in with ${provider}. Please try again.`);
    }
  };

  return { handleSocialAuth };
};