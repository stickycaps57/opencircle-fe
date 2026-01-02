import joinedIcon from "@src/assets/shared/joined_icon.svg";
import pendingIcon from "@src/assets/shared/for_approval_icon.svg";
import joinIcon from "@src/assets/shared/join_icon.svg";
import { PrimaryButton } from "@src/shared/components/PrimaryButton";
import { useFormatDate, checkOwnership } from "@src/shared/hooks";
import { useImageUrl } from "@src/shared/hooks/useImageUrl";
import { useLightbox } from "@src/shared/hooks/useLightbox";
import { ProfileAvatar } from "@src/shared/components/ProfileAvatar";
import type { EventData } from "@src/features/main/organization/profile/schema/event.type";
import { CommentsSection } from "@src/features/comments/ui/CommentsSection";

interface MemberActiveEventProps {
  event: EventData;
  currentUserAvatar?: string;
  onViewMoreComments?: () => void;
  status?: string; // Optional status property for RSVP status ("Approved", "Pending", or "Past")
  onJoinOrganization: (orgId: number) => void;
  onCancelJoiningOrganization: (orgId: number) => void;
  onLeaveOrganization: (orgId: number) => void;
  onRsvpEvent: (eventId: number) => void;
  onDeleteRsvpEvent: (rsvpId: number) => void;
}

export const MemberEvents = ({
  event,
  currentUserAvatar,
  onViewMoreComments,
  onJoinOrganization,
  onCancelJoiningOrganization,
  onLeaveOrganization,
  onRsvpEvent,
  onDeleteRsvpEvent,
  status,
}: MemberActiveEventProps) => {
  const { formatRelativeTime, formatDateTime } = useFormatDate();
  const { getImageUrl } = useImageUrl();
  const { openLightbox, LightboxViewer } = useLightbox();
  const isOwner = checkOwnership({ type: "event", ownerId: event.organization?.account_id });
  const isPastEvent = status === "Past";

  const handleViewMoreComments = () => {
    onViewMoreComments?.();
  };

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 w-full">
      {/* 1. Header with Avatar, Name, Time and 3-dot menu */}
      <div className="flex flex-row items-start justify-between mb-4">
        <div className="flex flex-row items-center space-x-2 sm:space-x-3">
          <ProfileAvatar
            src={getImageUrl(event.organization?.logo)}
            alt="Event Creator"
            className="w-10 h-10 sm:w-14 sm:h-14"
            type="organization"
            isOwner={isOwner}
            organizationId={event.organization_id}
            name={event.organization?.name}
            suffix={
              <span className="text-primary text-responsive-xs font-bold">
               {" "}
               <span className="text-authlayoutbg font-normal">posted an event</span>
              </span>
            }
            nameClassName="text-primary text-responsive-xs font-bold"
          >
            <p className="text-placeholderbg text-responsive-xxs">
              {formatRelativeTime(event.created_date)}
            </p>
          </ProfileAvatar>
        </div>

        <div className="flex items-start space-x-2">
          {/* Conditional rendering based on membership status */}
          {/* Show Join Organization button when status is null or rejected */}
          {(!event.user_membership_status_with_organizer ||
            event.user_membership_status_with_organizer === "rejected") && (
            <PrimaryButton
              variant="joinStatusButton"
              iconClass="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2"
              label="Join Organization"
              responsiveLabel="Join"
              icon={joinIcon}
              onClick={() => onJoinOrganization(event.organization_id)}
            />
          )}

          {/* Show For Approval button when status is pending */}
          {event.user_membership_status_with_organizer === "pending" && (
            <PrimaryButton
              variant="iconButton"
              iconClass="w-4 h-4 sm:w-5 sm:h-5"
              label=""
              icon={pendingIcon}
              buttonClass="p-1"
              onClick={() => onCancelJoiningOrganization(event.organization_id)}
            />
          )}

          {/* Show only icon when status is approved */}
          {event.user_membership_status_with_organizer === "approved" && (
            <PrimaryButton
              variant="iconButton"
              iconClass="w-4 h-4 sm:w-5 sm:h-5"
              label=""
              icon={joinedIcon}
              onClick={() => onLeaveOrganization(event.organization_id)}
            />
          )}
        </div>
      </div>

      {/* 2. Post Title */}
      <h3 className="text-responsive-base font-bold text-primary mb-3">
        {event.title}
      </h3>

      {/* 3. Location */}
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
          {event.address
            ? `${event.address.barangay}, ${event.address.city}, ${event.address.province}`
            : "No location provided"}
        </span>
      </div>

      {/* 4. Time of Event */}
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
          {formatDateTime(event.event_date)}
        </span>
      </div>

      {/* RSVP Buttons - Hidden for Past events */}
      {!isPastEvent && (
        <div className="mb-4">
          {/* Show RSVP button if user hasn't RSVPed yet */}
          {!event.user_rsvp && (
            <PrimaryButton
              variant={"rsvpButton"}
              label={"RSVP"}
              onClick={() => onRsvpEvent?.(event.id)}
            />
          )}

          {/* Show Pending button if user has RSVPed and status is pending */}
          {event.user_rsvp && event.user_rsvp.status === "pending" && (
            <PrimaryButton
              variant={"pendingEventButton"}
              label={"Pending"}
              onClick={() => onDeleteRsvpEvent?.(event.user_rsvp.rsvp_id)}
            />
          )}

          {/* Show Cancel RSVP button if user has RSVPed and status is approved */}
          {event.user_rsvp && event.user_rsvp.status === "joined" && (
            <PrimaryButton
              variant={"activeEventButton"}
              label={"Approved"}
              onClick={() => onDeleteRsvpEvent?.(event.user_rsvp.rsvp_id)}
            />
          )}
        </div>
      )}

      {/* 5. Description */}
      <div className="bg-athens_gray p-3 sm:p-4 rounded-xl text-responsive-xs text-primary leading-relaxed">
        <p>{event.description}</p>
      </div>

      {/* 6. Event Image */}
      <button
        type="button"
        className="w-full h-40 sm:h-48 md:h-56 lg:h-[300px] overflow-hidden mt-4 cursor-pointer"
        onClick={() =>
          openLightbox(0, [
            {
              src: event.image
                ? getImageUrl(event.image)
                : "",
            },
          ])
        }
      >
        <img
          src={
            event.image
              ? getImageUrl(event.image)
              : ""
          }
          alt={event.title}
          className="w-full h-full object-cover"
        />
      </button>

      {/* 8. Comments Section */}
      <CommentsSection
        contentType="event"
        contentId={event.id}
        comments={event.latest_comments}
        totalComments={event.total_comments}
        currentUserAvatar={currentUserAvatar}
        onViewMoreComments={handleViewMoreComments}
      />
      <LightboxViewer />
    </div>
  );
};
