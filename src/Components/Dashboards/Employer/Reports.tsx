import { useState } from "react";

// ── Icons ──────────────────────────────────────────────────────────────────────
const I = (d: string, s = 14, fill = "none") => <svg width={s} height={s} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: d }} />;
const Ico = {
  briefcase: I('<rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>', 16),
  users: I('<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>', 16),
  calendar: I('<rect width="18" height="18" x="3" y="4" rx="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/>', 16),
  trending: I('<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>', 16),
  chart: I('<line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/>', 28),
  download: I('<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>', 14)
};

// ── Shared styles ──────────────────────────────────────────────────────────────
const selClass = "font-sans px-2.5 py-[7px] border border-gray-200 rounded-md text-sm text-gray-700 bg-gray-50 cursor-pointer outline-none focus:bg-white focus:border-gray-300 transition-colors";

const STATS = [
  { title: "Active Jobs", value: "12", change: "+2 this week", trend: "up", icon: Ico.briefcase, bgClass: "bg-gray-100", textClass: "text-gray-900" },
  { title: "Total Applicants", value: "845", change: "+15% vs last month", trend: "up", icon: Ico.users, bgClass: "bg-amber-100", textClass: "text-amber-600" },
  { title: "Interviews", value: "48", change: "-5% vs last month", trend: "down", icon: Ico.calendar, bgClass: "bg-blue-100", textClass: "text-blue-600" },
  { title: "Profile Views", value: "2.4k", change: "+22% vs last month", trend: "up", icon: Ico.trending, bgClass: "bg-purple-100", textClass: "text-purple-600" },
];

const TOP_JOBS = [
  { role: "Senior Frontend Developer", views: "1.2k", apps: 45 },
  { role: "Product Designer", views: "850", apps: 12 },
  { role: "Backend Engineer", views: "620", apps: 89 },
];

// ── Main ───────────────────────────────────────────────────────────────────────
export default function Reports() {
  const [timeRange, setTimeRange] = useState("30d");

  return (
    <div className="font-sans bg-gray-50 min-h-screen flex flex-col">

      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3.5 flex items-center justify-between">
        <div>
          <h1 className="m-0 text-xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="m-0 text-sm text-gray-400 font-mono">Track hiring performance</p>
        </div>
        <div className="flex gap-2.5">
          <select value={timeRange} onChange={e => setTimeRange(e.target.value)} className={selClass}>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 3 Months</option>
            <option value="1y">This Year</option>
          </select>
          <button className={`${selClass} bg-white flex items-center gap-1.5 font-semibold hover:bg-gray-50`}>
            {Ico.download} Export CSV
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col gap-6">
        
        {/* Overview Stats */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
          {STATS.map((stat, i) => (
            <div key={i} className="bg-white border-[1.5px] border-gray-200 rounded-[10px] p-5">
              <div className="flex justify-between items-start mb-4">
                <div className={`${stat.bgClass} ${stat.textClass} p-2 rounded-lg flex items-center justify-center`}>
                  {stat.icon}
                </div>
              </div>
              <p className="m-[0_0_4px] text-sm font-semibold text-gray-500">{stat.title}</p>
              <p className="m-[0_0_8px] text-[26px] font-bold text-gray-900 font-mono">{stat.value}</p>
              <p className={`m-0 text-[13px] font-semibold ${stat.trend === "up" ? "text-emerald-600" : "text-red-600"}`}>{stat.change}</p>
            </div>
          ))}
        </div>

        {/* Charts Area */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4">
          <div className="bg-white border-[1.5px] border-gray-200 rounded-[10px] min-h-[400px] flex flex-col items-center justify-center text-center p-6">
            <div className="text-gray-300 mb-4">{Ico.chart}</div>
            <p className="m-0 text-lg font-semibold text-gray-900">Applicant Trends</p>
            <p className="m-[4px_0_0] text-[15px] text-gray-500 max-w-[300px] text-center">Interactive charts will be available once data integration is complete.</p>
          </div>

          <div className="bg-white border-[1.5px] border-gray-200 rounded-[10px] p-5">
            <h3 className="m-[0_0_20px] text-base font-bold text-gray-900 uppercase tracking-[0.05em]">Top Job Postings</h3>
            <div className="flex flex-col gap-4">
              {TOP_JOBS.map((job, idx) => (
                <div key={idx} className={`flex justify-between items-center pb-4 ${idx < TOP_JOBS.length - 1 ? "border-b border-gray-200" : "border-none"}`}>
                  <div>
                    <p className="m-[0_0_4px] text-[15px] font-semibold text-gray-900">{job.role}</p>
                    <p className="m-0 text-[13px] text-gray-500 font-mono">{job.views} views</p>
                  </div>
                  <div className="text-right">
                    <p className="m-[0_0_2px] text-base font-bold text-gray-900 font-mono">{job.apps}</p>
                    <p className="m-0 text-xs text-gray-400 uppercase">Applicants</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
