import ModernProgressBar from "./ProgressBar";
import deleteIcon from "@src/assets/shared/delete_icon.svg";
import editIcon from "@src/assets/shared/edit_icon.svg";

interface GoalCardProps {
  id: number;
  title: string;
  type: string;
  progress: number;
  startDate: string;
  endDate: string;
  color: "gray" | "green" | "pink";
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

export default function GoalCard({
  id,
  title,
  type,
  progress,
  startDate,
  endDate,
  color,
  onEdit,
  onDelete,
}: GoalCardProps) {
  const bgColorClasses = {
    gray: "bg-goal-gray",
    green: "bg-goal-green",
    pink: "bg-goal-pink",
  };

  const iconBgClasses = {
    gray: "bg-slate-700",
    green: "bg-green-700",
    pink: "bg-pink-700",
  };

  return (
    <div
      className={`${bgColorClasses[color]} rounded-3xl shadow-lg p-4 sm:p-6 flex gap-4 sm:gap-6 transition-shadow hover:shadow-md flex-1 items-center`}
    >
      {/* Icon/Avatar */}
      <div
        className={`${iconBgClasses[color]} w-14 h-14 sm:w-16 sm:h-16 rounded-full flex-shrink-0 flex items-center justify-center`}
      >
        <span className="text-2xl sm:text-3xl">🎯</span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col justify-between py-2">
        {/* Title Row with Action Buttons */}
        <div className="flex items-center justify-between gap-2 mb-1">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 truncate">
            {title}
          </h3>
          <div className="flex-shrink-0 flex items-center gap-1">
            <button
              onClick={() => onEdit?.(id)}
              className="p-1.5 hover:bg-black/10 rounded-lg transition-colors"
              title="Edit goal"
            >
              <img src={editIcon} alt="Edit" className="w-5 h-5" />
            </button>
            <button
              onClick={() => onDelete?.(id)}
              className="p-1.5 hover:bg-black/10 rounded-lg transition-colors"
              title="Delete goal"
            >
              <img src={deleteIcon} alt="Delete" className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Type, Date, Progress Bar, Percentage - Same Row */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Type & Date */}
          <div className="flex-shrink-0 min-w-fit max-w-[150px]">
            <p className="text-sm sm:text-base font-medium text-slate-700 truncate">
              {type}
            </p>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5 truncate">
              {startDate} to {endDate}
            </p>
          </div>

          {/* Progress Bar - Center */}
          <ModernProgressBar
            progress={progress}
            className="min-w-[80px] sm:min-w-[120px]"
          />

          {/* Progress Percentage */}
          <div className="flex-shrink-0 min-w-fit text-right">
            <p className="text-xl sm:text-2xl text-slate-900">
              {progress}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}