import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@src/shared/constants/queryKeys";
import { getMembershipAnalytics, getEventsSummary, getEventRespondents, getCommentAnalyticsSummary, getEventCommentAnalyticsSummary, getPostCommentAnalyticsSummary } from "@src/features/main/organization/dashboard/lib/dashboard.api";
import type { MembershipAnalyticsResponse, EventsSummaryResponse, EventsRespondentsResponse, CommentAnalyticsSummaryResponse, EventCommentAnalyticsSummaryResponse, PostCommentAnalyticsSummaryResponse } from "@src/features/main/organization/dashboard/schema/dashboard.types";

export const useMembershipAnalytics = (params?: { start_date?: string | null; end_date?: string | null }) => {
  return useQuery<MembershipAnalyticsResponse, Error>({
    queryKey: [
      QUERY_KEYS.MEMBERSHIP_ANALYTICS,
      params?.start_date ?? null,
      params?.end_date ?? null,
    ],
    queryFn: async () => await getMembershipAnalytics(params),
    staleTime: 60 * 1000,
  });
};

export const useEventsSummary = (params?: { start_date?: string | null; end_date?: string | null }) => {
  return useQuery<EventsSummaryResponse, Error>({
    queryKey: [
      QUERY_KEYS.MEMBERSHIP_ANALYTICS,
      "events-summary",
      params?.start_date ?? null,
      params?.end_date ?? null,
    ],
    queryFn: async () => await getEventsSummary(params),
    staleTime: 60 * 1000,
  });
};

export const useEventsRespondents = (params?: { start_date?: string | null; end_date?: string | null }) => {
  return useQuery<EventsRespondentsResponse, Error>({
    queryKey: [
      QUERY_KEYS.MEMBERSHIP_ANALYTICS,
      "events-respondents",
      params?.start_date ?? null,
      params?.end_date ?? null,
    ],
    queryFn: async () => await getEventRespondents(params),
    staleTime: 60 * 1000,
  });
};

export const useCommentAnalyticsSummary = (params?: { start_date?: string | null; end_date?: string | null }) => {
  return useQuery<CommentAnalyticsSummaryResponse, Error>({
    queryKey: [
      QUERY_KEYS.COMMENT_ANALYTICS_SUMMARY,
      params?.start_date ?? null,
      params?.end_date ?? null,
    ],
    queryFn: async () => await getCommentAnalyticsSummary(params),
    staleTime: 60 * 1000,
  });
};

export const useEventCommentAnalyticsSummary = (params?: { start_date?: string | null; end_date?: string | null }) => {
  return useQuery<EventCommentAnalyticsSummaryResponse, Error>({
    queryKey: [
      QUERY_KEYS.EVENT_COMMENT_ANALYTICS_SUMMARY,
      params?.start_date ?? null,
      params?.end_date ?? null,
    ],
    queryFn: async () => await getEventCommentAnalyticsSummary(params),
    staleTime: 60 * 1000,
  });
};

export const usePostCommentAnalyticsSummary = (params?: { start_date?: string | null; end_date?: string | null }) => {
  return useQuery<PostCommentAnalyticsSummaryResponse, Error>({
    queryKey: [
      QUERY_KEYS.POST_COMMENT_ANALYTICS_SUMMARY,
      params?.start_date ?? null,
      params?.end_date ?? null,
    ],
    queryFn: async () => await getPostCommentAnalyticsSummary(params),
    staleTime: 60 * 1000,
  });
};
