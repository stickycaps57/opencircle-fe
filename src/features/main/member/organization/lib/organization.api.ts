import axiosInstance from "@src/shared/api/axios";
import type {
  OrganizationMembershipsResponse,
  PendingOrganizationMembershipsResponse,
  DirectOrganizationSearchResponse,
  OrganizationSearchResponse,
  MemberJoinedOrganizationsResponse,
} from "../schema/organization.types";

export const getMemberJoinedOrganizations = async (
  accountUuid: string
): Promise<MemberJoinedOrganizationsResponse> => {
  try {
    const response = await axiosInstance.get<MemberJoinedOrganizationsResponse>(
      `/organization/user/joined?account_uuid=${accountUuid}`
    );

    return response.data;
  } catch (error) {
    console.error("Failed to fetch member joined organizations:", error);
    throw error;
  }
};

export const getOrganizationMemberships = async (
  accountUuid: string
): Promise<OrganizationMembershipsResponse> => {
  try {
    const response = await axiosInstance.get<OrganizationMembershipsResponse>(
      `/organization/memberships?account_uuid=${accountUuid}`
    );

    return response.data;
  } catch (error) {
    console.error("Failed to fetch organization memberships:", error);
    throw error;
  }
};

export const leaveOrganization = async (
  organizationId: number
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await axiosInstance.post("/organization/leave", {
      organization_id: organizationId,
    });

    return response.data;
  } catch (error) {
    console.error("Failed to leave organization:", error);
    throw error;
  }
};

export const getPendingOrganizationMemberships = async (
  accountUuid: string
): Promise<PendingOrganizationMembershipsResponse> => {
  try {
    const response =
      await axiosInstance.get<PendingOrganizationMembershipsResponse>(
        `/organization/pending-membership?account_uuid=${accountUuid}`
      );

    return response.data;
  } catch (error) {
    console.error("Failed to fetch pending organization memberships:", error);
    throw error;
  }
};

export const searchOrganizations = async (
  query: string
): Promise<DirectOrganizationSearchResponse> => {
  try {
    const response = await axiosInstance.get<OrganizationSearchResponse>(
      `/organization/search?query=${encodeURIComponent(query)}`
    );

    return response.data.results;
  } catch (error) {
    console.error("Failed to search organizations:", error);
    throw error;
  }
};
