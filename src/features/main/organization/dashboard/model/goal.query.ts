import { useQuery } from "@tanstack/react-query";
import { getGoalsByOrganization, getGoalDetails } from "../lib/goal.api";
import { QUERY_KEYS } from "@src/shared/constants/queryKeys";
import type { GoalsResponse, Goal } from "../schema/goal.type";

export const useGetGoals = (organizationId: number) => {
  return useQuery<GoalsResponse, Error>({
    queryKey: [QUERY_KEYS.ORGANIZATION_GOALS, organizationId],
    queryFn: async () => await getGoalsByOrganization(organizationId),
    staleTime: 60 * 1000,
  });
};

export const useGetGoal = (goalId: number, enabled: boolean = true) => {
  return useQuery<Goal, Error>({
    queryKey: [QUERY_KEYS.ORGANIZATION_GOALS, goalId],
    queryFn: () => getGoalDetails(goalId),
    enabled: enabled && !!goalId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
};
