import { PrimaryButton } from "@src/shared/components/PrimaryButton";
import type { EventData, RSVPData } from "@src/features/main/organization/profile/schema/event.type";
import type { ShareByContentSharer } from "@src/features/share/schema/share.types";
import { checkOwnership, useFormatDate, useImageUrl } from "@src/shared/hooks";
import { useAuthStore } from "@src/shared/store/auth";
import { isMember, isOrganization } from "@src/shared/utils";
import pendingIcon from "@src/assets/shared/for_approval_icon.svg";
import joinedIcon from "@src/assets/shared/joined_icon.svg";
import joinIcon from "@src/assets/shared/join_icon.svg";
import { ProfileAvatar } from "@src/shared/components/ProfileAvatar";
import { useState } from "react";
import { EventDetailsModal } from "@src/shared/components/modals/EventDetailsModal";

interface SharedEventPostProps {
  event: EventData;
  sharer?: ShareByContentSharer;
  user_rsvp_status?: RSVPData | null;
  onJoinOrganization?: (orgId: number) => void;
  onCancelJoiningOrganization?: (orgId: number) => void;
  onLeaveOrganization?: (orgId: number) => void;
  onRsvpEvent: (eventId: number) => void;
  onDeleteRsvpEvent: (rsvpId: number) => void;

}

export const SharedEventPost = ({
  event,
  sharer,
  user_rsvp_status,
  onJoinOrganization,
  onCancelJoiningOrganization,
  onLeaveOrganization,
  onRsvpEvent,
  onDeleteRsvpEvent,
}: SharedEventPostProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { formatRelativeTime, formatFriendlyDateTime } = useFormatDate();
  const { getImageUrl } = useImageUrl();
  const { user } = useAuthStore();
  const userRole = isMember(user) ? "member" : "organization";
  const isOwner = checkOwnership({ type: "event", ownerId: event.organization?.account_id });

  const currentAvatar = getImageUrl(
    isMember(user)
      ? user?.profile_picture
      : isOrganization(user)
      ? user?.logo
      : undefined
  );

  const creatorImageUrl = getImageUrl(event.organization?.logo);
  const eventImageUrl = getImageUrl(event.image);

  const userRsvp = sharer?.user_rsvp || user_rsvp_status;

  return (
    <>
      <div 
        className="bg-athens_gray rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 w-full cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="flex flex-row items-start justify-between mb-4">
          <div 
            className="flex flex-row items-center space-x-2 sm:space-x-3"
            onClick={(e) => e.stopPropagation()}
          >
            <ProfileAvatar
            src={creatorImageUrl}
            alt="Event Creator"
            className="w-10 h-10 sm:w-14 sm:h-14"
            type="organization"
            isOwner={isOwner}
            organizationId={event.organization_id}
            name={event.organization_name}
            suffix={
              <span className="text-primary text-responsive-xs font-bold">
               {" "}
               <span className="text-authlayoutbg font-normal"> posted an event</span>
              </span>
            }
            nameClassName="text-primary text-responsive-xs font-bold"
          >
            <p className="text-placeholderbg text-responsive-xxs">
              {formatRelativeTime(event.created_date)}
            </p>
          </ProfileAvatar>
        </div>
        <div 
          className="flex items-start space-x-2"
          onClick={(e) => e.stopPropagation()}
        >
          {userRole === "member" && (
            <>
              {(!event.user_membership_status_with_organizer ||
                event.user_membership_status_with_organizer === "rejected") && (
                <PrimaryButton
                  variant="joinStatusButton"
                  iconClass="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2"
                  label="Join Organization"
                  responsiveLabel="Join"
                  icon={joinIcon}
                  onClick={() => onJoinOrganization?.(event.organization_id)}
                />
              )}

              {event.user_membership_status_with_organizer === "pending" && (
                <PrimaryButton
                  variant="iconButton"
                  iconClass="w-4 h-4 sm:w-5 sm:h-5"
                  label=""
                  icon={pendingIcon}
                  buttonClass="p-1"
                  onClick={() => onCancelJoiningOrganization?.(event.organization_id)}
                />
              )}

              {event.user_membership_status_with_organizer === "approved" && (
                <PrimaryButton
                  variant="iconButton"
                  iconClass="w-4 h-4 sm:w-5 sm:h-5"
                  label=""
                  icon={joinedIcon}
                  onClick={() => onLeaveOrganization?.(event.organization_id)}
                />
              )}
            </>
          )}
        </div>
      </div>

      <h3 className="text-responsive-sm font-bold text-primary mb-4 mt-1">{event.title}</h3>

      <div className="flex items-center mb-4">
        <svg
          className="w-4 h-4 sm:w-5 sm:h-5 text-primary mr-1 sm:mr-2 flex-shrink-0"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
            clipRule="evenodd"
          />
        </svg>
        <span className="text-primary text-responsive-xs">
          {event.address?.province}, {event.address?.city}, {event.address?.barangay},
        </span>
      </div>

      <div className="flex items-center mb-4">
        <svg
          className="w-4 h-4 sm:w-5 sm:h-5 text-primary mr-1 sm:mr-2 flex-shrink-0"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
            clipRule="evenodd"
          />
        </svg>
        <span className="text-primary text-responsive-xs">
          {formatFriendlyDateTime(event.event_date)}
        </span>
      </div>

      {/* Only show RSVP button for members, not for organizations */}
      {userRole === "member" && (
        <div 
          className="mb-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Show RSVP button if user hasn't RSVPed yet */}
          {!userRsvp && (
            <PrimaryButton
              variant={"rsvpButton"}
              label={"RSVP"}
              onClick={() => onRsvpEvent?.(event.id)}
            />
          )}

          {/* Show Pending button if user has RSVPed and status is pending */}
          {userRsvp?.status === "pending" && (
            <PrimaryButton
              variant={"pendingEventButton"}
              label={"Pending"}
              onClick={() => {
                const rsvpId = userRsvp?.rsvp_id;
                if (rsvpId) onDeleteRsvpEvent(rsvpId);
              }}
            />
          )}

          {/* Show Cancel RSVP button if user has RSVPed and status is joined */}
          {userRsvp?.status === "joined" && (
            <PrimaryButton
              variant={"activeEventButton"}
              label={"Cancel RSVP"}
              onClick={() => {
                const rsvpId = userRsvp?.rsvp_id;
                if (rsvpId) onDeleteRsvpEvent(rsvpId);
              }}
            />
          )}
        </div>
      )}

      <div className="bg-white p-3 sm:p-4 rounded-xl text-responsive-xs text-primary leading-relaxed">
        <p>{event.description}</p>
      </div>

      <div className="w-full h-40 sm:h-48 md:h-56 lg:h-[300px] overflow-hidden mt-4">
        <img src={eventImageUrl} alt={event.title} className="w-full h-full object-cover" />
      </div>
      </div>

      {/* Event Details Modal */}
      <EventDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        eventId={event.id}
        currentUserAvatar={currentAvatar}
        userRole={userRole}
        onJoinOrganization={onJoinOrganization}
        onCancelJoiningOrganization={onCancelJoiningOrganization}
        onLeaveOrganization={onLeaveOrganization}
        onRsvpEvent={onRsvpEvent}
        onDeleteRsvpEvent={onDeleteRsvpEvent}
      />
    </>
  );
};
