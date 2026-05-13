import { useState, useEffect } from "react";
import { LoadingState, ErrorState } from "@src/shared/components";
import { ConfirmationModal } from "@src/shared/components/modals";
import { CreateGoalModal } from "@src/shared/components/modals/CreateGoalModal";
import GoalCard from "@src/shared/components/GoalCard";
import RecommendationCard from "@src/shared/components/RecommendationCard";
import { GOAL_FILTERS, type GoalFilterType } from "../lib/goalFilters";
import { useInfiniteGoals } from "../model/goal.infinite.query";
import { useAuthStore } from "@src/shared/store";
import { useInfiniteScroll, useConfirmationModal } from "@src/shared/hooks";
import { GOAL_RECOMMENDATIONS } from "../lib/goalRecommendations";
import { useDeleteGoal } from "../model/goal.mutation";
import createGoalIcon from "@src/assets/shared/create_goal_icon.png";

interface TransformedGoal {
  id: number;
  title: string;
  type: string;
  progress: number;
  startDate: string;
  endDate: string;
  color: "gray" | "green" | "pink";
  hasRecommendation?: boolean;
  target_reached: boolean | null;
  recommendationMessage?: string;
}

const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
};

const getGoalTypeLabel = (goalType: string): string => {
  const typeMap: Record<string, string> = {
    member_growth: "Member Growth Goal",
    event_participation: "Event Participation Goal",
    engagement: "Engagement Goal",
    announcement_activity: "Announcement Activity Goal",
    retention: "Retention Goal",
  };
  return typeMap[goalType] || goalType;
};

const getGoalColor = (
  status: string,
  targetReached: boolean | null
): "gray" | "green" | "pink" => {
  // Achieved goals are always green
  if (status === "achieved") return "green";

  // Already behind target
  if (status === "behind_target") return "pink";

  // For in_progress goals: check if midpoint expectation was met
  if (status === "in_progress") {
    // If target_reached is null, goal is before midpoint - neutral
    if (targetReached === null) return "gray";
    // If target_reached is false, goal is behind on expectations at midpoint
    if (targetReached === false) return "pink";
    // If target_reached is true, goal is on track at midpoint
    return "green";
  }

  return "gray";
};

const shouldShowRecommendation = (
  status: string,
  targetReached: boolean | null
): boolean => {
  // Don't show recommendation before midpoint (target_reached is null)
  if (targetReached === null) return false;

  // Show recommendation for behind target (warning)
  if (status === "behind_target") return true;

  // Show recommendation for in_progress goals (both positive and negative)
  if (status === "in_progress") return true;

  // Show recommendation for achieved goals (success celebration)
  if (status === "achieved" && targetReached) return true;

  return false;
};

const getStatusFromFilter = (filter: GoalFilterType): string | undefined => {
  const statusMap: Record<GoalFilterType, string | undefined> = {
    all: undefined,
    inProgress: "in_progress",
    achieved: "achieved",
    behindTarget: "behind_target",
  };
  return statusMap[filter];
};

