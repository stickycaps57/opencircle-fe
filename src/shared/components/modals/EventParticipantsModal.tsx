import { useState } from "react";
import { Modal } from "../Modal";
import { ConfirmationModal } from "./ConfirmationModal";
import { useGetEventRsvps } from "@src/features/main/organization/profile/model/event.query";
import {
  useAcceptRsvpRequest,
  useDeclineRsvpRequest,
} from "@src/features/main/organization/profile/model/event.mutation";
import {
  LoadingState,
  ErrorState,
  PrimaryButton,
  ProfileAvatar,
} from "@src/shared/components";
import { useImageUrl, useConfirmationModal } from "@src/shared/hooks";
import avatarImage from "@src/assets/shared/avatar.png";

interface EventParticipantsModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: number;
  initialTab?: "members" | "requests";
  isUserMember?: boolean;
}

export function EventParticipantsModal({
  isOpen,
  onClose,
  eventId,
  initialTab = "members",
  isUserMember = false,
}: EventParticipantsModalProps) {
  const [activeTab, setActiveTab] = useState<"members" | "requests">(
    initialTab
  );

  // Fetch event RSVPs data using the eventId
  const { data: eventRsvps, isLoading, error } = useGetEventRsvps(eventId);

  const { getImageUrl } = useImageUrl();
  const {
    isConfirmModalOpen,
    modalConfig,
    openConfirmationModal,
    closeConfirmationModal,
  } = useConfirmationModal();

  // Use the mutation hooks
  const rsvpStatusMutation = useAcceptRsvpRequest();
  const declineRequestMutation = useDeclineRsvpRequest();


  const handleRemoveMember = (rsvpId: number) => {
    openConfirmationModal({
      title: "Remove User From Event",
      message:
        "This action will remove the user from the event's participant list. Do you wish to continue?",
      confirmButtonText: "Remove",
      confirmButtonVariant: "primary",
      onConfirm: () => declineRequestMutation.mutateAsync(rsvpId),
    });
  };

  const handleAcceptRequest = (rsvpId: number) => {
    openConfirmationModal({
      title: "Accept This User",
      message:
        "This action will approve the user's participation in the event. Are you sure you want to accept?",
      confirmButtonText: "Accept",
      confirmButtonVariant: "primary",
      onConfirm: () => rsvpStatusMutation.mutateAsync({ rsvpId, status: "joined" }),
    });
  };

  const handleDeclineRequest = (rsvpId: number) => {
    openConfirmationModal({
      title: "Decline Event Request",
      message:
        "By declining, this user will not be able to participate in the event. Do you wish to continue?",
      confirmButtonText: "Decline",
      confirmButtonVariant: "primary",
      onConfirm: () => rsvpStatusMutation.mutateAsync({ rsvpId, status: "rejected" }),
    });
  };

  // Filter the RSVPs for members and requests while keeping the original structure
  const membersRsvps =
    eventRsvps?.rsvps.filter((rsvp) => rsvp.status === "joined") || [];
  const requestsRsvps =
    eventRsvps?.rsvps.filter((rsvp) => rsvp.status === "pending") || [];

  return (
    <>
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-3xl">
      {/* Loading State */}
      {isLoading && (
        <div className="p-6">
          <LoadingState message="Loading participants..." />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="p-6">
          <ErrorState
            message={`Failed to load participants. ${
              error.message || "Please try again later."
            }`}
          />
        </div>
      )}

      {/* Content when data is loaded */}
      {!isLoading && !error && eventRsvps && (
        <>
          {/* Header with Tabs */}
          <div className="relative p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex space-x-8">
                <button
                  onClick={() => setActiveTab("members")}
                  className={`text-responsive-sm font-bold transition-colors ${
                    activeTab === "members"
                      ? "text-primary"
                      : "text-placeholderbg hover:text-primary"
                  }`}
                >
                  Participants
                </button>
                {!isUserMember && (
                  <>
                    <span className="text-responsive-base">|</span>
                    <button
                      onClick={() => setActiveTab("requests")}
                      className={`text-responsive-sm font-bold transition-colors ${
                        activeTab === "requests"
                          ? "text-primary"
                          : "text-placeholderbg hover:text-primary"
                      }`}
                    >
                      Requests Received
                    </button>
                  </>
                )}
              </div>
              <PrimaryButton
                label="Close"
                variant="viewMoreButton"
                onClick={onClose}
              />
            </div>
          </div>

          <div className="flex flex-col h-full max-h-[calc(85vh-120px)]">
            {/* Members Tab Content */}
            {activeTab === "members" && (
              <div className="flex-1 overflow-y-auto p-6 space-y-4 max-h-[calc(85vh-180px)]">
                {membersRsvps.length > 0 ? (
                  membersRsvps.map((member) => (
                    <div
                      key={member.rsvp_id}
                      className="flex items-center justify-between sm:py-1 px-6 lg:py-2 lg:px-12"
                    >
                      <div className="flex items-center space-x-3">
                        <ProfileAvatar
                          src={
                            member.profile_picture
                              ? getImageUrl(
                                  member.profile_picture
                                )
                              : avatarImage
                          }
                          alt={`${member.first_name} ${member.last_name} avatar`}
                          className="w-12 h-12"
                          type="member"
                          isOwner={false}
                          memberUuid={member.uuid}
                          name={`${member.first_name} ${member.last_name}`}
                          nameClassName="text-primary font-medium text-responsive-xs"
                        >
                          {/* <p className="text-placeholderbg text-responsive-xxs">
                            Joined {formatFriendlyDateTime(member.created_at)}
                          </p> */}
                        </ProfileAvatar>
                      </div>
                      {!isUserMember && (
                        <PrimaryButton
                          label="Remove"
                          variant="removeButton"
                          onClick={() => handleRemoveMember(member.rsvp_id)}
                        />
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-placeholderbg text-responsive-xs">
                      No members yet. Invite people to join this event!
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Requests Tab Content */}
            {!isUserMember && activeTab === "requests" && (
              <div className="flex-1 overflow-y-auto p-6 space-y-4 max-h-[calc(85vh-180px)]">
                {requestsRsvps.length > 0 ? (
                  requestsRsvps.map((request) => (
                    <div
                      key={request.rsvp_id}
                      className="flex items-center justify-between p-4 bg-athens_gray rounded-xl"
                    >
                      <div className="flex items-center space-x-3">
                        <ProfileAvatar
                          src={
                            getImageUrl(
                                  request.profile_picture
                                )
                          }
                          alt={`${request.first_name} ${request.last_name} avatar`}
                          className="w-12 h-12"
                          type="member"
                          isOwner={false}
                          memberUuid={request.uuid}
                          name={`${request.first_name} ${request.last_name}`}
                          nameClassName="text-primary font-medium text-responsive-xs"
                        >
                          {/* <p className="text-placeholderbg text-responsive-xxs">
                            {request.requestedAt}
                          </p> */}
                        </ProfileAvatar>
                      </div>
                      {!isUserMember && (
                        <div className="flex space-x-3">
                          <PrimaryButton
                            label={
                              rsvpStatusMutation.isPending &&
                              rsvpStatusMutation.variables?.rsvpId === request.rsvp_id &&
                              rsvpStatusMutation.variables?.status === "joined"
                                ? "Accepting..."
                                : "Accept"
                            }
                            variant="acceptButton"
                            onClick={() => handleAcceptRequest(request.rsvp_id)}
                          />
                          <PrimaryButton
                            label={
                              declineRequestMutation.isPending &&
                              declineRequestMutation.variables === request.rsvp_id
                                ? "Declining..."
                                : "Decline"
                            }
                            variant="declineButton"
                            onClick={() => handleDeclineRequest(request.rsvp_id)}
                          />
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-placeholderbg text-responsive-xs">
                      No pending requests. Share your event to get more
                      participants!
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </Modal>
    {/* Confirmation Modal rendered outside to stack above parent modal */}
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
    </>
  );
}
