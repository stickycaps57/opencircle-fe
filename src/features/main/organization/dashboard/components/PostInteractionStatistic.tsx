import { useMemo, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { usePostCommentAnalyticsSummary } from "@src/features/main/organization/dashboard/model/dashboard.query";
import { DEFAULT_GRAPH_COLORS } from "@src/shared/enums/graphColors";

export default function PostInteractionStatistic() {
  const today = new Date().toISOString().split("T")[0];
  const [startDate, setStartDate] = useState(`${today}T00:00`);
  const [endDate, setEndDate] = useState(`${today}T23:59`);
  const { data } = usePostCommentAnalyticsSummary({ start_date: startDate, end_date: endDate });

  console.log("dataaa", data);

  const categories = useMemo(() => {
    const items = data?.post_analytics ?? [];
    const sorted = [...items].sort((a, b) => new Date(a.post_created_date).getTime() - new Date(b.post_created_date).getTime());
    return sorted.map((p) => (p.post_description.length > 12 ? `${p.post_description.slice(0, 12)}...` : p.post_description));
  }, [data?.post_analytics]);

  const series = useMemo(() => {
    const items = data?.post_analytics ?? [];
    const sorted = [...items].sort((a, b) => new Date(a.post_created_date).getTime() - new Date(b.post_created_date).getTime());
    const dataPoints = sorted.map((p) => p.comment_count);
    return [{ name: "Comments", data: dataPoints }];
  }, [data?.post_analytics]);

  const barColors = useMemo(() => {
    return categories.map((_, idx) => DEFAULT_GRAPH_COLORS[idx % DEFAULT_GRAPH_COLORS.length]);
  }, [categories]);

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "bar",
      toolbar: {
        show: true,
        tools: { download: true, selection: false, zoom: false, zoomin: false, zoomout: false, pan: false, reset: false },
      },
    },
    plotOptions: { bar: { horizontal: false, columnWidth: "45%", distributed: true } },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 2, colors: ["transparent"] },
    xaxis: { categories },
    legend: { show: false },
    grid: { strokeDashArray: 4 },
    yaxis: { title: { text: "Comments" } },
    colors: barColors,
  };

  return (
    <section className="mb-6">
      <h2 className="text-responsive-base font-bold text-primary mb-3">Post Interaction</h2>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-end space-x-3 mb-3">
          <div className="relative">
            <div className="text-responsive-xxs text-primary mb-1">Date</div>
            <input
              type="datetime-local"
              value={endDate}
              onChange={(e) => {
                const val = e.target.value;
                setEndDate(val);
                if (val) {
                  setStartDate(`${val.split("T")[0]}T00:00:00`);
                }
              }}
              className="border border-gray-300 rounded-lg px-3 py-2 text-responsive-xs text-primary bg-white"
            />
          </div>
        </div>
        <ReactApexChart options={options} series={series} type="bar" height={300} />
      </div>
    </section>
  );
}
