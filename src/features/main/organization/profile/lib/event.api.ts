import axiosInstance from "@src/shared/api/axios";
import { objectToFormData } from "@src/shared/utils/formDataConverter";
import type { Organization } from "@src/features/auth/schema/auth.types";
import type {
  CreateEventFormData,
  EventFormData,
} from "../schema/event.schema";
import type {
  CreateEventResponse,
  EventsResponse,
  OrganizationEventQueryParams,
  EventData,
  UpdateEventResponse,
  RandomEventsResponse,
  RandomEventsQueryParams,
  EventRsvpsResponse,
  PastEventsResponse,
} from "../schema/event.type";

interface EventWithCommentsParams {
  eventId: number;
  accountUuid: string;
}

export const acceptRsvpRequest = async (
  rsvpId: number,
  status: "joined" | "rejected"
): Promise<{ success: boolean; message?: string }> => {
  try {
    // Convert status data to FormData using utility function
    const formData = objectToFormData({ status });

    const response = await axiosInstance.put(
      `/rsvp/status/${rsvpId}`,
      formData
    );
    return response.data;
  } catch (error) {
    console.error(`Failed to accept RSVP request ${rsvpId}:`, error);
    throw error;
  }
};

export const declineRsvpRequest = async (
  rsvpId: number
): Promise<{ success: boolean; message?: string }> => {
  try {
    const response = await axiosInstance.delete(`/rsvp/${rsvpId}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to decline RSVP request ${rsvpId}:`, error);
    throw error;
  }
};

export const createEvent = async (
  eventData: CreateEventFormData
): Promise<CreateEventResponse> => {
  try {
    // Convert event data object to FormData
    const formData = objectToFormData(eventData, ["image"]);

    const response = await axiosInstance.post<CreateEventResponse>(
      "/event",
      formData
    );

    return response.data;
  } catch (error) {
    console.error("Event creation failed:", error);
    throw error;
  }
};

export const getEvents = async () => {
  try {
    const response = await axiosInstance.get("/event");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch events:", error);
    throw error;
  }
};

export const getOrganizationActiveEvents = async (
  params: OrganizationEventQueryParams
): Promise<EventsResponse> => {
  try {
    const response = await axiosInstance.get<EventsResponse>(
      `/event/organizer/active`,
      {
        params: {
          account_uuid: params.account_uuid,
          page: params.page || 1,
          per_page: params.per_page || 5,
        },
      }
    );

    // Handle the new response format
    return response.data;
  } catch (error) {
    console.error("Failed to fetch organization active events:", error);
    throw error;
  }
};

// Deletes an event by its ID
export const deleteEvent = async (eventId: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/event/${eventId}`);
  } catch (error) {
    console.error("Event deletion failed:", error);
    throw error;
  }
};

// Fetches a single event by its ID
export const getEventById = async (eventId: number): Promise<EventData> => {
  try {
    const response = await axiosInstance.get<EventData>(`/event/${eventId}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch event with ID ${eventId}:`, error);
    throw error;
  }
};

// Updates an existing event with the provided data
export const updateEvent = async (
  eventId: number,
  eventData: EventFormData
): Promise<UpdateEventResponse> => {
  try {
    // Convert event data object to FormData
    const formData = objectToFormData(eventData, ["image"]);

    const response = await axiosInstance.put<UpdateEventResponse>(
      `/event/${eventId}`,
      formData
    );

    return response.data;
  } catch (error) {
    console.error("Event update failed:", error);
    throw error;
  }
};

// Fetches random events with pagination and comments
export const getRandomEvents = async (
  params: RandomEventsQueryParams
): Promise<RandomEventsResponse> => {
  try {
    const response = await axiosInstance.get<RandomEventsResponse>(
      `/event/all_with_comments`,
      {
        params: {
          page: params.page || 1,
          limit: params.limit || 5,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Failed to fetch random events:", error);
    throw error;
  }
};

// Fetches all RSVPs for a specific event
export const getEventRsvps = async (
  eventId: number
): Promise<EventRsvpsResponse> => {
  try {
    const response = await axiosInstance.get<EventRsvpsResponse>(
      `/event/${eventId}/rsvps`
    );
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch RSVPs for event with ID ${eventId}:`, error);
    throw error;
  }
};

// Fetches past events for a specific organization with pagination
export const getOrganizationPastEvents = async (
  params: OrganizationEventQueryParams
): Promise<PastEventsResponse> => {
  try {
    const response = await axiosInstance.get<PastEventsResponse>(
      `/event/organizer/past`,
      {
        params: {
          account_uuid: params.account_uuid,
          page: params.page || 1,
          page_size: params.per_page || 5,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Failed to fetch organization past events:", error);
    throw error;
  }
};

// Fetches organization details by organization ID
export const getOrganizationById = async (
  organizationId: string
): Promise<Organization> => {
  try {
    const response = await axiosInstance.get<Organization>(
      `/organization/${organizationId}`
    );
    return response.data;
  } catch (error) {
    console.error(
      `Failed to fetch organization with ID ${organizationId}:`,
      error
    );
    throw error;
  }
};

// Fetches a single event with comments by its ID and account UUID
export const getEventWithComments = async (
  params: EventWithCommentsParams
): Promise<EventData> => {
  try {
    const response = await axiosInstance.get<EventData>(
      `/event/${params.eventId}/with_comments`,
      {
        params: {
          account_uuid: params.accountUuid,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      `Failed to fetch event with comments for ID ${params.eventId}:`,
      error
    );
    throw error;
  }
};
