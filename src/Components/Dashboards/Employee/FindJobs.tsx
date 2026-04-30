import { useState, useEffect, useMemo } from "react";
import { Search, X, RefreshCw, MapPin, Briefcase, Clock, DollarSign, Tag, ArrowLeft } from "lucide-react";
import JobCard from "./JobCard";
import { supabase } from "../../../lib/supabaseClient";
import { useAuth } from "../../../contexts/AuthContext";

// ── Types ──────────────────────────────────────────────────────────────────────
interface Job {
  id: string;
  title: string;
  category: string;
  job_type: string;
  location: string;
  salary_rate: string;
  description: string;
  expected_roles: string;
  required_skills: string[];
  status: string;
  created_at: string;
  employer_id: string;
  company_name?: string;
}

export const CATEGORIES = [
  "Technology & IT",
  "Healthcare & Medical",
  "Finance & Accounting",
  "Sales & Marketing",
  "Manual & Casual Labor",
  "Customer Support",
  "Administration",
  "Engineering & Design",
];

const CONTRACT_TYPES = ["All", "Permanent", "Contract", "Daily / Day-Labor", "Hourly / Shift", "Internship", "Gig / Project-Based"] as const;
const SORT_OPTIONS = ["Newest", "Oldest", "Salary: A–Z"] as const;

// Map job_type to the JobCard's limited type prop
const toCardType = (jobType: string): "Permanent" | "Contractual" | "Internship" => {
  if (jobType === "Permanent") return "Permanent";
  if (jobType === "Internship") return "Internship";
  return "Contractual";
};

// Days since created_at
const daysAgo = (dateStr: string) => {
  const n = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86_400_000);
  return Math.max(0, n);
};

// const fmtDate = (dateStr: string) =>
//   new Date(dateStr).toLocaleDateString("en-KE", { day: "2-digit", month: "long", year: "numeric" });

