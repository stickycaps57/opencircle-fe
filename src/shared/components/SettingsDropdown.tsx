import { useAuthStore } from "@src/shared/store";
import { useState } from "react";
import { useImageUrl } from "@src/shared/hooks/useImageUrl";
import logoutIcon from "@src/assets/shared/logout.png"
import { TwoFactorCodeModal } from "@src/shared/components/modals";
import { useEnableTwoFA, useDisableTwoFA } from "@src/features/auth/model/signup.mutations";
import { use2FAStatus } from "@src/features/auth/model/signup.query";

type SettingsDropdownProps = {
  onLogoutClick?: () => void;
};

export const SettingsDropdown = ({ onLogoutClick }: SettingsDropdownProps) => {
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
      console.log(error)
      // handled by mutation toasts
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-10 text-primary">
      <div className="px-4 pt-4 flex items-center space-x-3">
        <img src={profileImage} alt="profile" className="w-12 h-12 rounded-full object-cover" />
        <div className="min-w-0">
          <div className="text-responsive-xs font-bold truncate">{displayName}</div>
          <div className="text-responsive-xxs text-authlayoutbg truncate">
            {isMember ? "Member" : "Organization"}
          </div>
        </div>
      </div>

      <div className="px-4 py-3 flex items-center space-x-3">
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

      <div className="px-4 pb-4">
        <button
          type="button"
          className="flex items-center space-x-3 text-primary hover:underline"
          onClick={onLogoutClick}
        >
          <div className="w-7 flex-shrink-0 flex justify-center">
            <img src={logoutIcon} alt="Logout Icon" className="w-5 h-5" />
          </div>
          <span className="text-responsive-xs">Logout</span>
        </button>
      </div>
      <TwoFactorCodeModal
        isOpen={isTwoFAModalOpen}
        onClose={() => setIsTwoFAModalOpen(false)}
        onSubmit={handleTwoFASubmit}
        title={`${desiredEnable ? "Enable" : "Disable"} 2FA`}
        description={"Get the code in your authenticator app you used when signing up."}
        isSubmitting={desiredEnable ? enableTwoFAMutation.isPending : disableTwoFAMutation.isPending}
        submitLabel={desiredEnable ? (enableTwoFAMutation.isPending ? "Enabling..." : "Enable") : (disableTwoFAMutation.isPending ? "Disabling..." : "Disable")}
      />
    </div>
  );
};
