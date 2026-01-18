import { useEffect, useState } from "react";
import activeEventLogo from "@src/assets/shared/active-events.svg";
import pendingEventLogo from "@src/assets/shared/pending-events.svg";
import historyEventLogo from "@src/assets/shared/history-events.svg";
import rejectedEventLogo from "@src/assets/shared/rejected_icon.png";
import { MemberEvents } from "./subcomponents/MemberEvents";
import { useAuthStore } from "@src/shared/store/auth";
import { useUserEventsByRsvpStatusInfiniteQuery, useUserPastEventsInfiniteQuery } from "../model/event.infinite.query";
import { useInfiniteScroll } from "@src/shared/hooks/useInfiniteScroll";
import { LoadingState } from "@src/shared/components/states/LoadingState";
import { ErrorState } from "@src/shared/components/states/ErrorState";
import { useImageUrl } from "@src/shared/hooks/useImageUrl";
import avatarImage from "@src/assets/shared/avatar.png";
import {
  CommentsModal,
  ConfirmationModal,
} from "@src/shared/components/modals";
import { useInfiniteContentComments } from "@src/features/comments/model/comment.infinite.query";
import type { CommentsResponse } from "@src/features/comments/schema/comment.types";
import { isMember, isOrganization } from "@src/shared/utils";
import dropdownIcon from "@src/assets/shared/dropdown_icon.svg";
import { useConfirmationModal } from "@src/shared/hooks";
import {
  useDeleteRsvp,
  useJoinOrganization,
  useRsvpEvent,
} from "@src/features/home/model/home.mutation";
import { useLeaveOrganization } from "../../organization/model/organization.mutation";

