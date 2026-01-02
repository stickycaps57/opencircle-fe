import { useQuery } from "@tanstack/react-query";
import {
  getOrganizationMemberships,
  getPendingOrganizationMemberships,
  searchOrganizations,
  getMemberJoinedOrganizations,
} from "../lib/organization.api";
import { QUERY_KEYS } from "@src/shared/constants/queryKeys";

export const useMemberJoinedOrganizationsQuery = (accountUuid?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.MEMBER_JOINED_ORGANIZATIONS, accountUuid],
    queryFn: () => getMemberJoinedOrganizations(accountUuid || ""),
    enabled: !!accountUuid,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export const useOrganizationMembershipsQuery = (accountUuid?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ORGANIZATION_MEMBERSHIP, accountUuid],
    queryFn: () => getOrganizationMemberships(accountUuid || ""),
    enabled: !!accountUuid,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export const usePendingOrganizationMembershipsQuery = (
  accountUuid?: string
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ORGANIZATION_MEMBER_REQUESTS, accountUuid],
    queryFn: () => getPendingOrganizationMemberships(accountUuid || ""),
    enabled: !!accountUuid,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export const useOrganizationSearchQuery = (query: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ORGANIZATION, "search", query],
    queryFn: () => searchOrganizations(query),
    enabled: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};
