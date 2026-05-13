import MemberStatistic from "@src/features/main/organization/dashboard/components/MemberStatistic";
import EventsStatistic from "@src/features/main/organization/dashboard/components/EventsStatistic";
import MemberInteractionStatistic from "@src/features/main/organization/dashboard/components/MemberInteractionStatistic";
import EventInteractionStatistic from "@src/features/main/organization/dashboard/components/EventInteractionStatistic";
import PostInteractionStatistic from "@src/features/main/organization/dashboard/components/PostInteractionStatistic";

export default function DashboardInterface() {
  return (
    <div className="w-full px-6 py-8 mx-auto">
      <MemberStatistic />
      <EventsStatistic />
      <MemberInteractionStatistic />
      <EventInteractionStatistic />
      <PostInteractionStatistic />
    </div>
  );
}
