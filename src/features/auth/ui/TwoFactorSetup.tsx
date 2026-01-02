import { Link, useNavigate, useLocation } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import brandLogoDark from "@src/assets/brand-dark.png";
import { PrimaryButton } from "@src/shared/components/PrimaryButton";
import { useAuthStore } from "@src/shared/store";
import { useEffect, useState } from "react";
import { useInitiateTwoFASetup, useEnableTwoFA, useDisableTwoFA } from "../model/signup.mutations";
import { useBypassTwoFactor } from "../model/auth.mutations";

function TwoFactorSetupContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const authStore = useAuthStore();
  const pendingLogin = location.state?.loginResponse;
  const loginType: "member" | "organization" = location.state?.loginType || "member";
  const [isWaiting, setIsWaiting] = useState(false);
  const [showEnableForm, setShowEnableForm] = useState(false);
  const [formMode, setFormMode] = useState<"none" | "enable" | "disable">("none");
  const [otpCode, setOtpCode] = useState("");
  const setupMutation = useInitiateTwoFASetup();
  const enableMutation = useEnableTwoFA();
  const disableMutation = useDisableTwoFA();
  const bypassMutation = useBypassTwoFactor();

  const getCookie = (name: string) => {
    const match = document.cookie.match(new RegExp(`(^|;\\s*)${name}=([^;]+)`));
    return match ? decodeURIComponent(match[2]) : null;
  };

  const waitForCookie = async (
    name: string,
    timeoutMs = 5000,
    intervalMs = 150
  ) => {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      if (getCookie(name)) return true;
      await new Promise((r) => setTimeout(r, intervalMs));
    }
    return false;
  };

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      setIsWaiting(true);
      await waitForCookie("session_token");
      if (!mounted) return;
      setIsWaiting(false);
      setupMutation.mutate();
    };
    run();
    return () => { mounted = false; };
  }, []);

  const handleEnable = () => {
    setShowEnableForm(true);
    setFormMode("enable");
  };

  const handleDisable = () => {
    setShowEnableForm(true);
    setFormMode("disable");
    setOtpCode("");
  };


  const handleSubmitEnable = () => {
    bypassMutation.mutate({ bypass_status: true }, {
      onSuccess: (response) => {
        const msg = response?.data?.message || "Two-factor bypass updated";
        console.log(msg);
        if (pendingLogin) {
          authStore.login(pendingLogin);
          navigate(loginType === "member" ? "/member-profile" : "/organization-profile");
        }
      },
    });
  };

  const handleSubmitDisable = () => {
    bypassMutation.mutate({ bypass_status: true }, {
      onSuccess: (response) => {
        const msg = response?.data?.message || "Two-factor disabled";
        console.log(msg);
        if (pendingLogin) {
          authStore.login(pendingLogin);
          navigate(loginType === "member" ? "/member-profile" : "/organization-profile");
        }
      },
    });
  };

  const handleSubmitTwoFA = () => {
    if (formMode === "enable") {
      enableMutation.mutate(
        { totp_token: otpCode },
        { onSuccess: () => handleSubmitEnable() }
      );
    } else if (formMode === "disable") {
      disableMutation.mutate(
        { totp_token: otpCode },
        { onSuccess: () => handleSubmitDisable() }
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full">
        <div className="bg-white rounded-[50px] px-8 pb-24">
          <div className="flex justify-center items-center relative">
            <Link to="/">
              <img
                src={brandLogoDark}
                alt="Brand Logo"
                className="w-64 object-cover cursor-pointer"
              />
            </Link>
            <p className="absolute bottom-6 text-center text-base text-primary opacity-75">
              Create Events. Gather People. Make It Happen.
            </p>
          </div>

          <h1 className="text-center text-primary font-bold text-4xl pb-3">
            Two-Factor Authentication
          </h1>

          <p className="text-center text-base mb-4">
            Welcome! Before continuing, please choose your preferred security setup. Two-Factor Authentication (2FA) adds an extra layer of protection to your account.
          </p>

          <p  className="text-center text-base">Would you like to enable or disable 2FA for now?</p>

          <div className="flex flex-col items-center mt-2 mb-6">
            {(isWaiting || setupMutation.isPending) && (
              <div className="flex flex-col items-center">
                <div
                  className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"
                  aria-label="Loading"
                />
                <p className="text-center text-base mt-2">Initializing 2FA...</p>
              </div>
            )}
            {setupMutation.error && (
              <p className="text-center text-base text-red-600">Failed to initiate 2FA setup.</p>
            )}
            {setupMutation.data?.qr_code && (
              <img
                src={`data:image/png;base64,${setupMutation.data.qr_code}`}
                alt="2FA QR Code"
                className="w-64 h-64 object-contain"
              />
            )}
          </div>

          {setupMutation.data?.qr_code && (
            <div className="flex justify-center mb-6">
            <div className="flex gap-4 w-full max-w-md">
              <button
                className={`flex-1 py-3 px-6 text-responsive-xs text-center rounded-full border ${
                  formMode === "enable"
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-primary border-primary"
                }`}
                onClick={handleEnable}
              >
                Enable
              </button>
              <button
                className={`flex-1 py-3 px-6 text-responsive-xs text-center rounded-full border ${
                  formMode === "disable"
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-primary border-primary"
                }`}
                onClick={handleDisable}
              >
                Disable
              </button>
            </div>
          </div>
          )}
          
          {showEnableForm && (
            <div className="mt-6">
              <label className=" text-responsive-xs text-primary mb-2 block">
                Enter 6-digit code
              </label>
              <input
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                className="w-full px-3 py-2 border border-primary rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="- - - - - -"
              />
               <div className="mt-4">
                 <PrimaryButton
                   variant="button3"
                   label={
                     formMode === "enable"
                       ? enableMutation.isPending
                         ? "Submitting..."
                         : "Submit"
                       : disableMutation.isPending
                         ? "Submitting..."
                         : "Submit"
                   }
                   buttonClass="w-full"
                   onClick={handleSubmitTwoFA}
                 />
               </div>
              {formMode === "enable" && enableMutation.error && (
                <p className="text-center text-base text-red-600 mt-2">Failed to enable 2FA.</p>
              )}
              {formMode === "enable" && enableMutation.isSuccess && (
                <p className="text-center text-base text-green-600 mt-2">2FA enabled successfully.</p>
              )}
              {formMode === "disable" && disableMutation.error && (
                <p className="text-center text-base text-red-600 mt-2">Failed to disable 2FA.</p>
              )}
              {formMode === "disable" && disableMutation.isSuccess && (
                <p className="text-center text-base text-green-600 mt-2">2FA disabled successfully.</p>
              )}
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}

export default function TwoFactorSetup() {
  return (
    <ErrorBoundary fallbackRender={({ error }) => (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg w-full">
          <div className="bg-white rounded-56 px-8 pb-24">
            <h1 className="text-center text-primary font-bold text-3xl pb-3">Something went wrong</h1>
            <p className="text-center text-base mb-8">{String(error)}</p>
          </div>
        </div>
      </div>
    )}>
      <TwoFactorSetupContent />
    </ErrorBoundary>
  );
}