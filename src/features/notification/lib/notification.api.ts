import axiosInstance from "@src/shared/api/axios";
import type { NotificationsResponse, NotificationsQueryParams, UnreadNotificationsCountResponse } from "@src/features/notification/schema/notification.types";

export const getNotifications = async (
  { unread_only = false, limit = 3 }: NotificationsQueryParams = {}
): Promise<NotificationsResponse> => {
  const response = await axiosInstance.get<NotificationsResponse>("/notification/", {
    params: { unread_only, limit },
  });
  return response.data;
};

export const getUnreadNotificationsCount = async (): Promise<UnreadNotificationsCountResponse> => {
  const response = await axiosInstance.get<UnreadNotificationsCountResponse>("/notification/count/unread");
  return response.data;
};

export const markAllNotificationsAsRead = async (): Promise<void> => {
  await axiosInstance.put("/notification/read-all");
};

export const markNotificationAsRead = async (
  notificationId: number
): Promise<void> => {
  await axiosInstance.put(`/notification/${notificationId}/read`);
};

export const deleteNotification = async (
  notificationId: number
): Promise<void> => {
  await axiosInstance.delete(`/notification/${notificationId}`);
};
