import {
  collection, query, where, orderBy,
  getDocs, Timestamp, doc, updateDoc, limit,
} from "firebase/firestore";
import { db } from "./firebase";
import type { VisitLogDoc, VisitReason } from "@/types/visitLog";
import type { AdminStats, DateRange, CollegeBreakdown, ReasonBreakdown, DailyCount, UserSearchResult } from "@/types/analytics";
import type { UserDoc } from "@/types/user";

const LOGS_COL  = "logs";
const USERS_COL = "users";

export function getRangeForPreset(preset: "today" | "week" | "month"): DateRange {
  const now = new Date(); const from = new Date();
  if (preset === "today") { from.setHours(0,0,0,0); }
  else if (preset === "week") { from.setDate(now.getDate()-6); from.setHours(0,0,0,0); }
  else { from.setDate(1); from.setHours(0,0,0,0); }
  return { from, to: now };
}

function getPriorRange(range: DateRange): DateRange {
  const span = range.to.getTime() - range.from.getTime();
  return { from: new Date(range.from.getTime()-span), to: new Date(range.from.getTime()-1) };
}

async function fetchLogs(range: DateRange): Promise<VisitLogDoc[]> {
  const q = query(
    collection(db, LOGS_COL),
    where("timestamp", ">=", Timestamp.fromDate(range.from)),
    where("timestamp", "<=", Timestamp.fromDate(range.to)),
    orderBy("timestamp", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as VisitLogDoc);
}

export async function getAdminStats(range: DateRange): Promise<AdminStats> {
  const [logs, priorLogs] = await Promise.all([fetchLogs(range), fetchLogs(getPriorRange(range))]);
  const totalVisits    = logs.length;
  const uniqueVisitors = new Set(logs.map((l) => l.uid)).size;
  const reasonCounts: Record<string,number> = {};
  for (const log of logs) reasonCounts[log.reason] = (reasonCounts[log.reason]??0)+1;
  const reasonBreakdown: ReasonBreakdown[] = Object.entries(reasonCounts)
    .sort((a,b)=>b[1]-a[1])
    .map(([reason,count])=>({ reason: reason as VisitReason, count, percentage: totalVisits?Math.round((count/totalVisits)*100):0 }));
  const collegeCounts: Record<string,number> = {};
  for (const log of logs) collegeCounts[log.college_office]=(collegeCounts[log.college_office]??0)+1;
  const collegeBreakdown: CollegeBreakdown[] = Object.entries(collegeCounts)
    .sort((a,b)=>b[1]-a[1])
    .map(([college_office,count])=>({ college_office, count, percentage: totalVisits?Math.round((count/totalVisits)*100):0 }));
  const dailyMap: Record<string,number> = {};
  for (const log of logs) {
    const ts=(log.timestamp as unknown as Timestamp).toDate();
    const key=ts.toISOString().slice(0,10);
    dailyMap[key]=(dailyMap[key]??0)+1;
  }
  const dailyCounts: DailyCount[] = Object.entries(dailyMap).sort((a,b)=>a[0].localeCompare(b[0])).map(([date,count])=>({date,count}));
  const comparedToLast = priorLogs.length>0 ? Math.round(((totalVisits-priorLogs.length)/priorLogs.length)*100) : null;
  return { totalVisits, uniqueVisitors, topReason: reasonBreakdown[0]?.reason??null, collegeBreakdown, reasonBreakdown, dailyCounts, comparedToLast };
}

export async function searchUsersByEmail(emailFragment: string): Promise<UserSearchResult[]> {
  if (!emailFragment.trim()) return [];
  const lower = emailFragment.toLowerCase();
  const q = query(collection(db, USERS_COL), where("email",">=",lower), where("email","<=",lower+"\uf8ff"), limit(20));
  const snap = await getDocs(q);
  return Promise.all(snap.docs.map(async (docSnap) => {
    const data = docSnap.data() as UserDoc & { isBlocked?: boolean; blockReason?: string };
    const uid  = docSnap.id;
    const logsQ    = query(collection(db,LOGS_COL),where("uid","==",uid),orderBy("timestamp","desc"),limit(1));
    const countQ   = query(collection(db,LOGS_COL),where("uid","==",uid));
    const [logsSnap, countSnap] = await Promise.all([getDocs(logsQ), getDocs(countQ)]);
    const lastVisitTs = logsSnap.empty ? null : (logsSnap.docs[0].data().timestamp as Timestamp).toDate();
    return { uid, fullName:data.fullName, email:data.email, college_office:data.college_office, role:data.role, isBlocked:data.isBlocked??false, blockReason:data.blockReason??"", totalVisits:countSnap.size, lastVisit:lastVisitTs } satisfies UserSearchResult;
  }));
}

export async function getUserVisitHistory(uid: string, limitN=50) {
  const q = query(collection(db,LOGS_COL),where("uid","==",uid),orderBy("timestamp","desc"),limit(limitN));
  const snap = await getDocs(q);
  return snap.docs.map((d)=>{ const data=d.data() as VisitLogDoc; return { id:d.id, reason:data.reason, timestamp:(data.timestamp as unknown as Timestamp).toDate() }; });
}

export async function setUserBlocked(uid: string, blocked: boolean): Promise<void> {
  await updateDoc(doc(db, USERS_COL, uid), { isBlocked: blocked });
}
