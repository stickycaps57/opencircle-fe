interface ModernProgressBarProps {
  progress: number;
  className?: string;
}

export default function ModernProgressBar({
  progress,
  className = "",
}: ModernProgressBarProps) {
  return (
    <div className={`flex-1 h-4 bg-gray-200 rounded-full overflow-hidden ${className}`}>
      <div
        className="h-full bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-700 rounded-full transition-all duration-300 ease-out shadow-sm"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}