// ── Job Detail View ─────────────────────────────────────────────────────────────
function JobDetailView({ job, onBack }: { job: Job; onBack: () => void }) {
  return (
    <div className="bg-white border-[1.5px] border-gray-200 mt-6 mx-auto mb-10 max-w-4xl shadow-sm">
      {/* Header */}
      <div className="px-8 py-6 flex items-start justify-between gap-6">
        <div className="flex items-start gap-4">
          <button onClick={onBack} className="mt-1 flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors">
            <ArrowLeft size={16} />
          </button>
          <div className="w-14 h-14 border-[1.5px] border-gray-200 bg-gray-50 flex items-center justify-center text-2xl font-bold text-gray-900 font-mono flex-shrink-0">
            {job.company_name?.charAt(0) ?? "?"}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 leading-snug">{job.title}</h2>
            <p className="text-base text-gray-500 mt-1">{job.company_name}</p>
          </div>
        </div>
        <div className="text-right">
          <button className="h-11 px-8 bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 transition-colors shadow-md">
            Apply Now
          </button>
        </div>
      </div>

      {/* Badges */}
      <div className="px-8 py-4 bg-gray-50/50 border-t border-b border-gray-100 flex flex-wrap gap-3">
        {[
          { icon: <MapPin size={14} className="text-gray-400" />, text: job.location },
          { icon: <Briefcase size={14} className="text-gray-400" />, text: job.job_type },
          { icon: <Tag size={14} className="text-gray-400" />, text: job.category },
          { icon: <DollarSign size={14} className="text-gray-400" />, text: job.salary_rate },
          { icon: <Clock size={14} className="text-gray-400" />, text: `Posted ${ daysAgo(job.created_at) === 0 ? "Today" : `${daysAgo(job.created_at)}d ago`}` },
        ].map(({ icon, text }) => (
          <span key={text} className="flex items-center gap-1.5 text-[13px] font-medium text-gray-700 bg-white border border-gray-200 px-3 py-1.5 rounded-md shadow-sm">
            {icon} {text}
          </span>
        ))}
      </div>

      {/* Body */}
      <div className="px-8 py-8 flex flex-col gap-8">
        {/* Description */}
        <div>
          <p className="text-[13px] font-bold uppercase tracking-[0.05em] text-gray-400 mb-4 border-b border-gray-100 pb-2">Job Description</p>
          {job.description ? (
            <p className="text-[15px] text-gray-700 leading-loose whitespace-pre-wrap">{job.description}</p>
          ) : (
            <p className="text-[15px] text-gray-400 italic">No description provided.</p>
          )}
        </div>

        {/* Expected Roles */}
        {job.expected_roles && (
          <div>
            <p className="text-[13px] font-bold uppercase tracking-[0.05em] text-gray-400 mb-4 border-b border-gray-100 pb-2">Roles &amp; Responsibilities</p>
            <p className="text-[15px] text-gray-700 leading-loose whitespace-pre-wrap">{job.expected_roles}</p>
          </div>
        )}

        {/* Required Skills */}
        {job.required_skills && job.required_skills.length > 0 && (
          <div>
            <p className="text-[13px] font-bold uppercase tracking-[0.05em] text-gray-400 mb-4 border-b border-gray-100 pb-2">Required Skills</p>
            <div className="flex flex-wrap gap-2">
              {job.required_skills.map(skill => (
                <span key={skill} className="text-sm font-semibold bg-gray-100 text-gray-800 border border-gray-200 px-3 py-1.5 rounded-md">{skill}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


// ── Shared Select component ────────────────────────────────────────────────────
const Sel = ({ value, onChange, children }: React.SelectHTMLAttributes<HTMLSelectElement> & { children: React.ReactNode }) => (
  <select
    value={value}
    onChange={onChange}
    style={{ height: "36px", border: "1px solid #e5e7eb", backgroundColor: "#ffffff", padding: "0 12px", fontSize: "14px", color: "#374151", outline: "none", cursor: "pointer", borderRadius: "6px", fontFamily: "inherit" }}
  >
    {children}
  </select>
);

// ── Loading Skeleton ───────────────────────────────────────────────────────────
function JobSkeleton() {
  return (
    <div className="bg-white border-[1.5px] border-gray-200 p-5 flex flex-col gap-4 animate-pulse">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-gray-200 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-100 rounded w-1/2" />
        </div>
      </div>
      <div className="flex gap-2">
        <div className="h-5 w-24 bg-gray-100 rounded" />
        <div className="h-5 w-20 bg-gray-100 rounded" />
      </div>
      <div className="h-3 bg-gray-100 rounded w-16" />
      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
        <div className="h-5 w-32 bg-gray-200 rounded" />
        <div className="h-9 w-20 bg-gray-200 rounded" />
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function FindJobsPage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [jobType, setJobType] = useState("All");       // "All" | "Corporate" | "Manual/Casual"
  const [contract, setContract] = useState("All");
  const [location, setLocation] = useState("All Locations");
  const [sort, setSort] = useState<typeof SORT_OPTIONS[number]>("Newest");

  // ── Fetch active jobs from Supabase ──
  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      // Step 1 — fetch active jobs
      let query = supabase
        .from("jobs")
        .select(`
          id,
          title,
          category,
          job_type,
          location,
          salary_rate,
          description,
          expected_roles,
          required_skills,
          status,
          created_at,
          employer_id
        `)
        .eq("status", "active");

      // Hide jobs posted by the logged-in user
      if (user?.id) {
        query = query.neq("employer_id", user.id);
      }

      const { data: jobsData, error: jobsError } = await query.order("created_at", { ascending: false });

      if (jobsError) throw jobsError;

      // Step 2 — fetch company names for those employers
      // jobs.employer_id = profiles.id = companies.owner_id
      const employerIds = [...new Set((jobsData ?? []).map(j => j.employer_id).filter(Boolean))];

      let companyMap: Record<string, string> = {};
      if (employerIds.length > 0) {
        const { data: companiesData, error: companyError } = await supabase
          .from("companies")
          .select("owner_id, company_name")
          .in("owner_id", employerIds);

        if (companyError) throw companyError;

        companyMap = Object.fromEntries(
          (companiesData ?? []).map(c => [c.owner_id, c.company_name])
        );
      }

      // Step 3 — merge
      const mapped = (jobsData ?? []).map(row => ({
        ...row,
        company_name: companyMap[row.employer_id] ?? "Unknown Company",
      }));

      setJobs(mapped);
    } catch (err: any) {
      console.error("FindJobs fetch error:", err);
      setError(err.message || "Failed to load jobs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJobs(); }, [user?.id]);

  // ── Dynamic location list from fetched data ──
  const locationOptions = useMemo(() => {
    const unique = [...new Set(jobs.map(j => j.location).filter(Boolean))].sort();
    return ["All Locations", ...unique];
  }, [jobs]);

  // ── Determine corporate vs casual from job_type ──
  const isCasual = (jt: string) =>
    ["Daily / Day-Labor", "Hourly / Shift", "Gig / Project-Based"].includes(jt);

  // ── Active filter chips ──
  const activeFilters = [
    category !== "All Categories" && category,
    jobType !== "All" && jobType,
    contract !== "All" && contract,
    location !== "All Locations" && location,
  ].filter(Boolean) as string[];

  const clearFilter = (f: string) => {
    if (f === category) setCategory("All Categories");
    else if (f === jobType) setJobType("All");
    else if (f === contract) setContract("All");
    else setLocation("All Locations");
  };

  // ── Client-side filtering & sorting ──
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return jobs
      .filter(j => {
        const casual = isCasual(j.job_type);
        const typeMatch =
          jobType === "All" ||
          (jobType === "Corporate" && !casual) ||
          (jobType === "Manual/Casual" && casual);

        return (
          (category === "All Categories" || j.category === category) &&
          typeMatch &&
          (contract === "All" || j.job_type === contract) &&
          (location === "All Locations" || j.location === location) &&
          (!q || j.title.toLowerCase().includes(q) || (j.company_name ?? "").toLowerCase().includes(q))
        );
      })
      .sort((a, b) => {
        if (sort === "Oldest") return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        if (sort === "Salary: A–Z") return (a.salary_rate ?? "").localeCompare(b.salary_rate ?? "");
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
  }, [jobs, search, category, jobType, contract, location, sort]);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB", fontFamily: "'DM Sans','Segoe UI',sans-serif", boxSizing: "border-box", color: "#111827" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500;600&display=swap');*{box-sizing:border-box}`}</style>

      {/* Top bar */}
      <div style={{ backgroundColor: "#ffffff", borderBottom: "1px solid #e5e7eb", padding: "20px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "700", margin: "0 0 4px 0", color: "#111827" }}>Find Jobs</h1>
          <p style={{ fontSize: "14px", color: "#4b5563", margin: "0", fontFamily: "'DM Mono', monospace" }}>
            {loading ? "Loading jobs..." : `${filtered.length} opportunit${filtered.length !== 1 ? "ies" : "y"} found`}
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* Refresh */}
          <button
            onClick={fetchJobs}
            disabled={loading}
            title="Refresh jobs"
            style={{ display: "flex", alignItems: "center", gap: "6px", padding: "6px 12px", border: "1px solid #e5e7eb", borderRadius: "6px", fontSize: "13px", color: "#6b7280", background: "#fff", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.5 : 1 }}
          >
            <RefreshCw size={13} style={{ animation: loading ? "spin 1s linear infinite" : "none" }} />
            Refresh
          </button>

          {/* Job type tabs */}
          <div style={{ display: "flex", alignItems: "center", gap: "4px", backgroundColor: "#f3f4f6", padding: "4px", borderRadius: "8px" }}>
            {(["All", "Corporate", "Manual/Casual"] as const).map(t => (
              <button key={t} onClick={() => setJobType(t)}
                style={{ padding: "6px 12px", fontSize: "14px", fontWeight: "600", borderRadius: "6px", cursor: "pointer", border: jobType === t ? "1px solid #e5e7eb" : "none", backgroundColor: jobType === t ? "#ffffff" : "transparent", color: jobType === t ? "#111827" : "#6b7280" }}>
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div style={{ backgroundColor: "#ffffff", borderBottom: "1px solid #e5e7eb", padding: "12px 40px", display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
        {/* Search */}
        <div style={{ position: "relative", flex: 1, minWidth: "180px", maxWidth: "320px" }}>
          <Search size={14} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search jobs or companies…"
            style={{ width: "100%", height: "36px", border: "1px solid #e5e7eb", padding: "0 32px", fontSize: "14px", color: "#111827", outline: "none", borderRadius: "6px", fontFamily: "inherit", boxSizing: "border-box" }} />
          {search && <button onClick={() => setSearch("")} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#9ca3af", cursor: "pointer" }}><X size={14} /></button>}
        </div>

        <Sel value={category} onChange={e => setCategory(e.target.value)}>
          <option value="All Categories">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </Sel>

        <Sel value={contract} onChange={e => setContract(e.target.value)}>
          {CONTRACT_TYPES.map(t => <option key={t} value={t}>{t === "All" ? "All Contracts" : t}</option>)}
        </Sel>

        <Sel value={location} onChange={e => setLocation(e.target.value)}>
          {locationOptions.map(l => <option key={l}>{l}</option>)}
        </Sel>

        <Sel value={sort} onChange={e => setSort(e.target.value as typeof SORT_OPTIONS[number])}>
          {SORT_OPTIONS.map(s => <option key={s}>{s}</option>)}
        </Sel>

        <span style={{ fontSize: "14px", color: "#9ca3af", fontFamily: "'DM Mono', monospace", marginLeft: "auto" }}>
          {filtered.length} result{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Active filter chips */}
      {activeFilters.length > 0 && (
        <div style={{ padding: "10px 40px", display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", backgroundColor: "#ffffff", borderBottom: "1px solid #e5e7eb" }}>
          <span style={{ fontSize: "14px", color: "#9ca3af" }}>Active:</span>
          {activeFilters.map(f => (
            <span key={f} style={{ display: "flex", alignItems: "center", gap: "6px", backgroundColor: "#111827", color: "#ffffff", fontSize: "13px", padding: "4px 10px", borderRadius: "4px", fontFamily: "'DM Mono', monospace" }}>
              {f}
              <button onClick={() => clearFilter(f)} style={{ opacity: 0.6, background: "none", border: "none", color: "#ffffff", cursor: "pointer", padding: "0" }}><X size={11} /></button>
            </span>
          ))}
          <button
            onClick={() => { setCategory("All Categories"); setJobType("All"); setContract("All"); setLocation("All Locations"); }}
            style={{ fontSize: "13px", color: "#9ca3af", textDecoration: "underline", background: "none", border: "none", cursor: "pointer", marginLeft: "4px" }}
          >
            Clear all
          </button>
        </div>
      )}

      {/* Content Area */}
      <div style={{ padding: selectedJob ? "24px 40px" : "32px 40px", maxWidth: "1200px", margin: "0 auto" }}>
        
        {/* Error state */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between">
            <p className="text-sm text-red-600">{error}</p>
            <button onClick={fetchJobs} className="text-sm font-semibold text-red-600 underline">Retry</button>
          </div>
        )}

        {selectedJob ? (
          <JobDetailView job={selectedJob} onBack={() => setSelectedJob(null)} />
        ) : (
          loading ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "16px" }}>
              {Array.from({ length: 6 }).map((_, i) => <JobSkeleton key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ border: "1.5px dashed #e5e7eb", backgroundColor: "#ffffff", padding: "80px 20px", textAlign: "center", borderRadius: "12px" }}>
              <p style={{ fontSize: "16px", fontWeight: "600", color: "#111827", margin: "0 0 8px 0" }}>
                {jobs.length === 0 ? "No jobs have been posted yet" : "No jobs match your filters"}
              </p>
              <p style={{ fontSize: "14px", color: "#9ca3af", margin: "0" }}>
                {jobs.length === 0 ? "Check back soon — new opportunities are posted daily." : "Try adjusting your search or clearing some filters."}
              </p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "16px" }}>
              {filtered.map(job => (
                <JobCard
                  key={job.id}
                  title={job.title}
                  company={job.company_name ?? "Unknown Company"}
                  location={job.location}
                  salary={job.salary_rate ?? "—"}
                  type={toCardType(job.job_type)}
                  daysAgo={daysAgo(job.created_at)}
                  onView={() => setSelectedJob(job)}
                />
              ))}
            </div>
          )
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}