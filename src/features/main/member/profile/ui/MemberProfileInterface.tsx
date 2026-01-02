import { UserProfileHeader } from "@src/shared/components/UserProfileHeader";
import { useState } from "react";
import PostComponent from "../components/PostComponent";
import EventComponent from "../components/EventComponent";
import { useAuthStore } from "@src/shared/store/auth";
import { CalendarSection } from "@src/features/calendar/ui/CalendarSection";
import { useMemberProfileQuery } from "../model/member.query";
import { useImageUrl } from "@src/shared/hooks";
import avatarImage from "@src/assets/shared/avatar.png";

type MemberProfileInterfaceProps = {
  accountUuid?: string;
};

export default function MemberProfileInterface({ accountUuid }: MemberProfileInterfaceProps) {
  const [activeTab, setActiveTab] = useState("post");
  const { user } = useAuthStore();
  const effectiveUuid = accountUuid || user?.uuid || "";

  const { data: visitedProfile } = useMemberProfileQuery(effectiveUuid);
  const { getImageUrl } = useImageUrl();

  const headerProfile = visitedProfile
    ? {
        id: visitedProfile.id,
        name: `${visitedProfile.first_name} ${visitedProfile.last_name}`,
        role_id: 1,
        role: "member",
        bio: visitedProfile.bio,
        username: visitedProfile.username,
        avatarUrl: getImageUrl(
          visitedProfile.profile_picture,
          avatarImage
        ),
        organizer_view_user_membership: visitedProfile.organizer_view_user_membership || "",
        uuid: visitedProfile.uuid,
      }
    : user;

  const profileTabs = [
    { id: "post", label: "Post" },
    { id: "events", label: "Events" },
    { id: "calendar", label: "Calendar" },
  ];

  const renderActiveComponent = () => {
    switch (activeTab) {
      case "post":
        return <PostComponent accountUuid={effectiveUuid} />;
      case "events":
        return <EventComponent accountUuid={effectiveUuid} />;
      case "calendar":
        return <CalendarSection userType="member" accountUuid={effectiveUuid} />;
      default:
        return <PostComponent accountUuid={effectiveUuid} />;
    }
  };
  return (
    <div className="w-full min-h-screen">
      <div className="w-full h-auto sm:h-64 md:h-72 bg-white relative flex flex-col">
        <UserProfileHeader profile={headerProfile} />

        <nav className="flex justify-center px-2 sm:px-4 sm:pb-0">
          <div className="flex overflow-x-auto" >
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
                {activeTab === tab.id && (
                  <div className="absolute border-2 sm:border-3 md:border-4 bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
                )}
              </button>
            ))}
          </div>
        </nav>
      </div>

      <div className="w-full">{renderActiveComponent()}</div>
    </div>
  );
}
