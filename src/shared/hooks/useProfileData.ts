import type {
  Member,
  Organization,
} from "@src/features/auth/schema/auth.types";

import avatarImage from "@src/assets/shared/avatar.png";
import { useImageUrl } from "./useImageUrl";
import { isMember, isOrganization } from "@src/shared/utils/checkAuthenticatedRole";

/**
 * Type for the profile data that can be either Member or Organization
 */
export type ProfileData =
  | Member
  | Organization
  | {
      name: string;
      role: string;
      role_id?: number;
      email?: string;
      bio?: string;
      avatarUrl?: string;
      user_membership_status?: string;
      id: number;
      organizer_view_user_membership?: string;
      uuid?: string;
    };

// Type guard functions for ProfileData type (which can include custom profile objects)
export const isMemberType = (profile: ProfileData): profile is Member =>
  "first_name" in profile && "last_name" in profile;

export const isOrganizationType = (
  profile: ProfileData
): profile is Organization => "description" in profile && "name" in profile;

/**
 * Custom hook for handling profile data operations
 * @param profile - The profile data object (Member, Organization, or custom profile)
 * @returns Object containing utility functions for profile data
 */
export function useProfileData(profile: ProfileData | null | undefined) {
  const { getImageUrl: generateImageUrl } = useImageUrl();
  const toTitleCase = (s: string) =>
    s
      .split(" ")
      .map((w) => (w ? w[0].toUpperCase() + w.slice(1).toLowerCase() : ""))
      .join(" ");

  // Determine if the profile is a Member or Organization using shared type guards
  const isMemberProfile = profile ? isMember(profile as Member | Organization | null) : false;
  const isOrganizationProfile = profile ? isOrganization(profile as Member | Organization | null) : false;

  /**
   * Get the display name based on profile type
   */
  const getName = () => {
    if (!profile) return "Unknown";

    if (isMemberProfile && isMemberType(profile)) {
      return `${profile.first_name} ${profile.last_name}`;
    } else if (isOrganizationProfile && isOrganizationType(profile)) {
      return profile.name;
    }
    // For custom profile object
    return "name" in profile ? profile.name : "Unknown";
  };

  /**
   * Get the role or category based on profile type
   */
  const getRole = () => {
    if (!profile) return "";

    if (isMemberProfile) {
      return "Member";
    } else if (isOrganizationProfile && isOrganizationType(profile)) {
      return `Organization | ${profile.category}`;
    }
    // For custom profile object
    return "role" in profile ? toTitleCase(profile.role) : "";
  };

  /**
   * Get the bio or description based on profile type
   */
  const getBio = () => {
    if (!profile) return "";

    if (isMemberProfile && isMemberType(profile)) {
      return profile.bio;
    } else if (isOrganizationProfile && isOrganizationType(profile)) {
      return profile.description;
    }
    // For custom profile object
    return "bio" in profile ? profile.bio : "";
  };

  /**
   * Get the profile image URL based on profile type
   */
const getImageUrl = (): string => {
  if (!profile) return avatarImage;

  if (isMemberProfile && isMemberType(profile)) {
    const pic = profile.profile_picture;
    if (!pic) return avatarImage;

    if (pic) {
      const url = generateImageUrl(pic);
      return url || avatarImage;
    }

    return avatarImage;
  }

  if (isOrganizationProfile && isOrganizationType(profile)) {
    const logo = profile.logo;
    if (!logo) return avatarImage;

    if (logo) {
      const url = generateImageUrl(logo);
      return url || avatarImage;
    }

    return avatarImage;
  }

  if ("avatarUrl" in profile && typeof profile.avatarUrl === "string") {
    return profile.avatarUrl || avatarImage;
  }

  return avatarImage;
};


  /**
   * Get the email if available
   */
  const getEmail = () => {
    if (!profile) return undefined;
    return "email" in profile ? profile.email : undefined;
  };

  const getUsername = () => {
    if (!profile) return undefined;
    return "username" in profile ? profile.username : undefined;
  };

  return {
    isMember: isMemberProfile,
    isOrganization: isOrganizationProfile,
    getName,
    getRole,
    getBio,
    getImageUrl,
    getEmail,
    getUsername,
  };
}
