/**
 * Query keys for React Query
 * These constants are used to identify query keys across the application
 */
export const QUERY_KEYS = {
  // Post related queries
  POSTS: "posts",
  MEMBER_POSTS: "member-posts",
  POST: "post", // Individual post

  // Comment related queries
  COMMENTS: "comments",
  POST_COMMENTS: "post-comments",
  EVENT_COMMENTS: "event-comments",

  // User related queries
  USER: "user",
  MEMBER: "member",
  ORGANIZATION: "organization",

  // Event related queries
  EVENTS: "events",
  EVENTS_RSVPS: "events-rsvps",
  RANDOM_EVENTS: "random-events",
  MEMBER_EVENTS: "member-events",

  // ORGANIZATION
  ORGANIZATION_ACTIVE_EVENTS: "organization-events-active",
  ORGANIZATION_PAST_EVENTS: "organization-events-past",
  ORGANIZATION_MEMBERS: "organization-members",
  ORGANIZATION_MEMBER_REQUESTS: "organization-member-requests",
  MEMBER_EVENTS_BY_RSVP_STATUS: "member-events-by-rsvp-status",
  MEMBER_PAST_EVENTS: "member-past-events",
  ORGANIZATION_MEMBERSHIP: "organization-membership",
  MEMBER_JOINED_ORGANIZATIONS: "member-joined-organizations",

  // CALENDAR
  CALENDAR_EVENTS: "calendar-events",
  MEMBER_CALENDAR_EVENTS: "member-calendar-events",
  ORGANIZATION_CALENDAR_EVENTS: "organization-calendar-events",
  USER_SHARES: "user-shares",
  ALL_SHARES_WITH_COMMENTS: "all-shares-with-comments",
  CONTENT_SHARES: "content-shares",
  NOTIFICATIONS: "notifications",
  NOTIFICATIONS_UNREAD_COUNT: "notifications-unread-count",
  MEMBERSHIP_ANALYTICS: "membership-analytics",
  COMMENT_ANALYTICS_SUMMARY: "comment-analytics-summary",
  EVENT_COMMENT_ANALYTICS_SUMMARY: "event-comment-analytics-summary",
  POST_COMMENT_ANALYTICS_SUMMARY: "post-comment-analytics-summary",
  
  // AUTH
  TWO_FA_STATUS: "two-fa-status",
};
