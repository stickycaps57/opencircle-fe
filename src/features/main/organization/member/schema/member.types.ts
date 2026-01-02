// Type definition for profile picture
export interface ProfilePicture {
  id: number;
  directory: string;
  filename: string;
}

// Type definition for organization member
export interface OrganizationMember {
  user_id: number;
  account_uuid: string;
  first_name: string;
  last_name: string;
  bio: string;
  status: string;
  profile_picture: ProfilePicture | null;
}

export interface OrganizationMemberRequest {
  user_id: number;
  account_uuid: string;
  first_name: string;
  last_name: string;
  membership_id: number;
  bio: string;
  status: string;
  profile_picture: ProfilePicture | null;
}

// Type definition for organization members response
export interface OrganizationMembersResponse {
  organization_id: number;
  organization_name: string;
  members: OrganizationMember[];
  pending_applications: OrganizationMemberRequest[];
}

// Type definition for member requests response - Uses the same structure as OrganizationMembersResponse
export type MemberRequestsResponse = OrganizationMembersResponse;
