import axiosInstance from "@src/shared/api/axios";
import type { GoalsResponse, Goal } from "../schema/goal.type";

export interface GoalQueryParams {
  organizationId: number;
  page?: number;
  page_size?: number;
  status?: string;
}

export const getGoalsByOrganization = async (
  organizationId: number
): Promise<GoalsResponse> => {
  const response = await axiosInstance.get<GoalsResponse>(
    `/goals/${organizationId}`
  );
  return response.data;
};

export const getGoalsByOrganizationPaginated = async (
  params: GoalQueryParams
): Promise<GoalsResponse> => {
  const queryParams: Record<string, any> = {
    page: params.page || 1,
    page_size: params.page_size || 10,
  };

  if (params.status) {
    queryParams.status = params.status;
  }

  const response = await axiosInstance.get<GoalsResponse>(
    `/goals/${params.organizationId}`,
    {
      params: queryParams,
    }
  );
  return response.data;
};

export interface CreateGoalPayload {
  organization_id: number;
  goal_type: string;
  title: string;
  target_value: number;
  start_date: string;
  end_date: string;
}

export interface UpdateGoalPayload {
  title?: string | null;
  target_value?: number | null;
  start_date?: string | null;
  end_date?: string | null;
  status?: string | null;
}

export const createGoal = async (
  payload: CreateGoalPayload
): Promise<{ success: boolean; message: string; goal_id?: number }> => {
  const response = await axiosInstance.post("/goals/", payload);
  return response.data;
};

export const updateGoal = async (
  goalId: number,
  payload: UpdateGoalPayload
): Promise<{ success: boolean; message: string }> => {
  const response = await axiosInstance.put(`/goals/${goalId}`, payload);
  return response.data;
};

export const getGoalDetails = async (
  goalId: number
): Promise<Goal> => {
  const response = await axiosInstance.get<Goal>(`/goals/details/${goalId}`);
  return response.data;
};

export const deleteGoal = async (goalId: number): Promise<void> => {
  await axiosInstance.delete(`/goals/${goalId}`);
};
