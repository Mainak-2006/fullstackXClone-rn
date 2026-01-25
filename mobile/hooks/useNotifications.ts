import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient, notificationApi } from "../utils/api";

export const useNotifications = () => {
  const api = useApiClient();
  const queryClient = useQueryClient();

  const {
    data: notificationsData,
    error,
    refetch,
  } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => notificationApi.getNotifications(api),
    select: (res) => res.data.notifications,
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: (notificationId: string) => notificationApi.deleteNotification(api, notificationId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const deleteNotification = (notificationId: string) => {
    deleteNotificationMutation.mutate(notificationId);
  };

  return {
    notifications: notificationsData || [],
    error,
    refetch,
    deleteNotification,
  };
};