// import { CommentsSection } from "@src/shared/components/CommentsSection";
import { DropdownMenu } from "@src/shared/components/DropdownMenu";
import { useImageUrl, useFormatDate, checkOwnership } from "@src/shared/hooks";
import { useLightbox } from "@src/shared/hooks/useLightbox";
import { type PostData } from "@src/features/main/member/profile/schema/post.types";
import { ProfileAvatar } from "@src/shared/components/ProfileAvatar";
import { CommentsSection } from "@src/shared/components";

interface MemberPostProps {
  post: PostData;
  currentUserAvatar: string;
  onViewMoreComments?: () => void;
  onDeletePost?: (postId: number) => void;
  onEditPost?: (postId: number) => void;
}

export const MemberPost = ({
  post,
  onViewMoreComments,
  currentUserAvatar,
  onDeletePost,
  onEditPost,
}: MemberPostProps) => {
  const { getImageUrl } = useImageUrl();
  const { formatRelativeTime } = useFormatDate();
  const { openLightbox, LightboxViewer } = useLightbox();
  const isOwner =
    checkOwnership({ type: "post", ownerId: post.author.id }) ||
    checkOwnership({ type: "event", ownerId: post.author.id });

  const imageUrls = (post.images || []).map((img) =>
    getImageUrl(img)
  );

  const authorImageUrl = getImageUrl(
    post.author?.profile_picture ?? post.author?.logo
  );

  const handleEdit = () => {
    onEditPost?.(post.id);
  };

  const handleDelete = () => {
    onDeletePost?.(post.id);
  };

  const handleViewMoreComments = () => {
    onViewMoreComments?.();
  };

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 w-full">
      {/* 1. Header with Avatar, Name, Time and 3-dot menu */}
      <div className="flex flex-row items-start justify-between mb-4">
        <div className="flex flex-row items-center space-x-2 sm:space-x-3">
          <ProfileAvatar
            src={authorImageUrl}
            alt="Post Author"
            className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14"
            type={post.author.organization_name ? "organization" : "member"}
            isOwner={isOwner}
            memberUuid={!post.author.organization_name ? post.author.uuid : undefined}
            organizationId={post.author.organization_name ? post.author.id : undefined}
             name={post.author.organization_name
                ? post.author.organization_name
                : `${post.author.first_name} ${post.author.last_name}`}
            suffix={
              <span className="text-primary text-responsive-xs font-bold">
               {" "}
               <span className="text-authlayoutbg font-normal">posted</span>
              </span>
            }
            nameClassName="text-primary text-responsive-xs font-bold"
          >
            <p className="text-placeholderbg text-responsive-xxs">
              {formatRelativeTime(post.created_date)}
            </p>
          </ProfileAvatar>
        </div>

        {/* Horizontal 3-dot menu - only show if the post is from the authenticated user */}
        {isOwner && (
          <div className="flex-shrink-0">
            <DropdownMenu
              onEdit={handleEdit}
              onDelete={handleDelete}
              editLabel="Edit Post"
              deleteLabel="Delete Post"
            />
          </div>
        )}
      </div>

      {/* 5. Description */}
      <div className="p-3 sm:p-4 text-primary leading-relaxed">
        <p className="text-responsive-xs">{post.description}</p>
      </div>

      {imageUrls.length > 0 && (
        <div className={`grid ${imageUrls.length === 1 ? 'grid-cols-1' : 'grid-cols-2'} gap-2 mt-4`}>
          {imageUrls.slice(0, 4).map((src, idx) => (
            <button
              key={idx}
              type="button"
              className="w-full h-40 sm:h-48 md:h-56 lg:h-[300px] rounded-lg sm:rounded-xl overflow-hidden relative cursor-pointer"
              onClick={() => openLightbox(idx, imageUrls.map((u) => ({ src: u })))}
            >
              <img src={src} alt={`Post image ${post.id}-${idx + 1}`} className="w-full h-full object-cover" />
              {idx === 3 && imageUrls.length > 4 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white font-bold text-responsive-lg">
                  + {imageUrls.length - 4}
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* 8. Comments Section */}
      <CommentsSection
        contentType="post"
        contentId={post.id}
        comments={post.comments}
        totalComments={post.total_comments}
        currentUserAvatar={currentUserAvatar}
        onViewMoreComments={handleViewMoreComments}
      />
      <LightboxViewer />
    </div>
  );
};
