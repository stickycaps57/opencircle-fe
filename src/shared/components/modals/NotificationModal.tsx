import { Modal } from "@src/shared/components/Modal";
import { useNotifications } from "@src/features/notification/model/notification.query";
import { useMarkNotificationAsRead, useDeleteNotification, useMarkAllNotificationsAsRead } from "@src/features/notification/model/notification.mutation";
import { LoadingState, ErrorState } from "@src/shared/components";
import { Spinner } from "@src/shared/components/Spinner";
import { useState } from "react";
import { useFormatDate } from "@src/shared/hooks/useFormatDate";
import { PrimaryButton } from "@src/shared/components/PrimaryButton";
import deleteIcon from "@src/assets/shared/delete_icon.svg";

type NotificationModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function NotificationModal({ isOpen, onClose }: NotificationModalProps) {
  const [limit, setLimit] = useState<number>(50);
  const { data, isLoading, isError, isFetching } = useNotifications({ unread_only: false, limit });
  const { formatRelativeTime } = useFormatDate();
  const markOneMutation = useMarkNotificationAsRead();
  const deleteMutation = useDeleteNotification();
  const markAllMutation = useMarkAllNotificationsAsRead();

  const handleMarkAllAsRead = () => {
    markAllMutation.mutate();
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = Number(e.target.value);
    setLimit(next);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-3xl">
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <div></div>
        <h2 className="text-responsive-base font-bold text-primary">Notifications</h2>
        <button onClick={onClose} className="text-placeholderbg hover:text-primary transition-colors text-responsive-xs">Close</button>
      </div>

      <div className="flex flex-col h-full max-h-[calc(85vh-120px)]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <span className="text-responsive-xs text-primary">Showing {data?.notifications.length || 0} of {limit}</span>
          </div>
          <div className="flex items-center space-x-3">
            <PrimaryButton
              label="Mark all as read"
              variant="linkXsButton"
              contentClass="text-responsive-xxs"
              onClick={handleMarkAllAsRead}
            />
            <select
            value={limit}
            onChange={handleChange}
            className="px-3 py-2 border border-gray-300 rounded-lg text-responsive-xs text-primary bg-white"
          >
            {[10, 20, 30, 40, 50, 100].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
            </select>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 max-h-[calc(85vh-240px)]">
          {isLoading && <LoadingState message="Loading notifications..." />}
          {isError && <ErrorState message="Failed to load notifications." />}

          {!isLoading && !isError && data && data.notifications.length > 0 ? (
            <>
              {isFetching && <Spinner size="sm" />}
              {data.notifications.map((n) => (
                <div key={n.id} className="">
                  <div
                    className={`p-4 rounded-xl flex justify-between items-start ${n.is_read === 1 ? "bg-athens_gray" : "bg-white hover:bg-gray-50"}`}
                    onClick={() => {
                      if (n.is_read === 0) {
                        markOneMutation.mutate(n.id);
                      }
                    }}
                  >
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div className="text-primary text-responsive-xxs font-bold mb-1">{n.title}</div>
                        <button
                          type="button"
                          className="text-placeholderbg hover:text-primary ml-3"
                          aria-label="Delete notification"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteMutation.mutate(n.id);
                          }}
                        >
                          <img src={deleteIcon} alt="Delete" className="w-5 h-4" />
                        </button>
                      </div>
                      <div className="text-primary text-responsive-xs leading-relaxed">{n.message}</div>
                    </div>
                  </div>
                  <p className="text-placeholderbg text-responsive-xxs mt-2 ml-1">{formatRelativeTime(n.created_date)}</p>
                </div>
              ))}
            </>
          ) : (!isLoading && !isError) ? (
            <div className="text-center py-12">
              <p className="text-placeholderbg text-responsive-xs">No notifications yet.</p>
            </div>
          ) : null}
        </div>
      </div>
    </Modal>
  );
}
