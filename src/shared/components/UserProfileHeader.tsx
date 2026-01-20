import avatarImage from "@src/assets/shared/avatar.png";
import { useState } from "react";
import {
  useConfirmationModal,
  useProfileData,
  useProfileRelationship,
  type ProfileData,
} from "@src/shared/hooks";
import { PrimaryButton } from "./PrimaryButton";
import {
  ConfirmationModal,
  MemberOrganizationsModal,
  OrganizationMembersModal,
} from "./modals";
import { useJoinOrganization } from "@src/features/home/model/home.mutation";
import { useLeaveOrganization } from "@src/features/main/member/organization/model/organization.mutation";
import { useUpdateMemberRequestStatus } from "@src/features/main/organization/member/model/member.mutation";
import pendingIcon from "@src/assets/shared/for_approval_icon.svg";
import joinedIcon from "@src/assets/shared/joined_icon.svg";
import joinIcon from "@src/assets/shared/join_icon.svg";

interface UserProfileHeaderProps {
  profile?: ProfileData | null; // Make profile optional and allow null
}

export function UserProfileHeader({ profile }: UserProfileHeaderProps) {
  // Use the custom hook to get profile utility functions
  const {
    getName,
    getRole,
    getBio,
    getUsername,
    isOrganization,
  } = useProfileData(profile);


  const {
    isMemberVisitingOrganization,
    isOrganizationVisitingMember,
    isMemberVisitingAnotherMember,
    isOrganizationVisitingOrganization
  } = useProfileRelationship(profile);

  const joinOrganizationMutation = useJoinOrganization();
  const leaveOrganizationMutation = useLeaveOrganization();
  const updateStatusMutation = useUpdateMemberRequestStatus();
  const {
    isConfirmModalOpen,
    modalConfig,
    openConfirmationModal,
    closeConfirmationModal,
  } = useConfirmationModal();
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
  const [isOrganizationsModalOpen, setIsOrganizationsModalOpen] = useState(false);

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

  const handleAcceptRequest = (userId: number) => {
    openConfirmationModal({
      title: "Accept Member Request",
      message: `Are you sure you want to accept this member's request to join the organization?`,
      confirmButtonText: "Accept",
      confirmButtonVariant: "primary",
      onConfirm: () => {
        updateStatusMutation.mutate({ userId, status: "approved" });
      },
    });
  };

  const handleDeclineRequest = (userId: number) => {
    openConfirmationModal({
      title: "Decline Member Request",
      message: `Are you sure you want to decline this member's request to join the organization?`,
      confirmButtonText: "Decline",
      confirmButtonVariant: "primary",
      onConfirm: () => {
        updateStatusMutation.mutate({ userId, status: "rejected" });
      },
    });
  };

  const handleRemoveMember = (userId: number) => {
    openConfirmationModal({
      title: "Remove Member",
      message: `Are you sure you want to remove this member from the organization?`,
      confirmButtonText: "Remove",
      confirmButtonVariant: "primary",
      onConfirm: () => {
        updateStatusMutation.mutate({ userId, status: "rejected" });
      },
    });
  };

  // Handle null/undefined profile case
  if (!profile) {
    return (
      <div className="flex-1 flex items-center justify-center px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:pt-8">
        <div className="w-full sm:w-5/6 md:w-4/5 lg:w-2/3 flex flex-col sm:flex-row items-center sm:items-start justify-center sm:justify-start space-y-3 sm:space-y-0 sm:space-x-4 md:space-x-6 lg:space-x-8 xl:space-x-16">
          {/* Profile Image */}
          <div className="flex-shrink-0">
            <img
              src={avatarImage}
              alt="Default Profile"
              className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-36 lg:h-36 xl:w-40 xl:h-40 rounded-full object-cover border-2 sm:border-3 md:border-4 border-gray-100"
            />
          </div>

          {/* Profile Info */}
          <div className="text-center sm:text-left flex-1 max-w-full sm:max-w-none overflow-hidden">
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-primary mb-1 truncate">
              Loading...
            </h1>
            <p className="text-responsive-sm text-primary mb-1">User</p>
            <p className="text-responsive-xs text-primary leading-relaxed line-clamp-3 sm:line-clamp-none">
              Profile information is loading...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // const email = getEmail();
  const username = getUsername();
  console.log("profile", profile)
  const membershipStatus = profile?.user_membership_status;
  const orgId = profile?.id;

  const userMembershipStatusWithOrganizer = profile?.organizer_view_user_membership;

  return (
    <div className={`flex-1 flex items-center justify-center px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:pt-8 ${isOrganization ? "bg-secondary/50" : ""}`}>
      <div className={`w-full sm:w-5/6 md:w-4/5 lg:w-2/3 flex flex-col sm:flex-row items-center sm:items-start justify-center sm:justify-start space-y-3 sm:space-y-0 sm:space-x-4 md:space-x-6 lg:space-x-8 xl:space-x-16 lg:pr-22 xl:pr-42`}>
        {/* Profile Image */}
        <div className="flex-shrink-0">
          <img
            src={profile.avatarUrl}
            alt="Profile"
            className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-36 lg:h-36 xl:w-40 xl:h-40 rounded-full object-cover border-2 sm:border-3 md:border-4 border-gray-100"
          />
        </div>

        {/* Profile Info */}
        <div className="text-center sm:text-left flex-1 max-w-full sm:max-w-none overflow-hidden w-full">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 mb-1">
            <div className="sm:col-span-8 lg:col-span-8 flex justify-center sm:justify-start">
              <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-primary truncate">
                {getName()}
              </h1>
            </div>
            
            {isMemberVisitingOrganization && (
              <div className="sm:col-span-4 flex justify-end">
                
                {(!membershipStatus || membershipStatus === "rejected") && (
                  <PrimaryButton
                    variant="joinStatusButton"
                    iconClass="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2"
                    label="Join Organization"
                    responsiveLabel="Join"
                    icon={joinIcon}
                    onClick={() => handleJoinOrganization(orgId)}
                  />
                )}

                {membershipStatus === "pending" && (
                  <PrimaryButton
                    variant="iconButton"
                    iconClass="w-4 h-4 sm:w-5 sm:h-5"
                    label=""
                    icon={pendingIcon}
                    buttonClass="p-1"
                    onClick={() => handleCancelJoiningOrganization(orgId)}
                  />
                )}

                {membershipStatus === "approved" && (
                  <PrimaryButton
                    variant="iconButton"
                    iconClass="w-4 h-4 sm:w-5 sm:h-5"
                    label=""
                    icon={joinedIcon}
                    onClick={() => handleLeaveOrganization(orgId)}
                  />
                )}
              </div>
            )}

            {isOrganizationVisitingMember && (
              <div className="sm:col-span-4 flex justify-end space-x-2">
                {userMembershipStatusWithOrganizer === "pending" && (
                  <>
                    <PrimaryButton
                      variant="acceptButton"
                      label="Accept"
                      onClick={() =>
                        handleAcceptRequest(profile.id)
                      }
                    />
                    <PrimaryButton
                      variant="declineButton"
                      label="Decline"
                      onClick={() =>
                        handleDeclineRequest(profile.id)
                      }
                    />
                  </>
                )}

                {userMembershipStatusWithOrganizer === "approved" && (
                  <PrimaryButton
                    label="Remove"
                    variant="removeButton"
                    onClick={() =>
                      handleRemoveMember(profile.id)
                    }
                  />
                )}

                {userMembershipStatusWithOrganizer !== "pending" &&
                  userMembershipStatusWithOrganizer !== "approved" && (
                    <p className="text-placeholderbg text-responsive-xs">
                      Not a member
                    </p>
                  )}
              </div>
            )}

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
            <div className="sm:col-span-8 lg:col-span-9 flex justify-center sm:justify-start">
              <p className="text-responsive-xs text-primary">{getRole()}</p>
              
            </div>
            
              <div className="sm:col-span-4 lg:col-span-3 flex justify-end">
                {(isMemberVisitingOrganization || isOrganizationVisitingOrganization) && (
                    <PrimaryButton
                      variant="shareButton"
                      label="View all members"
                      onClick={() => setIsMembersModalOpen(true)}
                    />
                  )}

                  {(isOrganizationVisitingMember || isMemberVisitingAnotherMember) &&(
                    <PrimaryButton
                      variant="shareButton"
                      label="View all organizations"
                      onClick={() => setIsOrganizationsModalOpen(true)}
                    />
                  )}
              </div>
          </div>

          {/* {email && (
            <p className="text-responsive-xs text-placeholderbg mb-1 truncate">
              @ {email}
            </p>
          )} */}
          {username && (
            <p className="text-responsive-xs text-placeholderbg mb-1 truncate">
              @{username}
            </p>
          )}
          <p className="text-responsive-xs text-primary leading-relaxed line-clamp-3 sm:line-clamp-none">
            {getBio()}
          </p>
        </div>
      </div>
      
      {isMembersModalOpen && profile.id && (
        <OrganizationMembersModal
          isOpen={isMembersModalOpen}
          onClose={() => setIsMembersModalOpen(false)}
          organizationId={profile.id}
        />
      )}

      {isOrganizationsModalOpen && profile.uuid && (
        <MemberOrganizationsModal
          isOpen={isOrganizationsModalOpen}
          onClose={() => setIsOrganizationsModalOpen(false)}
          isMemberVisitingAnotherMember={isMemberVisitingAnotherMember}
          profileUuid={profile?.uuid}
          onJoinOrganization={handleJoinOrganization}
          onCancelJoinRequest={handleCancelJoiningOrganization}
          onLeaveOrganization={handleLeaveOrganization}
        />
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
}
