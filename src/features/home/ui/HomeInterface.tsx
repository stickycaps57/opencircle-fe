import {
  useConfirmationModal,
  useImageUrl,
  useInfiniteScroll,
} from "@src/shared/hooks";
import { useAuthStore } from "@src/shared/store";
import { isMember, isOrganization } from "@src/shared/utils";
import { useState } from "react";
import {
  EventFormModal,
  ConfirmationModal,
  PostFormModal,
  CommentsModal,
} from "@src/shared/components/modals";
import {
  useDeleteRsvp,
  useJoinOrganization,
  useRsvpEvent,
} from "../model/home.mutation";
import { useLeaveOrganization } from "@src/features/main/member/organization/model/organization.mutation";
import { useInfiniteRandomEvents } from "@src/features/main/organization/profile/model/event.infinite.query";
import { useDeleteEvent } from "@src/features/main/organization/profile/model/event.mutation";
import { ErrorState, LoadingState, IconDropdown } from "@src/shared/components";
import { ProfileAvatar } from "@src/shared/components/ProfileAvatar";
import { useInfiniteAllMemberPosts } from "@src/features/main/member/profile/model/post.infinite.query";
import { useDeletePost } from "@src/features/main/member/profile/model/post.mutation";
import { PublicEventPost } from "../components/PublicEventPost";
import { PublicMemberPost } from "../components/PublicMemberPost";
import { useInfiniteContentComments } from "@src/features/comments/model/comment.infinite.query";
import type { CommentsResponse } from "@src/features/comments/schema/comment.types";
import type { EventData } from "@src/features/main/organization/profile/schema/event.type";
import type { AllMemberPostData } from "@src/features/main/member/profile/schema/post.types";
import type { ShareItem } from "@src/features/share/schema/share.types";
import { useInfiniteAllShares } from "@src/features/share/model/share.infinite.query";
import { SharedCard } from "@src/features/share/ui/SharedCard";
import type { InfiniteData } from "@tanstack/react-query";

