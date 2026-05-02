import { useState, useEffect, useMemo } from "react";
import { Search, X, RefreshCw, MapPin, Briefcase, Clock, DollarSign, Tag, ArrowLeft, Building, Globe, Users, Mail, Phone, Bookmark } from "lucide-react";
import JobCard from "./JobCard";
import Pagination from "./Pagination";
import { supabase } from "../../../lib/supabaseClient";
import { useAuth } from "../../../contexts/AuthContext";

const PAGE_SIZE = 10;

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
function JobDetailView({
  job, onBack, onApply, applying, alreadyApplied, onViewCompany
}: {
  job: Job; onBack: () => void;
  onApply: () => void; applying: boolean; alreadyApplied: boolean;
  onViewCompany: () => void;
}) {
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
            <div className="flex items-center gap-3 mt-1">
              <p className="text-base text-gray-500 m-0">{job.company_name}</p>
              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
              <button 
                onClick={onViewCompany}
                className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors bg-transparent border-none cursor-pointer p-0 m-0"
              >
                View Company Profile
              </button>
            </div>
          </div>
        </div>
        <div className="text-right flex flex-col items-end gap-2">
          <button
            onClick={onApply}
            disabled={applying || alreadyApplied}
            className={`h-11 px-8 text-sm font-semibold transition-colors shadow-md ${
              alreadyApplied
                ? 'bg-emerald-600 text-white cursor-default'
                : applying
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-gray-900 text-white hover:bg-gray-700'
            }`}
          >
            {alreadyApplied ? '✓ Applied' : applying ? 'Applying…' : 'Apply Now'}
          </button>
          {alreadyApplied && <p className="text-xs text-emerald-600 font-medium">You have already applied for this job.</p>}
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

// ── Company Profile View ────────────────────────────────────────────────────────
function CompanyProfileView({
  employerId, companyName, onBack
}: {
  employerId: string; companyName: string; onBack: () => void;
}) {
  const { user } = useAuth();
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      // Fetch company details
      const { data: comp } = await supabase.from("companies").select("*").eq("owner_id", employerId).single();
      if (comp) setCompany(comp);

      // Check if already saved
      if (user) {
        const { data: saveCheck } = await supabase.from("saved_items")
          .select("id")
          .eq("user_id", user.id)
          .eq("employer_id", employerId)
          .maybeSingle();
        if (saveCheck) setSaved(true);
      }
      setLoading(false);
    })();
  }, [employerId, user]);

  const handleSave = async () => {
    if (!user || saved) return;
    setSaving(true);
    const { error } = await supabase.from("saved_items").insert({
      user_id: user.id,
      employer_id: employerId
    });
    setSaving(false);
    if (!error) setSaved(true);
    else alert("Error saving profile: " + error.message);
  };

  return (
    <div className="bg-white border-[1.5px] border-gray-200 mt-6 mx-auto mb-10 max-w-4xl shadow-sm">
      <div className="px-8 py-6 border-b border-gray-100 flex items-start justify-between gap-6">
        <div className="flex items-start gap-4">
          <button onClick={onBack} className="mt-1 flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors cursor-pointer border-none">
            <ArrowLeft size={16} />
          </button>
          <div className="w-16 h-16 border-[1.5px] border-gray-200 bg-gray-50 flex items-center justify-center text-3xl font-bold text-gray-900 font-mono flex-shrink-0">
            {companyName?.charAt(0) ?? "?"}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 leading-snug m-0 mb-1">{company?.company_name || companyName}</h2>
            <p className="text-base text-gray-500 m-0">{company?.industry || "Industry not specified"}</p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || saved}
          className={`flex items-center gap-2 h-10 px-5 text-sm font-bold transition-colors rounded-lg shadow-sm border ${
            saved ? "bg-emerald-50 text-emerald-700 border-emerald-200 cursor-default" : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 cursor-pointer"
          }`}
        >
          <Bookmark size={16} className={saved ? "fill-emerald-600" : ""} />
          {saved ? "Profile Saved" : saving ? "Saving…" : "Save Profile"}
        </button>
      </div>

      <div className="px-8 py-8">
        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <p className="text-[12px] font-bold uppercase tracking-wider text-gray-400 m-0 mb-2">Company Size</p>
                <div className="flex items-center gap-2 text-gray-700 font-medium">
                  <Users size={16} className="text-gray-400 shrink-0" />
                  {company?.company_size || "Not specified"}
                </div>
              </div>
              <div>
                <p className="text-[12px] font-bold uppercase tracking-wider text-gray-400 m-0 mb-2">Headquarters</p>
                <div className="flex items-center gap-2 text-gray-700 font-medium">
                  <MapPin size={16} className="text-gray-400 shrink-0" />
                  {company?.company_location || "Not specified"}
                </div>
              </div>
              <div>
                <p className="text-[12px] font-bold uppercase tracking-wider text-gray-400 m-0 mb-2">Industry</p>
                <div className="flex items-center gap-2 text-gray-700 font-medium">
                  <Building size={16} className="text-gray-400 shrink-0" />
                  {company?.industry || "Not specified"}
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <p className="text-[12px] font-bold uppercase tracking-wider text-gray-400 m-0 mb-2">Website</p>
                <div className="flex items-center gap-2 text-gray-700 font-medium">
                  <Globe size={16} className="text-gray-400 shrink-0" />
                  {company?.website ? (
                    <a href={company.website.startsWith('http') ? company.website : `https://${company.website}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                      {company.website}
                    </a>
                  ) : "Not specified"}
                </div>
              </div>
              <div>
                <p className="text-[12px] font-bold uppercase tracking-wider text-gray-400 m-0 mb-2">Contact Email</p>
                <div className="flex items-center gap-2 text-gray-700 font-medium">
                  <Mail size={16} className="text-gray-400 shrink-0" />
                  {company?.company_email || "Not specified"}
                </div>
              </div>
              <div>
                <p className="text-[12px] font-bold uppercase tracking-wider text-gray-400 m-0 mb-2">Contact Phone</p>
                <div className="flex items-center gap-2 text-gray-700 font-medium">
                  <Phone size={16} className="text-gray-400 shrink-0" />
                  {company?.company_phone || "Not specified"}
                </div>
              </div>
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
  const [viewingCompanyId, setViewingCompanyId] = useState<string | null>(null);
  const [viewingCompanyName, setViewingCompanyName] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [jobType, setJobType] = useState("All");
  const [contract, setContract] = useState("All");
  const [location, setLocation] = useState("All Locations");
  const [sort, setSort] = useState<typeof SORT_OPTIONS[number]>("Newest");
  const [page, setPage] = useState(1);

  // ── Apply flow ──
  const [appliedJobIds,  setAppliedJobIds]  = useState<Set<string>>(new Set());
  const [applying,       setApplying]       = useState(false);
  const [applyToast,     setApplyToast]     = useState<{ msg: string; ok: boolean } | null>(null);
  const [seekerProfile,  setSeekerProfile]  = useState({ name: "", phone: "", location: "" });

  const showApplyToast = (msg: string, ok: boolean) => {
    setApplyToast({ msg, ok });
    setTimeout(() => setApplyToast(null), 4000);
  };

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

  // ── Fetch seeker profile + already-applied job IDs ──
  useEffect(() => {
    if (!user?.id) return;
    (async () => {
      const [{ data: prof }, { data: apps }] = await Promise.all([
        supabase.from("profiles").select("first_name,last_name,phone,seeker_location").eq("id", user.id).single(),
        supabase.from("applications").select("job_id").eq("seeker_id", user.id).not("job_id", "is", null),
      ]);
      if (prof) setSeekerProfile({
        name: `${prof.first_name || ""} ${prof.last_name || ""}`.trim(),
        phone: prof.phone || "",
        location: prof.seeker_location || "",
      });
      if (apps) setAppliedJobIds(new Set(apps.map((a: any) => a.job_id).filter(Boolean)));
    })();
  }, [user?.id]);

  // ── Submit application ──
  const handleApply = async (job: Job) => {
    if (!user?.id) { showApplyToast("Please sign in to apply.", false); return; }
    if (appliedJobIds.has(job.id)) { showApplyToast("You have already applied for this job.", false); return; }

    setApplying(true);
    const validCats = new Set(["Corporate", "Casual", ...CATEGORIES]);
    const jobCategory = validCats.has(job.category)
      ? job.category
      : isCasual(job.job_type) ? "Casual" : "Corporate";

    const { error: insertErr } = await supabase.from("applications").insert({
      seeker_id:           user.id,
      employer_id:         job.employer_id,
      job_id:              job.id,
      applicant_name:      seekerProfile.name     || null,
      applicant_phone:     seekerProfile.phone    || null,
      applicant_location:  seekerProfile.location || null,
      job_title:           job.title,
      company:             job.company_name ?? "Unknown Company",
      location:            job.location,
      job_category:        jobCategory,
      job_type:            job.job_type,
      salary:              job.salary_rate,
      company_logo_letter: (job.company_name ?? "U").charAt(0).toUpperCase(),
      stage:               "applied",
    });
    setApplying(false);

    if (insertErr) {
      showApplyToast("Failed to submit: " + insertErr.message, false);
    } else {
      setAppliedJobIds(prev => new Set(prev).add(job.id));
      showApplyToast("Application submitted successfully! 🎉", true);
    }
  };

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

  // Reset to page 1 whenever filters or search change
  useMemo(() => { setPage(1); }, [search, category, jobType, contract, location, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

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

        {viewingCompanyId && selectedJob ? (
          <CompanyProfileView
            employerId={viewingCompanyId}
            companyName={viewingCompanyName || selectedJob.company_name || ""}
            onBack={() => setViewingCompanyId(null)}
          />
        ) : selectedJob ? (
          <JobDetailView
            job={selectedJob}
            onBack={() => setSelectedJob(null)}
            onApply={() => handleApply(selectedJob)}
            applying={applying}
            alreadyApplied={appliedJobIds.has(selectedJob.id)}
            onViewCompany={() => {
              setViewingCompanyId(selectedJob.employer_id);
              setViewingCompanyName(selectedJob.company_name || null);
            }}
          />
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
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "16px" }}>
                {paginated.map(job => (
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
              <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            </>
          )
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* Apply toast */}
      {applyToast && (
        <div className={`fixed bottom-6 right-6 z-[9999] flex items-center gap-2.5 px-5 py-3.5 rounded-xl shadow-2xl text-sm font-semibold ${
          applyToast.ok ? "bg-gray-900 text-white" : "bg-red-500 text-white"
        }`}>
          {applyToast.msg}
        </div>
      )}
    </div>
  );
}