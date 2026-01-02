import { useQuery } from "@tanstack/react-query";
import { getOrganizationById } from "../lib/event.api";
import { QUERY_KEYS } from "@src/shared/constants/queryKeys";

export const useOrganizationByIdQuery = (organizationId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ORGANIZATION, organizationId],
    queryFn: () => getOrganizationById(organizationId || ""),
    enabled: !!organizationId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};