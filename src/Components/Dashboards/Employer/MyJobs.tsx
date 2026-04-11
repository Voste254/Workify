import { useState, useMemo, useEffect } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { useAuth } from "../../../contexts/AuthContext";

// ── Types & Config ─────────────────────────────────────────────────────────────
export type JobStatus = "active" | "closed" | "draft";

export interface Job {
  id: string; title: string; location: string; type: string;
  createdAt: string; lastUpdated: string; applicantsCount: number;
  status: JobStatus; department: string;
  salaryRate: string; description: string;
}

const STATUS_CONFIG: Record<JobStatus, { label: string; color: string; bg: string }> = {
  active: { label: "Active", color: "#059669", bg: "#D1FAE5" },
  closed: { label: "Closed", color: "#FFFFFF", bg: "#DC2626" },
  draft:  { label: "Draft",  color: "#6B7280", bg: "#F3F4F6" },
};

// ── Mock Data removed – data fetched from Supabase ────────────────────────────

// ── Helpers ────────────────────────────────────────────────────────────────────
const fmtDate = (d: string) => new Date(d).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" });
const daysAgo = (d: string) => { const n = Math.floor((Date.now() - new Date(d).getTime()) / 86400000); return n === 0 ? "Today" : n === 1 ? "Yesterday" : `${n}d ago`; };

// ── Icons ──────────────────────────────────────────────────────────────────────
const I = (d: string, s = 14, fill = "none") => <svg width={s} height={s} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: d }} />;
const Ico = {
  search:   I('<circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>', 14),
  location: I('<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>', 12),
  users:    I('<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>', 12),
  close:    I('<path d="M18 6 6 18"/><path d="m6 6 12 12"/>', 14),
  edit:     I('<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>', 12),
  trash:    I('<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>', 14),
  salary:   I('<circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/><path d="M7 6h1v4"/><path d="m16.71 13.88.7.71-2.82 2.82"/>', 12),
};

