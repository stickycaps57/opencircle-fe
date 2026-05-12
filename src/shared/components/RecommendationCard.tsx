interface RecommendationCardProps {
  color: "gray" | "green" | "pink";
  title?: string;
}

export default function RecommendationCard({
  color,
  title = "Member Growth Goal",
}: RecommendationCardProps) {
  const bgColorClasses = {
    gray: "bg-white",
    green: "bg-green-50",
    pink: "bg-red-50",
  };

  return (
    <div
      className={`${bgColorClasses[color]} rounded-full p-4 sm:p-6 border border-gray-200 flex-shrink-0 flex items-center justify-center`}
    >
      <div className="flex flex-col items-center justify-center text-center">
        <p className="text-xs sm:text-sm text-slate-700 font-medium">
          {title}
        </p>
      </div>
    </div>
  );
}