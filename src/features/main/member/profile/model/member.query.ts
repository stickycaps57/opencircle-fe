import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@src/shared/constants/queryKeys";
import { getMemberProfile } from "../lib/event.api";
import type { MemberProfileResponse } from "../schema/profile.types";

export const useMemberProfileQuery = (accountUuid?: string) => {
  return useQuery<MemberProfileResponse>({
    queryKey: [QUERY_KEYS.MEMBER, "profile", accountUuid],
    queryFn: () => getMemberProfile(accountUuid!),
    enabled: !!accountUuid,
    staleTime: 5 * 60 * 1000,
  });
};