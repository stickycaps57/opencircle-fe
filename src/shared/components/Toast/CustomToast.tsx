import {
  toast,
  type ToastOptions,
} from "react-toastify";
import { SuccessToast } from "./SuccessToast";
import { ErrorToast } from "./ErrorToast";

// Default toast options
const defaultOptions: ToastOptions = {
  position: "bottom-right",
  autoClose: 5000, // Auto-close after 5 seconds
  hideProgressBar: true,
  closeOnClick: false,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  closeButton: false,
};

// Toast service functions
export const showSuccessToast = (message: string, options?: ToastOptions) => {
  // Create a mutable object to store the toast ID
  const toastIdRef = { current: null as string | number | null };
  
  // Create the toast and store its ID
  const toastId = toast.success(
    () => {
      // Pass the actual toast ID to the component
      return <SuccessToast message={message} toastId={toastIdRef.current as string} />;
    },
    {
      ...defaultOptions,
      ...options,
    }
  );
  
  // Store the toast ID in the reference
  toastIdRef.current = toastId;
  
  return toastId;
};

export const showErrorToast = (message: string, options?: ToastOptions) => {
  // Create a mutable object to store the toast ID
  const toastIdRef = { current: null as string | number | null };
  
  // Create the toast and store its ID
  const toastId = toast.error(
    () => {
      // Pass the actual toast ID to the component
      return <ErrorToast message={message} toastId={toastIdRef.current as string} />;
    },
    {
      ...defaultOptions,
      ...options,
    }
  );
  
  // Store the toast ID in the reference
  toastIdRef.current = toastId;
  
  return toastId;
};
