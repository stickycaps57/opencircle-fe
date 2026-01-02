import React, { useState, useMemo, useEffect } from "react";
import { ProfileAvatar } from "@src/shared/components/ProfileAvatar";
import { useOrganizationMembers } from "@src/features/main/organization/member/model/member.query";
import { LoadingState } from "@src/shared/components/states/LoadingState";
import { ErrorState } from "@src/shared/components/states/ErrorState";
import { PrimaryButton } from "@src/shared/components/PrimaryButton";
import { useAuthStore } from "@src/shared/store/auth";
import {
  useOrganizationMembershipsQuery,
  usePendingOrganizationMembershipsQuery,
} from "../model/organization.query";
import leaveOrgIcon from "@src/assets/shared/leave_org_icon.svg";
import joinIcon2 from "@src/assets/shared/join2.png";
import type { DirectOrganizationSearchItem } from "../schema/organization.types";
import type { ProfilePicture } from "@src/features/auth/schema/auth.types";

interface AllOrganizationMemberListProps {
  organizations: DirectOrganizationSearchItem[];
  initialSelectedOrgId?: number | null;
  handleJoinOrg?: (organizationId: number) => void;
  handleLeaveOrg?: (organizationId: number) => void;
  onBackToAll?: () => void;
  getImageUrl: (
    imageObject?: ProfilePicture | null,
    fallbackUrl?: string
  ) => string;
}

