import {
  RoleId,
  type Member,
  type Organization,
} from "@src/features/auth/schema/auth.types";

/**
 * Type guard to check if user is a Member
 * @param user - User object to check
 * @returns True if user is a Member
 */
export function isMember(user: Member | Organization | null): user is Member {
  return user?.role_id === RoleId.Member;
}

/**
 * Type guard to check if user is an Organization
 * @param user - User object to check
 * @returns True if user is an Organization
 */
export function isOrganization(
  user: Member | Organization | null
): user is Organization {
  return user?.role_id === RoleId.Organization;
}
