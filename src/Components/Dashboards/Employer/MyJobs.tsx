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

const STATUS_CONFIG: Record<JobStatus, { label: string; textClass: string; bgClass: string }> = {
  active: { label: "Active", textClass: "text-emerald-600", bgClass: "bg-emerald-100" },
  closed: { label: "Closed", textClass: "text-white", bgClass: "bg-red-600" },
  draft:  { label: "Draft",  textClass: "text-gray-500", bgClass: "bg-gray-100" },
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
const sel = "font-sans px-2.5 py-[7px] border border-gray-200 rounded-md text-sm text-gray-700 bg-gray-50 cursor-pointer outline-none";
const sectionLabel = "m-[0_0_8px] text-[13px] font-bold uppercase tracking-[0.1em] text-gray-400";
const iconBtn = (colorClass = "text-gray-500", borderClass = "border-gray-200", bgClass = "bg-transparent") => `border rounded-md px-2 py-1.5 cursor-pointer flex items-center ${borderClass} ${bgClass} ${colorClass}`;

// ── Job Card ───────────────────────────────────────────────────────────────────
function JobCard({ job, selected, onSelect }: { job: Job; selected: boolean; onSelect: () => void }) {
  const cfg = STATUS_CONFIG[job.status];
  return (
    <div onClick={onSelect} className={`bg-white border-[1.5px] rounded-lg px-[18px] py-4 cursor-pointer transition-colors duration-150 ${selected ? "border-gray-900" : "border-gray-200"} ${job.status === "closed" ? "opacity-70" : "opacity-100"}`}>
      <div className="flex gap-3">
        <div className="flex-1 min-w-0">
          <p className="m-[0_0_2px] text-base font-semibold text-gray-900">{job.title}</p>
          <p className="m-0 text-sm text-gray-500">{job.department}</p>
          <div className="flex gap-2.5 mt-2 flex-wrap">
            <span className="flex items-center gap-[3px] text-[13px] text-gray-400">{Ico.location} {job.location}</span>
            <span className="text-[13px] text-gray-500 px-[7px] py-[2px] bg-gray-100 rounded-[3px] font-medium">{job.type}</span>
            {job.salaryRate && (
              <span className="flex items-center gap-[3px] text-[13px] text-emerald-600 font-semibold font-mono">{Ico.salary} {job.salaryRate}</span>
            )}
          </div>
          <div className="flex justify-between items-end mt-3.5">
            <div className="flex items-center gap-1.5">
              <span className={`text-[13px] font-semibold tracking-[0.05em] px-2 py-[3px] rounded tracking-wide uppercase ${cfg.textClass} ${cfg.bgClass}`}>{cfg.label}</span>
              {job.status === "active" && (
                <span className="flex items-center gap-1 text-[13px] text-gray-900 font-semibold bg-gray-50 px-2 py-[3px] rounded border border-gray-200">
                  {Ico.users} {job.applicantsCount} Applicants
                </span>
              )}
            </div>
            <span className="text-[13px] text-gray-400 font-mono">Updated {daysAgo(job.lastUpdated)}</span>
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
    <div className="bg-white border-[1.5px] border-gray-200 rounded-[10px] h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-5 py-[18px] border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="m-0 text-[17px] font-bold text-gray-900">{job.title}</p>
            <p className="m-0 text-sm text-gray-500">{job.department} · {job.location}</p>
          </div>
          <div className="flex gap-1.5">
            <button onClick={() => onDelete(job.id)} className={iconBtn("text-red-500", "border-red-300", "bg-red-50")} title="Delete Job">{Ico.trash}</button>
            <button onClick={() => onEdit(job)} className={iconBtn()} title="Edit Job">{Ico.edit}</button>
            <button onClick={onClose} className={iconBtn()}>{Ico.close}</button>
          </div>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          <span className={`text-[13px] font-semibold tracking-[0.05em] px-2.5 py-1 rounded uppercase ${cfg.textClass} ${cfg.bgClass}`}>{cfg.label}</span>
          <span className="text-[13px] px-2.5 py-1 rounded text-gray-700 bg-gray-100 font-medium">{job.type}</span>
          <span className="flex items-center gap-1 text-[13px] px-2.5 py-1 rounded text-gray-900 bg-gray-50 border border-gray-200 font-semibold">
            {Ico.users} {job.applicantsCount} Applicants
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-5 py-[18px]">
        <p className={sectionLabel}>Quick Actions</p>
        <div className="grid grid-cols-2 gap-2 mb-5">
          <button className="p-2 bg-gray-900 text-white rounded-md text-sm font-semibold cursor-pointer font-sans">View Applicants</button>
          <button className="p-2 bg-white text-gray-900 border border-gray-200 rounded-md text-sm font-semibold cursor-pointer font-sans">Duplicate Job</button>
        </div>

        <p className={sectionLabel}>Overview</p>
        <div className="grid grid-cols-2 gap-2 mb-5">
          {([
            ["Posted Date", fmtDate(job.createdAt)],
            ["Last Update", fmtDate(job.lastUpdated)],
            ["Department",  job.department],
            ["Job Type",    job.type],
            ...(job.salaryRate ? [["Salary / Rate", job.salaryRate]] : []),
          ] as [string, string][]).map(([label, value]) => (
            <div key={label} className="px-3 py-2.5 rounded-md bg-gray-50 border border-gray-200">
              <p className="m-[0_0_2px] text-xs text-gray-400 uppercase tracking-[0.08em]">{label}</p>
              <p className={`m-0 text-sm font-semibold ${label === "Salary / Rate" ? "text-emerald-600" : "text-gray-900"} ${label.includes("Date") || label.includes("Update") || label === "Salary / Rate" ? "font-mono" : ""}`}>{value}</p>
            </div>
          ))}
        </div>

        {job.status === "active" && (
          <>
            <p className={sectionLabel}>Applicant Pipeline</p>
            <div className="px-3.5 py-3 rounded-md border border-gray-200 mb-5 bg-gray-50">
              {[["Applied", 24], ["Interviewing", 15], ["Offered", 6]].map(([label, value], i, arr) => (
                <div key={label as string} className={`flex justify-between text-sm ${i < arr.length - 1 ? "mb-2" : "mb-0"}`}>
                  <span className="text-gray-500">{label}</span>
                  <strong className="text-gray-900">{value}</strong>
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
        const { data: jobRows, error: jobErr } = await supabase
          .from("jobs")
          .select("id, title, location, job_type, created_at, updated_at, status, category, salary_rate, description")
          .eq("employer_id", user.id)
          .order("updated_at", { ascending: false });

        if (jobErr) throw jobErr;
        if (!jobRows) { setJobs([]); return; }

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

  if (loading) {
    return (
      <div className="font-sans flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-9 h-9 border-4 border-gray-100 border-t-gray-900 rounded-full animate-spin" />
        <p className="m-0 text-[15px] text-gray-400">Loading your jobs…</p>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="font-sans flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <p className="m-0 text-[15px] text-red-500">⚠ {fetchError}</p>
      </div>
    );
  }

  return (
    <div className="font-sans bg-gray-50 min-h-screen flex flex-col">

      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3.5 flex items-center justify-between">
        <div>
          <h1 className="m-0 text-xl font-bold text-gray-900">My Jobs</h1>
          <p className="m-0 text-sm text-gray-400 font-mono">{stats.active} active · {jobs.length} total</p>
        </div>
        <div className="flex gap-2">
          {([["Active", stats.active, false], ["Closed", stats.closed, false], ["Drafts", stats.draft, false], ["Total Apps", stats.totalApps, true]] as [string, number, boolean][]).map(([label, value, dark]) => (
            <div key={label} className={`px-3.5 py-1.5 rounded-md text-center ${dark ? "bg-gray-900 border-none" : "bg-gray-100 border border-gray-200"}`}>
              <p className={`m-0 text-lg font-bold font-mono ${dark ? "text-white" : "text-gray-900"}`}>{value}</p>
              <p className={`m-0 text-xs uppercase tracking-[0.06em] ${dark ? "text-gray-400" : "text-gray-500"}`}>{label}</p>
            </div>
          ))}
          <button onClick={() => setActivePage?.("Post Job")} className="ml-2 px-4 bg-gray-900 text-white border-none rounded-md text-[15px] font-semibold cursor-pointer font-sans">
            Post Job
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200 px-6 py-2.5 flex items-center gap-2.5 flex-wrap">
        <div className="relative flex-1 max-w-[260px]">
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400">{Ico.search}</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search jobs…"
            className="w-full py-[7px] pr-2.5 pl-8 border border-gray-200 rounded-md text-sm text-gray-900 bg-gray-50 outline-none" />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as JobStatus | "all")} className={sel}>
          <option value="all">All Statuses</option>
          {(Object.keys(STATUS_CONFIG) as JobStatus[]).map(s => <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>)}
        </select>
        <span className="text-sm text-gray-400 ml-auto font-mono">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Content */}
      <div className={`flex-1 grid gap-4 p-5 items-start ${selected ? "grid-cols-[1fr_380px]" : "grid-cols-1"}`}>
        <div className="flex flex-col gap-2.5">
          {filtered.length === 0
            ? <div className="p-12 text-center border-[1.5px] border-dashed border-gray-200 rounded-[10px] bg-white"><p className="m-0 text-base text-gray-400">No jobs match your filters.</p></div>
            : filtered.map(job => <JobCard key={job.id} job={job} selected={selectedId === job.id} onSelect={() => setSelectedId(p => p === job.id ? null : job.id)} />)
          }
        </div>
        {selected && (
          <div className="sticky top-5 h-[calc(100vh-175px)] overflow-hidden">
            <DetailPanel job={selected} onClose={() => setSelectedId(null)} onDelete={setJobToDelete} onEdit={(job) => { onEditJob?.(job); setActivePage?.("Post Job"); }} />
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {jobToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-5">
          <div className="bg-white w-full max-w-[400px] rounded-xl p-6">
            <h3 className="m-[0_0_10px] text-lg font-bold text-gray-900">Delete Job Posting</h3>
            <p className="m-[0_0_24px] text-sm text-gray-600 leading-relaxed">Are you sure you want to delete this job posting? This action cannot be undone and all associated applicants will be removed.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setJobToDelete(null)} className="px-4 py-2 bg-white border border-gray-200 rounded-md text-sm font-semibold text-gray-700 cursor-pointer font-sans">Cancel</button>
              <button onClick={() => {
                supabase.from("jobs").delete().eq("id", jobToDelete);
                setJobs(j => j.filter(x => x.id !== jobToDelete));
                if (selectedId === jobToDelete) setSelectedId(null);
                setJobToDelete(null);
              }} className="px-4 py-2 bg-red-500 border-none rounded-md text-sm font-semibold text-white cursor-pointer font-sans">Delete Job</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}