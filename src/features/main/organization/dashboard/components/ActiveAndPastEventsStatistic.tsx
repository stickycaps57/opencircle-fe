import { useState } from "react";
import ReactApexChart from "react-apexcharts";
import { PrimaryButton } from "@src/shared/components/PrimaryButton";
import { DEFAULT_GRAPH_COLORS } from "@src/shared/enums/graphColors";
import { RSVP_LABELS, buildRsvpSeries } from "@src/shared/enums/rsvp";
import { useEventsRespondents } from "@src/features/main/organization/dashboard/model/dashboard.query";
import type { EventRespondentsItem } from "@src/features/main/organization/dashboard/schema/dashboard.types";
import { EventsDataTableModal } from "@src/shared/components/modals/EventsDataTableModal";

export default function ActiveAndPastEventsStatistic() {
  const { data } = useEventsRespondents();
  const labels = RSVP_LABELS;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("Active Events");
  const [modalType, setModalType] = useState<"active" | "past">("active");

  const baseChartOptions: ApexCharts.ApexOptions = {
    chart: { type: "donut" },
    labels,
    colors: DEFAULT_GRAPH_COLORS,
    legend: { show: false },
    plotOptions: {
      pie: {
        donut: {
          size: "75%",
          labels: { show: false },
        },
      },
    },
    dataLabels: { enabled: false },
    stroke: { width: 0 },
  };

  const parseDate = (s: string) => new Date(s.replace(" ", "T"));
  const allEvents: EventRespondentsItem[] = data?.events ?? [];
  const now = new Date();
  const activeEventsAll = allEvents.filter((e) => parseDate(e.event_date) >= now);
  const pastEventsAll = allEvents.filter((e) => parseDate(e.event_date) < now);
  const activeEvents = activeEventsAll.slice(0, 4);
  const pastEvents = pastEventsAll.slice(0, 4);

  const getChartOptions = (): ApexCharts.ApexOptions => ({
    ...baseChartOptions,
    chart: {
      ...(baseChartOptions.chart as ApexCharts),
      toolbar: {
        show: false,
        tools: { download: true, selection: false, zoom: false, zoomin: false, zoomout: false, pan: false, reset: false },
        offsetY: -12,
        offsetX: 0,
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: "60%",
          labels: {
            show: true,
            name: { show: false },
            value: { show: true, fontSize: "12px", offsetY: 4 },
            total: { show: true },
          },
        },
      },
    },
    tooltip: { enabled: true },
  });

  const openActiveModal = () => {
    setModalTitle("Active Events");
    setModalType("active");
    setIsModalOpen(true);
  };

  const openPastModal = () => {
    setModalTitle("Past Events");
    setModalType("past");
    setIsModalOpen(true);
  };

  return (
    <section className="mt-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-responsive-xs text-primary">Active Events</div>
          <PrimaryButton label="See more" variant="linkXsButton" onClick={openActiveModal} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {activeEvents.length === 0 && (
            <div className="text-responsive-xs text-authlayoutbg">
              No active events
            </div>
          )}
          {activeEvents.map((ev) => {
            const series = buildRsvpSeries({
              joined: ev.rsvp_statistics.joined,
              pending: ev.rsvp_statistics.pending,
              rejected: ev.rsvp_statistics.rejected,
            });
            return (
              <div key={`active-${ev.event_id}`} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <ReactApexChart options={getChartOptions()} series={series} type="donut" height={100} width={100} />
                  </div>
                  <div className="flex-1 text-responsive-xs text-primary font-semibold truncate">{ev.event_title}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between">
          <div className="text-responsive-xs text-primary">Past Events</div>
          <PrimaryButton label="See more" variant="linkXsButton" onClick={openPastModal} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {pastEvents.length === 0 && (
            <div className="text-responsive-xs text-authlayoutbg">
              No past events
            </div>
          )}
          {pastEvents.map((ev) => {
            const series = buildRsvpSeries({
              joined: ev.rsvp_statistics.joined,
              pending: ev.rsvp_statistics.pending,
              rejected: ev.rsvp_statistics.rejected,
            });
            return (
              <div key={`past-${ev.event_id}`} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <ReactApexChart options={getChartOptions()} series={series} type="donut" height={100} width={100} />
                  </div>
                  <div className="flex-1 text-responsive-xs text-primary font-semibold">
                    {ev.event_title.length > 20
                      ? ev.event_title.slice(0, 20) + "…"
                      : ev.event_title}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <EventsDataTableModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalTitle}
        events={modalType === "active" ? activeEventsAll : pastEventsAll}
      />
    </section>
  );
}
