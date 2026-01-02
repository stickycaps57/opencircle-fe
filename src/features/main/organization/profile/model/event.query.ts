import { useQuery } from "@tanstack/react-query";
import {
  getEventById,
  getEventRsvps,
  getEventWithComments,
} from "../lib/event.api";
import { QUERY_KEYS } from "@src/shared/constants/queryKeys";
import type { EventData, EventRsvpsResponse } from "../schema/event.type";

export const useGetEvent = (eventId: number, enabled: boolean = true) => {
  return useQuery<EventData, Error>({
    queryKey: [QUERY_KEYS.EVENTS, eventId],
    queryFn: () => getEventById(eventId),
    enabled: enabled && !!eventId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
};

export const useGetEventRsvps = (eventId: number, enabled: boolean = true) => {
  return useQuery<EventRsvpsResponse, Error>({
    queryKey: [QUERY_KEYS.EVENTS_RSVPS, eventId],
    queryFn: () => getEventRsvps(eventId),
    enabled: enabled && !!eventId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
};

export const useGetEventWithComments = (
  eventId: number,
  accountUuid: string,
  enabled: boolean = true
) => {
  return useQuery<EventData, Error>({
    queryKey: [QUERY_KEYS.CALENDAR_EVENTS, eventId, "with_comments"],
    queryFn: () => getEventWithComments({ eventId, accountUuid }),
    enabled: enabled && !!eventId && !!accountUuid,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
};
