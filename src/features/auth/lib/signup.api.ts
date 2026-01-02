import axiosInstance from "@src/shared/api/axios";
import type { AxiosResponse } from "axios";
// import { useAuthStore } from "@src/shared/store";
import type {
  // MemberLoginResponse,
  MemberSignupResponse,
  VerifyEmailOtpResponse,
  OrganizationSignupResponse,
  TwoFAStatusResponse,
  TwoFASetupResponse,
  TwoFactorEnableResponse,
  TwoFactorEnableRequest,
  TwoFactorDisableResponse,
  TwoFactorDisableRequest,
} from "@src/features/auth/schema/auth.types";
import { objectToFormData } from "@src/shared/utils/formDataConverter";
import type {
  MemberSignupFormData,
  OrganizationSignupFormData,
  OtpSignupVerificationFormData
} from "../schema/signup.schema";

// Registers a new member with the provided data
export const registerMember = async (
  memberData: MemberSignupFormData
): Promise<MemberSignupResponse> => {
  try {
    const formData = objectToFormData(memberData, ["profile_picture"]);

    const response = await axiosInstance.post<MemberSignupResponse>(
      "/account/user",
      formData
    );

    // Authentication is handled separately after registration

    return response.data;
  } catch (error) {
    console.error("Member registration failed:", error);
    throw error;
  }
};

// Registers a new organization with the provided data
export const registerOrganization = async (
  organizationData: OrganizationSignupFormData
): Promise<OrganizationSignupResponse> => {
  try {
    const formData = objectToFormData(organizationData);

    const response = await axiosInstance.post<OrganizationSignupResponse>(
      "/account/organization",
      formData
    );

    // Authentication is handled separately after registration

    return response.data;
  } catch (error) {
    console.error("Organization registration failed:", error);
    throw error;
  }
};

// Registers a new organization with the provided data
export const verifyOtp = async (
  otpData: OtpSignupVerificationFormData
): Promise<VerifyEmailOtpResponse> => {
  try {
    const formData = objectToFormData(otpData);

    const response = await axiosInstance.post<VerifyEmailOtpResponse>("/account/verify-email-otp", formData);

    return response.data;
  } catch (error) {
    console.error("OTP verification failed:", error);
    throw error;
  }
};

// Resends email OTP to the provided email address
export const resendEmailOtp = async (
  data: { email: string }
): Promise<{ message: string }> => {
  try {
    const formData = objectToFormData(data);

    const response = await axiosInstance.post<{ message: string }>(
      "/account/resend-email-otp",
      formData
    );

    return response.data;
  } catch (error) {
    console.error("Resend email OTP failed:", error);
    throw error;
  }
};

/**
 * Fetches current Two-Factor Authentication (2FA) status for the authenticated user
 * @returns TwoFAStatusResponse containing whether 2FA is enabled and backup codes count
 */
export const getTwoFAStatus = async (): Promise<TwoFAStatusResponse> => {
  try {
    const response = await axiosInstance.get<TwoFAStatusResponse>("/2fa/status", {
      headers: { "X-Suppress-Unauthorized-Redirect": "1" },
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch 2FA status`);
    throw error;
  }
};

export const initiateTwoFASetup = async (): Promise<TwoFASetupResponse> => {
  try {
    const response = await axiosInstance.post<TwoFASetupResponse>("/2fa/setup", undefined, {
      headers: { "X-Suppress-Unauthorized-Redirect": "1" },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to initiate 2FA setup:", error);
    throw error;
  }
};

export const enableTwoFA = async (
  data: TwoFactorEnableRequest
): Promise<AxiosResponse<TwoFactorEnableResponse>> => {
  try {

    const formData = objectToFormData(data);

    const response = await axiosInstance.post<TwoFactorEnableResponse>(
      "/2fa/enable",
      formData
    );
    return response;
  } catch (error) {
    console.error("Failed to enable 2FA:", error);
    throw error;
  }
};

export const disableTwoFA = async (
  data: TwoFactorDisableRequest
): Promise<AxiosResponse<TwoFactorDisableResponse>> => {
  try {
    const formData = objectToFormData(data);
    const response = await axiosInstance.post<TwoFactorDisableResponse>(
      "/2fa/disable",
      formData
    );
    return response;
  } catch (error) {
    console.error("Failed to disable 2FA:", error);
    throw error;
  }
};


