"use client";

import { useState, useCallback } from "react";
import { useUserSearch } from "@/hooks/useAdminDashboard";
import { useBlockAction } from "@/hooks/useBlockAction";
import { getBlockHistory, type BlockEvent } from "@/lib/blockService";
import BlockModal from "@/components/admin/BlockModal";
import { BlockBadge, BlockToggleButton } from "@/components/ui/BlockBadge";
import type { UserSearchResult } from "@/types/analytics";

type DetailTab = "history" | "blockLog";

function Avatar({ name, size=36 }: { name: string; size?: number }) {
  return (
    <div className="rounded-full flex items-center justify-center font-bold text-white flex-shrink-0"
         style={{ width:size, height:size, fontSize:size*0.38, background:"linear-gradient(135deg,#7B1C2E,#C9A84C)" }}>
      {name?.[0]?.toUpperCase()??"?"}
    </div>
  );
}

export default function UserSearchPanel() {
  const { query, setQuery, results, searching, selectedUser, visitHistory, historyLoading, selectUser, clearSelected, toggleBlock } = useUserSearch();
  const [activeTab,  setActiveTab]  = useState<DetailTab>("history");
  const [blockLog,   setBlockLog]   = useState<BlockEvent[]>([]);
  const [logLoading, setLogLoading] = useState(false);

  const loadBlockLog = useCallback(async (uid: string) => {
    setLogLoading(true);
    try { setBlockLog(await getBlockHistory(uid)); }
    catch (err) { console.error(err); }
    finally { setLogLoading(false); }
  }, []);

  const handleTabChange = (tab: DetailTab) => {
    setActiveTab(tab);
    if (tab==="blockLog" && selectedUser) loadBlockLog(selectedUser.uid);
  };

  const onBlockSuccess = useCallback((uid: string, blocked: boolean) => {
    toggleBlock(uid, blocked);
    if (selectedUser?.uid===uid && activeTab==="blockLog") loadBlockLog(uid);
  }, [toggleBlock, selectedUser, activeTab, loadBlockLog]);

  const { modal, reason, setReason, submitting, error: blockError, openBlock, openUnblock, closeModal, confirmAction } = useBlockAction(onBlockSuccess);
  const handleToggle = (user: UserSearchResult) => user.isBlocked ? openUnblock(user) : openBlock(user);

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-800 mb-3">User Lookup</h2>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
            <input type="text" value={query} onChange={(e)=>setQuery(e.target.value)}
                   placeholder="Search by institutional email…"
                   className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm
                              text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-neu-maroon"/>
            {searching && (
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                <svg className="animate-spin h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
              </div>
            )}
          </div>
        </div>

        {!selectedUser && (
          <div className="divide-y divide-gray-50 max-h-80 overflow-y-auto">
            {results.length===0 && query.length>0 && !searching && (
              <p className="text-sm text-gray-400 text-center py-8">No users found for "{query}"</p>
            )}
            {results.length===0 && query.length===0 && (
              <p className="text-sm text-gray-400 text-center py-8">Type an email address to search for a visitor.</p>
            )}
            {results.map((user) => (
              <div key={user.uid} className="flex items-center gap-3 px-6 py-3.5 hover:bg-gray-50 transition-colors">
                <button onClick={()=>{ setActiveTab("history"); selectUser(user); }}
                        className="flex items-center gap-3 flex-1 min-w-0 text-left">
                  <Avatar name={user.fullName}/>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-gray-800 truncate">{user.fullName}</span>
                      <BlockBadge isBlocked={user.isBlocked}/>
                    </div>
                    <div className="text-xs text-gray-400 truncate">{user.email}</div>
                  </div>
                  <div className="text-right flex-shrink-0 mr-2">
                    <div className="text-sm font-semibold text-gray-700">{user.totalVisits}</div>
                    <div className="text-[10px] text-gray-400">visits</div>
                  </div>
                </button>
                <BlockToggleButton isBlocked={user.isBlocked} onClick={()=>handleToggle(user)} compact/>
              </div>
            ))}
          </div>
        )}

        {selectedUser && (
          <div>
            <div className="flex items-center gap-3 px-6 py-4 bg-gray-50 border-b border-gray-100">
              <button onClick={()=>{ clearSelected(); setBlockLog([]); }}
                      className="text-gray-400 hover:text-gray-600 text-xl leading-none">←</button>
              <Avatar name={selectedUser.fullName} size={42}/>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-gray-800">{selectedUser.fullName}</span>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full
                    ${selectedUser.role==="admin"?"bg-amber-50 text-amber-600":"bg-blue-50 text-blue-600"}`}>
                    {selectedUser.role.toUpperCase()}
                  </span>
                  <BlockBadge isBlocked={selectedUser.isBlocked} blockReason={selectedUser.blockReason} size="md"/>
                </div>
                <div className="text-xs text-gray-400 truncate">{selectedUser.email}</div>
                <div className="text-xs text-gray-400 truncate">{selectedUser.college_office}</div>
              </div>
              <BlockToggleButton isBlocked={selectedUser.isBlocked} onClick={()=>handleToggle(selectedUser)}/>
            </div>

            {selectedUser.isBlocked && selectedUser.blockReason && (
              <div className="mx-6 mt-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5">
                <span className="text-red-400 mt-0.5 flex-shrink-0">⊘</span>
                <div>
                  <p className="text-xs font-semibold text-red-700 mb-0.5">Block Reason</p>
                  <p className="text-sm text-red-600">{selectedUser.blockReason}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-3 divide-x divide-gray-100 border-y border-gray-100 mt-4">
              {[
                { label:"Total Visits", value:selectedUser.totalVisits },
                { label:"Last Visit",   value:selectedUser.lastVisit?.toLocaleDateString("en-PH",{month:"short",day:"numeric"})??"—" },
                { label:"Status",       value:selectedUser.isBlocked?"Blocked":"Active" },
              ].map(({label,value})=>(
                <div key={label} className="px-4 py-3 text-center">
                  <div className="text-base font-bold text-gray-800" style={{ fontFamily:"'Playfair Display',serif" }}>{value}</div>
                  <div className="text-[10px] text-gray-400 uppercase tracking-wide">{label}</div>
                </div>
              ))}
            </div>

            <div className="flex border-b border-gray-100">
              {([{id:"history",label:"Visit History"},{id:"blockLog",label:"Block Log"}] as {id:DetailTab;label:string}[]).map((tab)=>(
                <button key={tab.id} onClick={()=>handleTabChange(tab.id)}
                        className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider border-b-2 -mb-px transition-colors
                          ${activeTab===tab.id?"border-neu-maroon text-neu-maroon":"border-transparent text-gray-400 hover:text-gray-600"}`}>
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab==="history" && (
              <div className="max-h-56 overflow-y-auto">
                {historyLoading ? (
                  <div className="space-y-2 px-6 py-4">{[1,2,3].map((i)=><div key={i} className="h-8 bg-gray-100 rounded-lg animate-pulse"/>)}</div>
                ) : visitHistory.length===0 ? (
                  <p className="text-sm text-gray-400 text-center py-8">No visit history yet.</p>
                ) : (
                  <table className="w-full text-sm">
                    <thead><tr className="bg-gray-50">
                      <th className="px-6 py-2 text-left text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Date & Time</th>
                      <th className="px-6 py-2 text-left text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Purpose</th>
                    </tr></thead>
                    <tbody className="divide-y divide-gray-50">
                      {visitHistory.map((log)=>(
                        <tr key={log.id} className="hover:bg-gray-50">
                          <td className="px-6 py-2.5 text-gray-600 text-xs">
                            {log.timestamp.toLocaleString("en-PH",{month:"short",day:"numeric",year:"numeric",hour:"numeric",minute:"2-digit",hour12:true})}
                          </td>
                          <td className="px-6 py-2.5">
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                              {({"Reading":"📖","Research":"🔬","Computer Use":"💻","Studying":"✏️"} as Record<string,string>)[log.reason]??"•"} {log.reason}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {activeTab==="blockLog" && (
              <div className="max-h-56 overflow-y-auto">
                {logLoading ? (
                  <div className="space-y-2 px-6 py-4">{[1,2].map((i)=><div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse"/>)}</div>
                ) : blockLog.length===0 ? (
                  <p className="text-sm text-gray-400 text-center py-8">No block events recorded.</p>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {blockLog.map((event)=>(
                      <div key={event.id} className="px-6 py-3.5 flex items-start gap-3">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5
                          ${event.action==="blocked"?"bg-red-100 text-red-600":"bg-green-100 text-green-600"}`}>
                          {event.action==="blocked"?"⊘":"✓"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-xs font-semibold capitalize ${event.action==="blocked"?"text-red-600":"text-green-600"}`}>{event.action}</span>
                            <span className="text-xs text-gray-400">
                              {event.timestamp.toLocaleString("en-PH",{month:"short",day:"numeric",year:"numeric",hour:"numeric",minute:"2-digit",hour12:true})}
                            </span>
                          </div>
                          {event.reason && <p className="text-xs text-gray-500 mt-0.5 truncate">{event.reason}</p>}
                          <p className="text-[10px] text-gray-400 mt-0.5">by admin: {event.adminUid.slice(0,8)}…</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      <BlockModal open={modal.open} user={modal.open?modal.user:null} intent={modal.open?modal.intent:"block"}
                  reason={reason} onReasonChange={setReason} submitting={submitting} error={blockError}
                  onConfirm={confirmAction} onClose={closeModal}/>
    </>
  );
}
