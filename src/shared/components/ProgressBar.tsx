interface ModernProgressBarProps {
  progress: number;
  className?: string;
  currentValue?: number;
  targetValue?: number;
  isCardHovered?: boolean;
}

export default function ModernProgressBar({
  progress,
  className = "",
  currentValue,
  targetValue,
  isCardHovered = false,
}: ModernProgressBarProps) {
  const showValue = isCardHovered && currentValue !== undefined && targetValue !== undefined;

  return (
    <div className={`flex-1 relative ${className}`}>
      <div className={`h-5 bg-gray-200 rounded-full overflow-hidden relative`}>
        <div
          className="h-full bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-700 rounded-full transition-all duration-300 ease-out shadow-sm flex items-center justify-center"
          style={{ width: `${progress}%` }}
        >
          {showValue && (
            <span className="text-white text-xs font-semibold whitespace-nowrap px-1">
              {currentValue}/{targetValue}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}