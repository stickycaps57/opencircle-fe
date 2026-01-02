import { useQuery } from "@tanstack/react-query";
import { getMemberPostsWithComments, getPostById } from "../lib/post.api";
import type { UserQueryParams } from "@src/shared/utils/QueryParams";
import { QUERY_KEYS } from "@src/shared/constants/queryKeys";
import type { PostData } from "../schema/post.types";

export const useGetPost = (postId: number, enabled: boolean = true) => {
  return useQuery<PostData, Error>({
    queryKey: [QUERY_KEYS.POST, postId],
    queryFn: () => getPostById(postId),
    enabled: enabled && !!postId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useMemberPostsWithComments = (params: UserQueryParams) => {
  return useQuery({
    queryKey: [QUERY_KEYS.MEMBER_POSTS, params],
    queryFn: () => getMemberPostsWithComments(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
