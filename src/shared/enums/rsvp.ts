export enum RSVPCategory {
  Joined = "joined",
  Pending = "pending",
  Reject = "rejected",
}

export const RSVP_LABELS: string[] = ["Joined", "Pending", "Reject"];

export type RsvpCounts = { joined: number; pending: number; rejected: number };

export const buildRsvpSeries = (counts: RsvpCounts): number[] => [
  counts.joined,
  counts.pending,
  counts.rejected,
];
