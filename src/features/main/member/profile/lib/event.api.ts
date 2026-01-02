import axiosInstance from "@src/shared/api/axios";
import type { EventsByRsvpStatusResponse } from "../schema/event.types";
import type { MemberProfileResponse } from "../schema/profile.types";

export const getUserEventsByRsvpStatus = async (
  accountUuid: string,
  rsvpStatus: string,
  page: number = 1,
  limit: number = 10
): Promise<EventsByRsvpStatusResponse> => {
  try {
    const response = await axiosInstance.get<EventsByRsvpStatusResponse>(
      `/event/user/events_by_rsvp_status_with_comments`,
      {
        params: {
          account_uuid: accountUuid,
          page,
          limit,
          rsvp_status: rsvpStatus,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Failed to fetch user events by RSVP status:", error);
    throw error;
  }
};

export const getUserPastEvents = async (
  accountUuid: string,
  page: number = 1,
  limit: number = 5
): Promise<EventsByRsvpStatusResponse> => {
  try {
    const response = await axiosInstance.get<EventsByRsvpStatusResponse>(
      `/event/user/past_events_with_comments`,
      {
        params: {
          account_uuid: accountUuid,
          page,
          limit,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Failed to fetch user past events:", error);
    throw error;
  }
};

export const getMemberProfile = async (
  accountUuid: string
): Promise<MemberProfileResponse> => {
  try {
    const response = await axiosInstance.get<MemberProfileResponse>(
      `/user/profile/${accountUuid}`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch member profile:", error);
    throw error;
  }
};
