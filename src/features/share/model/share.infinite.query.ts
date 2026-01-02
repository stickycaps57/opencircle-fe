import { useInfiniteQuery } from "@tanstack/react-query";
import { getUserShares, getAllSharesWithComments, getSharesByContent } from "../lib/share.api";
import { QUERY_KEYS } from "@src/shared/constants/queryKeys";
import type {
  UserSharesResponse,
  SharesQueryParams,
  AllSharesResponse,
  AllSharesItem,
  ShareItem,
  ShareByContentResponse,
  SharesPagination,
  AccountUserDetails,
  AccountOrganizationDetails
} from "@src/features/share/schema/share.types";
import type { AllMemberPostData, ProfilePicture } from "@src/features/main/member/profile/schema/post.types";
import type { EventData } from "@src/features/main/organization/profile/schema/event.type";

export const useInfiniteUserShares = ({ account_uuid, content_type, limit = 5 }: SharesQueryParams) => {
  return useInfiniteQuery<UserSharesResponse, Error, UserSharesResponse, unknown[], number>({
    queryKey: [QUERY_KEYS.USER_SHARES, account_uuid, content_type, limit],
    queryFn: async ({ pageParam }) => {
      const page = typeof pageParam === "number" ? pageParam : 1;
      return await getUserShares(account_uuid, page, limit, content_type);
    },
    enabled: !!account_uuid,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { pagination } = lastPage;
      return pagination.page < pagination.pages ? pagination.page + 1 : undefined;
    },
    staleTime: 5 * 60 * 1000,
  });
};

const mapToShareItem = (item: AllSharesItem): ShareItem => {
  const contentType = item.content.type === "event" ? 2 : 1;
  const profile_picture = item.sharer.profile_picture as ProfilePicture | null;
  const account = item.sharer.organization_name
    ? ({ type: "organization" as const, id: item.sharer.organization_id, name: item.sharer.organization_name || "", logo: item.sharer.logo } as AccountOrganizationDetails)
    : ({
        type: "user" as const,
        id: item.sharer.id,
        first_name: item.sharer.first_name || "",
        last_name: item.sharer.last_name || "",
        profile_picture,
      } as AccountUserDetails);

  const content_details =
    item.content.type === "post"
      ? ({
          id: item.content.id,
          author_id: 0,
          author_uuid: item.content.author.uuid,
          author_email: item.content.author.email,
          author_first_name: item.content.author.first_name || "",
          author_last_name: item.content.author.last_name || "",
          author_profile_picture: item.content.author.profile_picture as ProfilePicture | null,
          author_logo: item.content.author.organization_logo as ProfilePicture | null,
          author_organization_name: item.content.author.organization_name || "",
          images: item.content.images || [],
          description: item.content.description || "",
          created_date: item.content.created_date,
        } as AllMemberPostData)
      : ({
          id: item.content.id,
          organization_id: item.content.organization_id,
          title: item.content.title,
          event_date: item.content.event_date,
          description: item.content.description,
          image: item.content.image
            ? {
                id: 0,
                directory: item.content.image.directory,
                filename: item.content.image.filename,
              }
            : undefined,
          created_date: item.content.created_date,
          last_modified_date: item.content.created_date,
          organization: {
            name: item.content.organization?.name ?? "",
            logo: item.content.organization?.logo
              ? {
                  id: 0,
                  directory: item.content.organization?.logo.directory,
                  filename: item.content.organization?.logo.filename,
                }
              : null,
            category: item.content.organization?.category ?? "",
          },
          organization_name: item.content.organization?.name ?? "",
          address: {
            province: item.content.organization?.address?.province ?? "",
            city: item.content.organization?.address?.city ?? "",
            barangay: item.content.organization?.address?.barangay ?? "",
          },
          user_membership_status_with_organizer:
            item.content.organization?.user_membership_status_with_organizer ?? "",
        } as EventData);

  return {
    shared_id: item.share_id,
    message: item.share_comment || "",
    comment: item.share_comment || "",
    account_uuid: item.sharer.uuid,
    content_type: contentType,
    auth_user_rsvp: item.auth_user_rsvp,
    date_created: item.share_date,
    content_details,
    account,
  };
};

type SharesPageMapped = { shares: ShareItem[]; pagination: SharesPagination };

export type InfiniteAllSharesParams = {
  limit?: number;
  content_type?: number;
};

export const useInfiniteAllShares = ({ limit = 5, content_type }: InfiniteAllSharesParams = {}) => {
  return useInfiniteQuery<SharesPageMapped, Error, SharesPageMapped, unknown[], number>({
    queryKey: [QUERY_KEYS.ALL_SHARES_WITH_COMMENTS, "all", limit, content_type],
    queryFn: async ({ pageParam }) => {
      const page = typeof pageParam === "number" ? pageParam : 1;
      const resp: AllSharesResponse = await getAllSharesWithComments(page, limit, content_type);
      return { shares: resp.shares.map(mapToShareItem), pagination: resp.pagination };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.pagination.page < lastPage.pagination.pages ? lastPage.pagination.page + 1 : undefined),
    staleTime: 5 * 60 * 1000,
  });
};

export const useInfiniteSharesByContent = ({ content_type, content_id, limit = 10 }: { content_type: number; content_id: number; limit?: number }) => {
  return useInfiniteQuery<ShareByContentResponse, Error, ShareByContentResponse, unknown[], number>({
    queryKey: [QUERY_KEYS.CONTENT_SHARES, content_type, content_id, limit],
    queryFn: async ({ pageParam }) => {
      const page = typeof pageParam === "number" ? pageParam : 1;
      return await getSharesByContent(content_type, content_id, page, limit);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { pagination } = lastPage;
      return pagination.page < pagination.pages ? pagination.page + 1 : undefined;
    },
    staleTime: 5 * 60 * 1000,
  });
};
