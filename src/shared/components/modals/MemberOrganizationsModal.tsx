import { Modal } from "../Modal";
import {
  LoadingState,
  ErrorState,
  PrimaryButton,
  ProfileAvatar,
} from "@src/shared/components";
import { useImageUrl } from "@src/shared/hooks";
import { useMemo } from "react";
import { useMemberJoinedOrganizationsQuery } from "@src/features/main/member/organization/model/organization.query";
import pendingIcon from "@src/assets/shared/for_approval_icon.svg";
import joinedIcon from "@src/assets/shared/joined_icon.svg";
import joinIcon from "@src/assets/shared/join_icon.svg";

interface MemberOrganizationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isMemberVisitingAnotherMember?: boolean;
  profileUuid?: string;
  userId?: number;
  onJoinOrganization?: (orgId: number) => void;
  onCancelJoinRequest?: (orgId: number) => void;
  onLeaveOrganization?: (orgId: number) => void;
}

export function MemberOrganizationsModal({
  isOpen,
  onClose,
  isMemberVisitingAnotherMember,
  profileUuid,
  onJoinOrganization,
  onCancelJoinRequest,
  onLeaveOrganization,
}: MemberOrganizationsModalProps) {
  const { getImageUrl } = useImageUrl();

  const { data, isLoading, error } = useMemberJoinedOrganizationsQuery(
    profileUuid
  );

  const organizations = useMemo(() => {
    if (!data?.organizations) return [];
    return data.organizations;
  }, [data]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-3xl">
      {/* Header */}
      <div className="relative p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="text-responsive-sm font-bold text-primary">
            Organizations
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
            <LoadingState message="Loading organizations..." />
          </div>
        )}

        {error && (
          <div className="p-6">
            <ErrorState
              message={`Failed to load organizations. ${
                error instanceof Error
                  ? error.message
                  : "Please try again later."
              }`}
            />
          </div>
        )}

        {!isLoading && !error && (
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {organizations.length > 0 ? (
              organizations.map((org) => (
                <div
                  key={org.id}
                  className="flex items-center justify-between sm:py-1 px-6 lg:py-2 lg:px-12"
                >
                  <div className="flex items-center space-x-3">
                    <ProfileAvatar
                      src={
                        getImageUrl(
                              org.logo
                            )
                      }
                      alt={`${org.name} logo`}
                      className="w-12 h-12"
                      type="organization"
                      isOwner={false}
                      organizationId={org.id}
                      name={org.name}
                      nameClassName="text-primary font-medium text-responsive-xs"
                    >
                      <p className="text-placeholderbg text-responsive-xxs">
                        {org.category}
                      </p>
                    </ProfileAvatar>
                  </div>
                  {isMemberVisitingAnotherMember && (
                    <div className="flex justify-center">
                      {(!org.visitor_membership_status ||
                        org.visitor_membership_status === "rejected") && (
                        <PrimaryButton
                          variant="joinStatusButton"
                          iconClass="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2"
                          label="Join Organization"
                          responsiveLabel="Join"
                          icon={joinIcon}
                          onClick={() => onJoinOrganization?.(org.id)}
                        />
                      )}

                      {org.visitor_membership_status === "pending" && (
                        <PrimaryButton
                          variant="iconButton"
                          iconClass="w-4 h-4 sm:w-5 sm:h-5"
                          label=""
                          icon={pendingIcon}
                          buttonClass="p-1"
                          onClick={() => onCancelJoinRequest?.(org.id)}
                        />
                      )}

                      {org.visitor_membership_status === "approved" && (
                        <PrimaryButton
                          variant="iconButton"
                          iconClass="w-4 h-4 sm:w-5 sm:h-5"
                          label=""
                          icon={joinedIcon}
                          onClick={() => onLeaveOrganization?.(org.id)}
                        />
                      )}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-placeholderbg text-responsive-xs">
                  No organizations found.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
