import axiosInstance from "@src/shared/api/axios";
import type {
  MembershipAnalyticsResponse,
  EventsSummaryResponse,
  EventsRespondentsResponse,
  CommentAnalyticsSummaryResponse,
  EventCommentAnalyticsSummaryResponse,
  PostCommentAnalyticsSummaryResponse,
} from "@src/features/main/organization/dashboard/schema/dashboard.types";

export const getMembershipAnalytics = async (
  params?: { start_date?: string | null; end_date?: string | null }
): Promise<MembershipAnalyticsResponse> => {
  const response = await axiosInstance.get<MembershipAnalyticsResponse>("/report/membership-analytics", {
    params: {
      ...(params?.start_date ? { start_date: params.start_date } : {}),
      ...(params?.end_date ? { end_date: params.end_date } : {}),
    },
  });
  return response.data;
};

export const getEventsSummary = async (
  params?: { start_date?: string | null; end_date?: string | null }
): Promise<EventsSummaryResponse> => {
  const response = await axiosInstance.get<EventsSummaryResponse>("/report/event-respondents-summary", {
    params: {
      ...(params?.start_date ? { start_date: params.start_date } : {}),
      ...(params?.end_date ? { end_date: params.end_date } : {}),
    },
  });
  return response.data;
};

export const getEventRespondents = async (
  params?: { start_date?: string | null; end_date?: string | null }
): Promise<EventsRespondentsResponse> => {
  const response = await axiosInstance.get<EventsRespondentsResponse>("/report/event-respondents", {
    params: {
      ...(params?.start_date ? { start_date: params.start_date } : {}),
      ...(params?.end_date ? { end_date: params.end_date } : {}),
    },
  });
  return response.data;
};

export const getCommentAnalyticsSummary = async (
  params?: { start_date?: string | null; end_date?: string | null }
): Promise<CommentAnalyticsSummaryResponse> => {
  const response = await axiosInstance.get<CommentAnalyticsSummaryResponse>(
    "/report/comment-analytics/summary",
    {
      params: {
        ...(params?.start_date ? { start_date: params.start_date } : {}),
        ...(params?.end_date ? { end_date: params.end_date } : {}),
      },
    }
  );
  return response.data;
};

export const getEventCommentAnalyticsSummary = async (
  params?: { start_date?: string | null; end_date?: string | null }
): Promise<EventCommentAnalyticsSummaryResponse> => {
  const response = await axiosInstance.get<EventCommentAnalyticsSummaryResponse>(
    "/report/comment-analytics/events",
    {
      params: {
        ...(params?.start_date ? { start_date: params.start_date } : {}),
        ...(params?.end_date ? { end_date: params.end_date } : {}),
      },
    }
  );
  return response.data;
};

export const getPostCommentAnalyticsSummary = async (
  params?: { start_date?: string | null; end_date?: string | null }
): Promise<PostCommentAnalyticsSummaryResponse> => {
  const response = await axiosInstance.get<PostCommentAnalyticsSummaryResponse>(
    "/report/comment-analytics/posts",
    {
      params: {
        ...(params?.start_date ? { start_date: params.start_date } : {}),
        ...(params?.end_date ? { end_date: params.end_date } : {}),
      },
    }
  );
  return response.data;
};
