import allIcon from "@src/assets/shared/all_icon.png";
import inProgressIcon from "@src/assets/shared/in_progress_icon.png";
import achievedIcon from "@src/assets/shared/achieved_icon.png";
import behindTargetIcon from "@src/assets/shared/behind_target_goals.png";

export type GoalFilterType = "all" | "inProgress" | "achieved" | "behindTarget";

export interface GoalFilter {
  id: GoalFilterType;
  label: string;
  icon: string;
}

export const GOAL_FILTERS: GoalFilter[] = [
  { id: "all", label: "All", icon: allIcon },
  { id: "inProgress", label: "In Progress", icon: inProgressIcon },
  { id: "achieved", label: "Achieved", icon: achievedIcon },
  { id: "behindTarget", label: "Behind Target", icon: behindTargetIcon },
];
