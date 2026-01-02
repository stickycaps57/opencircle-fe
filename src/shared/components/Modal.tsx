import { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  closeOnClickOutside?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  children,
  maxWidth,
  size = "md",
  closeOnClickOutside = true,
}: ModalProps) {
  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Size mappings for consistent responsive design
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    full: "max-w-full",
  };

  const modalWidth = maxWidth || sizeClasses[size];

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto">
      {/* Enhanced background overlay with Mantine-style appearance */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-all duration-200 ease-out animate-in fade-in"
        onClick={closeOnClickOutside ? onClose : undefined}
        aria-hidden="true"
        data-testid="modal-overlay"
      />

      {/* Modal content container with enhanced animations */}
      <div 
        className="flex min-h-full items-center justify-center p-3 sm:p-4 md:p-6 relative z-10 pointer-events-none"
      >
        <div
          className={`bg-white rounded-xl w-full ${modalWidth} shadow-2xl transform transition-all duration-200 ease-out animate-in zoom-in-95 fade-in slide-in-from-bottom-4 pointer-events-auto ${
            isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
          onClick={(e) => e.stopPropagation()}
          data-testid="modal-content"
        >
          {children}
        </div>
      </div>
    </div>
  );
}
