import { useQuery } from "@tanstack/react-query";
import { getTwoFAStatus } from "../lib/signup.api";
import type { TwoFAStatusResponse } from "@src/features/auth/schema/auth.types";
import { QUERY_KEYS } from "@src/shared/constants/queryKeys";

type Use2FAStatusOptions = {
  enabled?: boolean;
  staleTime?: number;
  cacheTime?: number;
  retry?: number;
};

export function use2FAStatus(options: Use2FAStatusOptions = {}) {
  const {
    enabled = true,
    staleTime = 60 * 1000, // 1 minute
    cacheTime = 5 * 60 * 1000, // 5 minutes
    retry = 1,
  } = options;

  return useQuery<TwoFAStatusResponse, Error>({
    queryKey: [QUERY_KEYS.TWO_FA_STATUS],
    queryFn: () => getTwoFAStatus(),
    staleTime,
    gcTime: cacheTime,
    retry,
    enabled,
  });
}