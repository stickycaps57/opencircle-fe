import { useInfiniteQuery } from "@tanstack/react-query";
import { getGoalsByOrganizationPaginated } from "../lib/goal.api";
import { QUERY_KEYS } from "@src/shared/constants/queryKeys";
import type { GoalsResponse } from "../schema/goal.type";

interface InfiniteGoalsParams {
  organizationId: number;
  page_size?: number;
  status?: string;
}

export const useInfiniteGoals = ({
  organizationId,
  page_size = 10,
  status,
}: InfiniteGoalsParams) => {
  return useInfiniteQuery<
    GoalsResponse,
    Error,
    { pages: GoalsResponse[] },
    unknown[],
    number
  >({
    queryKey: [QUERY_KEYS.ORGANIZATION_GOALS, organizationId, page_size, status],
    queryFn: ({ pageParam }: { pageParam: number }) => {
      return getGoalsByOrganizationPaginated({
        organizationId,
        page: pageParam,
        page_size,
        status,
      });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      // If we've fetched all goals, return undefined to signal the end
      const currentlyFetched = allPages.length * page_size;
      const total = lastPage.total_count;

      if (
        currentlyFetched >= total ||
        lastPage.goals.length < page_size
      ) {
        return undefined;
      }

      // Return the next page number
      return allPages.length + 1;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!organizationId,
  });
};