import { Modal } from "../Modal";
import DataTable, { type TableColumn } from "react-data-table-component";
import { useMemo } from "react";
import { useFormatDate } from "@src/shared/hooks";
import type { EventRespondentsItem } from "@src/features/main/organization/dashboard/schema/dashboard.types";

type Row = {
  title: string;
  joined: number;
  pending: number;
  rejected: number;
  total: number;
  unique_attendees: number;
  response_rate: number;
  event_date: string;
  event_created_date: string;
};

type EventsDataTableModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  rows?: Row[];
  events?: EventRespondentsItem[];
};

export function EventsDataTableModal({ isOpen, onClose, title = "Events", rows, events }: EventsDataTableModalProps) {
  const { formatDateTime } = useFormatDate();
  const data: Row[] = rows
    ? rows
    : events?.map((e) => ({
      title: e.event_title,
      joined: e.rsvp_statistics.joined,
      pending: e.rsvp_statistics.pending,
      rejected: e.rsvp_statistics.rejected,
      total: e.rsvp_statistics.total,
      unique_attendees: e.unique_attendees,
      response_rate: e.response_rate,
      event_date: e.event_date,
      event_created_date: e.event_created_date,
    })) || [];

  const columns: TableColumn<Row>[] = useMemo(
    () => [
      { name: "Title", selector: (row) => row.title, sortable: true },
      { name: "Joined", selector: (row) => row.joined, sortable: true, right: true, width: "100px" },
      { name: "Pending", selector: (row) => row.pending, sortable: true, right: true, width: "100px" },
      { name: "Rejected", selector: (row) => row.rejected, sortable: true, right: true, width: "100px" },
      { name: "Total", selector: (row) => row.total, sortable: true, right: true, width: "100px" },
      { name: "Unique Attendees", selector: (row) => row.unique_attendees, sortable: true, right: true, width: "160px" },
      { name: "Response Rate", selector: (row) => row.response_rate, sortable: true, right: true, width: "140px" },
      {
        name: "Event Date",
        selector: (row) => row.event_date,
        sortable: true,
        width: "180px",
        cell: (row) => formatDateTime(row.event_date.replace(" ", "T")),
      },
      {
        name: "Created Date",
        selector: (row) => row.event_created_date,
        sortable: true,
        width: "180px",
        cell: (row) => formatDateTime(row.event_created_date.replace(" ", "T")),
      },
    ],
    [formatDateTime]
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-6xl">
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <div></div>
        <h2 className="text-responsive-base font-bold text-primary">{title}</h2>
        <button onClick={onClose} className="text-placeholderbg hover:text-primary transition-colors text-responsive-xs">Close</button>
      </div>

      <div className="p-6">
        <div className="bg-white rounded-xl border border-gray-100">
          <DataTable
            columns={columns}
            data={data}
            pagination
            className="font-sans"
            customStyles={{
              table: { style: { fontFamily: "inherit" } },
              headRow: { style: { fontFamily: "inherit" } },
              headCells: { style: { fontFamily: "inherit" } },
              rows: { style: { fontFamily: "inherit" } },
              cells: { style: { fontFamily: "inherit" } },
            }}
          />
        </div>
      </div>
    </Modal>
  );
}
