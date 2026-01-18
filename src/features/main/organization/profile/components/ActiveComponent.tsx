import { useState } from "react";
import { CommentsModal, ConfirmationModal, PostFormModal, EventFormModal } from "@src/shared/components/modals";
import {
  useImageUrl,
  useInfiniteScroll,
  useConfirmationModal,
} from "@src/shared/hooks";
import { useAuthStore } from "@src/shared/store";
import { isMember, isOrganization } from "@src/shared/utils";
import { ProfileAvatar } from "@src/shared/components/ProfileAvatar";
import { useInfiniteMemberPosts } from "@src/features/main/member/profile/model/post.infinite.query";
import { MemberPost } from "@src/features/main/member/profile/components/subcomponents/MemberPost";
import { useDeletePost } from "@src/features/main/member/profile/model/post.mutation";
import { LoadingState, ErrorState } from "@src/shared/components";
import { useInfiniteContentComments } from "@src/features/comments/model/comment.infinite.query";
import { IconDropdown } from "@src/shared/components";
import type { CommentsResponse } from "@src/features/comments/schema/comment.types";

interface ActiveComponentProps {
  accountUuid: string;
  isUserMember?: boolean;
}

export default function ActiveComponent({ accountUuid}: ActiveComponentProps) {
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);
  const [isPostFormModalOpen, setIsPostFormModalOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [postFormMode, setPostFormMode] = useState<"create" | "edit">("create");
  const [isEventFormModalOpen, setIsEventFormModalOpen] = useState(false);
  const [eventFormMode, setEventFormMode] = useState<"create" | "edit">("create");
  const [selectedPostType, setSelectedPostType] = useState<"event" | "post">("post");

  

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


  const {
    data: infinitePostsData,
    isLoading: isLoadingPosts,
    isError: isErrorPosts,
    error: postsError,
    fetchNextPage: fetchNextPostsPage,
    hasNextPage: hasNextPostsPage,
    isFetchingNextPage: isFetchingNextPostsPage,
  } = useInfiniteMemberPosts({ uid: userUuid, limit: 5 });

  // Function to handle loading more posts
  const handleFetchNextPage = () => {
    if (!isFetchingNextPostsPage && hasNextPostsPage) {
      fetchNextPostsPage();
    }
  };

  console.log("infigite data post", infinitePostsData)

  // Setup infinite scroll
  const { sentinelRef: loadMoreRef } = useInfiniteScroll({
    onLoadMore: handleFetchNextPage,
    hasMore: !!hasNextPostsPage,
    isLoading: isFetchingNextPostsPage,
    enabled: !(isLoadingPosts || isErrorPosts),
    rootMargin: "200px",
  });

  const posts = infinitePostsData?.pages.flatMap((page) => page.posts) || [];

  const sortedPosts = posts.sort((a, b) => new Date(b.created_date).getTime() - new Date(a.created_date).getTime());

  const handleViewPostComments = (postId: number) => {
    setSelectedPostId(postId);
    setIsCommentsModalOpen(true);
  };

  const deletePostMutation = useDeletePost();

  const handleDeletePost = (postId: number) => {
    setSelectedPostId(postId);
    openConfirmationModal({
      title: "Delete Post",
      message:
        "This will permanently remove the post and all related details. Proceed?",
      confirmButtonText: "Delete",
      confirmButtonVariant: "primary",
      onConfirm: async () => {
        try {
          await deletePostMutation.mutateAsync(postId);
        } catch (error) {
          console.error("Failed to delete post:", error);
        }
      },
    });
  };

  const handleEditPost = (postId: number) => {
    setPostFormMode("edit");
    setSelectedPostId(postId);
    setIsPostFormModalOpen(true);
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
    postId: selectedPostId || 0,
    limit: 5,
  });

  // Flatten the pages of comments into a single array
  const comments =
    infiniteCommentsData?.pages?.flatMap(
      (page: CommentsResponse) => page.comments
    ) || [];
  // Get the total number of comments from the first page
  const totalComments = infiniteCommentsData?.pages?.[0]?.total || 0;

  const handleOpenCreatePostModal = () => {
    setIsPostFormModalOpen(true);
  };

  const handleOpenCreateEventModal = () => {
    setEventFormMode("create");
    setIsEventFormModalOpen(true);
  };

  const handleCreateActionClick = () => {
    if (selectedPostType === "event") {
      handleOpenCreateEventModal();
    } else {
      handleOpenCreatePostModal();
    }
  };

  const currentAvatar = getImageUrl(
    isMember(user)
      ? user?.profile_picture
      : isOrganization(user)
      ? user?.logo
      : undefined
  );

  return (
    <div className="w-full lg:w-1/2 mx-auto p-8">
      {/* Comment Card - Only shown if it is the own profile */}
      {isOwnProfile && (
        <div className="bg-white rounded-xl h-auto sm:h-[104px] p-4 shadow-sm border border-gray-100 mb-6">
          <div className="flex flex-row items-center space-x-2 sm:space-x-4 h-full">
            {/* Avatar Column */}
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
      {isLoadingPosts && <LoadingState message="Loading posts..." />}

      {/* Error State */}
      {isErrorPosts && (
        <ErrorState
          message={`Failed to load content. ${
            postsError?.message || "Please try again later."
          }`}
        />
      )}

      {/* Empty State */}
      {!isLoadingPosts && !isErrorPosts && sortedPosts.length === 0 && (
        <div className="text-center py-8">
          <p className="text-placeholderbg text-responsive-sm">
            No posts found. Create your first post!
          </p>
        </div>
      )}

      {/* Mixed Content List */}
      {!isLoadingPosts && !isErrorPosts && sortedPosts && sortedPosts.length > 0 && (
          <div className="space-y-6">
            {sortedPosts.map((post) => (
              <MemberPost
                key={`post-${post.id}`}
                post={post}
                currentUserAvatar={currentAvatar}
                onViewMoreComments={() => handleViewPostComments(post.id)}
                onDeletePost={handleDeletePost}
                onEditPost={handleEditPost}
              />
            ))}

            {/* Infinite scroll sentinel element */}
            <div className="w-full my-4">
              {isFetchingNextPostsPage && (
                <LoadingState
                  message="Loading more..."
                  className="py-4 text-center"
                />
              )}
              {isErrorPosts && !isFetchingNextPostsPage && (
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
              <div ref={loadMoreRef} className={`w-full ${hasNextPostsPage ? "h-20" : "h-4"}`} style={{ marginBottom: "20px" }} />
            </div>
          </div>
        )}

  <PostFormModal
    isOpen={isPostFormModalOpen}
    onClose={() => setIsPostFormModalOpen(false)}
    mode={postFormMode}
    postId={selectedPostId || undefined}
  />

  <EventFormModal
    isOpen={isEventFormModalOpen}
    onClose={() => setIsEventFormModalOpen(false)}
    mode={eventFormMode}
    eventId={undefined}
  />

    {/* Comments Modal */}
    <CommentsModal
      isOpen={isCommentsModalOpen}
      onClose={() => setIsCommentsModalOpen(false)}
      comments={comments}
      currentUserAvatar={currentAvatar}
      isLoading={isCommentsLoading}
      error={commentsError}
      postId={selectedPostId || 0}
      fetchNextPage={fetchNextCommentsPage}
      hasNextPage={hasNextCommentsPage}
      isFetchingNextPage={isFetchingNextCommentsPage}
      totalComments={totalComments}
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
