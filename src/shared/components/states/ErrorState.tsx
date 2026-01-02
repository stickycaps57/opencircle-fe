interface ErrorStateProps {
  message?: string;
  className?: string;
  onRetry?: () => void;
}

/**
 * A reusable error state component to display when an error occurs during data fetching
 */
export function ErrorState({
  message = "Failed to load data. Please try again later.",
  className = "text-center py-8",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className={className}>
      <p className="text-red-500">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/80 text-sm"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
