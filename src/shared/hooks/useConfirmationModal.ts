import { useState } from "react";

interface ModalConfig {
  title: string;
  message: string;
  confirmButtonText: string;
  confirmButtonVariant: "primary" | "danger";
  onConfirm: () => void;
}

export const useConfirmationModal = () => {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState<ModalConfig | null>(null);

  const openConfirmationModal = (config: ModalConfig) => {
    setModalConfig(config);
    setIsConfirmModalOpen(true);
  };

  const closeConfirmationModal = () => {
    setIsConfirmModalOpen(false);
    setModalConfig(null);
  };

  return {
    isConfirmModalOpen,
    modalConfig,
    openConfirmationModal,
    closeConfirmationModal,
  };
};
