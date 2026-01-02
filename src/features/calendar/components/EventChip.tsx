import React from "react";
import type { CalendarEvent } from "../schema/calendar.type";

interface EventChipProps {
  event: CalendarEvent;
  onClick?: (e: React.MouseEvent) => void;
}

// EventChip component for displaying compact event information with title and organization
export function EventChip({ event, onClick }: EventChipProps) {
  return (
    <div
      className="inline-flex flex-col w-full max-w-full overflow-hidden cursor-pointer"
      onClick={onClick}
    >
      {/* Date */}
      {/* <span className="text-responsive-xl">{formattedDate}</span> */}

      {/* Title */}
      <span
        className="text-responsive-xs font-bold text-primary mb-2"
        title={event.title}
      >
        {event.title}
      </span>

      {/* Organization/Author */}
      {event.organization && (
        <span
          className="text-responsive-xxs text-gray-500"
          title={event.organization.name}
        >
          {event.organization.name}
        </span>
      )}
    </div>
  );
}