export default function HomeInterface() {
  // State for modals
  const [isEventFormModalOpen, setIsEventFormModalOpen] = useState(false);
  const [isPostFormModalOpen, setIsPostFormModalOpen] = useState(false);
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);
  const [eventFormMode, setEventFormMode] = useState<"create" | "edit">(
    "create"
  );
  const [postFormMode, setPostFormMode] = useState<"create" | "edit">("create");
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [selectedPostType, setSelectedPostType] = useState<"event" | "post">("event");

  // No additional confirmation modal state needed - using useConfirmationModal

  const { user } = useAuthStore();
  const { getImageUrl } = useImageUrl();

  const currentAvatar = getImageUrl(
    isMember(user)
      ? user?.profile_picture
      : isOrganization(user)
      ? user?.logo
      : undefined
  );

  // Initialize mutations
  const deletePostMutation = useDeletePost();
  const deleteEventMutation = useDeleteEvent();
  const joinOrganizationMutation = useJoinOrganization();
  const leaveOrganizationMutation = useLeaveOrganization();
  const rsvpEventMutation = useRsvpEvent();
  const deleteRsvpMutation = useDeleteRsvp();

  const {
    isConfirmModalOpen,
    modalConfig,
    openConfirmationModal,
    closeConfirmationModal,
  } = useConfirmationModal();

  // Fetch random events with infinite scrolling
  const {
    data: randomEventsData,
    isLoading: isLoadingEvents,
    isError: isErrorEvents,
    error: eventsError,
    fetchNextPage: fetchNextEventsPage,
    hasNextPage: hasNextEventsPage,
    isFetchingNextPage: isFetchingNextEventsPage,
  } = useInfiniteRandomEvents();

  // Fetch all member posts with infinite scrolling
  const {
    data: postsData,
    isLoading: isLoadingPosts,
    isError: isErrorPosts,
    error: postsError,
    fetchNextPage: fetchNextPostsPage,
    hasNextPage: hasNextPostsPage,
    isFetchingNextPage: isFetchingNextPostsPage,
  } = useInfiniteAllMemberPosts();

  const {
    data: sharesData,
    isLoading: isLoadingShares,
    isError: isErrorShares,
    error: sharesError,
    fetchNextPage: fetchNextSharesPage,
    hasNextPage: hasNextSharesPage,
    isFetchingNextPage: isFetchingNextSharesPage,
  } = useInfiniteAllShares();

  // Determine if we should load more content (either events or posts)
  const hasMoreContent = !!hasNextEventsPage || !!hasNextPostsPage || !!hasNextSharesPage;
  const isLoadingMoreContent =
    isFetchingNextEventsPage || isFetchingNextPostsPage || isFetchingNextSharesPage;
  const isLoading = isLoadingEvents || isLoadingPosts || isLoadingShares;
  const isError = isErrorEvents || isErrorPosts || isErrorShares;

  // Set up infinite scrolling
  const { sentinelRef } = useInfiniteScroll({
    onLoadMore: () => {
      // Load both events and posts if available
      if (hasNextEventsPage && !isFetchingNextEventsPage) {
        fetchNextEventsPage();
      }
      if (hasNextPostsPage && !isFetchingNextPostsPage) {
        fetchNextPostsPage();
      }
      if (hasNextSharesPage && !isFetchingNextSharesPage) {
        fetchNextSharesPage();
      }
    },
    hasMore: hasMoreContent,
    isLoading: isLoadingMoreContent,
    enabled: !isLoading && !isError,
    rootMargin: "200px",
  });

  // Function to handle fetching next page for events
  const handleFetchNextEventsPage = () => {
    if (!isFetchingNextEventsPage && hasNextEventsPage) {
      void fetchNextEventsPage();
    }
  };

  // Function to handle fetching next page for posts
  const handleFetchNextPostsPage = () => {
    if (!isFetchingNextPostsPage && hasNextPostsPage) {
      void fetchNextPostsPage();
    }
  };

  // Function to handle fetching next page for both
  const handleFetchNextPage = () => {
    handleFetchNextEventsPage();
    handleFetchNextPostsPage();
  };

  // Flatten the events data from all pages
  const events =
    randomEventsData?.pages.flatMap((page) => page.random_events) || [];

  // Flatten the posts data from all pages
  const posts = postsData?.pages.flatMap((page) => page.posts) || [];

  const sharesInfinite = sharesData as InfiniteData<{ shares: ShareItem[] }> | undefined;
  const shares: ShareItem[] = sharesInfinite?.pages?.flatMap((page) => page.shares) || [];

  // Define union type for combined content items
  type CombinedContentItem =
    | { type: "event"; data: EventData; date: Date }
    | { type: "post"; data: AllMemberPostData; date: Date }
    | { type: "share"; data: ShareItem; date: Date };

  // Combine and shuffle events and posts for display
  const combinedContent: CombinedContentItem[] = [
    ...events.map((event) => ({
      type: "event" as const,
      data: event,
      date: new Date(event.created_date),
    })),
    ...posts.map((post) => ({
      type: "post" as const,
      data: post,
      date: new Date(post.created_date),
    })),
    ...shares.map((share) => ({
      type: "share" as const,
      data: share,
      date: new Date(share.date_created),
    })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime()); // Sort by date, newest first

  const handleOpenCreateEventModal = () => {
    setSelectedEventId(null);
    setEventFormMode("create");
    setIsEventFormModalOpen(true);
  };

  // Open post creation modal
  const handleOpenCreatePostModal = () => {
    setSelectedPostId(null);
    setPostFormMode("create");
    setIsPostFormModalOpen(true);
  };

  const handleCreateActionClick = () => {
    if (selectedPostType === "event") {
      handleOpenCreateEventModal();
    } else {
      handleOpenCreatePostModal();
    }
  };

  // Edit event
  const handleEditEvent = (eventId: number) => {
    setSelectedEventId(eventId);
    setEventFormMode("edit");
    setIsEventFormModalOpen(true);
  };

  // Delete event
  const handleDeleteEvent = (eventId: number) => {
    setSelectedEventId(eventId);
    openConfirmationModal({
      title: "Delete Event",
      message:
        "This will permanently remove the event and all related details. Proceed?",
      confirmButtonText: "Delete",
      confirmButtonVariant: "primary",
      onConfirm: async () => {
        try {
          await deleteEventMutation.mutateAsync(eventId);
        } catch {
          // Error handled by mutation
        }
      },
    });
  };

  // Fetch comments for the selected content with infinite scrolling
  const {
    data: infiniteCommentsData,
    isLoading: isCommentsLoading,
    error: commentsError,
    fetchNextPage: fetchNextCommentsPage,
    hasNextPage: hasNextCommentsPage,
    isFetchingNextPage: isFetchingNextCommentsPage,
  } = useInfiniteContentComments({
    postId: selectedPostId || 0,
    eventId: selectedEventId || 0,
    limit: 5,
  });

  // Flatten the pages of comments into a single array
  const comments =
    infiniteCommentsData?.pages?.flatMap(
      (page: CommentsResponse) => page.comments
    ) || [];
  // Get the total number of comments from the first page
  const totalComments = infiniteCommentsData?.pages?.[0]?.total || 0;

  const handleViewEventComments = (eventId: number) => {
    setSelectedEventId(eventId);
    setSelectedPostId(null);
    setIsCommentsModalOpen(true);
  };

  const handleViewPostComments = (postId: number) => {
    setSelectedPostId(postId);
    setSelectedEventId(null);
    setIsCommentsModalOpen(true);
  };

  // Edit post
  const handleEditPost = (postId: number) => {
    setPostFormMode("edit");
    setSelectedPostId(postId);
    setIsPostFormModalOpen(true);
  };

  // Delete post
  const handleDeletePost = (postId: number) => {
    setSelectedPostId(postId);
    openConfirmationModal({
      title: "Delete post",
      message:
        "This will permanently remove the post and all related details. Proceed?",
      confirmButtonText: "Delete",
      confirmButtonVariant: "primary",
      onConfirm: async () => {
        try {
          await deletePostMutation.mutateAsync(postId);
        } catch {
          // Error handled by mutation
        }
      },
    });
  };

  const handleJoinOrganization = (orgId: number) => {
    setSelectedPostId(orgId);
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
    setSelectedPostId(orgId);
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
    setSelectedPostId(orgId);
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

  // RSVP for event
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
        } catch {
          // Error handled by mutation
        }
      },
    });
  };

  // Cancel event reservation
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
        } catch {
          // Error handled by mutation
        }
      },
    });
  };

  return (
    <div className="w-full lg:w-1/2 mx-auto p-8">
      {isOrganization(user) ? (
        <div className="bg-white rounded-xl h-auto sm:h-[104px] p-4 shadow-sm border border-gray-100 mb-6">
          <div className="flex flex-row items-center space-x-2 sm:space-x-4 h-full">
            <div className="flex-shrink-0">
              <ProfileAvatar
                src={currentAvatar}
                alt="User Avatar"
                className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14"
                type="organization"
                isOwner={false}
                organizationId={user?.id}
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
      ) : (
        <div className="bg-white rounded-xl h-[90px] sm:h-[104px] p-3 sm:p-4 shadow-sm border border-gray-100 mb-4 sm:mb-6">
          <div className="flex flex-row items-center space-x-2 sm:space-x-4 h-full">
            {/* Avatar Column */}
            <div className="flex-shrink-0">
              <img
                src={currentAvatar}
                alt="User Avatar"
                className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full object-cover"
              />
            </div>

            {/* Input Column */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="What's on your mind..."
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-athens_gray border border-transparent rounded-full text-responsive-xs cursor-pointer"
                onClick={handleOpenCreatePostModal}
                readOnly
              />
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {(isLoadingEvents || isLoadingPosts) &&
        !isFetchingNextEventsPage &&
        !isFetchingNextPostsPage && (
          <LoadingState message="Loading content..." />
        )}

      {/* Error State */}
      {(isErrorEvents || isErrorPosts || isErrorShares) && (
        <ErrorState
        message={`Failed to load content. ${
            (eventsError || postsError || sharesError)?.message || "Please try again later."
          }`}
        />
      )}

      {/* No Content */}
      {!isLoadingEvents &&
        !isLoadingPosts &&
        !isLoadingShares &&
        !isErrorEvents &&
        !isErrorPosts &&
        !isErrorShares &&
        events.length === 0 &&
        posts.length === 0 &&
        shares.length === 0 && (
          <div className="text-center py-8">
            <p className="text-placeholderbg text-responsive-xs">
              No content found. Create your first event or post!
            </p>
          </div>
        )}

      {/* Content Feed - Events and Posts */}
      {!isLoadingEvents &&
        !isLoadingPosts &&
        !isLoadingShares &&
        !isErrorEvents &&
        !isErrorPosts &&
        !isErrorShares &&
        (events.length > 0 || posts.length > 0 || shares.length > 0) && (
          <div className="space-y-6">
            {/* Combined and chronologically sorted content */}
            {combinedContent.map((item) => {
              if (item.type === "event") {
                const event = item.data;
                return (
                  <PublicEventPost
                    key={`event-${event.id}`}
                    event={event}
                    currentUserAvatar={currentAvatar}
                    userRole={isMember(user) ? "member" : "organization"}
                    onViewMoreComments={handleViewEventComments}
                    onEdit={() => handleEditEvent(event.id)}
                    onDelete={() => handleDeleteEvent(event.id)}
                    onJoinOrganization={handleJoinOrganization}
                    onCancelJoiningOrganization={
                      handleCancelJoiningOrganization
                    }
                    onLeaveOrganization={handleLeaveOrganization}
                    onRsvpEvent={handleRsvpEvent}
                    onDeleteRsvpEvent={handleDeleteRsvpEvent}
                  />
                );
              } else if (item.type === "post") {
                const post = item.data;
                return (
                  <PublicMemberPost
                    key={`post-${post.id}`}
                    post={post}
                    currentUserAvatar={currentAvatar}
                    onViewMoreComments={() => handleViewPostComments(post.id)}
                    onDeletePost={() => handleDeletePost(post.id)}
                    onEditPost={() => handleEditPost(post.id)}
                  />
                );
              } else if (item.type === "share") {
                const share = item.data;
                return <SharedCard key={`share-${share.shared_id}`} share={share} />;
              }
            })}

            {/* Infinite scroll sentinel element */}
            <div className="w-full my-4">
              {/* Loading indicator for next page */}
              {(isFetchingNextEventsPage || isFetchingNextPostsPage || isFetchingNextSharesPage) && (
                <LoadingState
                  message="Loading more content..."
                  className="py-4 text-center"
                />
              )}

              {/* Error state for next page */}
              {(isErrorEvents || isErrorPosts || isErrorShares) &&
                !isFetchingNextEventsPage &&
                !isFetchingNextPostsPage &&
                !isFetchingNextSharesPage && (
                  <div className="flex flex-col items-center py-4">
                    <ErrorState
                      message="Failed to load more content."
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
                ref={sentinelRef}
                className={`w-full ${hasMoreContent ? "h-20" : "h-4"}`}
                style={{ marginBottom: "20px" }}
              />
            </div>
          </div>
        )}

      {/* Event Form Modal */}
      <EventFormModal
        isOpen={isEventFormModalOpen}
        onClose={() => setIsEventFormModalOpen(false)}
        mode={eventFormMode}
        eventId={selectedEventId || undefined}
      />

      {/* Post Form Modal */}
      <PostFormModal
        isOpen={isPostFormModalOpen}
        onClose={() => setIsPostFormModalOpen(false)}
        mode={postFormMode}
        postId={selectedPostId || undefined}
      />

      {/* Confirmation Modal for Delete - Handled by useConfirmationModal */}

      {/* Confirmation Modal for Join Organization */}
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

      {/* Confirmation Modal for RSVP - Handled by useConfirmationModal */}

      {/* Comments Modal */}
      <CommentsModal
        isOpen={isCommentsModalOpen}
        onClose={() => setIsCommentsModalOpen(false)}
        comments={comments}
        currentUserAvatar={currentAvatar}
        isLoading={isCommentsLoading}
        error={commentsError}
        postId={selectedPostId || undefined}
        eventId={selectedEventId || undefined}
        fetchNextPage={fetchNextCommentsPage}
        hasNextPage={hasNextCommentsPage}
        isFetchingNextPage={isFetchingNextCommentsPage}
        totalComments={totalComments}
      />
    </div>
  );
}
