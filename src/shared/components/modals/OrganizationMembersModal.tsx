import { Modal } from "../Modal";
import {
  LoadingState,
  ErrorState,
  PrimaryButton,
  ProfileAvatar,
} from "@src/shared/components";
import { useImageUrl } from "@src/shared/hooks";
import { useMemo } from "react";
import { useOrganizationMembers } from "@src/features/main/organization/member/model/member.query";

interface OrganizationMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  organizationId: number;
}

export function OrganizationMembersModal({
  isOpen,
  onClose,
  organizationId,
}: OrganizationMembersModalProps) {
  const { getImageUrl } = useImageUrl();

  const { data, isLoading, error } = useOrganizationMembers(
    organizationId
  );

  const members = useMemo(() => {
    if (!data?.members) return [];
    return data.members;
  }, [data]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-3xl">
      {/* Header */}
      <div className="relative p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="text-responsive-sm font-bold text-primary">
            Members
          </h3>
          <PrimaryButton
            label="Close"
            variant="viewMoreButton"
            onClick={onClose}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col h-full max-h-screen overflow-y-auto">
        {isLoading && (
          <div className="p-6">
            <LoadingState message="Loading members..." />
          </div>
        )}

        {error && (
          <div className="p-6">
            <ErrorState
              message={`Failed to load members. ${
                error.message || "Please try again later."
              }`}
            />
          </div>
        )}

        {!isLoading && !error && (
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {members.length > 0 ? (
              members.map((member) => (
                <div
                  key={member.user_id}
                  className="flex items-center justify-between sm:py-1 px-6 lg:py-2 lg:px-12"
                >
                  <div className="flex items-center space-x-3">
                    <ProfileAvatar
                      src={
                        getImageUrl(
                              member.profile_picture
                            )
                      }
                      alt={`${member.first_name} ${member.last_name} avatar`}
                      className="w-12 h-12"
                      type="member"
                      isOwner={false}
                      memberUuid={member.account_uuid}
                      name={`${member.first_name} ${member.last_name}`}
                      nameClassName="text-primary font-medium text-responsive-xs"
                    >
                       <p className="text-placeholderbg text-responsive-xxs">
                         {member.status === "pending" ? "Pending" : ""}
                       </p>
                    </ProfileAvatar>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-placeholderbg text-responsive-xs">
                  No members found.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
