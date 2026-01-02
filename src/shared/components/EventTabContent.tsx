import { ConfirmationModal } from "./modals";
import { useConfirmationModal, useImageUrl } from "../hooks";
import type { EventParticipant } from "@src/features/main/organization/profile/schema/event.type";
import {
  useAcceptRsvpRequest,
  useDeclineRsvpRequest,
} from "@src/features/main/organization/profile/model/event.mutation";
import { PrimaryButton } from "./PrimaryButton";

interface EventTabContentProps {
  activeTab: "members" | "request";
  members?: EventParticipant[];
  requests?: EventParticipant[];
  totalMembers?: number;
  totalRequests?: number;
  onViewMoreMembers?: () => void;
  onViewMoreRequests?: () => void;
  isUserMember?: boolean;
}

export function EventTabContent({
  activeTab,
  members = [],
  requests = [],
  totalMembers = 0,
  totalRequests = 0,
  onViewMoreMembers,
  onViewMoreRequests,
  isUserMember = false,
}: EventTabContentProps) {
  const {
    isConfirmModalOpen,
    modalConfig,
    openConfirmationModal,
    closeConfirmationModal,
  } = useConfirmationModal();

  const { getImageUrl } = useImageUrl();

  const acceptRsvpMutation = useAcceptRsvpRequest();
  const declineRsvpMutation = useDeclineRsvpRequest();

  const handleAcceptClick = (request: EventParticipant) => {
    openConfirmationModal({
      title: "Accept This User",
      message:
        "This action will approve the user's participation in the event. Are you sure you want to accept?",
      confirmButtonText: "Accept",
      confirmButtonVariant: "primary",
      onConfirm: () => acceptRsvpMutation.mutateAsync({ rsvpId: request.rsvp_id, status: "joined" }),
    });
  };

  const handleDeclineClick = (request: EventParticipant) => {
    openConfirmationModal({
      title: "Decline Event Request",
      message:
        "By declining, this user will not be able to participate in the event. Do you wish to continue?",
      confirmButtonText: "Decline",
      confirmButtonVariant: "primary",
      onConfirm: () => declineRsvpMutation.mutateAsync(request.rsvp_id),
    });
  };

  const handleRemoveClick = (member: EventParticipant) => {
    openConfirmationModal({
      title: "Remove User From Event",
      message:
        "This action will remove the user from the event's participant list. Do you wish to continue?",
      confirmButtonText: "Remove",
      confirmButtonVariant: "primary",
      onConfirm: () => declineRsvpMutation.mutateAsync(member.rsvp_id),
    });
  };

  if (activeTab === "members") {
    const displayedMembers = members.slice(0, 3);
    const hasMoreMembers = totalMembers > 3;
    return (
      <div className="px-2 sm:px-4 pt-2 sm:pt-4">
        <div className="space-y-3">
          {displayedMembers.length > 0 ? (
            displayedMembers.map((member) => (
              <div
                key={member.rsvp_id}
                className="justify-between flex items-center"
              >
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <img
                    src={getImageUrl(
                      member.user.profile_picture
                    )}
                    alt={`${member.user.first_name} ${member.user.last_name} avatar`}
                    className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-primary font-bold text-responsive-xs sm:text-responsive-sm">
                      {member.user.first_name} {member.user.last_name}
                    </p>
                  </div>
                </div>
                {!isUserMember && (
                  <div className="flex space-x-2 sm:space-x-3">
                    <PrimaryButton
                      label="Remove"
                      variant="removeButton"
                      onClick={() => handleRemoveClick(member)}
                    />
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-placeholderbg text-responsive-xs sm:text-responsive-sm">
              No members yet
            </p>
          )}
        </div>

        {/* View More Members */}
        {hasMoreMembers && (
          <div className="flex justify-between items-center mt-4 sm:mt-6 border-gray-200">
            <PrimaryButton
              label="View more"
              variant="viewMoreButton"
              onClick={() => onViewMoreMembers && onViewMoreMembers()}
            />
            <span className="text-authlayoutbg text-responsive-xs sm:text-responsive-sm">
              3 of {totalMembers}
            </span>
          </div>
        )}

        {/* Confirmation Modal */}
        {modalConfig && (
          <ConfirmationModal
            isOpen={isConfirmModalOpen}
            onClose={closeConfirmationModal}
            onConfirm={modalConfig.onConfirm}
            title={modalConfig.title}
            message={modalConfig.message}
            confirmButtonText={modalConfig.confirmButtonText}
            confirmButtonVariant={modalConfig.confirmButtonVariant}
          />
        )}
      </div>
    );
  } else {
    const displayedRequests = requests.slice(0, 3);
    const hasMoreRequests = totalRequests > 3;

    return (
      <div className="px-2 sm:px-4 pt-2 sm:pt-4">
        <div className="space-y-3">
          {displayedRequests.length > 0 ? (
            displayedRequests.map((request) => (
              <div
                key={request.rsvp_id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <img
                    src={getImageUrl(
                      request.user.profile_picture
                    )}
                    alt={`${request.user.first_name} ${request.user.last_name} avatar`}
                    className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-primary font-bold text-responsive-xs sm:text-responsive-sm">
                      {request.user.first_name} {request.user.last_name}
                    </p>
                    {/* <p className="text-placeholderbg text-responsive-xs">
                      {request.account.email}
                    </p> */}
                  </div>
                </div>
                {!isUserMember && (
                  <div className="flex space-x-2 sm:space-x-3">
                    <PrimaryButton
                      label="Accept"
                      variant="acceptButton"
                      onClick={() => handleAcceptClick(request)}
                    />
                    <PrimaryButton
                      label="Decline"
                      variant="declineButton"
                      onClick={() => handleDeclineClick(request)}
                    />
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-placeholderbg text-responsive-xs sm:text-responsive-sm">
              No pending requests
            </p>
          )}
        </div>

        {/* View More Section */}
        {hasMoreRequests && (
          <div className="flex justify-between items-center mt-4 sm:mt-6 border-gray-200">
            <PrimaryButton
              label="View more"
              variant="viewMoreButton"
              onClick={() => onViewMoreRequests && onViewMoreRequests()}
            />
            <span className="text-authlayoutbg text-responsive-xs sm:text-responsive-sm">
              3 of {totalRequests}
            </span>
          </div>
        )}

        {/* Confirmation Modal */}
        {modalConfig && (
          <ConfirmationModal
            isOpen={isConfirmModalOpen}
            onClose={closeConfirmationModal}
            onConfirm={modalConfig.onConfirm}
            title={modalConfig.title}
            message={modalConfig.message}
            confirmButtonText={modalConfig.confirmButtonText}
            confirmButtonVariant={modalConfig.confirmButtonVariant}
          />
        )}
      </div>
    );
  }
}
