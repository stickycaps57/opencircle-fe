import React, { useEffect } from "react";
import { toast } from "react-toastify";

/**
 * Success toast component with Tailwind CSS styling
 * Auto-closes after 5 seconds with a close button
 */
export const SuccessToast: React.FC<{ message: string; toastId?: string }> = ({
  message,
  toastId,
}) => {
  // Handle close button click
  const handleClose = () => {
    if (toastId) {
      toast.dismiss(toastId);
    }
  };

  // Auto-close effect that dismisses the toast after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (toastId) {
        toast.dismiss(toastId);
      }
    }, 5000);

    // Clean up timer if component unmounts
    return () => clearTimeout(timer);
  }, [toastId]);

  return (
    <div className="flex items-center justify-between p-4 bg-primary text-white rounded-full w-full max-w-md">
      <div className="text-sm font-medium flex-grow">{message}</div>
      <button
        onClick={handleClose}
        className="ml-3 text-white hover:text-gray-300 focus:outline-none"
        aria-label="Close toast"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
};
