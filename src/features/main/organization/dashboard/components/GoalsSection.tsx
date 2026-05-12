import { useState, useCallback, useRef, useEffect } from "react";
import { LoadingState } from "@src/shared/components";
import { CreateGoalModal } from "@src/shared/components/modals/CreateGoalModal";
import GoalCard from "@src/shared/components/GoalCard";
import RecommendationCard from "@src/shared/components/RecommendationCard";
import { GOAL_FILTERS, type GoalFilterType } from "../lib/goalFilters";

interface Goal {
  id: number;
  title: string;
  type: string;
  progress: number;
  startDate: string;
  endDate: string;
  color: "gray" | "green" | "pink";
  hasRecommendation?: boolean;
}

const generateMockGoals = (page: number, perPage: number = 3): Goal[] => {
  const allGoals: Goal[] = [
    {
      id: 1,
      title: "June July Goal",
      type: "Member Growth Goal",
      progress: 79,
      startDate: "Jun 1, 2025",
      endDate: "Jul 26, 2025",
      color: "gray",
      hasRecommendation: false,
    },
    {
      id: 2,
      title: "May",
      type: "Member Growth Goal",
      progress: 79,
      startDate: "Jun 1, 2025",
      endDate: "Jul 26, 2025",
      color: "green",
      hasRecommendation: true,
    },
    {
      id: 3,
      title: "May",
      type: "Member Growth Goal",
      progress: 79,
      startDate: "Jun 1, 2025",
      endDate: "Jul 26, 2025",
      color: "pink",
      hasRecommendation: true,
    },
    {
      id: 4,
      title: "Q3 Engagement Goal",
      type: "Member Growth Goal",
      progress: 65,
      startDate: "Jul 1, 2025",
      endDate: "Sep 30, 2025",
      color: "gray",
      hasRecommendation: false,
    },
    {
      id: 5,
      title: "August Target",
      type: "Member Growth Goal",
      progress: 82,
      startDate: "Aug 1, 2025",
      endDate: "Aug 31, 2025",
      color: "green",
      hasRecommendation: true,
    },
  ];

  const startIndex = page * perPage;
  return allGoals.slice(startIndex, startIndex + perPage);
};

export default function GoalsSection() {
  const [goals, setGoals] = useState<Goal[]>(generateMockGoals(0));
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [goalFilter, setGoalFilter] = useState<GoalFilterType>("all");
  const [isCreateGoalModalOpen, setIsCreateGoalModalOpen] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const handleEditGoal = (goalId: number) => {
    console.log("Edit goal:", goalId);
    // TODO: Implement edit functionality
  };

  const handleDeleteGoal = (goalId: number) => {
    console.log("Delete goal:", goalId);
    // TODO: Implement delete functionality
  };

  const handleOpenCreateGoalModal = () => {
    setIsCreateGoalModalOpen(true);
  };

  const handleCloseCreateGoalModal = () => {
    setIsCreateGoalModalOpen(false);
  };

  const handleLoadMore = useCallback(() => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    setTimeout(() => {
      const newGoals = generateMockGoals(page + 1);
      if (newGoals.length === 0) {
        setHasMore(false);
      } else {
        setGoals((prev) => [...prev, ...newGoals]);
        setPage((prev) => prev + 1);
      }
      setIsLoading(false);
    }, 600);
  }, [page, isLoading, hasMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          handleLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => {
      if (sentinelRef.current) {
        observer.unobserve(sentinelRef.current);
      }
    };
  }, [handleLoadMore, hasMore, isLoading]);

  return (
    <div className="w-full min-h-screen bg-athens_gray py-4 sm:py-6 lg:py-8">
      {/* Mobile Layout */}
      <div className="lg:hidden px-4 sm:px-6">
        <div className="mb-6 flex flex-row items-center justify-start gap-3">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Goals
          </h2>
          <button
            onClick={handleOpenCreateGoalModal}
            className="px-4 sm:px-5 py-2 bg-slate-700 text-white rounded-full font-medium text-sm sm:text-base hover:bg-slate-800 transition-colors inline-flex items-center gap-2"
          >
            <span>⊕</span>
            Create Goal
          </button>
          <div className="relative">
            <select
              value={goalFilter}
              onChange={(e) => setGoalFilter(e.target.value as GoalFilterType)}
              className="px-3 sm:px-4 py-2 bg-white text-slate-700 border border-gray-300 rounded-lg font-medium text-sm sm:text-base hover:border-gray-400 transition-colors appearance-none cursor-pointer pr-8"
            >
              {GOAL_FILTERS.map((filter) => (
                <option key={filter.id} value={filter.id}>
                  {filter.icon} {filter.label}
                </option>
              ))}
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-600">
              ▼
            </span>
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

          {hasMore && (
            <div
              ref={sentinelRef}
              className="w-full h-16 flex items-center justify-center text-slate-500"
            >
              <span className="text-xs sm:text-sm">Scroll to load more goals</span>
            </div>
          )}

          {!hasMore && goals.length > 0 && (
            <div className="text-center py-3 text-slate-500">
              <p className="text-xs sm:text-sm">No more goals to load</p>
            </div>
          )}
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block px-30 mx-auto">
        <div className="mb-6 flex flex-row items-center justify-start gap-3">
          <h2 className="text-3xl font-bold text-slate-900">Goals</h2>
          <button
            onClick={handleOpenCreateGoalModal}
            className="px-5 py-2 bg-slate-700 text-white rounded-full font-medium text-base hover:bg-slate-800 transition-colors inline-flex items-center gap-2"
          >
            <span>⊕</span>
            Create Goal
          </button>
          <div className="relative">
            <select
              value={goalFilter}
              onChange={(e) => setGoalFilter(e.target.value as GoalFilterType)}
              className="px-6 py-2 bg-white text-slate-700 border border-gray-300 rounded-full font-medium text-base hover:border-gray-400 transition-colors appearance-none cursor-pointer pr-8"
            >
              {GOAL_FILTERS.map((filter) => (
                <option key={filter.id} value={filter.id}>
                  {filter.icon} {filter.label}
                </option>
              ))}
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-600">
              ▼
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {goals.map((goal) => (
            <div key={goal.id} className="flex gap-4 items-stretch">
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
                  <RecommendationCard color={goal.color} />
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

          {hasMore && (
            <div
              ref={sentinelRef}
              className="w-full h-20 flex items-center justify-center text-slate-500"
            >
              <span className="text-sm">Scroll to load more goals</span>
            </div>
          )}

          {!hasMore && goals.length > 0 && (
            <div className="text-center py-4 text-slate-500">
              <p className="text-sm">No more goals to load</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Goal Modal */}
      <CreateGoalModal
        isOpen={isCreateGoalModalOpen}
        onClose={handleCloseCreateGoalModal}
      />
    </div>
  );
}