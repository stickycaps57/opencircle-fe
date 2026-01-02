export type DateFilter = {
  start_date: string | null;
  end_date: string | null;
  status_filter?: string | null;
};

export type StatusCounts = {
  pending: number;
  approved: number;
  rejected: number;
  left: number;
  total: number;
};

export type StatusPercentages = {
  pending_percentage: number;
  approved_percentage: number;
  rejected_percentage: number;
  left_percentage: number;
};

export type MembershipAnalytics = {
  status_counts: StatusCounts;
  status_percentages: StatusPercentages;
  active_members: number;
  recent_applications_30_days: number;
  retention_rate_percentage: number;
  conversion_rate_percentage: number;
};

export type MembershipAnalyticsResponse = {
  organization_id: number;
  organization_name: string;
  date_filter: DateFilter;
  membership_analytics: MembershipAnalytics;
};

export type EventSummaryRsvpCounts = {
  joined: number;
  rejected: number;
  pending: number;
  total: number;
};

export type EventSummaryRsvpPercentages = {
  joined_percentage: number;
  rejected_percentage: number;
  pending_percentage: number;
};

export type EventRespondentsSummary = {
  total_events: number;
  unique_attendees: number;
  rsvp_counts: EventSummaryRsvpCounts;
  rsvp_percentages: EventSummaryRsvpPercentages;
  average_rsvps_per_event: number;
};

export type EventsSummaryResponse = {
  organization_id: number;
  organization_name: string;
  date_filter: Omit<DateFilter, "status_filter">;
  summary: EventRespondentsSummary;
};

export type EventRespondentsItem = {
  event_id: number;
  event_title: string;
  event_date: string;
  event_created_date: string;
  rsvp_statistics: {
    joined: number;
    rejected: number;
    pending: number;
    total: number;
  };
  unique_attendees: number;
  response_rate: number;
};

export type EventsRespondentsResponse = {
  organization_id: number;
  organization_name: string;
  total_events: number;
  date_filter: Omit<DateFilter, "status_filter">;
  events: EventRespondentsItem[];
};

export type CommentAnalyticsFilters = {
  start_date: string;
  end_date: string;
};

export type OverallCommentSummary = {
  total_content_items: number;
  total_comments: number;
  content_with_comments: number;
  content_without_comments: number;
  average_comments_per_content: number;
  comment_engagement_rate: number;
};

export type PostCommentSummary = {
  total_posts: number;
  total_post_comments: number;
  posts_with_comments: number;
  posts_without_comments: number;
  average_comments_per_post: number;
};

export type EventCommentSummary = {
  total_events: number;
  total_event_comments: number;
  events_with_comments: number;
  events_without_comments: number;
  average_comments_per_event: number;
};

export type CommentDailyTrend = {
  date: string;
  post_comments: number;
  event_comments: number;
  total_comments: number;
};

export type CommentAnalyticsSummaryResponse = {
  organization_id: number;
  organization_name: string;
  filters: CommentAnalyticsFilters;
  overall_summary: OverallCommentSummary;
  post_summary: PostCommentSummary;
  event_summary: EventCommentSummary;
  daily_trends: CommentDailyTrend[];
};

export type EventCommentAnalyticsFilters = {
  start_date: string;
  end_date: string;
};

export type EventCommentAnalyticsSummary = {
  total_events: number;
  total_comments: number;
  events_with_comments: number;
  events_without_comments: number;
  average_comments_per_event: number;
};

export type EventCommentAnalyticsItem = {
  event_id: number;
  event_title: string;
  event_date: string;
  event_created_date: string;
  comment_count: number;
  first_comment_date: string;
  last_comment_date: string;
};

export type EventCommentAnalyticsSummaryResponse = {
  organization_id: number;
  organization_name: string;
  filters: EventCommentAnalyticsFilters;
  summary: EventCommentAnalyticsSummary;
  event_analytics: EventCommentAnalyticsItem[];
};

export type PostCommentAnalyticsFilters = {
  start_date: string;
  end_date: string;
};

export type PostCommentAnalyticsSummary = {
  total_posts: number;
  total_comments: number;
  posts_with_comments: number;
  posts_without_comments: number;
  average_comments_per_post: number;
};

export type PostCommentAnalyticsItem = {
  post_id: number;
  post_description: string;
  post_created_date: string;
  comment_count: number;
  first_comment_date: string;
  last_comment_date: string;
};

export type PostCommentAnalyticsSummaryResponse = {
  organization_id: number;
  organization_name: string;
  filters: PostCommentAnalyticsFilters;
  summary: PostCommentAnalyticsSummary;
  post_analytics: PostCommentAnalyticsItem[];
};
