export type NotificationItem = {
  id: number;
  recipient_id: number;
  type: string;
  title: string;
  message: string;
  is_read: 0 | 1;
  related_entity_id: number;
  related_entity_type: string; // "user" | "event" | etc.
  created_date: string;
  read_date: string | null;
};

export type NotificationsResponse = {
  notifications: NotificationItem[];
  count: number;
  unread_only: boolean;
};

export type NotificationsQueryParams = {
  unread_only?: boolean;
  limit?: number;
};

export type UnreadNotificationsCountResponse = {
  unread_count: number;
};
