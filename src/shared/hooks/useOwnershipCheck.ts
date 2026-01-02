import { useAuthStore } from "@src/shared/store";

type OwnershipType = "comment" | "post" | "event";

/**
 * Utility function to check if the current authenticated user is the owner of a content item
 * This is NOT a React hook and can be safely used anywhere
 *
 * @param type - The type of content (comment, post, event)
 * @param ownerId - The ID of the content owner (for posts and events)
 * @param accountId - The account ID (for comments)
 * @returns boolean indicating if the current user is the owner
 */
export const checkOwnership = ({
  type,
  ownerId,
  accountId,
}: {
  type: OwnershipType;
  ownerId?: number | string;
  accountId?: number | string;
}): boolean => {
  const authUser = useAuthStore.getState().user;

  if (!authUser) return false;

  switch (type) {
    case "comment":
      return !!accountId && authUser.account_id === accountId;

    case "post":
      return !!ownerId && authUser.account_id === ownerId;

    case "event":
      return "name" in authUser && !!ownerId && authUser.account_id === ownerId;

    default:
      return false;
  }
};
