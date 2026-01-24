import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { Stack } from "expo-router";
import "../global.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import { useInitializeChat } from "../hooks/useInitializeChat";

const queryClient = new QueryClient();

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

function RootLayoutInner() {
  useInitializeChat();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}

export default function RootLayout() {
  if (!CLERK_PUBLISHABLE_KEY) {
    throw new Error("Missing Clerk Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env file.");
  }

  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY} tokenCache={tokenCache}>
      <QueryClientProvider client={queryClient}>
        <RootLayoutInner />
        <StatusBar style="dark" />
      </QueryClientProvider>
    </ClerkProvider>
  );
}