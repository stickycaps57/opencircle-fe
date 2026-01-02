import axiosInstance from "@src/shared/api/axios";
import { useAuthStore } from "@src/shared/store";
import type {
  MemberLoginResponse,
  OrganizationLoginResponse,
  User,
  TwoFactorBypassResponse,
  TwoFactorBypassRequest,
  TwoFactorVerifyRequest,
} from "@src/features/auth/schema/auth.types";
import { objectToFormData } from "@src/shared/utils/formDataConverter";

// Re-export types from auth.types.ts
export type { MemberLoginResponse, OrganizationLoginResponse, User };

// Login credentials type
export type LoginCredentials = {
  login: string;
  password: string;
};

// Union type for login response
export type LoginResponse = MemberLoginResponse | OrganizationLoginResponse;

// Authenticates a member user with credentials
export const loginMember = async (
  credentials: LoginCredentials,
  options?: { commit?: boolean }
): Promise<MemberLoginResponse> => {
  try {
    const formData = objectToFormData(credentials);

    const response = await axiosInstance.post<MemberLoginResponse>(
      "/account/user_signin",
      formData
    );

    if (options?.commit !== false) {
      const data = response.data;
      if ('user' in data) {
        const authStore = useAuthStore.getState();
        authStore.login(data);
      }
    }

    return response.data;
  } catch (error) {
    console.error("Member login failed:", error);
    throw error;
  }
};

// Authenticates an organization with credentials
export const loginOrganization = async (
  credentials: LoginCredentials,
  options?: { commit?: boolean }
): Promise<OrganizationLoginResponse> => {
  try {
    const formData = objectToFormData(credentials);

    const response = await axiosInstance.post<OrganizationLoginResponse>(
      "/account/organization_signin",
      formData
    );

    if (options?.commit !== false) {
      const data = response.data;
      if ('organization' in data) {
        const authStore = useAuthStore.getState();
        authStore.login(data);
      }
    }

    return response.data;
  } catch (error) {
    console.error("Organization login failed:", error);
    throw error;
  }
};

// Fetch authenticated user data
export const fetchAuthUser = async (): Promise<User> => {
  try {
    const response = await axiosInstance.get<User>("/account/auth_user");
    return response.data;
  } catch (error) {
    console.error("Fetch auth user failed:", error);
    throw error;
  }
};

// Logs out the current user
export const logout = async (): Promise<void> => {
  try {
    await axiosInstance.post("/account/logout");

    // Clear all localStorage items
    localStorage.clear();

    const authStore = useAuthStore.getState();
    authStore.logout();

    return Promise.resolve();
  } catch (error) {
    console.error("Logout failed:", error);

    // Clear all localStorage items even on error
    localStorage.clear();

    const authStore = useAuthStore.getState();
    authStore.logout();
    throw error;
  }
};

export const bypassTwoFactor = async (
  data: TwoFactorBypassRequest
): Promise<import("axios").AxiosResponse<TwoFactorBypassResponse>> => {
  try {
    const formData = objectToFormData(data);
    const response = await axiosInstance.post<TwoFactorBypassResponse>(
      "/2fa/bypass-two-factor",
      formData
    );
    return response;
  } catch (error) {
    console.error("Bypass 2FA failed:", error);
    throw error;
  }
};

export const verifyTwoFactor = async (
  data: TwoFactorVerifyRequest
): Promise<MemberLoginResponse | OrganizationLoginResponse> => {
  try {
    const formData = objectToFormData(data);
    const response = await axiosInstance.post<MemberLoginResponse | OrganizationLoginResponse>(
      "/account/verify_2fa",
      formData
    );
    return response.data;
  } catch (error) {
    console.error("Verify 2FA failed:", error);
    throw error;
  }
};
