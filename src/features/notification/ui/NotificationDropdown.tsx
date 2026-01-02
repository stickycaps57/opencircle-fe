import { useNotifications } from "@src/features/notification/model/notification.query";
import { useState } from "react";
import { PrimaryButton } from "@src/shared/components/PrimaryButton";
import { NotificationModal } from "@src/shared/components/modals/NotificationModal";
import { useMarkAllNotificationsAsRead, useMarkNotificationAsRead, useDeleteNotification } from "@src/features/notification/model/notification.mutation";
import deleteIcon from "@src/assets/shared/delete_icon.svg";

type NotificationDropdownProps = {
  limit?: number;
  unreadOnly?: boolean;
  onSeeMoreClick?: () => void;
};

export const NotificationDropdown = ({ limit = 3, unreadOnly = false, onSeeMoreClick }: NotificationDropdownProps) => {
  const { data, isLoading, isError } = useNotifications({ unread_only: unreadOnly, limit });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const markAllMutation = useMarkAllNotificationsAsRead();
  const markOneMutation = useMarkNotificationAsRead();
  const deleteMutation = useDeleteNotification();

  const handleMarkAllAsRead = () => {
    markAllMutation.mutate();
  };

  return (
    <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-10 text-primary">
      <div className="px-4 py-2 border-b border-gray-200 flex items-center justify-between">
        <span className="text-responsive-xs font-semibold">Notifications</span>
        <div className="flex items-center space-x-4">
          <PrimaryButton
            label="Mark all as read"
            variant="linkXsButton"
            contentClass="text-responsive-xxs"
            onClick={handleMarkAllAsRead}
          />
          <PrimaryButton
            label="See more"
            variant="linkXsButton"
            contentClass="text-responsive-xxs"
            onClick={() => {
              setIsModalOpen(true);
              onSeeMoreClick?.();
            }}
          />
        </div>
      </div>

      {isLoading && (
        <div className="px-4 py-3 text-responsive-xxs text-authlayoutbg">Loading...</div>
      )}

      {isError && (
        <div className="px-4 py-3 text-responsive-xxs text-red-500">Failed to load notifications</div>
      )}

      {data && (
        <div className="divide-y divide-gray-200">
          {data.notifications.slice(0, limit).map((n) => (
            <div
              key={n.id}
              className={`px-4 py-3 ${n.is_read === 1 ? "bg-athens_gray" : "bg-white hover:bg-gray-50 cursor-pointer"}`}
              onClick={() => {
                if (n.is_read === 0) {
                  markOneMutation.mutate(n.id);
                }
              }}
            >
              <div className="flex items-start justify-between">
                <div className="text-responsive-xxs font-semibold">{n.title}</div>
                <button
                  type="button"
                  className="text-placeholderbg hover:text-primary ml-3"
                  aria-label="Delete notification"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteMutation.mutate(n.id);
                  }}
                >
                  <img src={deleteIcon} alt="Delete" className="w-4 h-4" />
                </button>
              </div>
              <div className="text-responsive-xxs text-authlayoutbg">{n.message}</div>
            </div>
          ))}
          {data.notifications.length === 0 && (
            <div className="px-4 py-3 text-responsive-xxs text-authlayoutbg">No notifications</div>
          )}
        </div>
      )}

      {isModalOpen && (
        <NotificationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
};
