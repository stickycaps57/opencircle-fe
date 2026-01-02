import { useMutation } from "@tanstack/react-query";

import {
  registerMember,
  registerOrganization,
  verifyOtp,
  resendEmailOtp,
  initiateTwoFASetup,
  enableTwoFA,
  disableTwoFA,
} from "../lib/signup.api";

import type {
  // MemberLoginResponse,
  MemberSignupResponse,
  OrganizationSignupResponse,
  VerifyEmailOtpResponse,
  TwoFASetupResponse,
  TwoFactorEnableResponse,
  TwoFactorEnableRequest,
} from "@src/features/auth/schema/auth.types";
import type { TwoFactorDisableResponse, TwoFactorDisableRequest } from "@src/features/auth/schema/auth.types";

import type {
  MemberSignupFormData,
  OrganizationSignupFormData,
  OtpSignupVerificationFormData
} from "../schema/signup.schema";
import { showSuccessToast, showErrorToast } from "@src/shared/components/Toast/CustomToast";

/**
 * Hook for organization registration using TanStack Query
 */
export const useOrganizationSignup = () => {
  return useMutation<
    OrganizationSignupResponse,
    Error,
    OrganizationSignupFormData
  >({
    mutationFn: (organizationData) => registerOrganization(organizationData),
    onSuccess: () => {
      showSuccessToast("Successfully signed up");
    },
    onError: (error) => {
      console.error("Organization registration error:", error);
      showErrorToast("Failed to sign up");
    },
  });
};

/**
 * Hook for member registration using TanStack Query
 */
export const useMemberSignup = () => {
  return useMutation<MemberSignupResponse, Error, MemberSignupFormData>({
    mutationFn: (memberData) => registerMember(memberData),
    // onSuccess: () => {
    //   showSuccessToast("Successfully signed up");
    // },
    onError: (error) => {
      console.error("Member registration error:", error);
      showErrorToast("Failed to sign up");
    },
  });
};

export function useVerifyEmailOtp() {
  return useMutation<VerifyEmailOtpResponse, Error, OtpSignupVerificationFormData>({
    mutationFn: (memberData) => verifyOtp(memberData),
    // onSuccess: () => {
    //   showSuccessToast("Successfully signed up");
    // },
    onError: (error) => {
      console.error("Member registration error:", error);
      showErrorToast("Failed to sign up");
    },
  });
}

export function useResendEmailOtp() {
  return useMutation<{ message: string }, Error, { email: string}>({
    mutationFn: (data) => resendEmailOtp(data),
    onSuccess: (data) => {
      showSuccessToast(data?.message || "OTP resent successfully");
    },
    onError: (error) => {
      console.error("Resend email OTP error:", error);
      showErrorToast("Failed to resend OTP");
    },
  });
}

export function useInitiateTwoFASetup() {
  return useMutation<TwoFASetupResponse, Error, void>({
    mutationFn: () => initiateTwoFASetup(),
    onError: (error) => {
      console.error("Initiate 2FA setup error:", error);
      showErrorToast("Failed to initiate 2FA setup");
    },
  });
}

export function useEnableTwoFA() {
  return useMutation<
    import("axios").AxiosResponse<TwoFactorEnableResponse>,
    Error,
    TwoFactorEnableRequest
  >({
    mutationFn: (payload) => enableTwoFA(payload),
    onSuccess: (response) => {
      const msg = response?.data?.message || "2FA enabled";
      showSuccessToast(msg);
    },
    onError: (error) => {
      console.error("Enable 2FA error:", error);
      showErrorToast("Failed to enable 2FA");
    },
  });
}

export function useDisableTwoFA() {
  return useMutation<
    import("axios").AxiosResponse<TwoFactorDisableResponse>,
    Error,
    TwoFactorDisableRequest
  >({
    mutationFn: (payload) => disableTwoFA(payload),
    onSuccess: (response) => {
      const msg = response?.data?.message || "2FA disabled";
      showSuccessToast(msg);
    },
    onError: (error) => {
      console.error("Disable 2FA error:", error);
      showErrorToast("Failed to disable 2FA");
    },
  });
}

