import { useState } from "react";
import {
  CommentsModal,
  MembersModal,
  ConfirmationModal,
  EventFormModal,
  PostFormModal,
} from "@src/shared/components/modals";
import { IconDropdown } from "@src/shared/components";
import { EventPastPost } from "./subcomponents/EventPastPost";
import {
  useImageUrl,
  useInfiniteScroll,
  useConfirmationModal,
} from "@src/shared/hooks";
import { useAuthStore } from "@src/shared/store";
import { isMember, isOrganization } from "@src/shared/utils";
import { ProfileAvatar } from "@src/shared/components/ProfileAvatar";
import { useInfiniteOrganizationPastEvents } from "../model/event.infinite.query";
import { useDeleteEvent } from "../model/event.mutation";
import { LoadingState, ErrorState } from "@src/shared/components";
import { useInfiniteContentComments } from "@src/features/comments/model/comment.infinite.query";
import type { CommentsResponse } from "@src/features/comments/schema/comment.types";
import type { EventParticipant } from "../schema/event.type";

interface PastEventsComponentProps {
  accountUuid: string;
}

export default function PastEventsComponent({ accountUuid }: PastEventsComponentProps) {
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [isEventFormModalOpen, setIsEventFormModalOpen] = useState(false);
  const [isPostFormModalOpen, setIsPostFormModalOpen] = useState(false);
  const [eventFormMode, setEventFormMode] = useState<"create" | "edit">("create");
  const [selectedPostType, setSelectedPostType] = useState<"event" | "post">("event");

  const {
    isConfirmModalOpen,
    modalConfig,
    openConfirmationModal,
    closeConfirmationModal,
  } = useConfirmationModal();

  const { user } = useAuthStore();
  const { getImageUrl } = useImageUrl();
  const userUuid = accountUuid || "";
  const isOwnProfile = user?.uuid === userUuid;

  // Fetch organization past events with infinite scrolling
  const {
    data: infinitePastEventsData,
    isLoading: isPastEventsLoading,
    error: pastEventsError,
    fetchNextPage: fetchNextPastEventsPage,
    hasNextPage: hasNextPastEventsPage,
    isFetchingNextPage: isFetchingNextPastEventsPage,
    isError: isPastEventsError,
  } = useInfiniteOrganizationPastEvents({
    account_uuid: accountUuid,
    per_page: 5, // This will be mapped to page_size in the API call
  });

  // Function to handle loading more past events
  const handleFetchNextPage = () => {
    if (!isFetchingNextPastEventsPage && hasNextPastEventsPage) {
      fetchNextPastEventsPage();
    }
  };

  // Setup infinite scroll
  const { sentinelRef: loadMoreRef } = useInfiniteScroll({
    onLoadMore: handleFetchNextPage,
    hasMore: !!hasNextPastEventsPage,
    isLoading: isFetchingNextPastEventsPage,
    enabled: !isPastEventsLoading && !isPastEventsError,
  });

  // Flatten the paginated past events data
  const pastEventsData =
    infinitePastEventsData?.pages.flatMap((page) => page.past_events) || [];

  // Past events data loaded

  // This function would be implemented when edit functionality is needed
  const handleEdit = (_eventId: number) => {
    // Edit past event functionality would be implemented here
    console.log(_eventId)
  };

  const deleteEventMutation = useDeleteEvent();

  const handleDelete = (eventId: number) => {
    setSelectedEventId(eventId);
    openConfirmationModal({
      title: "Delete Past Event",
      message:
        "This will permanently remove the past event and all related details. Proceed?",
      confirmButtonText: "Delete",
      confirmButtonVariant: "primary",
      onConfirm: async () => {
        try {
          await deleteEventMutation.mutateAsync(eventId);
          // Past event deleted successfully
        } catch (error) {
          console.error("Failed to delete past event:", error);
        }
      },
    });
  };

  const handleViewMoreMembers = (eventId: number) => {
    setSelectedEventId(eventId);
    setIsMembersModalOpen(true);
  };

  const handleViewMoreComments = (eventId: number) => {
    setSelectedEventId(eventId);
    setIsCommentsModalOpen(true);
  };

  // Fetch comments for the selected event with infinite scrolling
  const {
    data: infiniteCommentsData,
    isLoading: isCommentsLoading,
    error: commentsError,
    fetchNextPage: fetchNextCommentsPage,
    hasNextPage: hasNextCommentsPage,
    isFetchingNextPage: isFetchingNextCommentsPage,
  } = useInfiniteContentComments({
    eventId: selectedEventId || undefined,
    limit: 5,
  });

  // Flatten the pages of comments into a single array
  const comments =
    infiniteCommentsData?.pages?.flatMap(
      (page: CommentsResponse) => page.comments
    ) || [];
  // Get the total number of comments from the first page
  const totalComments = infiniteCommentsData?.pages?.[0]?.total || 0;

  const currentAvatar = getImageUrl(
    isMember(user)
      ? user?.profile_picture
      : isOrganization(user)
      ? user?.logo
      : undefined
  );

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

  // No sample data needed as we're using real data from the API

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
                isOwner={false}
                memberUuid={isMember(user) ? user?.uuid : undefined}
                organizationId={isOrganization(user) ? user?.id : undefined}
              />
            </div>

            <div className="flex-1">
              <input
                type="text"
                placeholder={
                  selectedPostType === "post" ? "Whats on your mind?" : "Post an event"
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
      {/* Loading State */}
      {isPastEventsLoading && <LoadingState message="Loading past events..." />}

      {/* Error State */}
      {isPastEventsError && (
        <ErrorState
          message={`Failed to load past events. ${
            pastEventsError?.message || "Please try again later."
          }`}
        />
      )}

      {/* No Events Message */}
      {!isPastEventsLoading &&
        !isPastEventsError &&
        pastEventsData.length === 0 && (
          <div className="text-center py-4 sm:py-6 md:py-8">
            <p className="text-placeholderbg text-responsive-sm">
              No past events found.
            </p>
          </div>
        )}

      {/* Past Event Posts */}
      {!isPastEventsLoading &&
        !isPastEventsError &&
        pastEventsData &&
        pastEventsData.length > 0 && (
          <div className="space-y-4 sm:space-y-6">
            {pastEventsData.map((event) => (
              <EventPastPost
                key={event.id}
                event={event}
                currentUserAvatar={currentAvatar}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onViewMoreMembers={handleViewMoreMembers}
                onViewMoreComments={handleViewMoreComments}
              />
            ))}

            {/* Infinite scroll sentinel element */}
            <div className="w-full my-3 sm:my-4">
              {isFetchingNextPastEventsPage && (
                <LoadingState
                  message="Loading more past events..."
                  className="py-4 text-center"
                />
              )}
              {isPastEventsError && !isFetchingNextPastEventsPage && (
                <div className="flex flex-col items-center py-3 sm:py-4">
                  <ErrorState
                    message="Failed to load more past events."
                    className="mb-2 text-center"
                  />
                  <button
                    onClick={handleFetchNextPage}
                    className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark mt-2"
                  >
                    Retry
                  </button>
                </div>
              )}
              {/* Always render sentinel element but with different heights */}
              <div
                ref={loadMoreRef}
                className={`w-full ${hasNextPastEventsPage ? "h-20" : "h-4"}`}
                style={{ marginBottom: "20px" }}
              />
            </div>
          </div>
        )}

      {/* Comments Modal */}
      <CommentsModal
        isOpen={isCommentsModalOpen}
        onClose={() => setIsCommentsModalOpen(false)}
        comments={comments}
        currentUserAvatar={currentAvatar}
        isLoading={isCommentsLoading}
        error={commentsError}
        eventId={selectedEventId || undefined}
        fetchNextPage={fetchNextCommentsPage}
        hasNextPage={hasNextCommentsPage}
        isFetchingNextPage={isFetchingNextCommentsPage}
        totalComments={totalComments}
      />

      <EventFormModal
        isOpen={isEventFormModalOpen}
        onClose={() => setIsEventFormModalOpen(false)}
        mode={eventFormMode}
        eventId={undefined}
      />

      <PostFormModal
        isOpen={isPostFormModalOpen}
        onClose={() => setIsPostFormModalOpen(false)}
        mode="create"
        postId={undefined}
      />

      {/* Members Modal */}
      <MembersModal
        isOpen={isMembersModalOpen}
        onClose={() => setIsMembersModalOpen(false)}
        members={
          selectedEventId
            ? (
                pastEventsData.find((event) => event.id === selectedEventId)
                  ?.members || []
              ).map((member: EventParticipant) => ({
                id: member.rsvp_id.toString(),
                name:
                  `${member.user?.first_name || ""} ${
                    member.user?.last_name || ""
                  }`.trim() || "Unknown User",
                avatar: getImageUrl(member.user?.profile_picture),
                joinedAt: "",
              }))
            : []
        }
      />

      {/* Confirmation Modal */}
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
