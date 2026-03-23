import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import JobCard from "./JobCard";

type JobType = "Corporate" | "Manual/Casual";
type ContractType = "Permanent" | "Contractual" | "Daily" | "Hourly";

interface Job {
  title: string; company: string; location: string; salary: string;
  jobType: JobType; contractType: ContractType; rating: number; daysAgo: number;
}

// TODO: replace with Supabase fetch
const JOBS: Job[] = [
  { title: "Senior Frontend Developer", company: "TechCorp Kenya",   location: "Nairobi, Kenya", salary: "180,000–250,000", jobType: "Corporate",     contractType: "Permanent",   rating: 4.8, daysAgo: 4 },
  { title: "Backend Engineer",          company: "Safaricom PLC",    location: "Nairobi, Kenya", salary: "200,000–300,000", jobType: "Corporate",     contractType: "Permanent",   rating: 4.6, daysAgo: 2 },
  { title: "React Developer (6 months)",company: "Africa Fintech",   location: "Lagos, Nigeria", salary: "150,000–220,000", jobType: "Corporate",     contractType: "Contractual", rating: 4.4, daysAgo: 6 },
  { title: "Data Analyst",              company: "KCB Group",        location: "Nairobi, Kenya", salary: "120,000–180,000", jobType: "Corporate",     contractType: "Contractual", rating: 4.2, daysAgo: 5 },
  { title: "Construction Worker",       company: "BuildRight Ltd",   location: "Nairobi, Kenya", salary: "2,500/day",       jobType: "Manual/Casual", contractType: "Daily",       rating: 4.1, daysAgo: 1 },
  { title: "Warehouse Loader",          company: "QuickLogistics",   location: "Mombasa, Kenya", salary: "2,000/day",       jobType: "Manual/Casual", contractType: "Daily",       rating: 4.0, daysAgo: 3 },
  { title: "House Cleaner",             company: "Sparkle Services", location: "Nairobi, Kenya", salary: "500/hr",          jobType: "Manual/Casual", contractType: "Hourly",      rating: 4.3, daysAgo: 2 },
  { title: "Delivery Rider",            company: "SwiftSend",        location: "Nairobi, Kenya", salary: "600/hr",          jobType: "Manual/Casual", contractType: "Hourly",      rating: 4.4, daysAgo: 4 },
];

const CONTRACT_TYPES = ["All", "Permanent", "Contractual", "Daily", "Hourly"] as const;
const LOCATIONS      = ["All Locations", "Nairobi, Kenya", "Mombasa, Kenya", "Lagos, Nigeria"];
const SORT_OPTIONS   = ["Newest", "Highest Rated", "Salary: High to Low"];

const Sel = ({ value, onChange, children }: React.SelectHTMLAttributes<HTMLSelectElement> & { children: React.ReactNode }) => (
  <select value={value} onChange={onChange} className="h-9 border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none focus:border-gray-900 transition appearance-none cursor-pointer">
    {children}
  </select>
);

export default function FindJobsPage() {
  const [search, setSearch]   = useState("");
  const [jobType, setJobType] = useState("All");
  const [contract, setContract] = useState("All");
  const [location, setLocation] = useState("All Locations");
  const [sort, setSort]         = useState("Newest");

  const activeFilters = [
    jobType !== "All" && jobType,
    contract !== "All" && contract,
    location !== "All Locations" && location,
  ].filter(Boolean) as string[];

  const clearFilter = (f: string) => {
    if (f === jobType) setJobType("All");
    else if (f === contract) setContract("All");
    else setLocation("All Locations");
  };

  const filtered = useMemo(() => JOBS
    .filter(j => {
      const q = search.toLowerCase();
      return (
        (jobType === "All"            || j.jobType === jobType) &&
        (contract === "All"           || j.contractType === contract) &&
        (location === "All Locations" || j.location === location) &&
        (!q || j.title.toLowerCase().includes(q) || j.company.toLowerCase().includes(q))
      );
    })
    .sort((a, b) =>
      sort === "Highest Rated"       ? b.rating - a.rating :
      sort === "Salary: High to Low" ? b.salary.localeCompare(a.salary) :
      a.daysAgo - b.daysAgo
    ),
  [search, jobType, contract, location, sort]);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 px-6 lg:px-10 py-5 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Find Jobs</h1>
          <p className="text-sm text-gray-600 font-mono mt-0.5">{filtered.length} listing{filtered.length !== 1 ? "s" : ""} available</p>
        </div>
        {/* Job type tabs */}
        <div className="flex items-center gap-1 bg-gray-100 p-1">
          {(["All", "Corporate", "Manual/Casual"] as const).map(t => (
            <button key={t} onClick={() => setJobType(t)}
              className={`px-3 py-1.5 text-sm font-semibold transition ${jobType === t ? "bg-white text-gray-900 border border-gray-200" : "text-gray-500 hover:text-gray-700"}`}>
              {t} <span className="font-mono ml-1 opacity-60">{t === "All" ? JOBS.length : JOBS.filter(j => j.jobType === t).length}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-white border-b border-gray-200 px-6 lg:px-10 py-3 flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search jobs or companies…"
            className="w-full h-9 border border-gray-200 pl-8 pr-8 text-sm text-gray-900 outline-none focus:border-gray-900 transition placeholder:text-gray-400 bg-white"/>
          {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"><X size={13}/></button>}
        </div>
        <Sel value={contract} onChange={e => setContract(e.target.value)}>
          {CONTRACT_TYPES.map(t => <option key={t} value={t}>{t === "All" ? "All Contracts" : t}</option>)}
        </Sel>
        <Sel value={location} onChange={e => setLocation(e.target.value)}>
          {LOCATIONS.map(l => <option key={l}>{l}</option>)}
        </Sel>
        <Sel value={sort} onChange={e => setSort(e.target.value)}>
          {SORT_OPTIONS.map(s => <option key={s}>{s}</option>)}
        </Sel>
        <span className="text-sm text-gray-400 font-mono ml-auto">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Active filter chips */}
      {activeFilters.length > 0 && (
        <div className="px-6 lg:px-10 py-2.5 flex items-center gap-2 flex-wrap bg-white border-b border-gray-200">
          <span className="text-sm text-gray-400">Active:</span>
          {activeFilters.map(f => (
            <span key={f} className="flex items-center gap-1.5 bg-gray-900 text-white text-sm px-2.5 py-1 font-mono">
              {f} <button onClick={() => clearFilter(f)} className="opacity-60 hover:opacity-100"><X size={11}/></button>
            </span>
          ))}
          <button onClick={() => { setJobType("All"); setContract("All"); setLocation("All Locations"); }}
            className="text-sm text-gray-400 hover:text-gray-700 underline ml-1">Clear all</button>
        </div>
      )}

      {/* Grid */}
      <div className="px-6 lg:px-10 py-6">
        {filtered.length === 0 ? (
          <div className="border-[1.5px] border-dashed border-gray-200 bg-white py-20 text-center">
            <p className="text-base font-semibold text-gray-900 mb-1">No jobs found</p>
            <p className="text-sm text-gray-400">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((job, i) => (
              <JobCard
                key={i}
                title={job.title}
                company={job.company}
                location={job.location}
                salary={job.salary}
                type={job.contractType === "Daily" || job.contractType === "Hourly" ? "Internship" : job.contractType}
                rating={job.rating}
                daysAgo={job.daysAgo}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}