import React, { useState, useMemo } from "react";
import { useImageUrl, useNavigation } from "@src/shared/hooks";
import { PrimaryButton } from "@src/shared/components/PrimaryButton";
import leaveOrgIcon from "@src/assets/shared/leave_org_icon.svg";
import { useAuthStore } from "@src/shared/store/auth";
import { useOrganizationMembershipsQuery } from "../model/organization.query";
import type { OrganizationMembership } from "../schema/organization.types";
import { ErrorState } from "@src/shared/components/states/ErrorState";
import { LoadingState } from "@src/shared/components/states/LoadingState";

interface OrganizationMembersListProps {
  selectedOrgId: number | null;
  filterType: "all" | "joined" | "approval";
  handleFilterClick: (type: "all" | "joined" | "approval") => void;
  handleLeaveOrg: (organizationId: number) => void;
  handleOrgClick?: (orgId: number) => void;
}


const OrganizationMembersList: React.FC<OrganizationMembersListProps> = ({
  selectedOrgId,
  filterType,
  handleFilterClick,
  handleLeaveOrg,
  handleOrgClick,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuthStore();
  const accountUuid = user?.uuid || "";
  const { onOrganizationClick } = useNavigation();

  // Fetch organization memberships
  const {
    data: organizationData,
    isLoading,
    isError,
    error,
  } = useOrganizationMembershipsQuery(accountUuid);

  // Filter organizations based on search query
  const filteredData = useMemo(() => {
    if (!organizationData) return undefined;

    const searchTerm = searchQuery.toLowerCase().trim();
    if (!searchTerm) return organizationData;

    return {
      organizations: organizationData.organizations.filter((org) =>
        org.organization_name.toLowerCase().includes(searchTerm)
      ),
    };
  }, [organizationData, searchQuery]);

  // Get selected organization
  const selectedOrg = useMemo(() => {
    if (!filteredData) return undefined;

    // If no organization is selected yet and we have organizations, select the first one
    if (selectedOrgId === null && filteredData.organizations.length > 0) {
      if (handleOrgClick) {
        handleOrgClick(filteredData.organizations[0].organization_id);
      }
      return filteredData.organizations[0];
    }

    return filteredData.organizations.find(
      (org) => org.organization_id === selectedOrgId
    );
  }, [filteredData, selectedOrgId, handleOrgClick]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
  };

  const { getImageUrl } = useImageUrl();

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
              className="w-full p-2 pl-12 text-responsive-sm text-primary border border-transparent rounded-full h-[56px] focus:outline-none focus:border-transparent focus:ring-0 placeholder:text-responsive-sm"
              placeholder="Find Organization"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-center items-center h-screen px-4">
        <div className="w-full md:w-11/12 lg:w-4/5 xl:w-2/3 bg-white flex flex-col md:flex-row h-full md:h-screen shadow-sm rounded-xl border-r-4 border-l-4 border-l-primary/20 border-r-primary/20">
          <div className="w-full md:w-1/3 bg-gray-100 overflow-hidden flex flex-col h-auto md:h-full rounded-tl-xl">
            <div className="bg-white padding-responsive-sm flex justify-between items-center border-b border-gray-200 ">
              <div className="flex">
                <button
                  className={`text-responsive-xxs ${
                    filterType === "all"
                      ? "text-primary font-medium"
                      : "text-primary-75"
                  }`}
                  onClick={() => handleFilterClick("all")}
                >
                  All
                </button>
                <div className="w-px bg-primary mx-2 my-1"></div>
                <button
                  className={`text-responsive-xxs ${
                    filterType === "joined"
                      ? "text-primary font-medium"
                      : "text-primary-75"
                  }`}
                  onClick={() => handleFilterClick("joined")}
                >
                  Joined
                </button>
                <div className="w-px bg-primary mx-2 my-1"></div>
                <button
                  className={`text-responsive-xxs ${
                    filterType === "approval"
                      ? "text-primary font-medium"
                      : "text-primary-75"
                  }`}
                  onClick={() => handleFilterClick("approval")}
                >
                  For Approval
                </button>
              </div>
            </div>
            <div className="flex-grow overflow-x-auto md:h-auto">
              {isLoading && <LoadingState message="Loading organizations..." />}
              {isError && (
                <ErrorState
                  message={`Failed to load organizations: ${
                    error instanceof Error ? error.message : "Unknown error"
                  }`}
                />
              )}

              <div className="flex flex-row md:flex-col">
                {filteredData &&
                  filteredData.organizations.map(
                    (org: OrganizationMembership) => (
                      <div
                        key={org.organization_id}
                        onClick={() =>
                          handleOrgClick && handleOrgClick(org.organization_id)
                        }
                        className={`
                p-3 sm:p-4 cursor-pointer transition-all duration-200 md:border-b border-gray-200
                ${
                  selectedOrgId === org.organization_id
                    ? "bg-white"
                    : "bg-athens_gray text-primary md:bg-athens_gray md:text-primary"
                }
              `}
                      >
                        <div className="flex md:items-center md:space-x-2 sm:space-x-3">
                          {org.organization_logo ? (
                            <img
                              src={getImageUrl(
                                org.organization_logo
                              )}
                              alt={`${org.organization_name} logo`}
                              className={`w-10 h-10 sm:w-10 sm:h-10 rounded-full object-cover flex-shrink-0 cursor-pointer border-2 border-transparent hover:border-secondary ${
                                selectedOrgId === org.organization_id ? "border-2 border-secondary lg:border-0" : ""
                              }`}
                              onClick={onOrganizationClick(org.organization_id)}
                            />
                          ) : (
                            <div
                              className={`w-10 h-10 sm:w-10 sm:h-10 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 cursor-pointer border-2 border-transparent hover:border-secondary ${
                                selectedOrgId === org.organization_id && "border-2 border-secondary lg:border-0"
                              }`}
                              onClick={onOrganizationClick(org.organization_id)}
                            >
                              {org.organization_name.charAt(0)}
                            </div>
                          )}
                          <div className="flex-1 min-w-0 hidden md:block">
                            <h3
                              className="text-responsive-xs mb-1 truncate font-medium hover:underline cursor-pointer"
                              onClick={onOrganizationClick(org.organization_id)}
                            >
                              {org.organization_name}
                            </h3>
                            <div className="text-responsive-xxs text-primary-75">
                              {org.membership_status}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  )}
              </div>
            </div>

            {(!filteredData || filteredData.organizations.length === 0) && (
              <div className="text-center py-6 sm:py-8 text-primary-75 bg-gray-100">
                <p className="text-responsive-xs">No organizations found</p>
              </div>
            )}
          </div>

          {/* Members List - Full width on mobile, right side on larger screens */}
          <div className="w-full md:w-2/3 border-t md:border-t-0 md:border-l border-primary/30 flex-grow md:h-full flex flex-col">
            <div className="px-3 sm:px-4 py-3 flex flex-col h-full">
              <div className="flex flex-row justify-between items-center mb-2">
                <h2 className="text-responsive-sm text-primary font-medium">
                  Members
                </h2>
                {selectedOrg && (
                  <div className="block">
                    <PrimaryButton
                      variant="leaveOrgButton"
                      label="Leave"
                      iconClass="w-4 h-4 sm:w-5 sm:h-5 mr-2"
                      icon={leaveOrgIcon}
                      onClick={() =>
                        handleLeaveOrg(selectedOrg.organization_id)
                      }
                    />
                  </div>
                )}
              </div>

              <hr className="mt-[2px]" />

              <div className="px-2 flex-grow overflow-hidden">
                <div className="spacing-responsive-sm h-full overflow-y-auto mt-2 sm:mt-3">
                  {selectedOrg && selectedOrg.members.length > 0 ? (
                    selectedOrg.members.map((member) => (
                      <div
                        key={member.user_id}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          <img
                            src={getImageUrl(
                              member.profile_picture
                            )}
                            alt={`${member.first_name} ${member.last_name} avatar`}
                            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                          />
                          <div>
                            <p className="text-primary text-responsive-xs font-medium">
                              {member.first_name} {member.last_name}
                            </p>
                            <p className="text-responsive-xxs text-placeholderbg">
                              {member.status.toLowerCase() === "approved"
                                ? ""
                                : member.status.toLowerCase() === "pending"
                                ? "Pending"
                                : "Unknown"}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 sm:py-8 text-primary-75">
                      <p className="text-responsive-xs">
                        {selectedOrg
                          ? "No members in this organization"
                          : "Select an organization to view members"}
                      </p>
                    </div>
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

export { OrganizationMembersList };
export default OrganizationMembersList;
