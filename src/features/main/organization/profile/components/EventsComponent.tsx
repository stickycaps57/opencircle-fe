import { useState } from "react";
import ActiveEventsList from "@src/features/main/organization/profile/components/ActiveEventsList";
import PastEventsComponent from "@src/features/main/organization/profile/components/PastEventsComponent";
import activeEventLogo from "@src/assets/shared/active-events.svg";
import historyEventLogo from "@src/assets/shared/history-events.svg";
import dropdownIcon from "@src/assets/shared/dropdown_icon.svg";

type EventsComponentProps = { accountUuid: string };

export default function EventsComponent({ accountUuid }: EventsComponentProps) {
  const [selectedTab, setSelectedTab] = useState<"active" | "past">("active");

  return (
    <div className="w-full lg:w-1/2 mx-auto p-3 sm:p-4 md:p-6">
      <div className="bg-white w-1/3 flex items-start justify-start p-2 sm:p-3 rounded-full mb-4 sm:mb-6 shadow-sm relative">
        <div className="flex items-center space-x-1 sm:space-x-2 w-full">
          <div className="flex items-center space-x-1 sm:space-x-2 w-full">
            <img
              src={selectedTab === "active" ? activeEventLogo : historyEventLogo}
              alt="Event Status"
              className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0"
            />
            <select
              className="bg-transparent text-primary font-medium text-responsive-xs text-center focus:outline-none appearance-none pr-8 w-full"
              value={selectedTab}
              onChange={(e) => setSelectedTab(e.target.value as "active" | "past")}
            >
              <option value="active" className="flex items-center">Active Events</option>
              <option value="past" className="flex items-center">Past Events</option>
            </select>
          </div>
        </div>
        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
          <img src={dropdownIcon} alt="Dropdown" className="h-7 w-7" />
        </div>
      </div>

      {selectedTab === "active" ? (
        <ActiveEventsList accountUuid={accountUuid} />
      ) : (
        <PastEventsComponent accountUuid={accountUuid} />
      )}
    </div>
  );
}

