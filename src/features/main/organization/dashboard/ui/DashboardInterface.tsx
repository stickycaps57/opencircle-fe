import MemberStatistic from "@src/features/main/organization/dashboard/components/MemberStatistic";
import EventsStatistic from "@src/features/main/organization/dashboard/components/EventsStatistic";
import MemberInteractionStatistic from "@src/features/main/organization/dashboard/components/MemberInteractionStatistic";
import EventInteractionStatistic from "@src/features/main/organization/dashboard/components/EventInteractionStatistic";
import PostInteractionStatistic from "@src/features/main/organization/dashboard/components/PostInteractionStatistic";

export default function DashboardInterface() {
  return (
    <div className="w-full md:w-11/12 lg:w-4/5 px-4 sm:px-6 lg:px-30 py-10 mx-auto">
      <MemberStatistic />
      <EventsStatistic
      />
      <MemberInteractionStatistic />
      <EventInteractionStatistic />
      <PostInteractionStatistic />
    </div>
  );
}
