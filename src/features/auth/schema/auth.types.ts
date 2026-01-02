// User profile picture type
export type ProfilePicture = {
  id?: number;
  directory?: string;
  filename?: string;
  image?: string;
};

// Authenticated member user type
export type Member = {
  id: number;
  account_id: number;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  bio: string;
  profile_picture: ProfilePicture;
  uuid: string;
  role_id: number; // Role ID for RBAC (1 = member)
  two_factor_enabled: 0 | 1;
  bypass_two_factor: 0 | 1;
  user_membership_status: string;
  organizer_view_user_membership: string;
  avatarUrl: string;
};

// Authenticated organization user type
export type Organization = {
  id: number;
  account_id: number;
  name: string;
  email: string;
  username: string;
  logo: ProfilePicture;
  category: string;
  description: string;
  uuid: string;
  role_id: number; // Role ID for RBAC (2 = organization)
  two_factor_enabled: 0 | 1;
  bypass_two_factor: 0 | 1;
  user_membership_status: string;
  organizer_view_user_membership: string;
  avatarUrl: string;
};

// Authenticated user (either Member or Organization)
export type User = Member | Organization;

// Role ID to role name mapping
export enum RoleId {
  Member = 1,
  Organization = 2,
}

// Role name type
export type RoleName = "member" | "organization";

// Member login response type
export type MemberLoginSuccess = {
  user: Member;
  expires_at: string;
};

export type MemberLogin2FARequired = {
  requires_2fa: true;
  message: string;
  account_type: "user";
};

export type MemberLoginResponse = MemberLoginSuccess | MemberLogin2FARequired;

export type MemberSignupResponse = {
  message: string;
  email: string;
  verification_required: string;
};

// Organization login response type
export type OrganizationLoginSuccess = {
  organization: Organization;
  expires_at: string;
};

export type OrganizationLogin2FARequired = {
  requires_2fa: true;
  message: string;
  account_type: "organization";
};

export type OrganizationLoginResponse =
  | OrganizationLoginSuccess
  | OrganizationLogin2FARequired;

// Authentication state type
export type AuthState = {
  user: User | null;
  expiresAt: string | null;
  isAuthenticated: boolean;
  login: (userData: MemberLoginSuccess | OrganizationLoginResponse) => void;
  logout: () => void;
  updateTwoFactorEnabled: (enabled: 0 | 1) => void;
};

export type VerifyEmailOtpResponse = {
  message: string;
  email_verified: string;
  account_type: string;
}
export type OrganizationSignupResponse = {
  message: string;
  email: string;
  verification_required: string;
}

export type TwoFAStatusResponse = {
  two_factor_enabled: boolean;
  backup_codes_count: number;
}
export type TwoFASetupResponse = {
  secret: string;
  qr_code: string;
  backup_codes: string[];
  message: string;
};

export type TwoFactorEnableRequest = {
  totp_token: string;
};

export type TwoFactorEnableResponse = {
  message: string;
  backup_codes: string[];
};

export type ApiErrorResponse = {
  detail?: string;
  message?: string;
};

export type TwoFactorDisableResponse = {
  message: string;
};

export type TwoFactorDisableRequest = {
  totp_token: string;
};

export type TwoFactorBypassResponse = {
  bypass_two_factor: 0 | 1;
  message: string;
};

export type TwoFactorBypassRequest = {
  bypass_status: boolean;
};

export type TwoFactorVerifyRequest = {
  totp_token: string;
  account_type: "member" | "organization";
};
