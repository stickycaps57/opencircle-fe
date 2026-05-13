interface RecommendationCardProps {
  color: "gray" | "green" | "pink";
  message: string;
}

export default function RecommendationCard({
  color,
  message,
}: RecommendationCardProps) {
  const bgColorClasses = {
    gray: "bg-white",
    green: "bg-green-50",
    pink: "bg-red-50",
  };

  const borderColorClasses = {
    gray: "border-gray-200",
    green: "border-green-200",
    pink: "border-red-200",
  };

  return (
    <div
      className={`${bgColorClasses[color]} ${borderColorClasses[color]} rounded-3xl shadow-lg p-3 sm:p-4 md:p-6 lg:p-8 border flex-shrink-0 flex flex-col gap-2 items-center`}
    >
      <p className="text-[10px] sm:text-xs md:text-sm text-slate-600 leading-relaxed text-center">
        {message}
      </p>
    </div>
  );
}