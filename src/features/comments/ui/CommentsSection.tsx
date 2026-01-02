import { useState } from "react";
// import type { KeyboardEvent } from "react";
import type {
  CommentsSectionProps,
  // ContentComment,
} from "../schema/comment.types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  postCommentSchema,
  type PostCommentFormData,
  // type EditCommentFormData,
} from "../schema/comment.schema";
import {
  usePostComment,
  // useDeleteComment,
  // useEditComment,
} from "../model/comment.mutation";
// import { useImageUrl, checkOwnership, useFormatDate } from "@src/shared/hooks";
import avatarImage from "@src/assets/shared/avatar.png";
import { PrimaryButton } from "@src/shared/components/PrimaryButton";
import { ShareFormModal } from "@src/shared/components/modals/ShareFormModal";
import { ShareListModal } from "@src/shared/components/modals/ShareListModal";
import { EventParticipantsModal } from "@src/shared/components/modals/EventParticipantsModal";
import { useInfiniteSharesByContent } from "@src/features/share/model/share.infinite.query";
import type { InfiniteData } from "@tanstack/react-query";
import type { ShareByContentResponse } from "@src/features/share/schema/share.types";
import { useAuthStore } from "@src/shared/store/auth";
import { isMember } from "@src/shared/utils";
import commentIcon from "@src/assets/shared/comment_icon.png"
import participantsIcon from "@src/assets/shared/participant_icon.png"
import shareIcon from "@src/assets/shared/share_icon.png"

// import { DropdownMenu } from "@src/shared/components/DropdownMenu";


