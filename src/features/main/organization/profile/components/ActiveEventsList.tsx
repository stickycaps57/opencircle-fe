import { useState } from "react";
import { EventActivePost } from "@src/features/main/organization/profile/components/subcomponents/EventActivePost";
import { useInfiniteOrganizationEvents } from "@src/features/main/organization/profile/model/event.infinite.query";
import { LoadingState, ErrorState } from "@src/shared/components";
import { useInfiniteScroll, useImageUrl, useConfirmationModal } from "@src/shared/hooks";
import { useAuthStore } from "@src/shared/store";
import { isMember, isOrganization } from "@src/shared/utils";
import { ProfileAvatar } from "@src/shared/components/ProfileAvatar";
import { CommentsModal, EventFormModal, PostFormModal, ConfirmationModal } from "@src/shared/components/modals";
import { IconDropdown } from "@src/shared/components";
import { useInfiniteContentComments } from "@src/features/comments/model/comment.infinite.query";
import type { CommentsResponse } from "@src/features/comments/schema/comment.types";
import { useDeleteEvent } from "@src/features/main/organization/profile/model/event.mutation";
import { useRsvpEvent, useDeleteRsvp } from "@src/features/home/model/home.mutation";

type ActiveEventsListProps = { accountUuid: string };

export default function ActiveEventsList({ accountUuid }: ActiveEventsListProps) {
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);
  const [isEventFormModalOpen, setIsEventFormModalOpen] = useState(false);
  const [isPostFormModalOpen, setIsPostFormModalOpen] = useState(false);
  const [eventFormMode, setEventFormMode] = useState<"create" | "edit">("create");
  const [selectedPostType, setSelectedPostType] = useState<"event" | "post">("event");

  const { user } = useAuthStore();
  const { getImageUrl } = useImageUrl();
  const { isConfirmModalOpen, modalConfig, openConfirmationModal, closeConfirmationModal } = useConfirmationModal();
  const userUuid = accountUuid || "";
  const isOwnProfile = user?.uuid === userUuid;

  const isUserMember = user ? isMember(user) : false;

  const currentAvatar = getImageUrl(
    isMember(user)
      ? user?.profile_picture
      : isOrganization(user)
      ? user?.logo
      : undefined
  );

  const {
    data: infiniteEventsData,
    isLoading: isEventsLoading,
    error: eventsError,
    fetchNextPage: fetchNextEventsPage,
    hasNextPage: hasNextEventsPage,
    isFetchingNextPage: isFetchingNextEventsPage,
    isError: isEventsError,
  } = useInfiniteOrganizationEvents({ account_uuid: accountUuid, per_page: 5 });

  const handleFetchNextPage = () => {
    if (!isFetchingNextEventsPage && hasNextEventsPage) {
      fetchNextEventsPage();
    }
  };

  const { sentinelRef } = useInfiniteScroll({
    onLoadMore: handleFetchNextPage,
    hasMore: !!hasNextEventsPage,
    isLoading: isFetchingNextEventsPage,
    enabled: !(isEventsLoading || isEventsError),
  });

  const activeEvents =
    infiniteEventsData?.pages.flatMap((page) => page.active_events) || [];

  const {
    data: infiniteCommentsData,
    isLoading: isCommentsLoading,
    error: commentsError,
    fetchNextPage: fetchNextCommentsPage,
    hasNextPage: hasNextCommentsPage,
    isFetchingNextPage: isFetchingNextCommentsPage,
  } = useInfiniteContentComments({ eventId: selectedEventId || 0, limit: 5 });

  const comments =
    infiniteCommentsData?.pages?.flatMap(
      (page: CommentsResponse) => page.comments
    ) || [];
  const totalComments = infiniteCommentsData?.pages?.[0]?.total || 0;

  const handleViewMoreComments = (eventId: number) => {
    setSelectedEventId(eventId);
    setIsCommentsModalOpen(true);
  };

  const deleteEventMutation = useDeleteEvent();
  const rsvpEventMutation = useRsvpEvent();
  const deleteRsvpMutation = useDeleteRsvp();

  const handleEdit = (eventId: number) => {
    setSelectedEventId(eventId);
    setEventFormMode("edit");
    setIsEventFormModalOpen(true);
  };

  const handleDelete = (eventId: number) => {
    setSelectedEventId(eventId);
    openConfirmationModal({
      title: "Delete Event",
      message: "This will permanently remove the event and all related details. Proceed?",
      confirmButtonText: "Delete",
      confirmButtonVariant: "primary",
      onConfirm: async () => {
        try {
          await deleteEventMutation.mutateAsync(eventId);
        } catch (error) {
          console.error("Failed to delete event:", error);
        }
      },
    });
  };

  const handleOpenCreateEventModal = () => {
    setEventFormMode("create");
    setIsEventFormModalOpen(true);
  };

  const handleOpenCreatePostModal = () => {
    setIsPostFormModalOpen(true);
  };

  const handleCreateActionClick = () => {
    if (selectedPostType === "event") {
      handleOpenCreateEventModal();
    } else {
      handleOpenCreatePostModal();
    }
  };

  const handleRsvpEvent = async (eventId: number) => {
    openConfirmationModal({
      title: "RSVP to Event",
      message: "Do you want to reserve a spot for this event?",
      confirmButtonText: "RSVP",
      confirmButtonVariant: "primary",
      onConfirm: async () => {
        try {
          await rsvpEventMutation.mutateAsync(eventId);
        } catch (error) {
          console.error("Failed to RSVP to event:", error);
        }
      },
    });
  };

  const handleDeleteRsvpEvent = async (rsvpId: number) => {
    openConfirmationModal({
      title: "Cancel RSVP",
      message: "Do you want to cancel your reservation for this event?",
      confirmButtonText: "Cancel RSVP",
      confirmButtonVariant: "primary",
      onConfirm: async () => {
        try {
          await deleteRsvpMutation.mutateAsync(rsvpId);
        } catch (error) {
          console.error("Failed to cancel RSVP:", error);
        }
      },
    });
  };

  return (
    <div className="w-full">
      {isOwnProfile && (
        <div className="bg-white rounded-xl h-auto sm:h-[104px] p-4 shadow-sm border border-gray-100 mb-6">
          <div className="flex flex-row items-center space-x-2 sm:space-x-4 h-full">
            <div className="flex-shrink-0">
              <ProfileAvatar
                src={currentAvatar}
                alt="User Avatar"
                className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14"
                type={isOrganization(user) ? "organization" : "member"}
                isOwner={isOwnProfile}
                memberUuid={isMember(user) ? user?.uuid : undefined}
                organizationId={isOrganization(user) ? user?.id : undefined}
              />
            </div>

            <div className="flex-1">
              <input
                type="text"
                placeholder={
                  selectedPostType === "post"
                    ? "Whats on your mind?"
                    : "Post an event"
                }
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-athens_gray border border-transparent rounded-full text-responsive-xs cursor-pointer"
                onClick={handleCreateActionClick}
                readOnly
              />
            </div>

            <div className="flex-shrink-0">
              <IconDropdown value={selectedPostType} setValue={setSelectedPostType} />
            </div>
          </div>
        </div>
      )}
      {isEventsLoading && <LoadingState message="Loading events..." />}
      {isEventsError && (
        <ErrorState
          message={`Failed to load events. ${eventsError?.message || "Please try again later."}`}
        />
      )}

      {!isEventsLoading && !isEventsError && activeEvents.length === 0 && (
        <div className="text-center py-4 sm:py-6 md:py-8">
          <p className="text-placeholderbg text-responsive-sm">No active events found.</p>
        </div>
      )}

      {!isEventsLoading && !isEventsError && activeEvents.length > 0 && (
        <div className="space-y-4 sm:space-y-6">
          {activeEvents.map((event) => (
            <EventActivePost
              key={event.id}
              event={event}
              currentUserAvatar={currentAvatar}
              isUserMember={isUserMember}
              onViewMoreComments={handleViewMoreComments}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onRsvpEvent={handleRsvpEvent}
              onDeleteRsvpEvent={handleDeleteRsvpEvent}
            />
          ))}

          <div className="w-full my-3 sm:my-4">
            {isFetchingNextEventsPage && (
              <LoadingState message="Loading more events..." className="py-3 sm:py-4 text-center" />
            )}
            {isEventsError && !isFetchingNextEventsPage && (
              <ErrorState message="Failed to load more events." className="text-center" />
            )}
            <div ref={sentinelRef} className={`w-full ${hasNextEventsPage ? "h-20" : "h-4"}`} style={{ marginBottom: "20px" }} />
          </div>
        </div>
      )}

      <CommentsModal
        isOpen={isCommentsModalOpen}
        onClose={() => setIsCommentsModalOpen(false)}
        comments={comments}
        currentUserAvatar={currentAvatar}
        isLoading={isCommentsLoading}
        error={commentsError}
        eventId={selectedEventId || 0}
        fetchNextPage={fetchNextCommentsPage}
        hasNextPage={hasNextCommentsPage}
        isFetchingNextPage={isFetchingNextCommentsPage}
        totalComments={totalComments}
      />

      <EventFormModal
        isOpen={isEventFormModalOpen}
        onClose={() => setIsEventFormModalOpen(false)}
        mode={eventFormMode}
        eventId={selectedEventId || undefined}
      />

      <PostFormModal
        isOpen={isPostFormModalOpen}
        onClose={() => setIsPostFormModalOpen(false)}
        mode="create"
        postId={undefined}
      />

      {modalConfig && (
        <ConfirmationModal
          isOpen={isConfirmModalOpen}
          onClose={closeConfirmationModal}
          onConfirm={modalConfig.onConfirm}
          title={modalConfig.title}
          message={modalConfig.message}
          confirmButtonText={modalConfig.confirmButtonText}
          confirmButtonVariant={modalConfig.confirmButtonVariant}
        />
      )}
    </div>
  );
}