const AllOrganizationMemberList: React.FC<AllOrganizationMemberListProps> = ({
  organizations,
  initialSelectedOrgId = null,
  getImageUrl,
  handleJoinOrg,
  handleLeaveOrg,
  onBackToAll,
}) => {
  const [selectedOrgId, setSelectedOrgId] = useState<number | null>(initialSelectedOrgId);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "joined" | "approval">("all");
  const { user } = useAuthStore();
  const accountUuid = user?.uuid || "";

  useEffect(() => {
    if (initialSelectedOrgId && initialSelectedOrgId !== selectedOrgId) {
      setSelectedOrgId(initialSelectedOrgId);
    }
    // Only react to changes in initialSelectedOrgId to avoid overriding user selection
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialSelectedOrgId]);

  const { data: membersData, isLoading, isError, error } = useOrganizationMembers(
    selectedOrgId ?? 0
  );

  const { data: joinedData } = useOrganizationMembershipsQuery(accountUuid);
  const { data: pendingData } = usePendingOrganizationMembershipsQuery(accountUuid);

  const members = useMemo(() => {
    if (!membersData || !selectedOrgId) return [];
    return membersData.members ?? [];
  }, [membersData, selectedOrgId]);

  const filteredOrganizations = useMemo(() => {
    let list = organizations;
    const term = searchQuery.toLowerCase().trim();
    if (term) {
      list = list.filter((org) => org.name.toLowerCase().includes(term));
    }
    if (filterType === "joined" && joinedData?.organizations) {
      const joinedIds = new Set(joinedData.organizations.map((o) => o.organization_id));
      list = list.filter((org) => joinedIds.has(org.organization_id));
    } else if (filterType === "approval" && pendingData?.pending_memberships) {
      const pendingIds = new Set(pendingData.pending_memberships.map((o) => o.organization_id));
      list = list.filter((org) => pendingIds.has(org.organization_id));
    }
    return list;
  }, [organizations, searchQuery, filterType, joinedData, pendingData]);

  return (
    <>
    <div className="flex justify-center items-center mt-6">
      <div className="w-full md:w-11/12 lg:w-4/5 xl:w-2/3 bg-white padding-responsive-sm border-gray-200 mb-6 rounded-full shadow-sm">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-primary-75"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            className="w-full p-2 pl-12 text-responsive-sm text-primary border border-transparent rounded-full h-[56px] focus:outline-none focus:border-transparent focus:ring-0 placeholder:text-responsive-lg"
            placeholder="Find Organization"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
    </div>
    <div className="flex justify-center items-center h-screen px-4">
      <div className="w-full md:w-11/12 lg:w-4/5 xl:w-2/3 bg-white flex flex-col md:flex-row h-full md:h-screen shadow-lg rounded-xl border-r-4 border-l-4 border-l-primary/20 border-r-primary/20">

        <div className="w-full md:w-1/3 bg-gray-100 overflow-hidden flex flex-col h-auto md:h-full">
          <div className="bg-white padding-responsive-sm flex justify-between items-center border-b border-gray-200 rounded-tl-xl">
            <div className="flex">
              <button
                className={`text-responsive-xxs ${filterType === "all" ? "text-primary font-medium" : "text-primary-75"}`}
                onClick={() => {
                  if (typeof onBackToAll === "function") {
                    onBackToAll();
                  }
                }}
              >
                All
              </button>
              <div className="w-px bg-primary mx-2 my-1"></div>
              <button
                className={`text-responsive-xxs ${filterType === "joined" ? "text-primary font-medium" : "text-primary-75"}`}
                onClick={() => setFilterType("joined")}
              >
                Joined
              </button>
              <div className="w-px bg-primary mx-2 my-1"></div>
              <button
                className={`text-responsive-xxs ${filterType === "approval" ? "text-primary font-medium" : "text-primary-75"}`}
                onClick={() => setFilterType("approval")}
              >
                For Approval
              </button>
            </div>
          </div>
          <div className="flex-grow overflow-y-auto">
            <div className="flex flex-col">
              {filteredOrganizations.map((org) => (
                <div
                  key={org.organization_id}
                  onClick={() => setSelectedOrgId(org.organization_id)}
                  className={`p-3 sm:p-4 cursor-pointer transition-all duration-200 md:border-b border-gray-200 ${
                    selectedOrgId === org.organization_id ? "bg-white" : "bg-athens_gray text-primary"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <ProfileAvatar
                      src={getImageUrl(org.logo)}
                      alt={`${org.name} logo`}
                      type="organization"
                      isOwner={false}
                      organizationId={org.organization_id}
                      className={`w-10 h-10 sm:w-10 sm:h-10 rounded-full object-cover ${
                        selectedOrgId === org.organization_id
                          ? "border-2 border-secondary hover:border-secondary"
                          : ''
                      }`}
                      name={org.name}
                      nameClassName="text-responsive-xs mb-1 truncate font-medium hover:underline cursor-pointer inline-block"
                      containerClassName="flex items-center gap-3 w-full"
                    >
                      <div className="text-responsive-xxs text-primary-75">
                        {org.category}
                      </div>
                    </ProfileAvatar>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Members */}
        <div className="w-full md:w-2/3 border-t md:border-t-0 md:border-l border-primary/30 flex-grow md:h-full flex flex-col transition-all duration-300">
          <div className="px-3 sm:px-4 py-3 flex flex-col h-full">
            <div className="flex flex-row justify-between items-center mb-2">
              <h2 className="text-responsive-sm text-primary font-medium">Members</h2>
              {selectedOrgId && (
                <div className="block">
                  {pendingData?.pending_memberships.some((pendingOrg) => pendingOrg.organization_id === selectedOrgId) ? (
                    <PrimaryButton
                      variant="removeButton"
                      label="Remove"
                      iconClass="w-4 h-4 sm:w-5 sm:h-5 mr-2"
                      onClick={() => (typeof handleLeaveOrg === "function" ? handleLeaveOrg(selectedOrgId) : undefined)}
                    />
                  ) : joinedData?.organizations.some((joinedOrg) => joinedOrg.organization_id === selectedOrgId) ? (
                    <PrimaryButton
                      variant="leaveOrgButton"
                      label="Leave"
                      iconClass="w-4 h-4 sm:w-5 sm:h-5 mr-2"
                      icon={leaveOrgIcon}
                      onClick={() => (typeof handleLeaveOrg === "function" ? handleLeaveOrg(selectedOrgId) : undefined)}
                    />
                  ) : (
                    <PrimaryButton
                      variant="joinStatusButton2"
                      iconClass="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 "
                      label="Join Organization"
                      responsiveLabel="Join"
                      icon={joinIcon2}
                      onClick={() => (typeof handleJoinOrg === "function" ? handleJoinOrg(selectedOrgId) : undefined)}
                    />
                  )}
                </div>
              )}
            </div>

            <hr className="mt-[2px]" />

            <div className="px-2 flex-grow overflow-hidden">
              <div className="spacing-responsive-sm h-full overflow-y-auto mt-2 sm:mt-3">
                {!selectedOrgId && (
                  <div className="text-center py-6 sm:py-8 text-primary-75">
                    <p className="text-responsive-xs">
                      Select an organization to view members
                    </p>
                  </div>
                )}

                {selectedOrgId && isLoading && (
                  <LoadingState message="Loading members..." />
                )}

                {selectedOrgId && isError && (
                  <ErrorState
                    message={`Failed to load members: ${
                      error instanceof Error ? error.message : "Unknown error"
                    }`}
                  />
                )}

                {selectedOrgId && !isLoading && !isError && members.length > 0 ? (
                  members.map((member) => (
                    <div
                      key={member.user_id}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <ProfileAvatar
                        src={getImageUrl(
                          member.profile_picture,
                        )}
                        alt={`${member.first_name} ${member.last_name} avatar`}
                        type="member"
                        isOwner={false}
                        memberUuid={member.account_uuid}
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                        name={`${member.first_name} ${member.last_name}`}
                        nameClassName="text-primary text-responsive-xs font-medium"
                        containerClassName="flex items-center space-x-2 sm:space-x-3"
                      >
                        <p className="text-responsive-xxs text-placeholderbg">
                          {member.status?.toLowerCase() === "approved"
                            ? ""
                            : member.status?.toLowerCase() === "pending"
                            ? "Pending"
                            : "Unknown"}
                        </p>
                      </ProfileAvatar>
                    </div>
                  ))
                ) : (
                  selectedOrgId && !isLoading && !isError && (
                    <div className="text-center py-6 sm:py-8 text-primary-75">
                      <p className="text-responsive-xs">No members in this organization</p>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default AllOrganizationMemberList;