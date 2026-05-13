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
      className={`${bgColorClasses[color]} ${borderColorClasses[color]} rounded-full p-6 sm:p-8 border flex-shrink-0 flex flex-col gap-2`}
    >
      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
        {message}
      </p>
    </div>
  );
}