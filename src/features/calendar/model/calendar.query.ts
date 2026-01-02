import { useQuery } from "@tanstack/react-query";
import {
  fetchMemberCalendarEvents,
  fetchOrganizationCalendarEvents,
} from "../lib/calendar.api";
import { useAuthStore } from "../../../shared/store/auth";
import { QUERY_KEYS } from "@src/shared/constants/queryKeys";

// Custom hook to fetch calendar events for the current authenticated member by month and year
export const useMemberCalendarEvents = (
  month: number,
  year: number,
  customAccountUuid?: string
) => {
  const { user } = useAuthStore();
  const accountUuid = customAccountUuid || user?.uuid || "";

  return useQuery({
    queryKey: [
      QUERY_KEYS.MEMBER_CALENDAR_EVENTS,
      { month, year, accountUuid },
    ],
    queryFn: () => fetchMemberCalendarEvents(accountUuid, month, year),
    enabled: !!accountUuid,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Custom hook to fetch calendar events for the current authenticated organization by month and year
export const useOrganizationCalendarEvents = (
  month: number,
  year: number,
  customAccountUuid?: string
) => {
  const { user } = useAuthStore();
  const accountUuid = customAccountUuid || user?.uuid || "";

  return useQuery({
    queryKey: [
      QUERY_KEYS.ORGANIZATION_CALENDAR_EVENTS,
      { month, year, accountUuid },
    ],
    queryFn: () => fetchOrganizationCalendarEvents(accountUuid, month, year),
    enabled: !!accountUuid,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
