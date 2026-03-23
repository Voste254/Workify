import { useState, useMemo } from "react";

// ── Types & Config ─────────────────────────────────────────────────────────────
type JobStatus = "active" | "closed" | "draft";

interface Job {
  id: string; title: string; location: string; type: string;
  createdAt: string; lastUpdated: string; applicantsCount: number;
  status: JobStatus; department: string; isHot: boolean;
}

const STATUS_CONFIG: Record<JobStatus, { label: string; color: string; bg: string }> = {
  active: { label: "Active", color: "#059669", bg: "#D1FAE5" },
  closed: { label: "Closed", color: "#FFFFFF", bg: "#DC2626" },
  draft:  { label: "Draft", color: "#6B7280", bg: "#F3F4F6" },
};

// ── Mock Data ──────────────────────────────────────────────────────────────────
const MOCK_JOBS: Job[] = [
  { id: "1", title: "Senior Frontend Developer", location: "San Francisco, CA (Remote)", type: "Full-time", createdAt: "2025-02-15", lastUpdated: "2025-03-08", applicantsCount: 45, status: "active", department: "Engineering", isHot: true },
  { id: "2", title: "Product Designer", location: "New York, NY", type: "Contract", createdAt: "2025-02-20", lastUpdated: "2025-03-05", applicantsCount: 12, status: "active", department: "Design", isHot: false },
  { id: "3", title: "Backend Engineer", location: "Remote", type: "Full-time", createdAt: "2025-01-10", lastUpdated: "2025-02-28", applicantsCount: 89, status: "closed", department: "Engineering", isHot: false },
  { id: "4", title: "Marketing Manager", location: "Chicago, IL", type: "Full-time", createdAt: "2025-03-09", lastUpdated: "2025-03-09", applicantsCount: 0, status: "draft", department: "Marketing", isHot: false },
  { id: "5", title: "Data Analyst", location: "Austin, TX", type: "Full-time", createdAt: "2025-02-25", lastUpdated: "2025-03-02", applicantsCount: 34, status: "active", department: "Data", isHot: false },
];

// ── Helpers ────────────────────────────────────────────────────────────────────
const fmtDate = (d: string) => new Date(d).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" });
const daysAgo = (d: string) => { const n = Math.floor((Date.now() - new Date(d).getTime()) / 86400000); return n === 0 ? "Today" : n === 1 ? "Yesterday" : `${n}d ago`; };

// ── Icons ──────────────────────────────────────────────────────────────────────
const I = (d: string, s = 14, fill = "none") => <svg width={s} height={s} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: d }} />;
const Ico = {
  search: I('<circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>', 14),
  location: I('<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>', 12),
  users: I('<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>', 12),
  close: I('<path d="M18 6 6 18"/><path d="m6 6 12 12"/>', 14),
  edit: I('<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>', 12),
  fire: I('<path d="M15.2 3a2 2 0 0 1 1.4.6 2 2 0 0 1 .6 1.4c0 1.2-1.2 2.8-2.6 4.3C13.2 10.8 12 12.3 12 14c0 1.7 1.3 3 3 3s3-1.3 3-3c0-.6-.2-1.2-.5-1.7a2 2 0 0 1 2.3-2.8c1.3.4 2.2 1.6 2.2 3C22 18 17.5 22 12 22S2 18 2 12.5c0-4.6 3-8 6.5-9.5a2 2 0 0 1 2.5 1c.5 1 1 2 1 3.5 0 1.2-.5 2.5-1.5 4-.6 1-1.5 2.3-1.5 3.5 0 1.4 1 2.5 2.5 2.5s2.5-1.1 2.5-2.5c0-1.2-.3-2.5-1.3-4C11.5 9 10 7.2 10 5c0-2.3 1.8-4.2 4-4.8a2 2 0 0 1 1.2 2.8z"/>', 12, "#EF4444")
};

