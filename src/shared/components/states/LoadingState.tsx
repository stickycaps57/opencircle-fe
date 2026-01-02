interface LoadingStateProps {
  message?: string;
  className?: string;
}

/**
 * A reusable loading state component to display when data is being fetched
 */
export function LoadingState({
  message = "Loading...",
  className = "text-center py-8",
}: LoadingStateProps) {
  return (
    <div className={className}>
      <p className="text-primary-75">{message}</p>
    </div>
  );
}
