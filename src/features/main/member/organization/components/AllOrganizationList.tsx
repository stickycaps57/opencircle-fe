import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import type { DirectOrganizationSearchItem } from "../schema/organization.types";
import { LoadingState } from "@src/shared/components/states/LoadingState";
import { ErrorState } from "@src/shared/components/states/ErrorState";
import { PrimaryButton } from "@src/shared/components/PrimaryButton";
import {
  useOrganizationSearchQuery,
  useOrganizationMembershipsQuery,
  usePendingOrganizationMembershipsQuery,
} from "../model/organization.query";
import { useAuthStore } from "@src/shared/store/auth";
import AllOrganizationMemberList from "./AllOrganizationMemberList";
import type { ProfilePicture } from "@src/features/auth/schema/auth.types";
import { ProfileAvatar } from "@src/shared/components";
import removeIcon from "@src/assets/shared//remove_icon.png";
import leaveOrgIcon from "@src/assets/shared/leave_org_icon.svg";
import joinIcon from "@src/assets/shared/join_icon.svg";
interface AllOrganizationListProps {
  selectedOrgId: number | null;
  filterType: "all" | "joined" | "approval";
  handleFilterClick: (type: "all" | "joined" | "approval") => void;
  handleJoinOrg?: (organizationId: number) => void;
  handleLeaveOrg?: (organizationId: number) => void;
  getImageUrl: (
    imageObject?: ProfilePicture | null,
    fallbackUrl?: string
  ) => string;
}

const AllOrganizationList: React.FC<AllOrganizationListProps> = ({
  // selectedOrgId is currently not used but kept for future implementation
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // selectedOrgId,
  filterType,
  handleFilterClick,
  handleJoinOrg,
  handleLeaveOrg,
  getImageUrl,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuthStore();
  const accountUuid = user?.uuid || "";

  // Use the search query hook directly in the component
  const { data, isLoading, isError, error } =
    useOrganizationSearchQuery(searchQuery);

  // Fetch joined organizations
  const { data: joinedData } = useOrganizationMembershipsQuery(accountUuid);

  // Fetch pending organizations
  const { data: pendingData } =
    usePendingOrganizationMembershipsQuery(accountUuid);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
  };

  const navigate = useNavigate();
  const [showMembersView, setShowMembersView] = useState(false);
  const [selectedOrgId, setSelectedOrgId] = useState<number | null>(null);

  const handleCardClick = (orgId: number) => {
    setSelectedOrgId(orgId);
    setShowMembersView(true);
    navigate({ search: `?orgId=${orgId}` });
  };

  const organizations: DirectOrganizationSearchItem[] = useMemo(() => data ?? [], [data]);

  if (showMembersView) {
    return (
      <AllOrganizationMemberList
        organizations={organizations}
        initialSelectedOrgId={selectedOrgId}
        handleJoinOrg={handleJoinOrg}
        handleLeaveOrg={handleLeaveOrg}
        getImageUrl={getImageUrl}
        onBackToAll={() => {
          setShowMembersView(false);
          navigate({ search: "" });
        }}
      />
    );
  }

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
              onChange={handleSearchChange}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-center items-center h-screen px-4">
        <div className="w-full md:w-11/12 lg:w-4/5 xl:w-2/3 bg-gray-100 flex flex-col h-full md:h-screen shadow-sm rounded-xl border-r-4 border-l-4 border-l-primary/20 border-r-primary/20">
          {/* Filter Buttons */}
          <div className="bg-white padding-responsive-sm flex justify-between items-center border-b border-gray-200 rounded-t-xl">
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

          <div className="flex-grow overflow-y-auto">
            {isLoading && <LoadingState message="Searching organizations..." />}

            {isError && (
              <ErrorState
                message={`Failed to search organizations: ${
                  error instanceof Error ? error.message : "Unknown error"
                }`}
              />
            )}

            {!isLoading && !isError && data && data.length > 0 ? (
              <div className="">
                {data.map((org: DirectOrganizationSearchItem) => (
                  <div
                    key={org.organization_id}
                    className="flex items-center justify-between p-3 hover:bg-white hover:shadow-md transition-all duration-200 group cursor-pointer"
                    onClick={() => handleCardClick(org.organization_id)}
                  >
                    <div className="flex items-center space-x-3">
                      <ProfileAvatar
                        src={getImageUrl(org.logo)}
                        alt={`${org.name} logo`}
                        type="organization"
                        isOwner={false}
                        organizationId={org.organization_id}
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                        name={org.name}
                        nameClassName="text-responsive-xs md:text-responsive-sm font-medium text-primary"
                        containerClassName="flex items-center gap-3"
                      >
                        <p className="text-responsive-xxs text-gray-500">
                          {org.category}
                        </p>
                      </ProfileAvatar>
                    </div>

                    <div
                      className="relative z-10"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                    >
                      {/* Check if organization is in pending list */}
                      {pendingData?.pending_memberships.some(
                        (pendingOrg) =>
                          pendingOrg.organization_id === org.organization_id
                      ) ? (
                        <PrimaryButton
                          variant="removeButton"
                          label="Remove"
                          icon={removeIcon}
                          iconClass="w-4 h-4 sm:w-5 sm:h-5 mr-2"
                          onClick={() =>
                            handleLeaveOrg &&
                            handleLeaveOrg(org.organization_id)
                          }
                        />
                      ) : joinedData?.organizations.some(
                          (joinedOrg) =>
                            joinedOrg.organization_id === org.organization_id
                        ) ? (
                        <PrimaryButton
                          variant="leaveOrgButton"
                          label="Leave"
                          iconClass="w-4 h-4 sm:w-5 sm:h-5 mr-2"
                          icon={leaveOrgIcon}
                          onClick={() =>
                            handleLeaveOrg &&
                            handleLeaveOrg(org.organization_id)
                          }
                        />
                      ) : (
                        <PrimaryButton
                          variant="joinStatusButton"
                          iconClass="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2"
                          label="Join Organization"
                          responsiveLabel="Join"
                          icon={joinIcon}
                          onClick={() =>
                            handleJoinOrg && handleJoinOrg(org.organization_id)
                          }
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : !isLoading && !isError ? (
              <div className="flex items-center justify-center h-full py-8">
                <p className="text-responsive-xxs text-gray-500">
                  {searchQuery.trim()
                    ? "No organizations found matching your search."
                    : "No organizations exist yet."}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default AllOrganizationList;
