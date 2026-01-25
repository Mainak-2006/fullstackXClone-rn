import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-expo";
import { useApiClient, userApi } from "../utils/api";

export const useCurrentUser = () => {
  const api = useApiClient();

  const { isSignedIn } = useAuth();

  const {
    data: currentUser,
    error,
    refetch,
  } = useQuery({
    queryKey: ["authUser"],
    queryFn: () => userApi.getCurrentUser(api),
    enabled: !!isSignedIn,
    select: (response) => response.data.user,
  });

  return { currentUser, error, refetch };
};