type EventComponentProps = { accountUuid?: string };
export default function EventComponent({ accountUuid }: EventComponentProps) {
  const [selectedRsvpStatus, setSelectedRsvpStatus] =
    useState<string>("joined");
  // const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const { user } = useAuthStore();
  const { getImageUrl } = useImageUrl();
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

  const joinOrganizationMutation = useJoinOrganization();
  const leaveOrganizationMutation = useLeaveOrganization();
  const rsvpEventMutation = useRsvpEvent();
  const deleteRsvpMutation = useDeleteRsvp();

  // Get user UUID for API calls
  const userUuid = accountUuid || user?.uuid || "";

  // Fetch past events when selectedRsvpStatus is "past", otherwise fetch events by RSVP status
  const isPastEvents = selectedRsvpStatus === "past";
  
  const {
    data: pastEventsData,
    fetchNextPage: fetchNextPastPage,
    hasNextPage: hasNextPastPage,
    isFetchingNextPage: isFetchingNextPastPage,
    isLoading: isLoadingPastEvents,
    refetch: refetchPastEvents,
    error: pastEventsError,
  } = useUserPastEventsInfiniteQuery({
    accountUuid: userUuid,
    limit: 5,
  });
  
  // Fetch events based on RSVP status (for non-past events)
  const {
    data: eventsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
    error: eventsError,
  } = useUserEventsByRsvpStatusInfiniteQuery({
    accountUuid: userUuid,
    rsvpStatus: selectedRsvpStatus,
    enabled: !isPastEvents,
  });

  const {
    data: infiniteCommentsData,
    isLoading: isCommentsLoading,
    error: commentsError,
    fetchNextPage: fetchNextCommentsPage,
    hasNextPage: hasNextCommentsPage,
    isFetchingNextPage: isFetchingNextCommentsPage,
  } = useInfiniteContentComments({
    eventId: selectedEventId || 0,
    limit: 5,
  });

  const {
    isConfirmModalOpen,
    modalConfig,
    openConfirmationModal,
    closeConfirmationModal,
  } = useConfirmationModal();

  // Ensure fetchNextPostsPage is properly typed
  const handleFetchNextPage = () => {
    if (fetchNextPage) {
      fetchNextPage();
    } else {
      console.error("fetchNextPostsPage function is not available");
    }
  };

  // Setup infinite scroll for the appropriate query based on selectedRsvpStatus
  const { sentinelRef } = useInfiniteScroll({
    onLoadMore: isPastEvents ? fetchNextPastPage : fetchNextPage,
    hasMore: isPastEvents ? !!hasNextPastPage : !!hasNextPage,
    isLoading: isPastEvents ? isFetchingNextPastPage : isFetchingNextPage,
  });

  // Refetch when RSVP status changes
  useEffect(() => {
    if (isPastEvents) {
      refetchPastEvents();
    } else {
      refetch();
    }
  }, [selectedRsvpStatus, refetch, refetchPastEvents, isPastEvents]);

  const handleViewMoreComments = (eventId: number) => {
    setSelectedEventId(eventId);
    setIsCommentsModalOpen(true);
  };

  // Get user avatar for comments
  const userAvatar = user
    ? "profile_picture" in user && user.profile_picture
      ? getImageUrl(user.profile_picture, avatarImage)
      : "logo" in user && user.logo
        ? getImageUrl(user.logo, avatarImage)
        : avatarImage
    : avatarImage;

  const currentAvatar = getImageUrl(
    isMember(user)
      ? user?.profile_picture
      : isOrganization(user)
      ? user?.logo
      : undefined,
    avatarImage
  );

  // Handle RSVP status change
  const handleRsvpStatusChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedRsvpStatus(event.target.value);
  };

  // Get events from the appropriate infinite query data based on selectedRsvpStatus
  const events = isPastEvents
    ? pastEventsData?.pages.flatMap((page) => page.events || []) || []
    : eventsData?.pages.flatMap((page) => page.events || []) || [];

  // Flatten the pages of comments into a single array
  const comments =
    infiniteCommentsData?.pages?.flatMap(
      (page: CommentsResponse) => page.comments
    ) || [];
  // Get the total number of comments from the first page
  const totalComments = infiniteCommentsData?.pages?.[0]?.total || 0;

  const handleJoinOrganization = (orgId: number) => {
    setSelectedEventId(orgId);
    openConfirmationModal({
      title: "Request to Join",
      message:
        "Do you want to join this group? Once you join, you'll be able to access its content, participate in discussions, and receive updates.",
      confirmButtonText: "Join",
      confirmButtonVariant: "primary",
      onConfirm: async () => {
        try {
          await joinOrganizationMutation.mutateAsync(orgId);
        } catch (error) {
          console.error("Failed to request to join organization:", error);
        }
      },
    });
  };

  const handleCancelJoiningOrganization = (orgId: number) => {
    setSelectedEventId(orgId);
    openConfirmationModal({
      title: "Cancel Join Request",
      message: "Do you want to cancel your request to join this organization?",
      confirmButtonText: "Cancel Request",
      confirmButtonVariant: "primary",
      onConfirm: async () => {
        try {
          await leaveOrganizationMutation.mutateAsync(orgId);
        } catch (error) {
          console.error("Failed to cancel join request:", error);
        }
      },
    });
  };

  const handleLeaveOrganization = (orgId: number) => {
    setSelectedEventId(orgId);
    openConfirmationModal({
      title: "Leave Organization",
      message: "Do you want to leave this organization?",
      confirmButtonText: "Leave",
      confirmButtonVariant: "primary",
      onConfirm: async () => {
        try {
          await leaveOrganizationMutation.mutateAsync(orgId);
        } catch (error) {
          console.error("Failed to leave organization:", error);
        }
      },
    });
  };

  const handleRsvpEvent = (eventId: number) => {
    setSelectedEventId(eventId);
    openConfirmationModal({
      title: "Reserve Your Spot",
      message:
        "Are you sure you want to reserve your spot for this event? You will receive a confirmation once your reservation is completed.",
      confirmButtonText: "Reserve",
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

  const handleDeleteRsvpEvent = (rsvpId: number) => {
    openConfirmationModal({
      title: "Cancel Reservation",
      message:
        "Are you sure you want to cancel your reservation for this event?",
      confirmButtonText: "Cancel Reservation",
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
    <div className="w-full lg:w-3/4 xl:w-1/2 mx-auto p-3 sm:p-4 md:p-6">
      <div className="bg-white w-1/3 flex items-start justify-start p-2 sm:p-3 rounded-full mb-4 sm:mb-6 shadow-sm relative">
        <div className="flex items-center space-x-1 sm:space-x-2 w-full">
          <div className="flex items-center space-x-1 sm:space-x-2 w-full">
            <img
              src={
                selectedRsvpStatus === "joined"
                  ? activeEventLogo
                  : selectedRsvpStatus === "pending"
                  ? pendingEventLogo
                  : selectedRsvpStatus === "rejected"
                  ? rejectedEventLogo
                  : historyEventLogo
              }
              alt="Event Status"
              className={
                selectedRsvpStatus === "rejected"
                  ? "w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 ml-1"
                  : "w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0"
              }
            />
            <select
              className="bg-transparent text-primary font-medium text-responsive-xs text-center focus:outline-none appearance-none pr-8 w-full"
              value={selectedRsvpStatus}
              onChange={handleRsvpStatusChange}
            >
              <option value="joined" className="flex items-center">
                Active Events
              </option>
              <option value="pending" className="flex items-center">
                Pending Events
              </option>
              <option value="rejected" className="flex items-center">
                Rejected Events
              </option>
              <option value="past" className="flex items-center">
                Event History
              </option>
            </select>
          </div>
        </div>
        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
          <img src={dropdownIcon} alt="Dropdown" className="h-7 w-7" />
        </div>
      </div>

      {/* Loading State */}
      {(isPastEvents ? isLoadingPastEvents : isLoading) && <LoadingState message={`Loading ${isPastEvents ? 'past' : ''} events...`} />}

      {/* Error State */}
      {(isPastEvents ? pastEventsError : eventsError) && (
        <ErrorState 
          message={`Failed to load ${isPastEvents ? 'past' : ''} events. Please try again later.`} 
          onRetry={isPastEvents ? refetchPastEvents : refetch}
        />
      )}

      {/* No Events State */}
      {!isPastEvents && !isLoading && !eventsError && events.length === 0 && (
        <div className="text-center py-3 sm:py-4 md:py-6">
          <p className="text-placeholderbg text-responsive-xs">
            No{" "}
            {selectedRsvpStatus === "joined"
              ? "active"
              : selectedRsvpStatus === "pending"
              ? "pending" : selectedRsvpStatus === "rejected" ? "rejected"
              : "past"}{" "}
            events found.
          </p>
        </div>
      )}
      
      {/* No Past Events State */}
      {isPastEvents && !isLoadingPastEvents && !pastEventsError && events.length === 0 && (
        <div className="text-center py-3 sm:py-4 md:py-6">
          <p className="text-placeholderbg text-responsive-xs">
            No past events found.
          </p>
        </div>
      )}

      {/* Events List */}
      {((isPastEvents && !isLoadingPastEvents && !pastEventsError) || (!isPastEvents && !isLoading && !eventsError)) && events && events.length > 0 && (
        <div className="space-y-3 sm:space-y-4 md:space-y-5">
          {events.map((event) => (
            <MemberEvents
              key={event.id}
              event={event}
              status={
                selectedRsvpStatus === "joined"
                  ? "Approved"
                  : selectedRsvpStatus === "pending"
                  ? "Pending" : selectedRsvpStatus === "pending" ? "Rejected"
                  : "Past"
              }
              currentUserAvatar={userAvatar}
              onViewMoreComments={() => {
                handleViewMoreComments(event.id);
              }}
              onJoinOrganization={handleJoinOrganization}
              onCancelJoiningOrganization={handleCancelJoiningOrganization}
              onLeaveOrganization={handleLeaveOrganization}
              onRsvpEvent={handleRsvpEvent}
              onDeleteRsvpEvent={handleDeleteRsvpEvent}
            />
          ))}

          {/* Infinite scroll sentinel element */}
          <div className="w-full my-3 sm:my-4">
            {(isPastEvents ? isFetchingNextPastPage : isFetchingNextPage) && (
              <LoadingState
                message="Loading more events..."
                className="py-3 sm:py-4 text-center text-responsive-xs"
              />
            )}
            {((isPastEvents ? pastEventsError : eventsError) && !(isPastEvents ? isFetchingNextPastPage : isFetchingNextPage)) && (
              <div className="flex flex-col items-center py-3 sm:py-4">
                <ErrorState
                  message="Failed to load more events."
                  className="mb-2 text-center text-responsive-xs"
                />
                <button
                  onClick={isPastEvents ? () => fetchNextPastPage() : handleFetchNextPage}
                  className="px-3 py-1.5 sm:px-4 sm:py-2 bg-primary text-white rounded hover:bg-primary-dark mt-2 text-responsive-xs"
                >
                  Retry
                </button>
              </div>
            )}
            {/* Always render sentinel element but with different heights */}
            <div
              ref={sentinelRef}
              className={`w-full ${
                (isPastEvents ? hasNextPastPage : hasNextPage) ? "h-16 sm:h-20" : "h-2 sm:h-4"
              }`}
              style={{ marginBottom: "16px" }}
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
        eventId={selectedEventId || 0}
        fetchNextPage={fetchNextCommentsPage}
        hasNextPage={hasNextCommentsPage}
        isFetchingNextPage={isFetchingNextCommentsPage}
        totalComments={totalComments}
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
