import { ClerkProvider } from '@clerk/clerk-expo'
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import { Stack } from 'expo-router'
import "../global.css"
import {QueryClient,QueryClientProvider}from "@tanstack/react-query"

export default function RootLayout() {

  const queryClient= new QueryClient()
  
  return (
    <ClerkProvider tokenCache={tokenCache}>
      <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{headerShown:false}}>
      <Stack.Screen name="(auth)" options={{headerShown:false}}/>
      <Stack.Screen name="(tabs)" options={{headerShown:false}}/>
      </Stack>
      </QueryClientProvider>
    </ClerkProvider>
  )
}