// ── Shared styles ──────────────────────────────────────────────────────────────
const sel = { fontFamily: "'DM Sans',sans-serif", padding: "7px 10px", border: "1px solid #E5E7EB", borderRadius: 6, fontSize: 14, color: "#374151", background: "#F9FAFB", cursor: "pointer", outline: "none" };
const sectionLabel = { margin: "0 0 8px", fontSize: 13, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.1em", color: "#9CA3AF" };
const iconBtn = (color = "#6B7280") => ({ background: "none", border: "1px solid #E5E7EB", borderRadius: 6, padding: "6px 8px", cursor: "pointer", color, display: "flex", alignItems: "center" as const });

// ── Job Card ───────────────────────────────────────────────────────────────────
function JobCard({ job, selected, onSelect }: { job: Job; selected: boolean; onSelect: () => void }) {
  const cfg = STATUS_CONFIG[job.status];
  return (
    <div onClick={onSelect} style={{ background: "#fff", border: `1.5px solid ${selected ? "#111827" : "#E5E7EB"}`, borderRadius: 8, padding: "16px 18px", cursor: "pointer", opacity: job.status === "closed" ? 0.7 : 1, transition: "border-color 0.15s", position: "relative" as const }}>
      {job.isHot && <div style={{ position: "absolute", top: 12, right: 12, color: "#EF4444" }}>{Ico.fire}</div>}
      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2, paddingRight: 20 }}>
            <p style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "#111827" }}>{job.title}</p>
          </div>
          <p style={{ margin: 0, fontSize: 14, color: "#6B7280" }}>{job.department}</p>
          <div style={{ display: "flex", gap: 10, marginTop: 8, flexWrap: "wrap" as const }}>
            <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 13, color: "#9CA3AF" }}>{Ico.location} {job.location}</span>
            <span style={{ fontSize: 13, color: "#6B7280", padding: "2px 7px", background: "#F3F4F6", borderRadius: 3, fontWeight: 500 }}>{job.type}</span>
          </div>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.05em", padding: "3px 8px", borderRadius: 4, textTransform: "uppercase" as const, color: cfg.color, background: cfg.bg }}>{cfg.label}</span>
              {job.status === "active" && (
                <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: "#111827", fontWeight: 600, background: "#F9FAFB", padding: "3px 8px", borderRadius: 4, border: "1px solid #E5E7EB" }}>
                  {Ico.users} {job.applicantsCount} Applicants
                </span>
              )}
            </div>
            <span style={{ fontSize: 13, color: "#9CA3AF", fontFamily: "'DM Mono',monospace" }}>Updated {daysAgo(job.lastUpdated)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Detail Panel ───────────────────────────────────────────────────────────────
function DetailPanel({ job, onClose }: { job: Job; onClose: () => void }) {
  const cfg = STATUS_CONFIG[job.status];
  return (
    <div style={{ background: "#fff", border: "1.5px solid #E5E7EB", borderRadius: 10, height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Header */}
      <div style={{ padding: "18px 20px", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div>
            <p style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#111827", display: "flex", gap: 6, alignItems: "center" }}>
              {job.title} {job.isHot && <span style={{ color: "#EF4444" }}>{Ico.fire}</span>}
            </p>
            <p style={{ margin: 0, fontSize: 14, color: "#6B7280" }}>{job.department} · {job.location}</p>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button style={iconBtn()}>{Ico.edit}</button>
            <button onClick={onClose} style={iconBtn()}>{Ico.close}</button>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" as const }}>
          <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.05em", padding: "4px 10px", borderRadius: 4, textTransform: "uppercase" as const, color: cfg.color, background: cfg.bg }}>{cfg.label}</span>
          <span style={{ fontSize: 13, padding: "4px 10px", borderRadius: 4, color: "#374151", background: "#F3F4F6", fontWeight: 500 }}>{job.type}</span>
          <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, padding: "4px 10px", borderRadius: 4, color: "#111827", background: "#F9FAFB", border: "1px solid #E5E7EB", fontWeight: 600 }}>
            {Ico.users} {job.applicantsCount} Applicants
          </span>
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: "auto", padding: "18px 20px" }}>
        <p style={sectionLabel}>Quick Actions</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 20 }}>
          <button style={{ padding: "8px", background: "#111827", color: "#fff", border: "none", borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>View Applicants</button>
          <button style={{ padding: "8px", background: "#fff", color: "#111827", border: "1px solid #E5E7EB", borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>Duplicate Job</button>
        </div>

        <p style={sectionLabel}>Overview</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 20 }}>
          {[["Posted Date", fmtDate(job.createdAt)], ["Last Update", fmtDate(job.lastUpdated)], ["Department", job.department], ["Job Type", job.type]].map(([label, value]) => (
            <div key={label} style={{ padding: "10px 12px", borderRadius: 6, background: "#F9FAFB", border: "1px solid #E5E7EB" }}>
              <p style={{ margin: "0 0 2px", fontSize: 12, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</p>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#111827", fontFamily: label.includes("Date") || label.includes("Update") ? "'DM Mono',monospace" : "inherit" }}>{value}</p>
            </div>
          ))}
        </div>

        {job.status === "active" && (
          <>
            <p style={sectionLabel}>Applicant Pipeline</p>
            <div style={{ padding: "12px 14px", borderRadius: 6, border: "1px solid #E5E7EB", marginBottom: 20, background: "#FAFAFA" }}>
               <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 14 }}>
                 <span style={{ color: "#6B7280" }}>Applied</span> <strong style={{ color: "#111827" }}>24</strong>
               </div>
               <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 14 }}>
                 <span style={{ color: "#6B7280" }}>Interviewing</span> <strong style={{ color: "#111827" }}>15</strong>
               </div>
               <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                 <span style={{ color: "#6B7280" }}>Offered</span> <strong style={{ color: "#111827" }}>6</strong>
               </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────────
export default function MyJobs() {
  const [jobs] = useState(MOCK_JOBS);
  const [selectedId, setSelectedId] = useState<string | null>("1");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<JobStatus | "all">("all");

  const q = search.toLowerCase();
  const filtered = useMemo(() => jobs
    .filter(j => (!q || [j.title, j.department].some(s => s.toLowerCase().includes(q))) && (filterStatus === "all" || j.status === filterStatus))
    .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()),
    [jobs, q, filterStatus]);

  const selected = jobs.find(a => a.id === selectedId) || null;

  const stats = {
    active: jobs.filter(j => j.status === "active").length,
    closed: jobs.filter(j => j.status === "closed").length,
    draft: jobs.filter(j => j.status === "draft").length,
    totalApps: jobs.reduce((sum, j) => sum + j.applicantsCount, 0),
  };

  return (
    <div style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif", background: "#F9FAFB", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500;600&display=swap');*{box-sizing:border-box}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#E5E7EB;border-radius:4px}`}</style>

      {/* Top bar */}
      <div style={{ background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#111827" }}>My Jobs</h1>
          <p style={{ margin: 0, fontSize: 14, color: "#9CA3AF", fontFamily: "'DM Mono',monospace" }}>{stats.active} active · {jobs.length} total</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {([["Active", stats.active, false], ["Closed", stats.closed, false], ["Drafts", stats.draft, false], ["Total Apps", stats.totalApps, true]] as [string, number, boolean][]).map(([label, value, dark]) => (
            <div key={label} style={{ padding: "6px 14px", borderRadius: 6, background: dark ? "#111827" : "#F3F4F6", border: dark ? "none" : "1px solid #E5E7EB", textAlign: "center" as const }}>
              <p style={{ margin: 0, fontSize: 18, fontWeight: 700, color: dark ? "#fff" : "#111827", fontFamily: "'DM Mono',monospace" }}>{value}</p>
              <p style={{ margin: 0, fontSize: 12, color: dark ? "#9CA3AF" : "#6B7280", textTransform: "uppercase" as const, letterSpacing: "0.06em" }}>{label}</p>
            </div>
          ))}
          <button style={{ marginLeft: 8, padding: "0 16px", background: "#059669", color: "#fff", border: "none", borderRadius: 6, fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
            Post Job
          </button>
        </div>
      </div>

      {/* Filters */}
      <div style={{ background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "10px 24px", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" as const }}>
        <div style={{ position: "relative" as const, flex: 1, maxWidth: 260 }}>
          <span style={{ position: "absolute" as const, left: 10, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }}>{Ico.search}</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search jobs…"
            style={{ width: "100%", padding: "7px 10px 7px 32px", border: "1px solid #E5E7EB", borderRadius: 6, fontSize: 14, color: "#111827", background: "#F9FAFB", outline: "none" }} />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as JobStatus | "all")} style={sel}>
          <option value="all">All Statuses</option>
          {(Object.keys(STATUS_CONFIG) as JobStatus[]).map(s => <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>)}
        </select>
        <span style={{ fontSize: 14, color: "#9CA3AF", marginLeft: "auto", fontFamily: "'DM Mono',monospace" }}>{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Content */}
      <div style={{ flex: 1, display: "grid", gridTemplateColumns: selected ? "1fr 380px" : "1fr", gap: 16, padding: 20, alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.length === 0
            ? <div style={{ padding: 48, textAlign: "center" as const, border: "1.5px dashed #E5E7EB", borderRadius: 10, background: "#fff" }}><p style={{ margin: 0, fontSize: 16, color: "#9CA3AF" }}>No jobs match your filters.</p></div>
            : filtered.map(job => <JobCard key={job.id} job={job} selected={selectedId === job.id} onSelect={() => setSelectedId(p => p === job.id ? null : job.id)} />)
          }
        </div>
        {selected && (
          <div style={{ position: "sticky" as const, top: 20, height: "calc(100vh - 175px)", overflow: "hidden" }}>
            <DetailPanel job={selected} onClose={() => setSelectedId(null)} />
          </div>
        )}
      </div>
    </div>
  );
}
