import { useInfiniteQuery } from "@tanstack/react-query";
import type { UserQueryParams } from "@src/shared/utils/QueryParams";
import type {
  InfinitePostsResponse,
  MemberPostsResponse,
  AllMemberPostsResponse,
  PostData,
  AllMemberPostData,
} from "../schema/post.types";
import { getMemberPostsWithComments, getAllMemberPosts } from "../lib/post.api";
import { QUERY_KEYS } from "@src/shared/constants/queryKeys";

type InfiniteMemberPostsParams = Omit<UserQueryParams, "page"> & {
  limit?: number;
};

export const useInfiniteMemberPosts = ({
  uid,
  limit = 5,
}: InfiniteMemberPostsParams) => {
  // Use useInfiniteQuery with proper type annotations
  const result = useInfiniteQuery<
    MemberPostsResponse,
    Error,
    InfinitePostsResponse<PostData>,
    unknown[],
    number
  >({
    queryKey: [QUERY_KEYS.MEMBER_POSTS, uid, limit],
    queryFn: ({ pageParam }: { pageParam: number }) => {
      return getMemberPostsWithComments({
        uid,
        page: pageParam,
        per_page: limit,
      });
    },
    initialPageParam: 1, // Start with page 1
    getNextPageParam: (lastPage) => {
      // If we've fetched all posts, return undefined to signal the end
      const totalPages = Math.ceil(lastPage.total / lastPage.page_size);
      const nextPage = lastPage.page + 1;

      if (nextPage > totalPages || lastPage.posts.length === 0) {
        return undefined;
      }

      // Return the next page number
      return nextPage;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!uid, // Only run the query if uid is provided
  });

  return result;
};

// Type for the parameters accepted by useInfiniteAllMemberPosts
export type InfiniteAllMemberPostsParams = {
  limit?: number;
};

// Hook for fetching all member posts with infinite scrolling
export const useInfiniteAllMemberPosts = ({
  limit = 5,
}: InfiniteAllMemberPostsParams = {}) => {
  return useInfiniteQuery<
    AllMemberPostsResponse,
    Error,
    InfinitePostsResponse<AllMemberPostData>,
    unknown[],
    number
  >({
    queryKey: [QUERY_KEYS.MEMBER_POSTS, "all", limit],
    queryFn: ({ pageParam }: { pageParam: number }) => {
      // Call getAllMemberPosts with the correct parameters
      return getAllMemberPosts(pageParam, limit);
    },
    initialPageParam: 1, // Start with page 1
    getNextPageParam: (lastPage) => {
      // If we've fetched all posts, return undefined to signal the end
      const totalPages = Math.ceil(lastPage.total / lastPage.page_size);
      const nextPage = lastPage.page + 1;

      if (nextPage > totalPages || lastPage.posts.length === 0) {
        return undefined;
      }

      // Return the next page number
      return nextPage;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
