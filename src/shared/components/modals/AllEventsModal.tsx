import { format } from "date-fns";
import { useState, useEffect } from "react";
import { Modal } from "../Modal";
import type { CalendarEvent } from "@src/features/calendar/schema/calendar.type";
import { useImageUrl } from "@src/shared/hooks/useImageUrl";
import avatarImage from "@src/assets/shared/avatar.png";
import { PrimaryButton } from "../PrimaryButton";

interface AllEventsModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
}

/**
 * Modal component for displaying all events for a specific date
 */
export function AllEventsModal({
  isOpen,
  onClose,
  date,
  events,
  onEventClick,
}: AllEventsModalProps) {
  // Use the image URL hook to generate image URLs
  const { getImageUrl } = useImageUrl();

  // State to track loading status of images
  const [loadingImages, setLoadingImages] = useState<Record<string, boolean>>(
    {}
  );

  // Handle loading state for images when modal opens/closes
  useEffect(() => {
    if (isOpen && events.length > 0) {
      // Initialize loading state when modal is opened
      setLoadingImages((prevState) => {
        const newState = { ...prevState };

        // Set loading state for each event
        events.forEach((event) => {
          // Only set if not already tracked
          if (newState[event.event_id] === undefined) {
            newState[event.event_id] = true;
          }
        });

        return newState;
      });
    }

    // Reset loading states when modal closes to prevent stale states
    if (!isOpen) {
      setLoadingImages({});
    }

    // Cleanup function to reset loading states when component unmounts or dependencies change
    return () => {
      // No need for additional cleanup as the effect itself handles state reset when isOpen changes
    };
  }, [isOpen, events]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <div className="w-full p-6 sm:p-7 md:p-8">
        <h3 className="text-xl font-semibold leading-6 text-primary mb-5">
          Events on {format(date, "MMMM d, yyyy")}
        </h3>

        <div className="mt-5 max-h-[400px] overflow-y-auto pr-1">
          {events.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-gray-500">
                No events scheduled for this date.
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Check other dates or create a new event.
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {events.map((event) => (
                <li
                  key={event.event_id}
                  className="p-4 bg-white rounded-lg hover:bg-gray-50 cursor-pointer transition-colors shadow-sm"
                  onClick={() => onEventClick(event)}
                >
                  <div className="flex flex-col">
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 rounded-full overflow-hidden mr-3 flex-shrink-0 bg-gray-100">
                        {loadingImages[event.event_id] && (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100">
                            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        )}
                        <img
                          src={
                            getImageUrl(
                                  event.organization.logo
                                )
                          }
                          alt={event.organization.name}
                          className={`w-full h-full object-cover transition-opacity duration-200 ${
                            loadingImages[event.event_id]
                              ? "opacity-0"
                              : "opacity-100"
                          }`}
                          onLoad={() => {
                            setLoadingImages((prev) => ({
                              ...prev,
                              [event.event_id]: false,
                            }));
                          }}
                          onError={(e) => {
                            // Set fallback image on error
                            e.currentTarget.src = avatarImage;
                            setLoadingImages((prev) => ({
                              ...prev,
                              [event.event_id]: false,
                            }));
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {event.title}
                        </h4>
                        <p className="text-xs text-gray-500 truncate">
                          {event.organization.name}
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full ml-2 flex-shrink-0">
                        {format(new Date(event.event_date), "h:mm a")}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-7 flex justify-end">
          <PrimaryButton
            label="Close"
            variant="acceptButton"
            onClick={onClose}
          />
        </div>
      </div>
    </Modal>
  );
}
