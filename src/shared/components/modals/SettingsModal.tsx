import { useAuthStore } from "@src/shared/store";
import { useState } from "react";
import { useImageUrl } from "@src/shared/hooks/useImageUrl";
import logoutIcon from "@src/assets/shared/logout.png";
import { TwoFactorCodeModal } from "@src/shared/components/modals/TwoFactorCodeModal";
import { useEnableTwoFA, useDisableTwoFA } from "@src/features/auth/model/signup.mutations";
import { use2FAStatus } from "@src/features/auth/model/signup.query";
import { Modal } from "@src/shared/components/Modal";

type SettingsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onLogoutClick?: () => void;
};

export const SettingsModal = ({ isOpen, onClose, onLogoutClick }: SettingsModalProps) => {
  const { user } = useAuthStore();
  const { getImageUrl } = useImageUrl();

  const isMember = user && "first_name" in user;
  const displayName = isMember ? `${user?.first_name} ${user?.last_name}` : user?.name || "";
  const profileImage = isMember
    ? getImageUrl(user?.profile_picture)
    : getImageUrl(user?.logo);

  const { data: twoFAStatus, refetch: refetchTwoFAStatus } = use2FAStatus();
  const twoFAEnabled = !!twoFAStatus?.two_factor_enabled;
  const [isTwoFAModalOpen, setIsTwoFAModalOpen] = useState(false);

  const [desiredEnable, setDesiredEnable] = useState<boolean>(false);
  const enableTwoFAMutation = useEnableTwoFA();
  const disableTwoFAMutation = useDisableTwoFA();

  const openTwoFAModal = (enable: boolean) => {
    setDesiredEnable(enable);
    setIsTwoFAModalOpen(true);
  };

  const handleTwoFASubmit = async (code: string) => {
    try {
      if (desiredEnable) {
        await enableTwoFAMutation.mutateAsync({ totp_token: code });
      } else {
        await disableTwoFAMutation.mutateAsync({ totp_token: code });
      }
      await refetchTwoFAStatus();
      setIsTwoFAModalOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = () => {
    onClose();
    onLogoutClick?.();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="sm">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <img src={profileImage} alt="profile" className="w-12 h-12 rounded-full object-cover" />
            <div className="min-w-0">
              <div className="text-responsive-xs font-bold truncate">{displayName}</div>
              <div className="text-responsive-xxs text-authlayoutbg truncate">
                {isMember ? "Member" : "Organization"}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3 py-3">
            <div className="w-7 flex-shrink-0 flex justify-center">
              <button
                type="button"
                className={`relative w-9 h-5 rounded-full transition-colors ${twoFAEnabled ? "bg-primary" : "bg-gray-300"}`}
                aria-pressed={twoFAEnabled}
                aria-label="2FA status"
                onClick={() => openTwoFAModal(!twoFAEnabled)}
              >
                <span
                  className={`absolute top-1 left-0.5 w-3 h-3 bg-white rounded-full transition-transform ${twoFAEnabled ? "translate-x-3" : "translate-x-0"}`}
                />
              </button>
            </div>
            <span className="text-responsive-xs">2FA Authentication</span>
          </div>

          <div className="pt-3 border-t border-gray-200">
            <button
              type="button"
              className="flex items-center space-x-3 text-primary hover:underline"
              onClick={handleLogout}
            >
              <div className="w-7 flex-shrink-0 flex justify-center">
                <img src={logoutIcon} alt="Logout Icon" className="w-5 h-5" />
              </div>
              <span className="text-responsive-xs">Logout</span>
            </button>
          </div>
        </div>
      </Modal>

      <TwoFactorCodeModal
        isOpen={isTwoFAModalOpen}
        onClose={() => setIsTwoFAModalOpen(false)}
        onSubmit={handleTwoFASubmit}
        title={`${desiredEnable ? "Enable" : "Disable"} 2FA`}
        description={"Get the code in your authenticator app you used when signing up."}
        isSubmitting={desiredEnable ? enableTwoFAMutation.isPending : disableTwoFAMutation.isPending}
        submitLabel={desiredEnable ? (enableTwoFAMutation.isPending ? "Enabling..." : "Enable") : (disableTwoFAMutation.isPending ? "Disabling..." : "Disable")}
      />
    </>
  );
};
