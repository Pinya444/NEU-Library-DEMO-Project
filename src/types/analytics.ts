import type { VisitReason } from "./visitLog";

export type RangePreset = "today" | "week" | "month" | "custom";

export interface DateRange {
  from: Date;
  to:   Date;
}

export interface CollegeBreakdown {
  college_office: string;
  count:          number;
  percentage:     number;
}

export interface ReasonBreakdown {
  reason:     VisitReason;
  count:      number;
  percentage: number;
}

export interface DailyCount {
  date:  string;
  count: number;
}

export interface AdminStats {
  totalVisits:      number;
  uniqueVisitors:   number;
  topReason:        VisitReason | null;
  collegeBreakdown: CollegeBreakdown[];
  reasonBreakdown:  ReasonBreakdown[];
  dailyCounts:      DailyCount[];
  comparedToLast:   number | null;
}

export interface UserSearchResult {
  uid:            string;
  fullName:       string;
  email:          string;
  college_office: string;
  role:           string;
  isBlocked:      boolean;
  blockReason?:   string;
  totalVisits:    number;
  lastVisit:      Date | null;
}
