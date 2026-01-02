import React, { useState } from "react";
import { useImageUrl, useNavigation } from "@src/shared/hooks";
import { PrimaryButton } from "@src/shared/components/PrimaryButton";
import { ErrorState } from "@src/shared/components/states/ErrorState";
import { LoadingState } from "@src/shared/components/states/LoadingState";
import { useAuthStore } from "@src/shared/store/auth";
import { usePendingOrganizationMembershipsQuery } from "../model/organization.query";
import removeIcon from "@src/assets/shared//remove_icon.png";

interface PendingOrganizationProps {
  selectedOrgId: number | null;
  filterType: "all" | "joined" | "approval";
  handleFilterClick: (type: "all" | "joined" | "approval") => void;
  handleLeaveOrg: (organizationId: number) => void;
}


const PendingOrganization: React.FC<PendingOrganizationProps> = ({
  filterType,
  handleFilterClick,
  handleLeaveOrg,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuthStore();
  const { getImageUrl } = useImageUrl();
  const accountUuid = user?.uuid || "";
  
  // Fetch pending organization memberships
  const { data: pendingData, isLoading, isError, error } = usePendingOrganizationMembershipsQuery(accountUuid);
  
  // Filter organizations based on search query
  const filteredData = React.useMemo(() => {
    if (!pendingData) return undefined;
    
    const searchTerm = searchQuery.toLowerCase().trim();
    if (!searchTerm) return pendingData;
    
    return {
      pending_memberships: pendingData.pending_memberships.filter(org => 
        org.organization_name.toLowerCase().includes(searchTerm)
      )
    };
  }, [pendingData, searchQuery]);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
  };
  
  const { onOrganizationClick, navigateToOrganization } = useNavigation();
  
  const handleCardClick = (orgId: number) => {
    navigateToOrganization(orgId);
  };

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
        <div className="w-full md:w-11/12 lg:w-4/5 xl:w-2/3 bg-gray-100 flex flex-col h-full md:h-screen shadow-sm rounded-xl border-r-4 border-l-4 border-l-primary/20 border-r-primary/20" >
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
          {isLoading && <LoadingState message="Loading pending organizations..." />}
          {isError && <ErrorState message={`Failed to load pending organizations: ${error instanceof Error ? error.message : 'Unknown error'}`} />}
          
          {!isLoading && !isError && filteredData && filteredData.pending_memberships.length > 0 ? (
            <div className="space-y-3 md:space-y-4">
              {filteredData.pending_memberships.map((org) => (
                <div
                  key={org.organization_id}
                  className="flex items-center justify-between p-3 hover:bg-white hover:shadow-md transition-all duration-200 group cursor-pointer"
                  onClick={() => handleCardClick(org.organization_id)}
                >
                  <div className="flex items-center space-x-3">
                    {org.organization_logo ? (
                      <img
                        src={getImageUrl(
                          org.organization_logo
                        )}
                        alt={`${org.organization_name} logo`}
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover flex-shrink-0 cursor-pointer border-2 border-transparent hover:border-secondary"
                        onClick={onOrganizationClick(org.organization_id)}
                      />
                    ) : (
                      <div
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 cursor-pointer border-2 border-transparent hover:border-secondary"
                        onClick={onOrganizationClick(org.organization_id)}
                      >
                        {org.organization_name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h3
                        className="text-responsive-xs md:text-responsive-sm font-medium text-primary group-hover:font-bold hover:underline cursor-pointer"
                        onClick={onOrganizationClick(org.organization_id)}
                      >
                        {org.organization_name}
                      </h3>
                      <p className="text-responsive-xxs text-gray-500">
                        {org.organization_category}
                      </p>
                    </div>
                  </div>

                  <div
                    className="relative z-10"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  >
                    <PrimaryButton
                      variant="removeButton"
                      label="Remove"
                      icon={removeIcon}
                      iconClass="w-4 h-4 sm:w-5 sm:h-5 mr-2"
                      onClick={() => handleLeaveOrg(org.organization_id)}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-responsive-sm text-gray-500">
                No pending organization requests.
              </p>
            </div>
          )}
        </div>
        </div>
      </div>
    </>
  );
};

export { PendingOrganization };
export default PendingOrganization;
