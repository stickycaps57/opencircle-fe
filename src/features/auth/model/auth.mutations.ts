import { useMutation } from "@tanstack/react-query";
import {
  loginMember,
  loginOrganization,
  logout,
  bypassTwoFactor,
  verifyTwoFactor,
  type LoginCredentials,
  type MemberLoginResponse,
  type OrganizationLoginResponse,
} from "../lib";
import { showSuccessToast, showErrorToast } from "@src/shared/components/Toast/CustomToast";
import type { TwoFactorBypassResponse, TwoFactorBypassRequest, TwoFactorVerifyRequest } from "@src/features/auth/schema/auth.types";

/**
 * Hook for member login using TanStack Query
 */
export const useMemberLogin = () => {
  return useMutation<MemberLoginResponse, Error, LoginCredentials>({
    mutationFn: (credentials) => loginMember(credentials),
    onSuccess: () => {
      showSuccessToast("Successfully logged in");
    },
    onError: (error) => {
      console.error("Member login error:", error);
      showErrorToast("Failed to login");
    },
  });
};

/**
 * Hook for organization login using TanStack Query
 */
export const useOrganizationLogin = () => {
  return useMutation<OrganizationLoginResponse, Error, LoginCredentials>({
    mutationFn: (credentials) => loginOrganization(credentials),
    onSuccess: () => {
      showSuccessToast("Successfully logged in");
    },
    onError: (error) => {
      console.error("Organization login error:", error);
      showErrorToast("Failed to login");
    },
  });
};

/**
 * Hook for deferred member login (does not commit auth state automatically)
 */
export const useMemberLoginDeferred = () => {
  return useMutation<MemberLoginResponse, Error, LoginCredentials>({
    mutationFn: (credentials) => loginMember(credentials, { commit: false }),
    onSuccess: () => {
      showSuccessToast("Successfully logged in");
    },
    onError: (error) => {
      console.error("Member login error:", error);
      showErrorToast("Failed to login");
    },
  });
};

/**
 * Hook for deferred organization login (does not commit auth state automatically)
 */
export const useOrganizationLoginDeferred = () => {
  return useMutation<OrganizationLoginResponse, Error, LoginCredentials>({
    mutationFn: (credentials) => loginOrganization(credentials, { commit: false }),
    onSuccess: () => {
      showSuccessToast("Successfully logged in");
    },
    onError: (error) => {
      console.error("Organization login error:", error);
      showErrorToast("Failed to login");
    },
  });
};

// Removed deprecated useLogin hook

/**
 * Hook for logout using TanStack Query
 */
export const useLogout = () => {
  return useMutation<void, Error, void>({
    mutationFn: () => logout(),
    onSuccess: () => {
      showSuccessToast("Successfully logged out");
    },
    onError: (error) => {
      console.error("Logout error:", error);
      showErrorToast("Failed to logout");
    },
  });
};

export const useBypassTwoFactor = () => {
  return useMutation<
    import("axios").AxiosResponse<TwoFactorBypassResponse>,
    Error,
    TwoFactorBypassRequest
  >({
    mutationFn: (payload) => bypassTwoFactor(payload),
    onError: (error) => {
      console.error("Bypass 2FA error:", error);
      showErrorToast("Failed to update 2FA bypass");
    },
  });
};

export const useVerifyTwoFactor = () => {
  return useMutation<MemberLoginResponse | OrganizationLoginResponse, Error, TwoFactorVerifyRequest>({
    mutationFn: (payload) => verifyTwoFactor(payload),
    onSuccess: () => {
      showSuccessToast("2FA verified successfully");
    },
    onError: (error) => {
      console.error("Verify 2FA error:", error);
      showErrorToast("Failed to verify 2FA");
    },
  });
};
