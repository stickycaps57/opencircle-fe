import React from "react";
import { ToastContainer as ReactToastifyContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/**
 * Custom ToastContainer component that wraps react-toastify's ToastContainer
 * with custom styling and configuration
 */
export const ToastContainer: React.FC = () => {
  return (
    <ReactToastifyContainer
      position="bottom-right"
      autoClose={5000}
      hideProgressBar
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="colored"
      toastClassName={() => ""}
      progressClassName={() => ""}
    />
  );
};
