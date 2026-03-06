"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { getAdminStats, getRangeForPreset, searchUsersByEmail, getUserVisitHistory, setUserBlocked } from "@/lib/adminService";
import type { AdminStats, DateRange, RangePreset, UserSearchResult } from "@/types/analytics";

export function useAdminStats() {
  const [preset,  setPresetState] = useState<RangePreset>("today");
  const [range,   setRange]       = useState<DateRange>(getRangeForPreset("today"));
  const [stats,   setStats]       = useState<AdminStats | null>(null);
  const [loading, setLoading]     = useState(true);
  const [error,   setError]       = useState<string | null>(null);

  const load = useCallback(async (r: DateRange) => {
    setLoading(true); setError(null);
    try { setStats(await getAdminStats(r)); }
    catch (err) { console.error(err); setError("Failed to load stats. Check Firestore indexes."); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(range); }, [range, load]);

  const setPreset = useCallback((p: RangePreset) => {
    if (p === "custom") { setPresetState("custom"); return; }
    setPresetState(p);
    setRange(getRangeForPreset(p as "today"|"week"|"month"));
  }, []);

  const setCustomRange = useCallback((r: DateRange) => { setPresetState("custom"); setRange(r); }, []);
  const refresh = useCallback(() => load(range), [load, range]);

  return { stats, loading, error, preset, range, setPreset, setCustomRange, refresh };
}

export function useUserSearch() {
  const [query,          setQueryState]    = useState("");
  const [results,        setResults]       = useState<UserSearchResult[]>([]);
  const [searching,      setSearching]     = useState(false);
  const [selectedUser,   setSelectedUser]  = useState<UserSearchResult | null>(null);
  const [visitHistory,   setVisitHistory]  = useState<{id:string;reason:string;timestamp:Date}[]>([]);
  const [historyLoading, setHistoryLoading]= useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>|null>(null);

  const setQuery = useCallback((q: string) => {
    setQueryState(q);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!q.trim()) { setResults([]); return; }
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try { setResults(await searchUsersByEmail(q.trim().toLowerCase())); }
      catch (err) { console.error(err); }
      finally { setSearching(false); }
    }, 400);
  }, []);

  const selectUser = useCallback(async (u: UserSearchResult) => {
    setSelectedUser(u); setHistoryLoading(true);
    try { setVisitHistory(await getUserVisitHistory(u.uid)); }
    catch (err) { console.error(err); }
    finally { setHistoryLoading(false); }
  }, []);

  const clearSelected = useCallback(() => { setSelectedUser(null); setVisitHistory([]); }, []);

  const toggleBlock = useCallback(async (uid: string, blocked: boolean) => {
    await setUserBlocked(uid, blocked);
    setResults((prev) => prev.map((r) => r.uid===uid ? {...r,isBlocked:blocked} : r));
    if (selectedUser?.uid===uid) setSelectedUser((prev) => prev ? {...prev,isBlocked:blocked} : prev);
  }, [selectedUser]);

  return { query, setQuery, results, searching, selectedUser, visitHistory, historyLoading, selectUser, clearSelected, toggleBlock };
}
