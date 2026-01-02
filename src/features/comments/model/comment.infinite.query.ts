import { useInfiniteQuery } from "@tanstack/react-query";
import type { ContentCommentQueryParams } from "@src/shared/utils/QueryParams";
import type {
  CommentsResponse,
  InfiniteCommentsResponse,
} from "../schema/comment.types";
import { getContentComments } from "../lib";
import { QUERY_KEYS } from "@src/shared/constants/queryKeys";

// Type for the parameters accepted by useInfiniteContentComments
type InfiniteContentCommentsParams = Omit<ContentCommentQueryParams, "offset">;

// Hook for fetching comments for a specific content (post or event) with infinite scrolling
export const useInfiniteContentComments = ({
  postId,
  eventId,
  limit = 5,
}: InfiniteContentCommentsParams) => {
  return useInfiniteQuery<
    CommentsResponse,
    Error,
    InfiniteCommentsResponse,
    unknown[],
    number
  >({
    queryKey: [QUERY_KEYS.EVENT_COMMENTS, { postId, eventId }, limit],
    queryFn: ({ pageParam }: { pageParam: number }) => {
      // Use offset-based pagination instead of increasing limit
      const offset = pageParam * limit;
      return getContentComments({
        postId,
        eventId,
        limit,
        offset,
      });
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      // If we've fetched all comments, return undefined to signal the end
      const currentlyFetched = allPages.length * limit;
      const total = lastPage.total;

      if (currentlyFetched >= total || lastPage.comments.length < limit) {
        return undefined;
      }

      // Return the next page number, which will be used to calculate the offset
      return allPages.length;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!(postId || eventId), // Only run the query if either postId or eventId is provided
  });
};

// Legacy hook for fetching comments for a specific post with infinite scrolling
export const useInfinitePostComments = (
  params: InfiniteContentCommentsParams
) => {
  return useInfiniteContentComments(params);
};
