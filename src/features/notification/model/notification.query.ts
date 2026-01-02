import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@src/shared/constants/queryKeys";
import { getNotifications, getUnreadNotificationsCount } from "@src/features/notification/lib/notification.api";
import type { NotificationsResponse, NotificationsQueryParams, UnreadNotificationsCountResponse } from "@src/features/notification/schema/notification.types";

export const useNotifications = ({ unread_only = false, limit = 3 }: NotificationsQueryParams = {}) => {
  return useQuery<NotificationsResponse, Error>({
    queryKey: [QUERY_KEYS.NOTIFICATIONS, unread_only, limit],
    queryFn: async () => await getNotifications({ unread_only, limit }),
    staleTime: 60 * 1000,
  });
};

export const useUnreadNotificationsCount = (enabled: boolean = true) => {
  return useQuery<UnreadNotificationsCountResponse, Error>({
    queryKey: [QUERY_KEYS.NOTIFICATIONS_UNREAD_COUNT],
    queryFn: async () => await getUnreadNotificationsCount(),
    staleTime: 60 * 1000,
    enabled,
  });
};