// ── Shared styles ──────────────────────────────────────────────────────────────
const sel = { fontFamily: "'DM Sans',sans-serif", padding: "7px 10px", border: "1px solid #E5E7EB", borderRadius: 6, fontSize: 14, color: "#374151", background: "#F9FAFB", cursor: "pointer", outline: "none" };
const sectionLabel = { margin: "0 0 8px", fontSize: 13, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.1em", color: "#9CA3AF" };
const iconBtn = (color = "#6B7280") => ({ background: "none", border: "1px solid #E5E7EB", borderRadius: 6, padding: "6px 8px", cursor: "pointer", color, display: "flex", alignItems: "center" as const });

// ── Job Card ───────────────────────────────────────────────────────────────────
function JobCard({ job, selected, onSelect }: { job: Job; selected: boolean; onSelect: () => void }) {
  const cfg = STATUS_CONFIG[job.status];
  return (
    <div onClick={onSelect} style={{ background: "#fff", border: `1.5px solid ${selected ? "#111827" : "#E5E7EB"}`, borderRadius: 8, padding: "16px 18px", cursor: "pointer", opacity: job.status === "closed" ? 0.7 : 1, transition: "border-color 0.15s" }}>
      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: "0 0 2px", fontSize: 16, fontWeight: 600, color: "#111827" }}>{job.title}</p>
          <p style={{ margin: 0, fontSize: 14, color: "#6B7280" }}>{job.department}</p>
          <div style={{ display: "flex", gap: 10, marginTop: 8, flexWrap: "wrap" as const }}>
            <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 13, color: "#9CA3AF" }}>{Ico.location} {job.location}</span>
            <span style={{ fontSize: 13, color: "#6B7280", padding: "2px 7px", background: "#F3F4F6", borderRadius: 3, fontWeight: 500 }}>{job.type}</span>
            {job.salaryRate && (
              <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 13, color: "#059669", fontWeight: 600, fontFamily: "'DM Mono',monospace" }}>{Ico.salary} {job.salaryRate}</span>
            )}
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
function DetailPanel({ job, onClose, onDelete, onEdit }: { job: Job; onClose: () => void; onDelete: (id: string) => void; onEdit: (job: Job) => void }) {
  const cfg = STATUS_CONFIG[job.status];
  return (
    <div style={{ background: "#fff", border: "1.5px solid #E5E7EB", borderRadius: 10, height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Header */}
      <div style={{ padding: "18px 20px", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div>
            <p style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#111827" }}>{job.title}</p>
            <p style={{ margin: 0, fontSize: 14, color: "#6B7280" }}>{job.department} · {job.location}</p>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={() => onDelete(job.id)} style={{ ...iconBtn("#EF4444"), borderColor: "#FCA5A5", background: "#FEF2F2" }} title="Delete Job">{Ico.trash}</button>
            <button onClick={() => onEdit(job)} style={iconBtn()} title="Edit Job">{Ico.edit}</button>
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
          {([
            ["Posted Date", fmtDate(job.createdAt)],
            ["Last Update", fmtDate(job.lastUpdated)],
            ["Department",  job.department],
            ["Job Type",    job.type],
            ...(job.salaryRate ? [["Salary / Rate", job.salaryRate]] : []),
          ] as [string, string][]).map(([label, value]) => (
            <div key={label} style={{ padding: "10px 12px", borderRadius: 6, background: "#F9FAFB", border: "1px solid #E5E7EB" }}>
              <p style={{ margin: "0 0 2px", fontSize: 12, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</p>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: label === "Salary / Rate" ? "#059669" : "#111827", fontFamily: label.includes("Date") || label.includes("Update") || label === "Salary / Rate" ? "'DM Mono',monospace" : "inherit" }}>{value}</p>
            </div>
          ))}
        </div>

        {job.status === "active" && (
          <>
            <p style={sectionLabel}>Applicant Pipeline</p>
            <div style={{ padding: "12px 14px", borderRadius: 6, border: "1px solid #E5E7EB", marginBottom: 20, background: "#FAFAFA" }}>
              {[["Applied", 24], ["Interviewing", 15], ["Offered", 6]].map(([label, value], i, arr) => (
                <div key={label as string} style={{ display: "flex", justifyContent: "space-between", marginBottom: i < arr.length - 1 ? 8 : 0, fontSize: 14 }}>
                  <span style={{ color: "#6B7280" }}>{label}</span>
                  <strong style={{ color: "#111827" }}>{value}</strong>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────────
export default function MyJobs({ setActivePage, onEditJob }: { setActivePage?: (page: string) => void; onEditJob?: (job: Job) => void } = {}) {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<JobStatus | "all">("all");
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);

  // ── Fetch jobs from Supabase ───────────────────────────────────────────────
  useEffect(() => {
    if (!user) return;

    const fetchJobs = async () => {
      setLoading(true);
      setFetchError(null);

      try {
        // 1. Fetch all jobs for this employer
        const { data: jobRows, error: jobErr } = await supabase
          .from("jobs")
          .select("id, title, location, job_type, created_at, updated_at, status, category, salary_rate, description")
          .eq("employer_id", user.id)
          .order("updated_at", { ascending: false });

        if (jobErr) throw jobErr;
        if (!jobRows) { setJobs([]); return; }

        // 2. Fetch applicant counts per job
        const jobIds = jobRows.map(j => j.id);
        let countMap: Record<string, number> = {};

        if (jobIds.length > 0) {
          const { data: appRows, error: appErr } = await supabase
            .from("applications")
            .select("job_id")
            .in("job_id", jobIds);

          if (!appErr && appRows) {
            appRows.forEach(row => {
              countMap[row.job_id] = (countMap[row.job_id] || 0) + 1;
            });
          }
        }

        // 3. Map DB rows → Job interface
        const mapped: Job[] = jobRows.map(row => ({
          id: row.id,
          title: row.title,
          location: row.location ?? "",
          type: row.job_type ?? "",
          createdAt: row.created_at,
          lastUpdated: row.updated_at ?? row.created_at,
          status: (row.status as JobStatus) ?? "draft",
          department: row.category ?? "",
          applicantsCount: countMap[row.id] ?? 0,
          salaryRate: row.salary_rate ?? "",
          description: row.description ?? "",
        }));

        setJobs(mapped);
        if (mapped.length > 0) setSelectedId(mapped[0].id);
      } catch (err: any) {
        console.error("MyJobs fetch error:", err);
        setFetchError(err.message || "Failed to load jobs.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [user]);

  const q = search.toLowerCase();
  const filtered = useMemo(() => jobs
    .filter(j => (!q || [j.title, j.department].some(s => s.toLowerCase().includes(q))) && (filterStatus === "all" || j.status === filterStatus))
    .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()),
    [jobs, q, filterStatus]);

  const selected = jobs.find(a => a.id === selectedId) || null;
  const stats = {
    active:    jobs.filter(j => j.status === "active").length,
    closed:    jobs.filter(j => j.status === "closed").length,
    draft:     jobs.filter(j => j.status === "draft").length,
    totalApps: jobs.reduce((sum, j) => sum + j.applicantsCount, 0),
  };

  // ── Loading / error states ─────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh", flexDirection: "column", gap: 12 }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700&display=swap');@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}`}</style>
        <div style={{ width: 36, height: 36, border: "4px solid #F3F4F6", borderTop: "4px solid #111827", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
        <p style={{ margin: 0, fontSize: 15, color: "#9CA3AF" }}>Loading your jobs…</p>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh", flexDirection: "column", gap: 12 }}>
        <p style={{ margin: 0, fontSize: 15, color: "#EF4444" }}>⚠ {fetchError}</p>
      </div>
    );
  }

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
          <button onClick={() => setActivePage?.("Post Job")} style={{ marginLeft: 8, padding: "0 16px", background: "#111827", color: "#fff", border: "none", borderRadius: 6, fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
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
            <DetailPanel job={selected} onClose={() => setSelectedId(null)} onDelete={setJobToDelete} onEdit={(job) => { onEditJob?.(job); setActivePage?.("Post Job"); }} />
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {jobToDelete && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: 20 }}>
          <div style={{ background: "#fff", width: "100%", maxWidth: 400, borderRadius: 12, padding: 24 }}>
            <h3 style={{ margin: "0 0 10px", fontSize: 18, fontWeight: 700, color: "#111827" }}>Delete Job Posting</h3>
            <p style={{ margin: "0 0 24px", fontSize: 14, color: "#4B5563", lineHeight: 1.5 }}>Are you sure you want to delete this job posting? This action cannot be undone and all associated applicants will be removed.</p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
              <button onClick={() => setJobToDelete(null)} style={{ padding: "8px 16px", background: "#fff", border: "1px solid #E5E7EB", borderRadius: 6, fontSize: 14, fontWeight: 600, color: "#374151", cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>Cancel</button>
              <button onClick={() => {
                supabase.from("jobs").delete().eq("id", jobToDelete);
                setJobs(j => j.filter(x => x.id !== jobToDelete));
                if (selectedId === jobToDelete) setSelectedId(null);
                setJobToDelete(null);
              }} style={{ padding: "8px 16px", background: "#EF4444", border: "none", borderRadius: 6, fontSize: 14, fontWeight: 600, color: "#fff", cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>Delete Job</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}