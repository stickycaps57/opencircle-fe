import { useInfiniteQuery } from "@tanstack/react-query";
import {
  getOrganizationActiveEvents,
  getOrganizationPastEvents,
  getRandomEvents,
} from "../lib/event.api";
import { QUERY_KEYS } from "@src/shared/constants/queryKeys";
import type {
  EventsResponse,
  InfiniteEventsResponse,
  OrganizationEventQueryParams,
  RandomEventsResponse,
  RandomEventsQueryParams,
  InfiniteRandomEventsResponse,
  PastEventsResponse,
  InfinitePastEventsResponse,
} from "../schema/event.type";

type InfiniteOrganizationEventsParams = Omit<
  OrganizationEventQueryParams,
  "page"
>;

export const useInfiniteOrganizationEvents = ({
  account_uuid,
  per_page = 5,
}: InfiniteOrganizationEventsParams) => {
  return useInfiniteQuery<
    EventsResponse,
    Error,
    InfiniteEventsResponse,
    unknown[],
    number
  >({
    queryKey: [QUERY_KEYS.ORGANIZATION_ACTIVE_EVENTS, account_uuid, per_page],
    queryFn: ({ pageParam }: { pageParam: number }) => {
      return getOrganizationActiveEvents({
        account_uuid,
        page: pageParam,
        per_page,
      });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      // If we've fetched all events, return undefined to signal the end
      const currentlyFetched = allPages.length * per_page;
      const total = lastPage.total;

      if (
        currentlyFetched >= total ||
        lastPage.active_events.length < per_page
      ) {
        return undefined;
      }

      // Return the next page number
      return allPages.length + 1;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!account_uuid, // Only run the query if account_uuid is provided
  });
};

/**
 * Type for the parameters accepted by useInfiniteRandomEvents
 */
type InfiniteRandomEventsParams = Omit<RandomEventsQueryParams, "page">;

/**
 * Hook for fetching random events with infinite scrolling
 * @param params - Object containing optional limit
 * @returns Infinite query result with random events data
 */
export const useInfiniteRandomEvents = ({
  limit = 5,
}: InfiniteRandomEventsParams = {}) => {
  return useInfiniteQuery<
    RandomEventsResponse,
    Error,
    InfiniteRandomEventsResponse,
    unknown[],
    number
  >({
    queryKey: [QUERY_KEYS.RANDOM_EVENTS, limit],
    queryFn: ({ pageParam }: { pageParam: number }) => {
      return getRandomEvents({
        page: pageParam,
        limit,
      });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      // If we've fetched all events, return undefined to signal the end
      const { page, pages } = lastPage.pagination;

      if (page >= pages || lastPage.random_events.length < limit) {
        return undefined;
      }

      // Return the next page number
      return page + 1;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook for fetching organization past events with infinite scrolling
 * @param params - Object containing account_uuid and optional per_page
 * @returns Infinite query result with organization past events data
 */
export const useInfiniteOrganizationPastEvents = ({
  account_uuid,
  per_page = 5,
}: InfiniteOrganizationEventsParams) => {
  return useInfiniteQuery<
    PastEventsResponse,
    Error,
    InfinitePastEventsResponse,
    unknown[],
    number
  >({
    queryKey: [QUERY_KEYS.ORGANIZATION_PAST_EVENTS, account_uuid, per_page],
    queryFn: ({ pageParam }: { pageParam: number }) => {
      return getOrganizationPastEvents({
        account_uuid,
        page: pageParam,
        per_page,
      });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      // If we've fetched all events, return undefined to signal the end
      const currentlyFetched = allPages.length * per_page;
      const total = lastPage.total;

      if (currentlyFetched >= total || lastPage.past_events.length < per_page) {
        return undefined;
      }

      // Return the next page number
      return allPages.length + 1;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!account_uuid, // Only run the query if account_uuid is provided
  });
};
