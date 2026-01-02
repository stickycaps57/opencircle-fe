import { useInfiniteQuery } from "@tanstack/react-query";
import { getUserEventsByRsvpStatus, getUserPastEvents } from "../lib/event.api";
import type {
  EventsByRsvpStatusQueryParams,
  EventsByRsvpStatusResponse,
} from "../schema/event.types";
import { QUERY_KEYS } from "@src/shared/constants/queryKeys";

export const useUserEventsByRsvpStatusInfiniteQuery = (
  params: EventsByRsvpStatusQueryParams & { enabled?: boolean }
) => {
  const { accountUuid, rsvpStatus, limit = 10, enabled = true } = params;

  return useInfiniteQuery<EventsByRsvpStatusResponse>({
    queryKey: [
      QUERY_KEYS.MEMBER_EVENTS_BY_RSVP_STATUS,
      accountUuid,
      rsvpStatus,
    ],
    queryFn: async ({ pageParam }) => {
      // Ensure pageParam is a number with default value of 1
      const page = typeof pageParam === "number" ? pageParam : 1;
      return await getUserEventsByRsvpStatus(
        accountUuid,
        rsvpStatus,
        page,
        limit
      );
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { pagination } = lastPage;
      return pagination.page < pagination.pages
        ? pagination.page + 1
        : undefined;
    },
    enabled: enabled && !!accountUuid && !!rsvpStatus,
  });
};

export const useUserPastEventsInfiniteQuery = (
  params: Omit<EventsByRsvpStatusQueryParams, 'rsvpStatus'>
) => {
  const { accountUuid, limit = 5 } = params;

  return useInfiniteQuery<EventsByRsvpStatusResponse>({
    queryKey: [
      QUERY_KEYS.MEMBER_PAST_EVENTS,
      accountUuid,
    ],
    queryFn: async ({ pageParam }) => {
      // Ensure pageParam is a number with default value of 1
      const page = typeof pageParam === "number" ? pageParam : 1;
      return await getUserPastEvents(
        accountUuid,
        page,
        limit
      );
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { pagination } = lastPage;
      return pagination.page < pagination.pages
        ? pagination.page + 1
        : undefined;
    },
    enabled: !!accountUuid,
  });
};
