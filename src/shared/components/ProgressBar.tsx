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

  if (showValue && currentValue === 0) {
    return (
      <div className={`flex-1 relative ${className}`}>
        <div className={`h-5 bg-gray-200 rounded-full flex items-center justify-center pl-3`}>
          <span className="text-slate-600 text-xs font-semibold">
            {targetValue}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex-1 relative ${className}`}>
      <div className={`h-5 bg-gray-200 rounded-full overflow-hidden relative`}>
        <div
          className="h-full bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-700 rounded-full transition-all duration-300 ease-out shadow-sm flex items-center justify-center"
          style={{ width: `${progress}%` }}
        >
          {showValue && currentValue > 0 && (
            <span className="text-white text-xs font-semibold whitespace-nowrap px-2 pl-3">
              {currentValue}/{targetValue}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}