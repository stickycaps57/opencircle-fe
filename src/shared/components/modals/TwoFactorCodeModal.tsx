import { useState } from "react";
import { Modal } from "../Modal";
import { PrimaryButton } from "@src/shared/components";

interface TwoFactorCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (code: string) => void;
  title?: string;
  description?: string;
  isSubmitting?: boolean;
  submitLabel?: string;
}

export const TwoFactorCodeModal = ({
  isOpen,
  onClose,
  onSubmit,
  title = "Two-Factor Authentication",
  description = "Get the code in your authenticator app you used when signing up.",
  isSubmitting = false,
  submitLabel = "Submit",
}: TwoFactorCodeModalProps) => {
  const [code, setCode] = useState("");

  const handleSubmit = () => {
    onSubmit(code);
    setCode("");
  };

  const handleClose = () => {
      onClose();
      setCode("")
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="xl">
      <div className="relative p-6 border-b border-gray-100">
        <h2 className="text-responsive-base font-bold text-primary text-center">{title}</h2>
        <button
          onClick={handleClose}
          className="absolute right-6 top-1/2 transform -translate-y-1/2 text-placeholderbg hover:text-primary transition-colors text-responsive-xs"
        >
          Close
        </button>
      </div>

      <div className="p-6">
        <p className="text-primary text-responsive-xs leading-relaxed mb-4 text-center">
          {description}
        </p>
        <label className="text-responsive-xs text-primary mb-2 block text-center">Enter 6-digit code</label>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
          className="w-full px-3 py-2 border border-primary rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary text-responsive-xs tracking-widest text-center"
          placeholder="- - - - - -"
        />
        <div className="mt-4">
          <PrimaryButton
            variant="button3"
            label={isSubmitting ? "Submitting..." : submitLabel}
            buttonClass="w-full"
            onClick={handleSubmit}
          />
        </div>
      </div>
    </Modal>
  );
};

