import { useState } from "react";
import { ConfirmationModal } from "@src/shared/components/modals";
import { useConfirmationModal } from "@src/shared/hooks";
import { MembersList, MemberRequestsList } from "../components";
import {
  useOrganizationMembers,
  useMemberRequests,
} from "../model/member.query";
import { useUpdateMemberRequestStatus } from "../model/member.mutation";
import { useAuthStore } from "@src/shared/store";

export default function OrganizationMemberInterface() {
  // State for active tab
  const [activeTab, setActiveTab] = useState<"members" | "requests">("members");

  // Get organization ID from authenticated user
  const { user } = useAuthStore();
  
  const organizationId = user?.id || 0;

  // Fetch members and member requests data
  const {
    data: membersData,
    isLoading: isMembersLoading,
    error: membersError,
  } = useOrganizationMembers(organizationId);

  const {
    data: requestsData,
    isLoading: isRequestsLoading,
    error: requestsError,
  } = useMemberRequests();

  // Mutation for updating member request status
  const updateStatusMutation = useUpdateMemberRequestStatus();

  // Confirmation modal hook
  const {
    isConfirmModalOpen,
    modalConfig,
    openConfirmationModal,
    closeConfirmationModal,
  } = useConfirmationModal();

  // Handler for accepting a member request
  const handleAcceptRequest = (
    userId: number,
    firstName: string,
    lastName: string
  ) => {
    openConfirmationModal({
      title: "Accept Member Request",
      message: `Are you sure you want to accept ${firstName} ${lastName}'s request to join the organization?`,
      confirmButtonText: "Accept",
      confirmButtonVariant: "primary",
      onConfirm: () => {
        updateStatusMutation.mutate({ userId, status: "approved" });
      },
    });
  };

  // Handler for declining a member request
  const handleDeclineRequest = (
    userId: number,
    firstName: string,
    lastName: string
  ) => {
    openConfirmationModal({
      title: "Decline Member Request",
      message: `Are you sure you want to decline ${firstName} ${lastName}'s request to join the organization?`,
      confirmButtonText: "Decline",
      confirmButtonVariant: "primary",
      onConfirm: () => {
        updateStatusMutation.mutate({ userId, status: "rejected" });
      },
    });
  };

  const handleRemoveMember = (
    userId: number,
    firstName: string,
    lastName: string
  ) => {
    openConfirmationModal({
      title: "Remove Member",
      message: `Are you sure you want to remove ${firstName} ${lastName} from the organization?`,
      confirmButtonText: "Remove",
      confirmButtonVariant: "primary",
      onConfirm: () => {
        updateStatusMutation.mutate({ userId, status: "rejected" });
      },
    });
  };

  // Tab change handler
  const handleTabChange = (tab: "members" | "requests") => {
    setActiveTab(tab);
  };

  return (
    <div className="flex justify-center items-center h-screen px-4">
      <div className="w-full md:w-11/12 lg:w-4/5 xl:w-2/3 bg-white flex flex-col h-full md:h-screen border shadow-lg border-primary/30">
        {/* Tab Navigation */}
        <div className="bg-white padding-responsive-sm flex justify-between items-center border-b border-gray-200">
          <div className="flex">
            <button
              className={`text-responsive-xxs ${
                activeTab === "members"
                  ? "text-primary font-medium"
                  : "text-primary-75"
              }`}
              onClick={() => handleTabChange("members")}
            >
              Members
            </button>
            <div className="w-px bg-primary mx-2 my-1"></div>
            <button
              className={`text-responsive-xxs ${
                activeTab === "requests"
                  ? "text-primary font-medium"
                  : "text-primary-75"
              }`}
              onClick={() => handleTabChange("requests")}
            >
              Member Requests
            </button>
          </div>
        </div>
        {/* Tab Content */}
        <div className="flex-grow overflow-y-auto">
          {activeTab === "members" && (
            <div className="h-full">
              <MembersList
                members={membersData?.members || []}
                isLoading={isMembersLoading}
                error={membersError as Error | null}
                onRemove={handleRemoveMember}
              />
            </div>
          )}

          {activeTab === "requests" && (
            <div className="h-full">
              <MemberRequestsList
                memberRequests={requestsData?.pending_applications || []}
                isLoading={isRequestsLoading}
                error={requestsError as Error | null}
                onAccept={(userId) => {
                  const member = requestsData?.pending_applications.find(
                    (m) => m.user_id === userId
                  );
                  if (member) {
                    handleAcceptRequest(
                      userId,
                      member.first_name,
                      member.last_name
                    );
                  }
                }}
                onDecline={(userId) => {
                  const member = requestsData?.pending_applications.find(
                    (m) => m.user_id === userId
                  );
                  if (member) {
                    handleDeclineRequest(
                      userId,
                      member.first_name,
                      member.last_name
                    );
                  }
                }}
              />
            </div>
          )}
        </div>
      </div>

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
