import type { ProfilePicture, AllMemberPostData } from "@src/features/main/member/profile/schema/post.types";
import type { OrganizationMembership } from "@src/features/main/member/organization/schema/organization.types";
import type { EventData } from "@src/features/main/organization/profile/schema/event.type";

export interface MemberProfileResponse {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  bio: string;
  profile_picture: ProfilePicture;
  created_date: string;
  recent_posts: AllMemberPostData[];
  recent_shares: AllMemberPostData[];
  organizations: OrganizationMembership[];
  recent_events: EventData[];
  organizer_view_user_membership: string;
  uuid: string; 
}