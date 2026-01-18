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
  participantPendingCount,
  // sharesCount,
}: CommentsSectionProps) {
  const [error, setError] = useState("");
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isShareListOpen, setIsShareListOpen] = useState(false);
  const [isParticipantsModalOpen, setIsParticipantsModalOpen] = useState(false);
  const { user } = useAuthStore();
  const isUserMember = isMember(user);
  const hasMoreComments = totalComments > 0;
  const hasParticipants = typeof participantsCount === "number" && participantsCount > 0;
  const hasPendingRscvp = typeof participantPendingCount === "number" && participantPendingCount > 0;
  const contentTypeNum = contentType === "post" ? 1 : 2;
  const { data: sharesData } = useInfiniteSharesByContent({ content_type: contentTypeNum, content_id: contentId, limit: 10 });
  const sharesInfinite = sharesData as InfiniteData<ShareByContentResponse> | undefined;
  const sharesTotal = sharesInfinite?.pages?.[0]?.pagination?.total || 0;
  const hasShares = sharesTotal > 0;
  const postCommentMutation = usePostComment();

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
            {hasPendingRscvp && !isUserMember && (
              <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-secondary text-white text-responsive-xxs">{participantPendingCount}</span>
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
