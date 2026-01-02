import type { ContentComment } from "@src/features/comments/schema/comment.types";

// Type for grouped events by date
export type EventsByDate = Record<string, CalendarEvent[]>;

// Type for the event response from API
export type EventResponse = {
  rsvped_events: CalendarEvent[];
};

// Type for the organization calendar response from API
export type OrganizationCalendarResponse = {
  past_events: OrganizationEvent[];
  active_events: OrganizationEvent[];
};

export interface Image {
  id: number;
  directory: string;
  filename: string;
}

// Interface for address data
export interface Address {
  id: number;
  country: string;
  province: string;
  city: string;
  barangay: string;
  house_building_number: string;
  country_code: string;
  province_code: string;
  city_code: string;
  barangay_code: string;
}

// Interface for organization data
export interface Organization {
  id: number;
  name: string;
  description: string;
  logo: Image;
  category: string;
  account_id?: number;
}

// Interface for calendar event data
export interface CalendarEvent {
  event_id: number;
  event_organization_id: number;
  title: string;
  event_date: string; // ISO date string
  address_id: number;
  description: string;
  image: Image;
  created_date: string;
  last_modified_date: string;
  rsvp_status: string;
  address: Address;
  organization: Organization;
  user_membership_status_with_organizer?: string;
  total_comments?: number;
  latest_comments?: ContentComment[];
  rsvp_id?: number;
  user_rsvp?: {
    status: string;
    rsvp_id: number;
  };
}

// Interface for organization event data
export interface OrganizationEvent {
  id: number;
  organization_id: number;
  title: string;
  event_date: string; // ISO date string
  address_id: number;
  description: string;
  image: Image;
  created_date: string;
  last_modified_date: string;
  address: Address;
  organization: Organization;
}
