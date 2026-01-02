import { ProfileAvatar } from "@src/shared/components/ProfileAvatar";
import { DropdownMenu } from "@src/shared/components/DropdownMenu";
import { CommentsSection } from "@src/features/comments/ui/CommentsSection";
import {
  useFormatDate,
  useImageUrl,
  checkOwnership,
} from "@src/shared/hooks";
import { useLightbox } from "@src/shared/hooks/useLightbox";
import type { EventData } from "../../schema/event.type";

interface EventPastPostProps {
  event: EventData;
  currentUserAvatar: string;
  onEdit?: (eventId: number) => void;
  onDelete?: (eventId: number) => void;
  onViewMoreMembers?: (eventId: number) => void;
  onViewMoreComments?: (eventId: number) => void;
}

export const EventPastPost = ({
  event,
  currentUserAvatar,
  onEdit,
  onDelete,
  onViewMoreMembers,
  onViewMoreComments,
}: EventPastPostProps) => {
  // const {
  //   isConfirmModalOpen,
  //   modalConfig,
  //   openConfirmationModal,
  //   closeConfirmationModal,
  // } = useConfirmationModal();

  const { formatRelativeTime, formatDateTime } = useFormatDate();
  const { getImageUrl } = useImageUrl();
  const { openLightbox, LightboxViewer } = useLightbox();
  const isOwner = checkOwnership({ type: "event", ownerId: event.organization?.account_id });

  const handleEdit = () => {
    onEdit?.(event.id);
  };

  const handleDelete = () => {
    onDelete?.(event.id)
  };

  const handleViewMoreMembers = () => {
    onViewMoreMembers?.(event.id);
  };

  const handleViewMoreComments = () => {
    onViewMoreComments?.(event.id);
  };

  // Members display logic (without remove buttons)
  const displayedMembers = event.members?.slice(0, 3) || [];
  const totalMembers = event.total_members || 0;
  const hasMoreMembers = totalMembers > 3;

  // Get event image URL
  const eventImageUrl = getImageUrl(event.image);

  // We'll format the location directly in the JSX for better handling of optional fields

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
      {/* 1. Header with Avatar, Name, Time and 3-dot menu */}
      <div className="flex flex-row items-start justify-between mb-3 sm:mb-4">
        <div className="flex flex-row items-center space-x-2 sm:space-x-3">
          <ProfileAvatar
            src={getImageUrl(event.organization?.logo)}
            alt={event.organization?.name || "Event Creator"}
            className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full object-cover"
            type="organization"
            organizationId={event.organization_id}
            isOwner={isOwner}
            name={event.organization?.name || "Organization"}
            suffix={
              <span className="text-authlayoutbg"> posted an event</span>
            }
            nameClassName="text-primary text-responsive-sm font-bold"
          >
            <p className="text-placeholderbg text-responsive-xs">
              {formatRelativeTime(event.created_date)}
            </p>
          </ProfileAvatar>
        </div>

        {/* Horizontal 3-dot menu - only show if the event is from the authenticated user */}
        {checkOwnership({
          type: "event",
          ownerId: event.organization?.account_id,
        }) && (
          <DropdownMenu
            onEdit={handleEdit}
            onDelete={handleDelete}
            showEdit={false}
            deleteLabel="Delete Event"
          />
        )}
      </div>

      {/* 2. Post Title */}
      <h3 className="text-responsive-sm sm:text-responsive-base font-bold text-primary mb-2 sm:mb-3">
        {event.title}
      </h3>

      {/* 3. Location */}
      <div className="flex items-center mb-2 sm:mb-3">
        <svg
          className="w-4 h-4 sm:w-5 sm:h-5 text-primary mr-1 sm:mr-2"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
            clipRule="evenodd"
          />
        </svg>
        <span className="text-primary text-responsive-sm">
          {event.address ? (
            <>
              {event.address.house_building_number &&
                `${event.address.house_building_number}, `}
              {event.address.barangay && `${event.address.barangay}, `}
              {event.address.city && `${event.address.city}, `}
              {event.address.province && event.address.province}
              {event.address.country && `, ${event.address.country}`}
            </>
          ) : (
            "No location specified"
          )}
        </span>
      </div>

      {/* 4. Time of Event */}
      <div className="flex items-center mb-3 sm:mb-4">
        <svg
          className="w-4 h-4 sm:w-5 sm:h-5 text-primary mr-1 sm:mr-2"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
            clipRule="evenodd"
          />
        </svg>
        <span className="text-primary text-responsive-sm">
          {event.event_date
            ? formatDateTime(event.event_date)
            : "No date specified"}
        </span>
      </div>

      {/* 5. Description */}
      <div className="bg-athens_gray p-3 sm:p-4 rounded-xl text-responsive-xs sm:text-responsive-sm text-primary leading-relaxed">
        <p>{event.description}</p>
      </div>

      {/* 6. Event Image */}
      <button
        type="button"
        className="w-full h-40 sm:h-48 md:h-56 lg:h-64 rounded-xl overflow-hidden mt-3 sm:mt-4 cursor-pointer"
        onClick={() => openLightbox(0, [{ src: eventImageUrl }])}
      >
        <img
          src={eventImageUrl}
          alt={event.title}
          className="w-full h-full object-cover"
        />
      </button>

      <hr className="my-3 sm:my-4 text-gainsboro" />

      {/* 7. Members Section */}
      <div className="">
        {/* Members Header */}
        <div className="flex">
          <div className="px-3 sm:px-4 py-[2px] text-responsive-xs sm:text-responsive-sm text-primary font-bold">
            Members
          </div>
        </div>

        {/* Members Content */}
        <div className="px-3 sm:px-4 pt-3 sm:pt-4">
          <div className="space-y-3">
            {displayedMembers.length > 0 ? (
              displayedMembers.map((member) => (
                <div
                  key={member.rsvp_id}
                  className="flex items-center space-x-2 sm:space-x-3"
                >
                  <img
                    src={getImageUrl(
                      member.user?.profile_picture
                    )}
                    alt={`${member.user?.first_name || "User"} ${
                      member.user?.last_name || ""
                    } avatar`}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-primary text-responsive-xs sm:text-responsive-sm font-medium">{`${
                      member.user?.first_name || "User"
                    } ${member.user?.last_name || ""}`}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-placeholderbg text-responsive-xs sm:text-responsive-sm">
                No members participated
              </p>
            )}
          </div>

          {/* View More Members */}
          {hasMoreMembers && (
            <div className="flex justify-between items-center mt-4 sm:mt-6 border-gray-200">
              <button
                onClick={handleViewMoreMembers}
                className="text-authlayoutbg text-responsive-sm hover:underline transition-all duration-200"
              >
                View more
              </button>
              <span className="text-authlayoutbg text-responsive-sm">
                3 of {totalMembers}
              </span>
            </div>
          )}
        </div>
      </div>

      <hr className="my-3 sm:my-4 text-gainsboro" />

      {/* 8. Comments Section */}
      <CommentsSection
        comments={event.limited_comments || []}
        totalComments={event.total_comments || 0}
        onViewMoreComments={handleViewMoreComments}
        contentId={event.id}
        contentType="event"
        currentUserAvatar={currentUserAvatar} // Provide default avatar for comment input
      />
      <LightboxViewer />

      {/* Confirmation Modal */}
      {/* {modalConfig && (
        <ConfirmationModal
          isOpen={isConfirmModalOpen}
          onClose={closeConfirmationModal}
          onConfirm={modalConfig.onConfirm}
          title={modalConfig.title}
          message={modalConfig.message}
          confirmButtonText={modalConfig.confirmButtonText}
          confirmButtonVariant={modalConfig.confirmButtonVariant}
        />
      )} */}
    </div>
  );
};
