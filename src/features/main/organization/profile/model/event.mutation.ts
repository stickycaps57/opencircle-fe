import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createEvent,
  deleteEvent,
  updateEvent,
  acceptRsvpRequest,
  declineRsvpRequest,
} from "../lib/event.api";
import type {
  CreateEventFormData,
  EventFormData,
} from "../schema/event.schema";
import { QUERY_KEYS } from "@src/shared/constants/queryKeys";
import type {
  CreateEventResponse,
  UpdateEventResponse,
} from "../schema/event.type";
import { showSuccessToast, showErrorToast } from "@src/shared/components/Toast/CustomToast";

// Custom hook for handling event creation functionality using TanStack Query
export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation<CreateEventResponse, Error, CreateEventFormData>({
    mutationFn: (eventData) => createEvent(eventData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ORGANIZATION_ACTIVE_EVENTS],
      });
      showSuccessToast("Successfully created");
    },
    onError: (error) => {
      console.error("Event creation error:", error);
      showErrorToast("Failed to create");
    },
  });
};

// Custom hook for handling event deletion functionality using TanStack Query
export const useDeleteEvent = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: (eventId) => deleteEvent(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ORGANIZATION_ACTIVE_EVENTS],
      });

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.RANDOM_EVENTS],
      });
      showSuccessToast("Successfully deleted");
    },
    onError: (error) => {
      console.error("Event deletion error:", error);
      showErrorToast("Failed to delete");
    },
  });
};

// Custom hook for handling event update functionality using TanStack Query
export const useUpdateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation<
    UpdateEventResponse,
    Error,
    { eventId: number; eventData: EventFormData }
  >({
    mutationFn: ({ eventId, eventData }) => updateEvent(eventId, eventData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ORGANIZATION_ACTIVE_EVENTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.EVENTS, variables.eventId],
      });
      showSuccessToast("Successfully updated");
    },
    onError: (error) => {
      console.error("Event update error:", error);
      showErrorToast("Failed to update");
    },
  });
};

export const useAcceptRsvpRequest = () => {
  const queryClient = useQueryClient();
  return useMutation<{ success: boolean; message?: string }, Error, { rsvpId: number; status: "joined" | "rejected" }>({
    mutationFn: ({ rsvpId, status }) => acceptRsvpRequest(rsvpId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ORGANIZATION_ACTIVE_EVENTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.EVENTS_RSVPS],
      });
      
      showSuccessToast("Successfully accepted");
    },
    onError: (error) => {
      console.error("RSVP acceptance error:", error);
      showErrorToast("Failed to accept");
    },
  });
};

export const useDeclineRsvpRequest = () => {
  const queryClient = useQueryClient();
  return useMutation<{ success: boolean; message?: string }, Error, number>({
    mutationFn: (rsvpId) => declineRsvpRequest(rsvpId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ORGANIZATION_ACTIVE_EVENTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.EVENTS_RSVPS],
      });
      showSuccessToast("Successfully declined");
    },
    onError: (error) => {
      console.error("RSVP decline error:", error);
      showErrorToast("Failed to decline");
    },
  });
};
