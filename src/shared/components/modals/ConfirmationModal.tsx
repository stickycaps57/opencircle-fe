import { Modal } from "../Modal";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmButtonText: string;
  confirmButtonVariant?: "primary" | "danger";
  userName?: string;
}

export const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmButtonText,
  confirmButtonVariant = "primary",
}: ConfirmationModalProps) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const buttonStyles = {
    primary: "bg-primary text-white hover:bg-opacity-90",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      {/* Header */}
      <div className="relative p-6 border-b border-gray-100">
        <h2 className="text-responsive-base font-bold text-primary text-center">
          {title}
        </h2>
        <button
          onClick={onClose}
          className="absolute right-6 top-1/2 transform -translate-y-1/2 text-placeholderbg hover:text-primary transition-colors text-responsive-xs"
        >
          Close
        </button>
      </div>

      {/* Content */}
      <div className="p-6 text-center">
        <p className="text-primary text-responsive-xs leading-relaxed mb-6 sm:mb-8">
          {message}
        </p>

        {/* Confirm Button */}
        <button
          onClick={handleConfirm}
          className={`w-full py-3 sm:py-4 rounded-full font-medium transition-colors text-responsive-xs ${buttonStyles[confirmButtonVariant]}`}
        >
          {confirmButtonText}
        </button>
      </div>
    </Modal>
  );
};
