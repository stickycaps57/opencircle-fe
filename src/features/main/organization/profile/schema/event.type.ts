export interface EventFormData {
  title: string;
  country: string;
  province: string;
  city: string;
  barangay: string;
  address: string;
  schedule: string;
  description: string;
  image?: File;
}

// Type for API response when creating an event
export interface CreateEventResponse {
  id: string;
  title: string;
  event_date: string;
  country: string;
  province: string;
  city: string;
  barangay: string;
  house_building_number: string;
  description: string;
  image_url?: string;
  created_at: string;
  organization_id: string;
}

// Type for API response when updating an event
export interface UpdateEventResponse {
  id: string;
  title: string;
  event_date: string;
  country: string;
  province: string;
  city: string;
  barangay: string;
  house_building_number: string;
  description: string;
  image_url?: string;
  updated_at: string;
  organization_id: string;
}

import type {
  Member,
  Organization,
} from "@src/features/auth/schema/auth.types";
import type { ContentComment } from "@src/features/comments/schema/comment.types";
import type {
  CommentAccount,
  ProfilePicture,
} from "@src/features/main/member/profile/schema/post.types";

// Type definition for organization event query parameters
export interface OrganizationEventQueryParams {
  page?: number;
  per_page?: number;
  account_uuid: string;
}

// Type definition for event participant (used for both requests and members)
export interface EventParticipant {
  rsvp_id: number;
  rsvp_status: string;
  account: CommentAccount;
  user: Member;
}

// Type definition for event image
export interface EventImage {
  id: number;
  directory: string;
  filename: string;
}

// Type definition for event address
export interface EventAddress {
  id: number;
  country: string;
  province: string;
  city: string;
  barangay: string;
  house_building_number: string;
  country_code: string;
  province_code: string;
  city_code: string;
  barangay_code: string;
}

export interface RSVPData {
  rsvp_id: number;
  status: string;
}

// Type definition for event data
export interface EventData {
  id: number;
  organization_id: number;
  title: string;
  event_date: string;
  address_id: number;
  description: string;
  image: EventImage;
  created_date: string;
  last_modified_date: string;
  total_comments: number;
  total_members: number;
  total_pending_rsvps: number;
  organization: Organization;
  organization_name: string;
  address: EventAddress;
  members: EventParticipant[];
  pending_rsvps: EventParticipant[];
  limited_comments: ContentComment[];
  latest_comments: ContentComment[];
  user_membership_status_with_organizer: string;
  user_rsvp: RSVPData;
  logo: ProfilePicture | null;
}

/**
 * Type definition for paginated events response
 */
export type EventsResponse = {
  page: number;
  page_size: number;
  active_events: EventData[];
  total: number;
};

/**
 * Interface for the infinite query response structure
 */
export interface InfiniteEventsResponse {
  pages: EventsResponse[];
  pageParams: number[];
}

/**
 * Type definition for random events query parameters
 */
export interface RandomEventsQueryParams {
  page?: number;
  limit?: number;
}

/**
 * Type definition for random events pagination
 */
export interface RandomEventsPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

/**
 * Type definition for random events response
 */
export interface RandomEventsResponse {
  random_events: EventData[];
  pagination: RandomEventsPagination;
}

/**
 * Interface for the infinite random events query response structure
 */
export interface InfiniteRandomEventsResponse {
  pages: RandomEventsResponse[];
  pageParams: number[];
}

/**
 * Type definition for individual RSVP participant
 */
export interface EventRsvpParticipant {
  rsvp_id: number;
  status: string;
  account_id: number;
  uuid: string;
  email: string;
  first_name: string;
  last_name: string;
  bio: string;
  profile_picture: ProfilePicture;
}

/**
 * Type definition for event RSVPs response
 */
export interface EventRsvpsResponse {
  event_id: number;
  rsvps: EventRsvpParticipant[];
}

/**
 * Type definition for paginated past events response
 */
export type PastEventsResponse = {
  page: number;
  page_size: number;
  past_events: EventData[];
  total: number;
};

/**
 * Interface for the infinite past events query response structure
 */
export interface InfinitePastEventsResponse {
  pages: PastEventsResponse[];
  pageParams: number[];
}

export interface EventActivePostProps {
  event: EventData;
  currentUserAvatar: string;
  isUserMember?: boolean;
  onViewMoreComments?: (eventId: number) => void;
  onViewMoreMembers?: (eventId: number) => void;
  onViewMoreRequests?: (eventId: number) => void;
  onEdit?: (eventId: number) => void;
  onDelete?: (eventId: number) => void;
  onJoinOrganization?: (orgId: number) => void;
  onCancelJoiningOrganization?: (orgId: number) => void;
  onLeaveOrganization?: (orgId: number) => void;
  onRsvpEvent?: (eventId: number) => void;
  onDeleteRsvpEvent?: (rsvpId: number) => void;
}
