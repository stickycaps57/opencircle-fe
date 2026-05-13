import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createGoal, updateGoal, deleteGoal } from "../lib/goal.api";
import type { CreateGoalFormData } from "../schema/goal.schema";
import type { CreateGoalPayload, UpdateGoalPayload } from "../lib/goal.api";
import { QUERY_KEYS } from "@src/shared/constants/queryKeys";
import { showSuccessToast, showErrorToast } from "@src/shared/components/Toast/CustomToast";

export const useCreateGoal = (organizationId: number) => {
  const queryClient = useQueryClient();

  return useMutation<
    { success: boolean; message: string; goal_id?: number },
    Error,
    CreateGoalFormData
  >({
    mutationFn: (formData) => {
      const payload: CreateGoalPayload = {
        organization_id: organizationId,
        goal_type: formData.goalType,
        title: formData.goalName,
        target_value: parseInt(formData.targetNumber),
        start_date: formData.startDate,
        end_date: formData.endDate,
      };
      return createGoal(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ORGANIZATION_GOALS],
        exact: false,
      });
      showSuccessToast("Goal created successfully");
    },
    onError: (error) => {
      console.error("Goal creation error:", error);
      showErrorToast("Failed to create goal");
    },
  });
};

export const useUpdateGoal = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { success: boolean; message: string },
    Error,
    { goalId: number; formData: CreateGoalFormData }
  >({
    mutationFn: ({ goalId, formData }) => {
      const payload: UpdateGoalPayload = {
        title: formData.goalName,
        target_value: parseInt(formData.targetNumber),
        start_date: formData.startDate,
        end_date: formData.endDate,
      };
      return updateGoal(goalId, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ORGANIZATION_GOALS],
        exact: false,
      });
      showSuccessToast("Goal updated successfully");
    },
    onError: (error) => {
      console.error("Goal update error:", error);
      showErrorToast("Failed to update goal");
    },
  });
};

export const useDeleteGoal = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: (goalId) => deleteGoal(goalId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ORGANIZATION_GOALS],
        exact: false,
      });
      showSuccessToast("Goal deleted successfully");
    },
    onError: (error) => {
      console.error("Goal deletion error:", error);
      showErrorToast("Failed to delete goal");
    },
  });
};
