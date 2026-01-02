import { type FallbackProps } from "react-error-boundary";

interface ErrorBoundaryComponentProps extends FallbackProps {
  title?: string;
  showReset?: boolean;
}

export function ErrorBoundaryComponent({
  error,
  resetErrorBoundary,
  title = "Something went wrong",
  showReset = true,
}: ErrorBoundaryComponentProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center bg-red-50 text-red-800">
      <h1 className="text-3xl font-semibold mb-2">{title}</h1>
      <p className="mb-4 max-w-lg text-sm">
        {error?.message || "An unknown error occurred."}
      </p>

      {showReset && (
        <button
          onClick={resetErrorBoundary}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
