import type { EventData } from "@src/features/main/organization/profile/schema/event.type";

export interface EventPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface EventsByRsvpStatusResponse {
  events: EventData[];
  pagination: EventPagination;
}

export interface EventsByRsvpStatusQueryParams {
  accountUuid: string;
  rsvpStatus: string;
  page?: number;
  limit?: number;
}
