import { useMemo } from "react";
import DashboardCharts from "./Charts/DashboardCharts";

// ── Icons ──────────────────────────────────────────────────────────────────────
const I = (d: string, s = 14, fill = "none") => <svg width={s} height={s} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: d }} />;
const Ico = {
  briefcase: I('<rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>', 16),
  users: I('<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>', 16),
  trending: I('<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>', 16)
};

const STATS = [
  { title: "Active Jobs", value: "12", icon: Ico.briefcase, bg: "#F3F4F6", text: "#111827" },
  { title: "Total Applicants", value: "845", icon: Ico.users, bg: "#FEF3C7", text: "#D97706" },
  { title: "Profile Views", value: "2.4k", icon: Ico.trending, bg: "#EDE9FE", text: "#7C3AED" },
];

export default function EmployerDashboardHome() {
  const lineData = useMemo(() => ({
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Applications",
        data: [12, 19, 14, 20, 25, 30],
        borderColor: "#111827",
        backgroundColor: "#111827",
      },
    ],
  }), []);

  const barData = useMemo(() => ({
    labels: ["Job A", "Job B", "Job C", "Job D"],
    datasets: [
      {
        label: "Applications",
        data: [12, 9, 15, 7],
        backgroundColor: "#111827",
      },
    ],
  }), []);

  return (
    <div style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif", background: "#F9FAFB", minHeight: "100vh", padding: 24, display: "flex", flexDirection: "column", gap: 24 }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500;600&display=swap');*{box-sizing:border-box}`}</style>

      {/* Overview Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
        {STATS.map((stat, i) => (
          <div key={i} style={{ background: "#fff", border: "1.5px solid #E5E7EB", borderRadius: 10, padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div style={{ background: stat.bg, color: stat.text, padding: 8, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {stat.icon}
              </div>
            </div>
            <p style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 600, color: "#6B7280" }}>{stat.title}</p>
            <p style={{ margin: "0 0 8px", fontSize: 28, fontWeight: 700, color: "#111827", fontFamily: "'DM Mono',monospace" }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Area */}
      <div style={{ background: "#fff", border: "1.5px solid #E5E7EB", borderRadius: 10, padding: 20 }}>
         <h3 style={{ margin: "0 0 20px", fontSize: 16, fontWeight: 700, color: "#111827" }}>Analytics Overview</h3>
         <DashboardCharts lineData={lineData} barData={barData} />
      </div>

    </div>
  );
}