export default function GoalsSection() {
  const { user } = useAuthStore();
  const organizationId = user?.id || 0;

  const [goals, setGoals] = useState<TransformedGoal[]>([]);
  const [goalFilter, setGoalFilter] = useState<GoalFilterType>("all");
  const [isCreateGoalModalOpen, setIsCreateGoalModalOpen] = useState(false);
  const [goalFormMode, setGoalFormMode] = useState<"create" | "edit">("create");
  const [selectedGoalId, setSelectedGoalId] = useState<number | null>(null);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const { isConfirmModalOpen, modalConfig, openConfirmationModal, closeConfirmationModal } = useConfirmationModal();
  const deleteGoalMutation = useDeleteGoal();

  const {
    data: infiniteGoalsData,
    isLoading,
    error: goalsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteGoals({
    organizationId,
    page_size: 10,
    status: getStatusFromFilter(goalFilter),
  });

  const handleFetchNextPage = () => {
    if (!isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  };

  const { sentinelRef } = useInfiniteScroll({
    onLoadMore: handleFetchNextPage,
    hasMore: !!hasNextPage,
  });

  useEffect(() => {
    if (infiniteGoalsData?.pages) {
      const allGoals = infiniteGoalsData.pages.flatMap((page) => page.goals);
      const transformedGoals = allGoals.map((goal): TransformedGoal => {
        const showRecommendation = shouldShowRecommendation(
          goal.status,
          goal.target_reached
        );
        const isPositive = goal.target_reached === true || goal.status === "achieved";

        let recommendationMessage = "";

        if (showRecommendation) {
          const recommendations = GOAL_RECOMMENDATIONS[goal.goal_type];
          if (recommendations) {
            const rec = isPositive
              ? recommendations.positive
              : recommendations.negative;
            recommendationMessage = rec.message;
          }
        }

        return {
          ...goal,
          color: getGoalColor(goal.status, goal.target_reached),
          hasRecommendation: showRecommendation,
          startDate: formatDate(goal.start_date),
          endDate: formatDate(goal.end_date),
          type: getGoalTypeLabel(goal.goal_type),
          progress: goal.progress.progress_percentage,
          title: goal.title,
          recommendationMessage,
        };
      });
      setGoals(transformedGoals);
    }
  }, [infiniteGoalsData]);

  const handleEditGoal = (goalId: number) => {
    setSelectedGoalId(goalId);
    setGoalFormMode("edit");
    setIsCreateGoalModalOpen(true);
  };

  const handleDeleteGoal = (goalId: number) => {
    openConfirmationModal({
      title: "Delete Goal",
      message: "This will permanently remove the goal and all related details. Proceed?",
      confirmButtonText: "Delete",
      confirmButtonVariant: "primary",
      onConfirm: async () => {
        try {
          await deleteGoalMutation.mutateAsync(goalId);
        } catch (error) {
          console.error("Failed to delete goal:", error);
        }
      },
    });
  };

  const handleOpenCreateGoalModal = () => {
    setSelectedGoalId(null);
    setGoalFormMode("create");
    setIsCreateGoalModalOpen(true);
  };

  const handleCloseCreateGoalModal = () => {
    setSelectedGoalId(null);
    setGoalFormMode("create");
    setIsCreateGoalModalOpen(false);
  };

  if (goalsError) {
    return (
      <div className="w-full min-h-screen bg-athens_gray py-4 sm:py-6 lg:py-8">
        <div className="px-4 sm:px-6 lg:px-30">
          <ErrorState message="An error occurred while fetching goals. Please try again later." />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-athens_gray py-4 sm:py-6 lg:py-8">
      {/* Mobile Layout */}
      <div className="lg:hidden px-4 sm:px-6">
        <div className="mb-6 flex flex-row items-center justify-start gap-3">
          <h2 className="text-responsive-base font-bold text-primary">Goals</h2>
          <button
            onClick={handleOpenCreateGoalModal}
            className="px-4 sm:px-5 py-2 bg-slate-700 text-white rounded-full font-medium text-sm sm:text-base hover:bg-slate-800 transition-colors inline-flex items-center gap-2"
          >
            <img src={createGoalIcon} alt="Create" className="w-5 h-5" />
            Create Goal
          </button>
          <div className="relative">
            <button
              onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
              className="px-3 sm:px-4 py-2 bg-white text-slate-700 border border-gray-300 rounded-lg font-medium text-sm sm:text-base hover:border-gray-400 transition-colors inline-flex items-center gap-2"
            >
              {typeof GOAL_FILTERS.find(f => f.id === goalFilter)?.icon === 'string' &&
              GOAL_FILTERS.find(f => f.id === goalFilter)!.icon.length > 2 ? (
                <img
                  src={GOAL_FILTERS.find(f => f.id === goalFilter)?.icon as string}
                  alt={goalFilter}
                  className="w-4 h-4"
                />
              ) : (
                <span>{GOAL_FILTERS.find(f => f.id === goalFilter)?.icon}</span>
              )}
              {GOAL_FILTERS.find(f => f.id === goalFilter)?.label}
              <span className="text-slate-600">▼</span>
            </button>
            {isFilterDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-10 min-w-[150px]">
                {GOAL_FILTERS.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => {
                      setGoalFilter(filter.id);
                      setIsFilterDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 flex items-center gap-2 hover:bg-gray-100 transition-colors ${
                      goalFilter === filter.id ? 'bg-blue-500 text-white' : 'text-slate-700'
                    }`}
                  >
                    {typeof filter.icon === 'string' && filter.icon.length > 2 ? (
                      <img src={filter.icon} alt={filter.id} className="w-4 h-4" />
                    ) : (
                      <span>{filter.icon}</span>
                    )}
                    {filter.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {goals.map((goal) => (
            <GoalCard
              key={goal.id}
              id={goal.id}
              title={goal.title}
              type={goal.type}
              progress={goal.progress}
              startDate={goal.startDate}
              endDate={goal.endDate}
              color={goal.color}
              onEdit={handleEditGoal}
              onDelete={handleDeleteGoal}
            />
          ))}

          {isLoading && (
            <div className="py-4">
              <LoadingState
                message="Loading more goals..."
                className="text-center"
              />
            </div>
          )}

          {goals.length === 0 && !isLoading && (
            <div className="text-center py-8">
              <p className="text-slate-600 text-sm">No goals found.</p>
            </div>
          )}

          {hasNextPage && (
            <div
              ref={sentinelRef}
              className="w-full h-16 flex items-center justify-center text-slate-500"
            >
              <span className="text-xs sm:text-sm">Scroll to load more goals</span>
            </div>
          )}
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block px-6 mx-auto">
        <div className="mb-6 flex flex-row items-center justify-start gap-3">
          <h2 className="text-responsive-base font-bold text-primary">Goals</h2>
          <button
            onClick={handleOpenCreateGoalModal}
            className="px-5 py-2 bg-slate-700 text-white rounded-full font-medium text-base hover:bg-slate-800 transition-colors inline-flex items-center gap-2"
          >
            <img src={createGoalIcon} alt="Create" className="w-5 h-5" />
            Create Goal
          </button>
          <div className="relative">
            <button
              onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
              className="px-6 py-2 bg-white text-slate-700 border border-gray-300 rounded-full font-medium text-base hover:border-gray-400 transition-colors inline-flex items-center gap-2"
            >
              {typeof GOAL_FILTERS.find(f => f.id === goalFilter)?.icon === 'string' &&
              GOAL_FILTERS.find(f => f.id === goalFilter)!.icon.length > 2 ? (
                <img
                  src={GOAL_FILTERS.find(f => f.id === goalFilter)?.icon as string}
                  alt={goalFilter}
                  className="w-5 h-5"
                />
              ) : (
                <span>{GOAL_FILTERS.find(f => f.id === goalFilter)?.icon}</span>
              )}
              {GOAL_FILTERS.find(f => f.id === goalFilter)?.label}
              <span className="text-slate-600">▼</span>
            </button>
            {isFilterDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-10 min-w-[180px]">
                {GOAL_FILTERS.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => {
                      setGoalFilter(filter.id);
                      setIsFilterDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 flex items-center gap-2 hover:bg-gray-100 transition-colors ${
                      goalFilter === filter.id ? 'bg-blue-500 text-white' : 'text-slate-700'
                    }`}
                  >
                    {typeof filter.icon === 'string' && filter.icon.length > 2 ? (
                      <img src={filter.icon} alt={filter.id} className="w-5 h-5" />
                    ) : (
                      <span>{filter.icon}</span>
                    )}
                    {filter.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4 items-center">
          {goals.map((goal) => (
            <div key={goal.id} className="flex gap-4 items-center">
              {/* Goal Card - Always 80% */}
              <div style={{ width: "80%" }}>
                <GoalCard
                  id={goal.id}
                  title={goal.title}
                  type={goal.type}
                  progress={goal.progress}
                  startDate={goal.startDate}
                  endDate={goal.endDate}
                  color={goal.color}
                  onEdit={handleEditGoal}
                  onDelete={handleDeleteGoal}
                />
              </div>

              {/* Recommendation Card - Always 20% space reserved */}
              <div style={{ width: "20%" }} className="flex-shrink-0">
                {goal.hasRecommendation && (
                  <RecommendationCard color={goal.color} message={goal.recommendationMessage || ""} />
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="py-6">
              <LoadingState
                message="Loading more goals..."
                className="text-center"
              />
            </div>
          )}

          {goals.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <p className="text-slate-600 text-base">No goals found.</p>
            </div>
          )}

          {hasNextPage && (
            <div
              ref={sentinelRef}
              className="w-full h-20 flex items-center justify-center text-slate-500"
            >
              <span className="text-sm">Scroll to load more goals</span>
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Goal Modal */}
      <CreateGoalModal
        isOpen={isCreateGoalModalOpen}
        onClose={handleCloseCreateGoalModal}
        mode={goalFormMode}
        goalId={selectedGoalId || undefined}
      />

      {/* Confirmation Modal */}
      {modalConfig && (
        <ConfirmationModal
          isOpen={isConfirmModalOpen}
          title={modalConfig.title}
          message={modalConfig.message}
          confirmButtonText={modalConfig.confirmButtonText}
          confirmButtonVariant={modalConfig.confirmButtonVariant}
          onConfirm={modalConfig.onConfirm}
          onClose={closeConfirmationModal}
        />
      )}
    </div>
  );
}