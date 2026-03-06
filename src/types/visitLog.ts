import type { Timestamp } from "firebase/firestore";

export const VISIT_REASONS = [
  "Reading",
  "Research",
  "Computer Use",
  "Studying",
] as const;

export type VisitReason = (typeof VISIT_REASONS)[number];

export interface VisitLogDoc {
  uid:            string;
  userEmail:      string;
  fullName:       string;
  college_office: string;
  reason:         VisitReason;
  timestamp:      Timestamp;
}

export interface VisitLog extends Omit<VisitLogDoc, "timestamp"> {
  id:        string;
  timestamp: Date;
}
