import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-expo";
import { useApiClient, userApi } from "../utils/api";

export const useUserSync = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const api = useApiClient();
  const [syncAttempted, setSyncAttempted] = useState(false);

  const syncUserMutation = useMutation({
    mutationFn: () => userApi.syncUser(api),
    onSuccess: () => {
      setSyncAttempted(true);
    },
    onError: (error: any) => {
      setSyncAttempted(true);
    },
  });

  // auto-sync user when signed in
  useEffect(() => {
    // Only attempt sync if auth is loaded, user is signed in, and we haven't attempted sync yet
    if (isLoaded && isSignedIn && !syncAttempted && !syncUserMutation.isPending) {
      syncUserMutation.mutate();
    }
  }, [isLoaded, isSignedIn, syncAttempted]);

  return {
    isLoading: syncUserMutation.isPending,
    error: syncUserMutation.error,
    isSuccess: syncUserMutation.isSuccess,
    retry: () => {
      setSyncAttempted(false);
      syncUserMutation.reset();
    }
  };
};