import { useState } from "react";
import { EventDetailsModal } from "@src/shared/components/modals/EventDetailsModal";
import { CalendarGrid } from "../components/CalendarGrid";
import {
  useMemberCalendarEvents,
  useOrganizationCalendarEvents,
} from "../model/calendar.query";
import { useAuthStore } from "@src/shared/store/auth";
import { isMember, isOrganization } from "@src/shared/utils";
import type {
  CalendarEvent,
  OrganizationEvent,
  EventResponse,
} from "../schema/calendar.type";
import { useImageUrl } from "@src/shared/hooks";
import {
  useJoinOrganization,
  useRsvpEvent,
  useDeleteRsvp,
} from "@src/features/home/model/home.mutation";
import { useLeaveOrganization } from "@src/features/main/member/organization/model/organization.mutation";

// Calendar component that displays events based on user type (member or organization)
type CalendarSectionProps = {
  userType?: "member" | "organization";
  accountUuid?: string;
};

export function CalendarSection(
  { userType, accountUuid }: CalendarSectionProps = { userType: "member" }
) {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuthStore();

  // Initialize mutation hooks
  const joinOrganizationMutation = useJoinOrganization();
  const leaveOrganizationMutation = useLeaveOrganization();
  const rsvpEventMutation = useRsvpEvent();
  const deleteRsvpMutation = useDeleteRsvp();

  // State for tracking current month and year
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  // Get current month and year for the query
  const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-indexed
  const currentYear = currentDate.getFullYear();

  // Always call both hooks to maintain consistent hook call order
  const memberQuery = useMemberCalendarEvents(
    currentMonth,
    currentYear,
    accountUuid || user?.uuid || ""
  );
  const organizationQuery = useOrganizationCalendarEvents(
    currentMonth,
    currentYear,
    accountUuid || user?.uuid || ""
  );

  // Select the appropriate query result based on userType
  const { data, isLoading, isError } =
    userType === "organization" ? organizationQuery : memberQuery;

  // Extract and transform events from API response based on userType
  let events: CalendarEvent[] = [];

  if (data) {
    if (userType === "organization") {
      // Transform organization events to match CalendarEvent structure
      const orgData = data as {
        active_events: OrganizationEvent[];
        past_events: OrganizationEvent[];
      };

      // Safely handle potentially empty arrays
      const activeEvents = orgData.active_events || [];
      const pastEvents = orgData.past_events || [];

      // Combine active and past events
      const combinedEvents = [...activeEvents, ...pastEvents];

      // Only map if there are events to process
      events =
        combinedEvents.length > 0
          ? combinedEvents.map((event) => ({
              event_id: event.id,
              event_organization_id: event.organization_id,
              title: event.title,
              event_date: event.event_date,
              address_id: event.address_id,
              description: event.description,
              image: event.image,
              created_date: event.created_date,
              last_modified_date: event.last_modified_date,
              rsvp_status: "organizer", // Organization is the organizer
              address: event.address,
              organization: event.organization,
            }))
          : [];
    } else {
      // Member events are already in the correct format
      const memberData = data as EventResponse;
      if (memberData.rsvped_events) {
        events = memberData.rsvped_events;
      }
    }
  }

  // Handle date selection
  const handleDateSelect = (_date: Date) => {
    // This function could be used to filter events for the selected date
    // or perform other actions when a date is selected
    console.log("Selected date:", _date);
  };

  // Handle month change
  const handleMonthChange = (date: Date) => {
    // Update the current date to fetch events for the new month
    setCurrentDate(date);
  };

  // Handle event selection
  const handleEventSelect = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleJoinOrganization = (orgId: number) => {
    joinOrganizationMutation.mutate(orgId);
  };

  const handleCancelJoiningOrganization = (orgId: number) => {
    leaveOrganizationMutation.mutate(orgId);
  };

  const handleLeaveOrganization = (orgId: number) => {
    leaveOrganizationMutation.mutate(orgId);
  };

  const handleRsvpEvent = (eventId: number) => {
    rsvpEventMutation.mutate(eventId);
  };

  const handleDeleteRsvpEvent = (rsvpId: number) => {
    deleteRsvpMutation.mutate(rsvpId);
  };

  const { getImageUrl } = useImageUrl();

  const currentAvatar = getImageUrl(
    isMember(user)
      ? user?.profile_picture
      : isOrganization(user)
      ? user?.logo
      : undefined
  );

  return (
    <div className="w-full">
      {isLoading && (
        <div className="text-center py-4 text-gray-500">Loading events...</div>
      )}

      {isError && (
        <div className="text-center py-4 text-red-500">
          Error loading events. Please try again later.
        </div>
      )}
      <CalendarGrid
        events={events}
        onDateSelect={handleDateSelect}
        onMonthChange={handleMonthChange}
        onEventSelect={handleEventSelect}
      />

      {/* Event Details Modal */}
      {selectedEvent && (
        <EventDetailsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          eventId={selectedEvent.event_id}
          currentUserAvatar={currentAvatar}
          isOwner={false}
          userRole={
            isMember(user)
              ? "member"
              : isOrganization(user)
              ? "organization"
              : "member"
          }
          onJoinOrganization={handleJoinOrganization}
          onCancelJoiningOrganization={handleCancelJoiningOrganization}
          onLeaveOrganization={handleLeaveOrganization}
          onRsvpEvent={handleRsvpEvent}
          onDeleteRsvpEvent={handleDeleteRsvpEvent}
        />
      )}
    </div>
  );
}
