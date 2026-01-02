import axiosInstance from "../../../shared/api/axios";
import type { EventResponse, OrganizationCalendarResponse } from "../schema/calendar.type";

// Fetches calendar events for a specific member by account UUID, month, and year
export const fetchMemberCalendarEvents = async (
  accountUuid: string,
  month: number,
  year: number
): Promise<EventResponse> => {
  try {
    const response = await axiosInstance.get<EventResponse>(
      `/event/user/rsvped?account_uuid=${accountUuid}&month=${month}&year=${year}`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch member calendar events:", error);
    throw error;
  }
};

// Fetches calendar events for a specific organization by account UUID, month, and year
export const fetchOrganizationCalendarEvents = async (
  accountUuid: string,
  month: number,
  year: number
): Promise<OrganizationCalendarResponse> => {
  try {
    const response = await axiosInstance.get<OrganizationCalendarResponse>(
      `/event/organizer/by_month_year?account_uuid=${accountUuid}&month=${month}&year=${year}`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch organization calendar events:", error);
    throw error;
  }
};
