import ModernProgressBar from "./ProgressBar";
import deleteIcon from "@src/assets/shared/delete_icon.svg";
import editIcon from "@src/assets/shared/edit_icon.svg";
import goalCardIcon from "@src/assets/shared/goal_card_icon.png";

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

  return (
    <div
      className={`${bgColorClasses[color]} rounded-3xl shadow-lg p-3 sm:p-4 md:p-6 flex gap-3 sm:gap-4 md:gap-6 transition-shadow hover:shadow-md flex-1 items-center`}
    >
      {/* Icon/Avatar */}
      <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full flex-shrink-0 flex items-center justify-center">
        <img src={goalCardIcon} alt="Goal" className="w-full h-full" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col justify-between py-1 sm:py-2">
        {/* Title Row with Action Buttons */}
        <div className="flex items-center justify-between gap-2 mb-1">
          <h3 className="text-xs sm:text-base md:text-lg lg:text-xl font-bold text-slate-900 truncate">
            {title}
          </h3>
          <div className="flex-shrink-0 flex items-center gap-0.5 sm:gap-1">
            <button
              onClick={() => onEdit?.(id)}
              className="p-1 sm:p-1.5 hover:bg-black/10 rounded-lg transition-colors flex-shrink-0"
              title="Edit goal"
            >
              <img src={editIcon} alt="Edit" className="w-3.5 sm:w-4 md:w-5 h-3.5 sm:h-4 md:h-5" />
            </button>
            <button
              onClick={() => onDelete?.(id)}
              className="p-1 sm:p-1.5 hover:bg-black/10 rounded-lg transition-colors flex-shrink-0"
              title="Delete goal"
            >
              <img src={deleteIcon} alt="Delete" className="w-3.5 sm:w-4 md:w-5 h-3.5 sm:h-4 md:h-5" />
            </button>
          </div>
        </div>

        {/* Type, Date, Progress Bar, Percentage - Same Row */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-wrap md:flex-nowrap">
          {/* Type & Date */}
          <div className="flex-shrink-0 min-w-fit max-w-[100px] sm:max-w-[150px]">
            <p className="text-xs sm:text-sm md:text-base font-medium text-slate-700 truncate">
              {type}
            </p>
            <p className="text-[10px] sm:text-xs md:text-sm text-slate-500 mt-0.5 truncate">
              {startDate} to {endDate}
            </p>
          </div>

          {/* Progress Bar - Center */}
          <ModernProgressBar
            progress={progress}
            className="min-w-[60px] sm:min-w-[80px] md:min-w-[120px]"
          />

          {/* Progress Percentage */}
          <div className="flex-shrink-0 min-w-fit text-right">
            <p className="text-sm sm:text-lg md:text-xl lg:text-2xl font-semibold text-slate-900">
              {progress}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}