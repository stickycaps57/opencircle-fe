import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markAllNotificationsAsRead, markNotificationAsRead, deleteNotification } from "@src/features/notification/lib/notification.api";
import { QUERY_KEYS } from "@src/shared/constants/queryKeys";
import { showSuccessToast, showErrorToast } from "@src/shared/components/Toast/CustomToast";

export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, void>({
    mutationFn: () => markAllNotificationsAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NOTIFICATIONS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NOTIFICATIONS_UNREAD_COUNT] });
      showSuccessToast("All notifications marked as read");
    },
    onError: (error) => {
      console.error("Failed to mark all as read:", error);
      showErrorToast("Failed to mark notifications as read");
    },
  });
};

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: (notificationId) => markNotificationAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NOTIFICATIONS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NOTIFICATIONS_UNREAD_COUNT] });
    },
    onError: (error) => {
      console.error("Failed to mark notification as read:", error);
      showErrorToast("Failed to mark notification as read");
    },
  });
};

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: (notificationId) => deleteNotification(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NOTIFICATIONS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NOTIFICATIONS_UNREAD_COUNT] });
      showSuccessToast("Notification deleted");
    },
    onError: (error) => {
      console.error("Failed to delete notification:", error);
      showErrorToast("Failed to delete notification");
    },
  });
};
