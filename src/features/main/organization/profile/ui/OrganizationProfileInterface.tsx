import { useState, useEffect } from "react";
import ActiveComponent from "../components/ActiveComponent";
import EventsComponent from "../components/EventsComponent";
import { UserProfileHeader } from "@src/shared/components/UserProfileHeader";
import { useAuthStore } from "@src/shared/store/auth";
import { CalendarSection } from "@src/features/calendar/ui/CalendarSection";
import { useOrganizationByIdQuery } from "../model/organization.query";
import {
  isMember,
  isOrganization,
} from "@src/shared/utils/checkAuthenticatedRole";
import { type Organization } from "@src/features/auth/schema/auth.types";
import { useImageUrl, useProfileRelationship } from "@src/shared/hooks";
import avatarImage from "@src/assets/shared/avatar.png";

interface OrganizationProfileInterfaceProps {
  organizationId?: string;
}

export default function OrganizationProfileInterface({
  organizationId,
}: OrganizationProfileInterfaceProps) {
  const [activeTab, setActiveTab] = useState("active");
  const { user } = useAuthStore();
  const [organizationData, setOrganizationData] = useState<Organization | null>(
    null
  );
  
  const isUserMember = user ? isMember(user) : false;

  const { data: organizationDetails } = useOrganizationByIdQuery(
   organizationId
  );

   const {
      isOrganizationVisitingOrganization
    } = useProfileRelationship(organizationDetails);

  useEffect(() => {
    if (isUserMember && organizationDetails) {
      setOrganizationData(organizationDetails);
    } else if (isOrganizationVisitingOrganization && organizationDetails){
      setOrganizationData(organizationDetails);
    } 
    else if (!isUserMember && user && isOrganization(user)) {
      setOrganizationData(user);
    }
  }, [isUserMember, organizationDetails, organizationId, user, isOrganizationVisitingOrganization]);

  const { getImageUrl } = useImageUrl();

  const headerProfile = organizationData
    ? {
        id: organizationData.id,
        name: organizationData.name,
        role_id: 2,
        role: "organization",
        bio: organizationData.description,
        username: organizationData.username,
        avatarUrl: getImageUrl(
          organizationData.logo,
          avatarImage
        ),
        uuid: organizationData.uuid,
      }
    : user;

  const profileTabs = [
    { id: "active", label: "Post" },
    { id: "events", label: "Events" },
    { id: "calendar", label: "Calendar" },
  ];

  const renderActiveComponent = () => {
    // Get the account UUID from the organization data or the current user
    // For organization users, use their own UUID
    // For member users viewing an organization, use the organization's account_id as UUID
    const accountUuid = isUserMember
      ? organizationData?.uuid || ""
      : isOrganizationVisitingOrganization ? organizationData?.uuid || "" : user?.uuid || "";


    switch (activeTab) {
      case "active":
        return (
          <ActiveComponent
            accountUuid={accountUuid}
          />
        );
      case "events":
        return <EventsComponent accountUuid={accountUuid} />;
      case "calendar":
        return (
          <CalendarSection userType="organization" accountUuid={accountUuid} />
        );
      default:
        return <EventsComponent accountUuid={accountUuid} />;
    }
  };

  return (
    <div className="w-full min-h-screen">
      {/* Profile Header Section */}
      <div className="w-full h-auto sm:h-64 md:h-72 bg-white relative flex flex-col">
        {/* Profile Details Section - Centered */}
        <UserProfileHeader
          profile={headerProfile}
        />

        {/* Menu Section - Fixed at Bottom */}
        <nav className="flex justify-center px-2 sm:px-4 sm:pb-0 bg-secondary/50">
          <div className="flex overflow-x-auto">
            {profileTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative py-2 sm:py-3 md:py-4 px-2 sm:px-3 text-responsive-sm font-bold text-center w-[140px] transition-colors duration-200 whitespace-nowrap ${
                  activeTab === tab.id
                    ? "text-primary"
                    : "text-placeholderbg hover:text-primary"
                }`}
              >
                {tab.label}
                {/* Active indicator */}
                {activeTab === tab.id && (
                  <div className="absolute border-2 sm:border-3 md:border-4 bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
                )}
              </button>
            ))}
          </div>
        </nav>
      </div>

      {/* Dynamic Content Section */}
      <div className="w-full">{renderActiveComponent()}</div>
    </div>
  );
}
