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
const sel = { fontFamily: "'DM Sans',sans-serif", padding: "7px 10px", border: "1px solid #E5E7EB", borderRadius: 6, fontSize: 12, color: "#374151", background: "#F9FAFB", cursor: "pointer", outline: "none" };

const STATS = [
  { title: "Active Jobs", value: "12", change: "+2 this week", trend: "up", icon: Ico.briefcase, bg: "#F3F4F6", text: "#111827" },
  { title: "Total Applicants", value: "845", change: "+15% vs last month", trend: "up", icon: Ico.users, bg: "#FEF3C7", text: "#D97706" },
  { title: "Interviews", value: "48", change: "-5% vs last month", trend: "down", icon: Ico.calendar, bg: "#DBEAFE", text: "#2563EB" },
  { title: "Profile Views", value: "2.4k", change: "+22% vs last month", trend: "up", icon: Ico.trending, bg: "#EDE9FE", text: "#7C3AED" },
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
    <div style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif", background: "#F9FAFB", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500;600&display=swap');*{box-sizing:border-box}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#E5E7EB;border-radius:4px}`}</style>

      {/* Top bar */}
      <div style={{ background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#111827" }}>Reports & Analytics</h1>
          <p style={{ margin: 0, fontSize: 12, color: "#9CA3AF", fontFamily: "'DM Mono',monospace" }}>Track hiring performance</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <select value={timeRange} onChange={e => setTimeRange(e.target.value)} style={sel}>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 3 Months</option>
            <option value="1y">This Year</option>
          </select>
          <button style={{ ...sel, background: "#fff", display: "flex", alignItems: "center", gap: 6, fontWeight: 600 }}>
            {Ico.download} Export CSV
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 24 }}>
        
        {/* Overview Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
          {STATS.map((stat, i) => (
            <div key={i} style={{ background: "#fff", border: "1.5px solid #E5E7EB", borderRadius: 10, padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div style={{ background: stat.bg, color: stat.text, padding: 8, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {stat.icon}
                </div>
              </div>
              <p style={{ margin: "0 0 4px", fontSize: 12, fontWeight: 600, color: "#6B7280" }}>{stat.title}</p>
              <p style={{ margin: "0 0 8px", fontSize: 24, fontWeight: 700, color: "#111827", fontFamily: "'DM Mono',monospace" }}>{stat.value}</p>
              <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: stat.trend === "up" ? "#059669" : "#DC2626" }}>{stat.change}</p>
            </div>
          ))}
        </div>

        {/* Charts Area */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
          <div style={{ background: "#fff", border: "1.5px solid #E5E7EB", borderRadius: 10, minHeight: 400, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textContent: "center" }}>
            <div style={{ color: "#D1D5DB", marginBottom: 16 }}>{Ico.chart}</div>
            <p style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "#111827" }}>Applicant Trends</p>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#6B7280", maxWidth: 300, textAlign: "center" }}>Interactive charts will be available once data integration is complete.</p>
          </div>

          <div style={{ background: "#fff", border: "1.5px solid #E5E7EB", borderRadius: 10, padding: 20 }}>
            <h3 style={{ margin: "0 0 20px", fontSize: 14, fontWeight: 700, color: "#111827", textTransform: "uppercase", letterSpacing: "0.05em" }}>Top Job Postings</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {TOP_JOBS.map((job, idx) => (
                <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 16, borderBottom: idx < TOP_JOBS.length - 1 ? "1px solid #E5E7EB" : "none" }}>
                  <div>
                    <p style={{ margin: "0 0 4px", fontSize: 13, fontWeight: 600, color: "#111827" }}>{job.role}</p>
                    <p style={{ margin: 0, fontSize: 11, color: "#6B7280", fontFamily: "'DM Mono',monospace" }}>{job.views} views</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ margin: "0 0 2px", fontSize: 14, fontWeight: 700, color: "#111827", fontFamily: "'DM Mono',monospace" }}>{job.apps}</p>
                    <p style={{ margin: 0, fontSize: 10, color: "#9CA3AF", textTransform: "uppercase" }}>Applicants</p>
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
