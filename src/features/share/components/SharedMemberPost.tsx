import { useImageUrl, useFormatDate, checkOwnership } from "@src/shared/hooks";
import { useAuthStore } from "@src/shared/store";
import { isMember } from "@src/shared/utils";
import { type AllMemberPostData } from "@src/features/main/member/profile/schema/post.types";
import { ProfileAvatar } from "@src/shared/components/ProfileAvatar";

interface SharedMemberPostProps {
  post: AllMemberPostData;
}

export const SharedMemberPost = ({ post }: SharedMemberPostProps) => {

  const { getImageUrl } = useImageUrl();
  const { formatRelativeTime } = useFormatDate();
  const isOwner = checkOwnership({ type: "post", ownerId: post.author_id });
  const imageUrls = (post.images || []).map((img) => getImageUrl(img));

  const { user } = useAuthStore();
  const authorImageUrl = getImageUrl(
    isMember(user) ? post.author_profile_picture ?? post.profile_picture : post.author_logo
  );

  return (
    <div className="bg-athens_gray rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 w-full">
      <div className="flex flex-row items-center justify-between mb-4">
        <div className="flex flex-row items-center space-x-2 sm:space-x-3">
          <ProfileAvatar
            src={authorImageUrl}
            alt="Post Author"
            className="w-10 h-10 sm:w-14 sm:h-14"
            type={post.author_organization_name ? "organization" : "member"}
            isOwner={isOwner}
            memberUuid={post.author_uuid}
            organizationId={post.author_organization_id}
            name={post.author_organization_name
                ? post.author_organization_name
                : `${post.author_first_name} ${post.author_last_name}`}
            suffix={
              <span className="text-primary text-responsive-xs font-bold">
               {" "}
               <span className="text-authlayoutbg font-normal"> posted</span>
              </span>
            }
            nameClassName="text-primary text-responsive-xs font-bold"
          >
            <p className="text-placeholderbg text-responsive-xxs">
              {formatRelativeTime(post.created_date)}
            </p>
          </ProfileAvatar>
        </div>
      </div>

      <div className="bg-white p-3 sm:p-4 rounded-xl text-responsive-xs text-primary leading-relaxed">
        <p>{post.description}</p>
      </div>

      {imageUrls.length > 0 && (
        <div className="grid grid-cols-2 gap-2 mt-4">
          {imageUrls.slice(0, 4).map((src, idx) => (
            <div key={idx} className="w-full h-40 sm:h-48 md:h-56 lg:h-[300px] rounded-lg overflow-hidden relative">
              <img src={src} alt={`Post image ${post.id}-${idx + 1}`} className="w-full h-full object-cover" />
              {idx === 3 && imageUrls.length > 4 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white font-bold text-responsive-lg">
                  + {imageUrls.length - 4}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
