import type { AllMemberPostData, ProfilePicture } from "@src/features/main/member/profile/schema/post.types";
import type { EventData, EventImage, RSVPData } from "@src/features/main/organization/profile/schema/event.type";

export interface ShareCreateResponse {
  shared_id: number;
  message: string;
}

export type AccountUserDetails = {
  type: "user";
  id: number;
  first_name: string;
  last_name: string;
  profile_picture: ProfilePicture | null;
  user_rsvp?: RSVPData;
};

export type AccountOrganizationDetails = {
  type: "organization";
  id: number;
  name: string;
  logo: ProfilePicture | null;
};

export type AccountDetails = AccountUserDetails | AccountOrganizationDetails;

export interface ShareItem {
  shared_id: number;
  message: string;
  comment: string;
  account_uuid: string;
  content_type: number;
  auth_user_rsvp?: RSVPData | null;
  date_created: string;
  content_details: AllMemberPostData | EventData;
  account?: AccountDetails;
  sharer?: ShareByContentSharer;
};

export interface SharesPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

// AllSharesResponse is defined below after related types

// Shares by specific content API types
export type ShareByContentSharer = {
  uuid: string;
  email: string;
  organization_name?: string | null;
  first_name: string | null;
  last_name: string | null;
  profile_picture?: ProfilePicture | null;
  logo?: ProfilePicture | null;
  user_rsvp?: RSVPData;
};

export type ShareByContentItem = {
  share_id: number;
  comment: string | null;
  date_created: string;
  sharer: ShareByContentSharer;
};

export interface ShareByContentResponse {
  content_type: number;
  content_id: number;
  shares: ShareByContentItem[];
  pagination: SharesPagination;
}

export interface UserSharesResponse {
  shares: ShareItem[];
  pagination: SharesPagination;
}

export interface InfiniteSharesResponse {
  pages: UserSharesResponse[];
  pageParams: number[];
}

export type InfiniteAllMemberPostsParams = {
  content_type?: number; 
  limit?: number
};

export interface SharesQueryParams {
  account_uuid: string;
  content_type?: number;
  page?: number;
  limit?: number;
}

// Types for /share/all_with_comments API response
import type { ContentComment } from "@src/features/comments/schema/comment.types";
import type { PostImage } from "@src/features/main/member/profile/schema/post.types";

export type ShareAuthorMinimal = {
  uuid: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  organization_name?: string | null;
  profile_picture?: ProfilePicture | null;
  organization_logo?: ProfilePicture | null;
};

export type ShareSharer = {
  id: number;
  organization_id: number;
  uuid: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  organization_name: string | null;
  profile_picture: ProfilePicture | null;
  logo?: ProfilePicture | null;
  user_rsvp?: RSVPData;
};

export type ShareContentPost = {
  type: "post";
  id: number;
  description: string;
  images: PostImage[];
  created_date: string;
  author: ShareAuthorMinimal;
};

export type ShareContentEvent = {
  type: "event";
  id: number;
  organization_id: number;
  title: string;
  description: string;
  event_date: string;
  created_date: string;
  image: EventImage;
  organization?: {
    name: string;
    category: string;
    address?: {
      province: string;
      city: string;
      barangay: string;
    };
    logo?: ProfilePicture | null;
    user_membership_status_with_organizer: string | null;
  };
};

export type ShareContent = ShareContentPost | ShareContentEvent;

export interface AllSharesItem {
  share_id: number;
  share_comment: string;
  share_date: string;
  sharer: ShareSharer;
  content: ShareContent;
  comments: ContentComment[];
  comments_count: number;
  auth_user_rsvp?: RSVPData;
}

export interface AllSharesResponse {
  shares: AllSharesItem[];
  pagination: SharesPagination;
}
