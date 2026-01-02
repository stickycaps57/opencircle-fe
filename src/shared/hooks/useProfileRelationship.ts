import { useAuthStore } from "@src/shared/store";
import { useProfileData, type ProfileData } from "./useProfileData";
import { isMember as isUserMemberCheck, isOrganization as isUserOrganizationCheck } from "@src/shared/utils";

export const useProfileRelationship = (profile?: ProfileData | null) => {
  const { user } = useAuthStore();
  
  // Get profile type info using existing hook
  const { isOrganization: isProfileOrganization, isMember: isProfileMember } = useProfileData(profile);

  // Check visitor type
  const isVisitorMember = isUserMemberCheck(user);
  const isVisitorOrganizer = isUserOrganizationCheck(user);

  // Check if visiting own profile
  const isOwnProfile =
    !!user &&
    !!profile &&
    profile.uuid === user.uuid;

  // Determine relationship
  const isMemberVisitingOrganization =
    isVisitorMember && isProfileOrganization && !isOwnProfile;

  const isOrganizationVisitingMember =
    isVisitorOrganizer && isProfileMember && !isOwnProfile;

  const isOrganizationVisitingOrganization =
    isVisitorOrganizer && isProfileOrganization && !isOwnProfile;

  const isMemberVisitingAnotherMember =
    isVisitorMember && isProfileMember && !isOwnProfile;

  return {
    isMemberVisitingOrganization,
    isOrganizationVisitingMember,
    isOrganizationVisitingOrganization,
    isMemberVisitingAnotherMember,
    isOwnProfile,
    isVisitorMember,
    isVisitorOrganizer,
  };
};
