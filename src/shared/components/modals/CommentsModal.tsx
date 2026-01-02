import { ProfileAvatar } from "@src/shared/components/ProfileAvatar";
import { useEffect, useState, useRef, useMemo } from "react";
import type { DefaultComment } from "@src/features/comments/schema/comment.types";
import type { KeyboardEvent } from "react";
import { Modal } from "../Modal";
import {
  useFormatDate,
  useImageUrl,
  useInfiniteScroll,
  checkOwnership,
} from "@src/shared/hooks";
import { LoadingState, ErrorState } from "@src/shared/components";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  postCommentSchema,
  type PostCommentFormData,
} from "@src/features/comments/schema/comment.schema";
import {
  usePostComment,
  useDeleteComment,
  useEditComment,
} from "@src/features/comments/model/comment.mutation";
import { DropdownMenu } from "@src/shared/components/DropdownMenu";

interface CommentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  comments: DefaultComment[];
  isLoading: boolean;
  error: Error | null;
  currentUserAvatar?: string;
  onPostComment?: (content: string) => void;

  fetchNextPage?: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  totalComments?: number;
  postId?: number;
  eventId?: number;
}

export function CommentsModal({
  isOpen,
  isLoading,
  error: propError,
  onClose,
  comments,
  currentUserAvatar = "https://placehold.co/40x40/29465b/ffffff?text=U",

  fetchNextPage,
  hasNextPage = false,
  isFetchingNextPage = false,
  totalComments = 0,
  postId,
  eventId,
}: CommentsModalProps) {
  const [error, setError] = useState<string>("");
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingCommentText, setEditingCommentText] = useState("");
  const editInputRef = useRef<HTMLInputElement>(null);
  const postCommentMutation = usePostComment();
  const deleteCommentMutation = useDeleteComment();
  const editCommentMutation = useEditComment();
  const { formatRelativeTime } = useFormatDate();

  const sortedComments = useMemo(() => {
    return [...comments].sort(
      (a, b) => new Date(b.last_modified_date).getTime() - new Date(a.last_modified_date).getTime()
    );
  }, [comments]);

  const handleEditComment = (comment: DefaultComment) => {
    setEditingCommentId(comment.id);
    setEditingCommentText(comment.message);
  };

  const handleDeleteComment = (commentId: number) => {
    deleteCommentMutation.mutate(commentId);
  };

  const saveEditedComment = async () => {
    if (editingCommentId && editingCommentText.trim()) {
      try {
        const editData = {
          comment_id: editingCommentId,
          message: editingCommentText,
        };

        await editCommentMutation.mutateAsync(editData);
        setEditingCommentId(null);
        setEditingCommentText("");
      } catch (error) {
        setError(String(error));
      }
    }
  };

  const cancelEditing = () => {
    setEditingCommentId(null);
  };

  const handleEditKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      saveEditedComment();
    } else if (e.key === "Escape") {
      cancelEditing();
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<PostCommentFormData>({
    resolver: zodResolver(postCommentSchema),
    defaultValues: {
      // Set either post_id or event_id based on which one is provided
      ...(postId && postId > 0 ? { post_id: postId } : {}),
      ...(eventId && eventId > 0 ? { event_id: eventId } : {}),
      message: "",
    },
  });

  // Update post_id or event_id value when props change
  useEffect(() => {
    if (postId && postId > 0) {
      setValue("post_id", postId);
      // Clear event_id if post_id is set
      setValue("event_id", undefined);
    } else if (eventId && eventId > 0) {
      setValue("event_id", eventId);
      // Clear post_id if event_id is set
      setValue("post_id", undefined);
    }
  }, [postId, eventId, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    setError("");

    if ((!postId || postId <= 0) && (!eventId || eventId <= 0)) {
      setError("Cannot post comment: Invalid content ID");
      return;
    }

    try {
      await postCommentMutation.mutateAsync(data);

      reset({
        ...(postId && postId > 0 ? { post_id: postId } : {}),
        ...(eventId && eventId > 0 ? { event_id: eventId } : {}),
        message: "",
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(String(error)); // fallback in case it's not an Error object
      }
    }
  });

  const { getImageUrl } = useImageUrl();

  // Set up infinite scroll
  const { sentinelRef } = useInfiniteScroll({
    onLoadMore: () => fetchNextPage?.(),
    hasMore: !!hasNextPage,
    isLoading: isFetchingNextPage,
    enabled: isOpen, // Only enable when modal is open
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <div></div>
        <h2 className="text-responsive-base font-bold text-primary">
          Comments ({totalComments})
        </h2>
        <button
          onClick={onClose}
          className="text-placeholderbg hover:text-primary transition-colors text-responsive-xs"
        >
          Close
        </button>
      </div>

      <div className="flex flex-col h-full max-h-[calc(85vh-120px)]">
        {/* Scrollable Comments List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 max-h-[calc(85vh-240px)]">
          {isLoading && !isFetchingNextPage && (
            <LoadingState message="Loading comments..." />
          )}

          {propError && !isFetchingNextPage && (
            <ErrorState message="Failed to load comments. Please try again later." />
          )}

          {!isLoading && !error && comments.length > 0 ? (
            <>
              {sortedComments.map((comment) => (
                <div key={comment.id} className="">
                  <div className="bg-athens_gray p-4 rounded-xl flex justify-between items-start">
                    <div className="flex space-x-3 flex-1">
                      <ProfileAvatar
                        src={getImageUrl(
                          comment.role === "user"
                            ? comment?.profile_picture
                            : comment.role === "organization"
                            ? comment?.organization_logo
                            : undefined
                        )}
                        alt={`${comment.author} avatar`}
                        className="w-12 h-12"
                        type={comment.role === "organization" ? "organization" : "member"}
                        isOwner={false}
                        memberUuid={comment.role === "user" ? comment.account_uuid : undefined}
                        organizationId={comment.role === "organization" ? Number(comment.author) : undefined}
                        name={
                          comment.role === "member"
                            ? `${comment.user_first_name} ${comment.user_last_name}`
                            : comment.role === "organization"
                            ? comment.organization_name
                            : `${comment.user_first_name} ${comment.user_last_name}`
                        }
                        nameClassName="text-primary font-medium text-responsive-xs mb-2 block"
                        containerClassName="flex items-start gap-3 w-full"
                      >
                        {editingCommentId === comment.id ? (
                          <div className="relative w-full">
                            <input
                              ref={editInputRef}
                              type="text"
                              value={editingCommentText}
                              onChange={(e) =>
                                setEditingCommentText(e.target.value)
                              }
                              onKeyDown={handleEditKeyPress}
                              onBlur={cancelEditing}
                              className="w-full px-2 sm:px-3 py-1 sm:py-2 bg-white border border-primary rounded-full text-primary text-responsive-xs"
                              autoFocus
                            />
                            <div className="absolute right-2 top-1 sm:top-2 text-responsive-xs text-primary-75">
                              Press Enter to save
                            </div>
                          </div>
                        ) : (
                          <p className="text-primary text-responsive-xs leading-relaxed">
                            {comment.message}
                          </p>
                        )}
                      </ProfileAvatar>
                    </div>
                    {checkOwnership({
                      type: "comment",
                      accountId: comment.author,
                    }) && (
                      <DropdownMenu
                        onEdit={() => handleEditComment(comment)}
                        onDelete={() => handleDeleteComment(comment.id)}
                        className="ml-2"
                        editLabel="Edit Comment"
                        deleteLabel="Delete Comment"
                      />
                    )}
                  </div>
                  <p className="text-placeholderbg text-responsive-xxs mt-2 ml-4">
                    {formatRelativeTime(comment.created_date)}
                  </p>
                </div>
              ))}

              {/* Infinite scroll sentinel element */}
              {hasNextPage && (
                <div ref={sentinelRef} className="h-4 w-full">
                  {isFetchingNextPage && (
                    <LoadingState
                      message="Loading more comments..."
                      className="py-4 text-center"
                    />
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-placeholderbg text-responsive-xs">
                No comments yet. Be the first to comment!
              </p>
            </div>
          )}
        </div>

        {/* Fixed Post Comment Form at Bottom */}
        <div className="border-t border-gray-200 p-6 bg-white">
          <form onSubmit={onSubmit} className="flex flex-col">
            <div className="flex space-x-3 items-center">
              <img
                src={currentUserAvatar}
                alt="Your Avatar"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-grow">
                <input
                  type="text"
                  placeholder="Post a comment... (Press Enter to submit)"
                  {...register("message")}
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 bg-athens_gray border ${
                    errors.message ? "border-red-500" : "border-transparent"
                  } rounded-full text-responsive-xs focus:outline-none focus:ring-2 focus:ring-primary`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      onSubmit();
                    }
                  }}
                />
              </div>
            </div>
            <div className="mt-1 ml-13">
              {errors.message && (
                <p className="text-red-500 text-responsive-xxs ml-10">
                  {errors.message.message}
                </p>
              )}
              {error && (
                <p className="text-red-500 text-responsive-xxs ml-10">
                  {error}
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
}
