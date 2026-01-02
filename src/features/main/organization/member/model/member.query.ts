import { useQuery } from "@tanstack/react-query";
import { getOrganizationMembers, getMemberRequests } from "../lib/member.api";
import { QUERY_KEYS } from "@src/shared/constants/queryKeys";

export const useOrganizationMembers = (organizationId: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ORGANIZATION_MEMBERS, organizationId],
    queryFn: () => getOrganizationMembers(organizationId),
  });
};

export const useMemberRequests = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.ORGANIZATION_MEMBER_REQUESTS],
    queryFn: () => getMemberRequests(),
  });
};
