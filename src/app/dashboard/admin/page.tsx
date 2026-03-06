"use client";

import AuthGuard           from "@/components/AuthGuard";
import StatCard            from "@/components/admin/StatCard";
import DateRangePicker     from "@/components/admin/DateRangePicker";
import CollegeBreakdownChart from "@/components/admin/CollegeBreakdownChart";
import ReasonDonutChart    from "@/components/admin/ReasonDonutChart";
import TrendSparkline      from "@/components/admin/TrendSparkline";
import UserSearchPanel     from "@/components/admin/UserSearchPanel";
import { useAdminStats }   from "@/hooks/useAdminDashboard";
import { useAuth }         from "@/hooks/useAuth";

function rangeLabel(preset: string, from: Date, to: Date) {
  if (preset==="today") return "Today";
  if (preset==="week")  return "This week";
  if (preset==="month") return "This month";
  const fmt=(d:Date)=>d.toLocaleDateString("en-PH",{month:"short",day:"numeric"});
  return `${fmt(from)} – ${fmt(to)}`;
}

function AdminDashboardContent() {
  const { neuUser, signOut } = useAuth();
  const { stats, loading, error, preset, range, setPreset, setCustomRange, refresh } = useAdminStats();
  const now = new Date();

  return (
    <div className="min-h-screen" style={{ background:"linear-gradient(160deg,#FAF6F0 0%,#F2EAE0 100%)" }}>
      <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-3.5 border-b border-white/60 backdrop-blur-md"
              style={{ background:"rgba(250,246,240,0.85)" }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
               style={{ background:"linear-gradient(135deg,#7B1C2E,#C9A84C)" }}>📖</div>
          <div>
            <span className="font-semibold text-sm text-gray-800">NEU Library</span>
            <span className="text-gray-400 text-sm"> · Admin</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background:"#2E7D52" }}/>
          <span className="text-xs text-gray-400">Live</span>
          <button onClick={refresh} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 text-sm">↻</button>
          <button onClick={signOut} className="text-xs text-gray-400 hover:text-gray-700">Sign out</button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily:"'Playfair Display',serif" }}>
              Library Dashboard
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              {now.toLocaleDateString("en-PH",{weekday:"long",month:"long",day:"numeric",year:"numeric"})}
              {neuUser && ` · Welcome, ${neuUser.fullName.split(" ")[0]}`}
            </p>
          </div>
          <DateRangePicker preset={preset} range={range} onPresetChange={setPreset} onCustomRange={setCustomRange}/>
        </div>

        {error && (
          <div className="px-5 py-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-2">
            ⚠️ {error}
          </div>
        )}

        <section>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
            {rangeLabel(preset,range.from,range.to)} · Summary
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Total Visits"    value={stats?.totalVisits??0}
                      sub={stats?.comparedToLast!=null?(stats.comparedToLast>=0?"+":"")+stats.comparedToLast+"% vs prior":"No prior data"}
                      icon="👥" accent="#7B1C2E" delay={0} trend={stats?.comparedToLast??null} loading={loading}/>
            <StatCard label="Unique Visitors" value={stats?.uniqueVisitors??0}
                      sub="Distinct library users" icon="🎓" accent="#1A5C8A" delay={80} loading={loading}/>
            <StatCard label="Top Purpose"
                      value={stats?.topReason?`${{Reading:"📖",Research:"🔬","Computer Use":"💻",Studying:"✏️"}[stats.topReason]??""} ${stats.topReason}`:"—"}
                      sub={stats?.reasonBreakdown[0]?`${stats.reasonBreakdown[0].percentage}% of all visits`:"No data yet"}
                      icon="📊" accent="#C9A84C" delay={160} loading={loading}/>
            <StatCard label="Top College"
                      value={stats?.collegeBreakdown[0]?.college_office.replace("College of ","").replace(" Administration"," Admin")??"—"}
                      sub={stats?.collegeBreakdown[0]?`${stats.collegeBreakdown[0].count} visits (${stats.collegeBreakdown[0].percentage}%)`:"No data yet"}
                      icon="🏛️" accent="#2E7D52" delay={240} loading={loading}/>
          </div>
        </section>

        {!loading && stats && stats.dailyCounts.length>1 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Visit Trend</p>
              <p className="text-sm text-gray-600">{stats.dailyCounts.length}-day period · {stats.totalVisits} total visits</p>
            </div>
            <TrendSparkline data={stats.dailyCounts} color="#7B1C2E" width={240} height={48}/>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          <CollegeBreakdownChart data={stats?.collegeBreakdown??[]} loading={loading}/>
          <ReasonDonutChart      data={stats?.reasonBreakdown??[]}  loading={loading}/>
        </div>

        <section>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">User Lookup</p>
          <UserSearchPanel/>
        </section>
      </main>
    </div>
  );
}

export default function AdminDashboardPage() {
  return <AuthGuard requiredRole="admin"><AdminDashboardContent/></AuthGuard>;
}
