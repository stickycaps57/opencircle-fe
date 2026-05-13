export type GoalFilterType = "all" | "inProgress" | "achieved" | "behindTarget";

export interface GoalFilter {
  id: GoalFilterType;
  label: string;
  icon: string;
}

export const GOAL_FILTERS: GoalFilter[] = [
  { id: "all", label: "All", icon: "📊" },
  { id: "inProgress", label: "In Progress", icon: "🚀" },
  { id: "achieved", label: "Achieved", icon: "✅" },
  { id: "behindTarget", label: "Behind Target", icon: "⚠️" },
];