export function CommentsSection({
  // comments = [],
  totalComments = 0,
  currentUserAvatar = avatarImage,
  onViewMoreComments,
  contentId,
  contentType = "post", // Default to post for backward compatibility
  participantsCount,
  // sharesCount,
}: CommentsSectionProps) {
  const [error, setError] = useState("");
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isShareListOpen, setIsShareListOpen] = useState(false);
  const [isParticipantsModalOpen, setIsParticipantsModalOpen] = useState(false);
  const { user } = useAuthStore();
  const isUserMember = isMember(user);
  // const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  // const [editingCommentText, setEditingCommentText] = useState("");
  // const editInputRef = useRef<HTMLInputElement>(null);
  // const displayedComments = comments.slice(0, 3);
  const hasMoreComments = totalComments > 0;
  const hasParticipants = typeof participantsCount === "number" && participantsCount > 0;
  const contentTypeNum = contentType === "post" ? 1 : 2;
  const { data: sharesData } = useInfiniteSharesByContent({ content_type: contentTypeNum, content_id: contentId, limit: 10 });
  const sharesInfinite = sharesData as InfiniteData<ShareByContentResponse> | undefined;
  const sharesTotal = sharesInfinite?.pages?.[0]?.pagination?.total || 0;
  const hasShares = sharesTotal > 0;
  const postCommentMutation = usePostComment();
  // const deleteCommentMutation = useDeleteComment();
  // const editCommentMutation = useEditComment();
  // const { formatRelativeTime } = useFormatDate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PostCommentFormData>({
    resolver: zodResolver(postCommentSchema),
    defaultValues: {
      ...(contentType === "post"
        ? { post_id: contentId }
        : { event_id: contentId }),
      message: "",
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    setError("");

    try {
      await postCommentMutation.mutateAsync(data);
      reset({
        ...(contentType === "post"
          ? { post_id: contentId }
          : { event_id: contentId }),
        message: "",
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(String(error));
      }
    }
  });

  // const { getImageUrl } = useImageUrl();

  // const handleEditComment = (comment: ContentComment) => {
  //   setEditingCommentId(comment.comment_id);
  //   setEditingCommentText(comment.message);
  //   setTimeout(() => {
  //     if (editInputRef.current) {
  //       editInputRef.current.focus();
  //     }
  //   }, 0);
  // };

  // const saveEditedComment = async () => {
  //   if (!editingCommentId) return;

  //   try {
  //     const editData: EditCommentFormData = {
  //       comment_id: editingCommentId,
  //       message: editingCommentText,
  //     };

  //     await editCommentMutation.mutateAsync(editData);
  //     setEditingCommentId(null);
  //     setEditingCommentText("");
  //   } catch (error) {
  //     setError(String(error));
  //   }
  // };

  // const handleEditKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
  //   if (e.key === "Enter") {
  //     e.preventDefault();
  //     saveEditedComment();
  //   } else if (e.key === "Escape") {
  //     setEditingCommentId(null);
  //     setEditingCommentText("");
  //   }
  // };

  // const cancelEditing = () => {
  //   setEditingCommentId(null);
  //   setEditingCommentText("");
  // };

  // const handleDeleteComment = async (commentId: number) => {
  //   try {
  //     await deleteCommentMutation.mutateAsync(commentId);
  //   } catch (error) {
  //     setError(String(error));
  //   }
  // };

  return (
    <div className="w-full max-w-full px-2 sm:px-3 md:px-4 mt-4">
      <div className="flex justify-end items-center space-x-4 mb-2 sm:mb-3 md:mb-4">
        {hasMoreComments && (
          <button
            onClick={onViewMoreComments}
            className="text-primary text-responsive-xs hover:underline transition-all duration-200 flex items-center"
          >
            <span className="hidden sm:inline">
              {totalComments} comments
            </span>
            <span className="sm:hidden">
              {totalComments} comments
            </span>
          </button>
        )}
        {contentType === "event" && hasParticipants && (
          <button
            onClick={() => setIsParticipantsModalOpen(true)}
            className="text-primary text-responsive-xs hover:underline transition-all duration-200 flex items-center"
          >
            {participantsCount} participants
          </button>
        )}
        {hasShares && (
          <button
            onClick={() => setIsShareListOpen(true)}
            className="text-primary text-responsive-xs hover:underline transition-all duration-200 flex items-center"
          >
            {sharesTotal} shares
          </button>
        )}
      </div>
      {contentType === "event" ? (
        <div className={`flex justify-around items-center mb-2 sm:mb-3 md:mb-4`}>
          <div className="flex items-center space-x-2">
            <img src={commentIcon} alt="Comments" className="w-4 h-4" />
            <h4 className="text-responsive-xs font-semibold text-primary">Comments</h4>
          </div>
          <div className="flex items-center space-x-2">
            <img src={participantsIcon} alt="Participants" className="w-4 h-4" />
            <PrimaryButton label="Participants" variant="shareButton" onClick={() => setIsParticipantsModalOpen(true)} />
            {hasParticipants && !isUserMember && (
              <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-secondary text-white text-responsive-xxs">{participantsCount}</span>
            )}
          </div>
          {isUserMember && (
            <div className="flex items-center space-x-2">
              <img src={shareIcon} alt="Share" className="w-4 h-4" />
              <PrimaryButton label="Share" variant="shareButton" onClick={() => setIsShareModalOpen(true)} />
            </div>
          )}
        </div>
      ) : (
        <div className="flex justify-around items-center mb-2 sm:mb-3 md:mb-4">
          <div className="flex items-center space-x-2">
            <img src={commentIcon} alt="Comments" className="w-4 h-4" />
            <h4 className="text-responsive-xs font-semibold text-primary">Comments</h4>
          </div>
          <div></div>
          <div className="flex items-center space-x-2">
            <img src={shareIcon} alt="Share" className="w-4 h-4" />
            <PrimaryButton label="Share" variant="shareButton" onClick={() => setIsShareModalOpen(true)} />
          </div>
        </div>
      )}
      <hr className="my-4 text-gainsboro" />

      {/* Latest Comment Item */}
      {/* <div className="space-y-2 sm:space-y-3 md:space-y-4 mb-2 sm:mb-3 md:mb-4">
        {displayedComments.length > 0 ? (
          displayedComments.map((comment) => (
            <div key={comment.comment_id} className="w-full">
              <div className="bg-athens_gray p-2 sm:p-3 rounded-lg sm:rounded-xl flex justify-between items-start sm:items-center">
                <div className="flex space-x-2 sm:space-x-3 flex-1">
                  {comment.user && Object.keys(comment.user).length > 0 ? (
                    <img
                      src={getImageUrl(
                        comment.user.profile_picture,
                        avatarImage
                      )}
                      alt={`${comment.user.first_name} ${comment.user.last_name} avatar`}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                      onError={(e) => (e.currentTarget.src = avatarImage)}
                    />
                  ) : comment.organization &&
                    Object.keys(comment.organization).length > 0 ? (
                    <img
                      src={getImageUrl(comment.organization.logo)}
                      alt={`${comment.organization.name} logo`}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                      onError={(e) => (e.currentTarget.src = avatarImage)}
                    />
                  ) : (
                    <img
                      src={avatarImage}
                      alt="Default avatar"
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-primary font-medium text-responsive-xxs mb-1">
                      {comment.user && Object.keys(comment.user).length > 0
                        ? `${comment.user.first_name} ${comment.user.last_name}`
                        : comment.organization &&
                          Object.keys(comment.organization).length > 0
                        ? comment.organization.name
                        : "Unknown"}
                    </p>
                    {editingCommentId === comment.comment_id ? (
                      <div className="relative">
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
                      <p className="text-primary text-responsive-xs line-clamp-3">
                        {comment.message}
                      </p>
                    )}
                  </div>
                </div>
                {checkOwnership({
                  type: "comment",
                  accountId: comment.account.id,
                }) && (
                  <DropdownMenu
                    onEdit={() => handleEditComment(comment)}
                    onDelete={() => handleDeleteComment(comment.comment_id)}
                    className="ml-2"
                    editLabel="Edit Comment"
                    deleteLabel="Delete Comment"
                  />
                )}
              </div>
              <p className="text-placeholderbg text-responsive-xxs mt-1 ml-2 sm:ml-3">
                {formatRelativeTime(comment.created_date)}
              </p>
            </div>
          ))
        ) : (
          <p className="text-placeholderbg text-responsive-sm text-center py-2 sm:py-3 md:py-4">
            No comments yet. Be the first to comment!
          </p>
        )}
      </div> */}

      {/* Post Comment Form */}
      <form onSubmit={onSubmit} className="flex flex-col py-2 sm:py-3 md:py-4">
        <div className="flex space-x-2 sm:space-x-3 items-center">
          <img
            src={currentUserAvatar}
            alt="Your Avatar"
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
          />
          <div className="flex-grow">
            <input
              type="text"
              placeholder="Enter a comment"
              {...register("message")}
              className={`w-full px-3 sm:px-4 py-2 sm:py-3 bg-athens_gray border ${
                errors.message ? "border-red-500" : "border-transparent"
              } rounded-full text-responsive-xs`}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  onSubmit();
                }
              }}
            />
          </div>
        </div>
        <div className="mt-1 ml-10 sm:ml-13">
          {errors.message && (
            <p className="text-red-500 text-responsive-xs ml-8 sm:ml-10">
              {errors.message.message}
            </p>
          )}
          {error && (
            <p className="text-red-500 text-responsive-xs ml-8 sm:ml-10">
              {error}
            </p>
          )}
        </div>
      </form>
      <ShareFormModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        contentId={contentId}
        contentType={contentType}
      />
      <ShareListModal
        isOpen={isShareListOpen}
        onClose={() => setIsShareListOpen(false)}
        contentId={contentId}
        contentType={contentType}
      />
      {contentType === "event" && (
        <EventParticipantsModal
          isOpen={isParticipantsModalOpen}
          onClose={() => setIsParticipantsModalOpen(false)}
          eventId={contentId}
          initialTab="members"
          isUserMember={isUserMember}
        />
      )}
    </div>
  );
}
