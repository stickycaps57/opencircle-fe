import { useMembershipAnalytics } from "@src/features/main/organization/dashboard/model/dashboard.query";
import { useState } from "react";

export default function MemberStatistic() {
  const now = new Date();
  const today = now.toISOString().split("T")[0];
  const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const oneWeekAgo = lastWeek.toISOString().split("T")[0];

  const [startDate, setStartDate] = useState(`${oneWeekAgo} 00:00`);
  const [endDate, setEndDate] = useState(`${today} 23:59`);

  const { data: membership } = useMembershipAnalytics({
    start_date: startDate,
    end_date: endDate,
  });
  const counts = membership?.membership_analytics?.status_counts;

  const emptyCount = 0;
  const items = [
    { label: "Approved", value: counts?.approved ?? emptyCount },
    { label: "Pending", value: counts?.pending ?? emptyCount },
    { label: "Rejected", value: counts?.rejected ?? emptyCount },
    { label: "Left", value: counts?.left ?? emptyCount },
  ];

  return (
    <section className="mb-12">
      <div className="flex justify-between items-center mb-4">
         <h2 className="text-responsive-base font-bold text-primary">Members</h2>
         <div className="flex gap-2">
           <input
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-responsive-xs text-primary bg-white"
            />
           <input
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-responsive-xs text-primary bg-white"
            />
         </div>
      </div>
     
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <div key={item.label} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="text-responsive-xs text-primary font-semibold">{item.label}</div>
            <div className="text-responsive-xl text-primary font-bold mt-1">{item.value}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
