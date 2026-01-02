import type { ShareItem } from "@src/features/share/schema/share.types";
import type { EventData } from "@src/features/main/organization/profile/schema/event.type";
import type { AllMemberPostData } from "@src/features/main/member/profile/schema/post.types";
import { SharedEventPost } from "@src/features/share/components/SharedEventPost";
import { SharedMemberPost } from "@src/features/share/components/SharedMemberPost";
import { ProfileAvatar } from "@src/shared/components/ProfileAvatar";
import { useFormatDate, useConfirmationModal, useImageUrl } from "@src/shared/hooks";
import { ConfirmationModal } from "@src/shared/components/modals";
import { useJoinOrganization, useRsvpEvent, useDeleteRsvp } from "@src/features/home/model/home.mutation";
import { useLeaveOrganization } from "@src/features/main/member/organization/model/organization.mutation";
import avatarImage from "@src/assets/shared/avatar.png";

type SharedCardProps = {
  share: ShareItem;
};

export const SharedCard = ({ share }: SharedCardProps) => {
  const { formatRelativeTime } = useFormatDate();
  const { getImageUrl } = useImageUrl();
  const joinOrganizationMutation = useJoinOrganization();
  const leaveOrganizationMutation = useLeaveOrganization();
  const rsvpEventMutation = useRsvpEvent();
  const deleteRsvpMutation = useDeleteRsvp();
  const {
    isConfirmModalOpen,
    modalConfig,
    openConfirmationModal,
    closeConfirmationModal,
  } = useConfirmationModal();

  const handleJoinOrganization = (orgId: number) => {
    openConfirmationModal({
      title: "Request to Join",
      message:
        "Do you want to join this group? Once you join, you'll be able to access its content, participate in discussions, and receive updates.",
      confirmButtonText: "Join",
      confirmButtonVariant: "primary",
      onConfirm: async () => {
        try {
          await joinOrganizationMutation.mutateAsync(orgId);
        } catch (error) {
          console.error("Failed to request to join organization:", error);
        }
      },
    });
  };

  const handleCancelJoiningOrganization = (orgId: number) => {
    openConfirmationModal({
      title: "Cancel Join Request",
      message: "Do you want to cancel your request to join this organization?",
      confirmButtonText: "Cancel Request",
      confirmButtonVariant: "primary",
      onConfirm: async () => {
        try {
          await leaveOrganizationMutation.mutateAsync(orgId);
        } catch (error) {
          console.error("Failed to cancel join request:", error);
        }
      },
    });
  };

  const handleLeaveOrganization = (orgId: number) => {
    openConfirmationModal({
      title: "Leave Organization",
      message: "Do you want to leave this organization?",
      confirmButtonText: "Leave",
      confirmButtonVariant: "primary",
      onConfirm: async () => {
        try {
          await leaveOrganizationMutation.mutateAsync(orgId);
        } catch (error) {
          console.error("Failed to leave organization:", error);
        }
      },
    });
  };

  const handleRsvpEvent = (eventId: number) => {
    openConfirmationModal({
      title: "Reserve Your Spot",
      message:
        "Are you sure you want to reserve your spot for this event? You will receive a confirmation once your reservation is completed.",
      confirmButtonText: "Reserve",
      confirmButtonVariant: "primary",
      onConfirm: async () => {
        try {
          await rsvpEventMutation.mutateAsync(eventId);
        } catch {
          // Error handled by mutation
        }
      },
    });
  };

  const handleDeleteRsvpEvent = (rsvpId: number) => {
    openConfirmationModal({
      title: "Cancel Reservation",
      message:
        "Are you sure you want to cancel your reservation for this event?",
      confirmButtonText: "Cancel Reservation",
      confirmButtonVariant: "primary",
      onConfirm: async () => {
        try {
          await deleteRsvpMutation.mutateAsync(rsvpId);
        } catch {
          // Error handled by mutation
        }
      },
    });
  };

  const account = share.account;
  const isOrganizationAccount = account?.type === "organization";

  const avatarSrc = (() => {
    if (!account && !share) return avatarImage;
    if (isOrganizationAccount) {
      return getImageUrl(account?.logo ?? share.sharer?.logo);
    }
    return getImageUrl(account?.profile_picture ?? share.sharer?.profile_picture);
  })();

  const displayName = (() => {
    if (!account && !share) return "User";
    if (isOrganizationAccount) {
      return account?.name || "Organization";
    }
    return `${account?.first_name || share?.sharer?.first_name || "User"} ${account?.last_name || share?.sharer?.last_name || ""}`;
  })();

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 w-full">
      <div className="flex flex-row items-start justify-between mb-3">
        <div className="flex flex-row items-center space-x-2 sm:space-x-3">
          <ProfileAvatar
            src={avatarSrc}
            alt="Sharer"
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
            type={isOrganizationAccount ? "organization" : "member"}
            isOwner={false}
            memberUuid={!isOrganizationAccount ? share?.account_uuid : undefined}
            organizationId={isOrganizationAccount ? account?.id : undefined}
             name={displayName}
            suffix={
              <span className="text-primary text-responsive-xs font-bold">
               {" "}
               <span className="text-authlayoutbg font-normal">shared {share.content_type === 2 ? "an event" : "a post"}</span>
              </span>
            }
            nameClassName="text-primary text-responsive-xs font-bold"
          >
            
            <p className="text-placeholderbg text-responsive-xxs">
              {formatRelativeTime(share.date_created)}
            </p>
          </ProfileAvatar>
        </div>
      </div>

      {share.comment && (
        <div className="mb-4">
          <p className="text-primary text-responsive-xs leading-relaxed">{share.comment}</p>
        </div>
      )}

      {share.content_type === 2 ? (
        <SharedEventPost
          event={share.content_details as EventData}
          sharer={share.sharer}
          user_rsvp_status={share.auth_user_rsvp}
          onJoinOrganization={handleJoinOrganization}
          onCancelJoiningOrganization={handleCancelJoiningOrganization}
          onLeaveOrganization={handleLeaveOrganization}
          onRsvpEvent={handleRsvpEvent}
          onDeleteRsvpEvent={handleDeleteRsvpEvent}
        />
      ) : (
        <SharedMemberPost post={share.content_details as AllMemberPostData} />
      )}

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
};
