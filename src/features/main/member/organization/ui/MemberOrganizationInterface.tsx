import { useState } from "react";
import { ConfirmationModal } from "@src/shared/components/modals";
import { useConfirmationModal } from "@src/shared/hooks";
import { useImageUrl } from "@src/shared/hooks/useImageUrl";
import { useLeaveOrganization } from "../model/organization.mutation";
import { useJoinOrganization } from "@src/features/home/model/home.mutation";

// Import the components
import { OrganizationMembersList } from "../components/OrganizationMembersList";
import { PendingOrganization } from "../components/PendingOrganization";
import AllOrganizationList from "../components/AllOrganizationList";

export default function MemberOrganizationInterface() {
  // No need to get user UUID here as it's handled in child components

  const {
    isConfirmModalOpen,
    modalConfig,
    openConfirmationModal,
    closeConfirmationModal,
  } = useConfirmationModal();

  // Use the image URL hook
  const { getImageUrl } = useImageUrl();

  const [selectedOrgId, setSelectedOrgId] = useState<number | null>(null);

  // Filter state for organizations
  const [filterType, setFilterType] = useState<"all" | "joined" | "approval">(
    "all"
  );

  // Initialize leave and join organization mutations
  const leaveOrganizationMutation = useLeaveOrganization();
  const joinOrganizationMutation = useJoinOrganization();

  const handleLeaveOrg = (organizationId: number) => {
    openConfirmationModal({
      title: "Leave Group Confirmation",
      message: `Are you sure you want to leave this organization? Once you leave, you will no longer have access to its content or updates.`,
      confirmButtonText: "Leave",
      confirmButtonVariant: "primary",
      onConfirm: async () => {
        try {
          await leaveOrganizationMutation.mutateAsync(organizationId);
        } catch (error) {
          console.error(
            `Failed to leave organization: ${
              error instanceof Error ? error.message : "Unknown error"
            }`
          );
          // Error will be handled by the mutation's onError callback
        }
      },
    });
  };

  const handleJoinOrg = (organizationId: number) => {
    openConfirmationModal({
      title: "Request to Join",
      message:
        "Do you want to join this group? Once you join, you'll be able to access its content, participate in discussions, and receive updates.",
      confirmButtonText: "Join",
      confirmButtonVariant: "primary",
      onConfirm: async () => {
        try {
          await joinOrganizationMutation.mutateAsync(organizationId);
        } catch (error) {
          console.error(
            `Failed to request to join organization: ${
              error instanceof Error ? error.message : "Unknown error"
            }`
          );
          // Error will be handled by the mutation's onError callback
        }
      },
    });
  };

  const handleOrgClick = (orgId: number) => {
    setSelectedOrgId(orgId);
  };

  const handleFilterClick = (type: "all" | "joined" | "approval") => {
    setFilterType(type);
  };

  return (
    <div className="w-full min-h-screen">
      {/* Loading and Error States are now handled in child components */}

      {filterType === "joined" ? (
        <OrganizationMembersList
          selectedOrgId={selectedOrgId}
          filterType={filterType}
          handleOrgClick={handleOrgClick}
          handleFilterClick={handleFilterClick}
          handleLeaveOrg={handleLeaveOrg}
        />
      ) : filterType === "approval" ? (
        <PendingOrganization
          filterType={filterType}
          handleFilterClick={handleFilterClick}
          selectedOrgId={selectedOrgId}
          handleLeaveOrg={handleLeaveOrg}
        />
      ) : (
        <AllOrganizationList
          filterType={filterType}
          handleFilterClick={handleFilterClick}
          selectedOrgId={selectedOrgId}
          handleJoinOrg={handleJoinOrg}
          handleLeaveOrg={handleLeaveOrg}
          getImageUrl={getImageUrl}
        />
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
