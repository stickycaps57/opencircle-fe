export interface GoalProgress {
  current_value: number;
  progress_percentage: number;
  status: "in_progress" | "achieved" | "behind_target";
  updated_date: string;
}

export interface Goal {
  id: number;
  organization_id: number;
  goal_type: string;
  title: string;
  target_value: number;
  start_date: string;
  end_date: string;
  status: "in_progress" | "achieved" | "behind_target";
  created_date: string;
  last_modified_date: string;
  progress: GoalProgress;
  target_reached: boolean;
}

export interface GoalsResponse {
  goals: Goal[];
  count: number;
  page: number;
  page_size: number;
  total_count: number;
  total_pages: number;
}
