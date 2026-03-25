import { useState, useMemo } from "react";
import { Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import JobCard from "./JobCard";

// Types
type JobType = "Corporate" | "Manual/Casual";
type ContractType = "Permanent" | "Contractual" | "Daily" | "Hourly";

interface Job {
  category: string;
  title: string; company: string; location: string; salary: string;
  jobType: JobType; contractType: ContractType; rating: number; daysAgo: number;
}

// Categories from the image
const CATEGORIES = [
  { name: "Software Engineer", salary: "$130,988" },
  { name: "Registered Nurse", salary: "$94,161" },
  { name: "Accountant", salary: "$67,907" },
  { name: "Business Analyst", salary: "$89,256" },
  { name: "Nursing Assistant", salary: "$46,439" },
  { name: "Sales Executive", salary: "$92,134" },
  { name: "Human Resources Specialist", salary: "$63,818" },
  { name: "Customer Service Representative", salary: "$66,829" },
  { name: "Assistant Store Manager", salary: "$39,248" },
];

const JOBS: Job[] = [
  { category: "Software Engineer", title: "Senior Frontend Developer", company: "TechCorp Kenya", location: "Nairobi, Kenya", salary: "180,000–250,000", jobType: "Corporate", contractType: "Permanent", rating: 4.8, daysAgo: 4 },
  { category: "Software Engineer", title: "Backend Engineer", company: "Safaricom PLC", location: "Nairobi, Kenya", salary: "200,000–300,000", jobType: "Corporate", contractType: "Permanent", rating: 4.6, daysAgo: 2 },
  { category: "Software Engineer", title: "React Developer (6 months)", company: "Africa Fintech", location: "Lagos, Nigeria", salary: "150,000–220,000", jobType: "Corporate", contractType: "Contractual", rating: 4.4, daysAgo: 6 },
  { category: "Business Analyst", title: "Data Analyst", company: "KCB Group", location: "Nairobi, Kenya", salary: "120,000–180,000", jobType: "Corporate", contractType: "Contractual", rating: 4.2, daysAgo: 5 },
  { category: "Manual/Casual", title: "Construction Worker", company: "BuildRight Ltd", location: "Nairobi, Kenya", salary: "2,500/day", jobType: "Manual/Casual", contractType: "Daily", rating: 4.1, daysAgo: 1 },
  { category: "Manual/Casual", title: "Warehouse Loader", company: "QuickLogistics", location: "Mombasa, Kenya", salary: "2,000/day", jobType: "Manual/Casual", contractType: "Daily", rating: 4.0, daysAgo: 3 },
  { category: "Manual/Casual", title: "House Cleaner", company: "Sparkle Services", location: "Nairobi, Kenya", salary: "500/hr", jobType: "Manual/Casual", contractType: "Hourly", rating: 4.3, daysAgo: 2 },
  { category: "Manual/Casual", title: "Delivery Rider", company: "SwiftSend", location: "Nairobi, Kenya", salary: "600/hr", jobType: "Manual/Casual", contractType: "Hourly", rating: 4.4, daysAgo: 4 },
  { category: "Accountant", title: "Senior Accountant", company: "KPMG", location: "Nairobi, Kenya", salary: "150,000–200,000", jobType: "Corporate", contractType: "Permanent", rating: 4.7, daysAgo: 1 },
  { category: "Registered Nurse", title: "ER Nurse", company: "Aga Khan Hospital", location: "Nairobi, Kenya", salary: "80,000–120,000", jobType: "Corporate", contractType: "Permanent", rating: 4.9, daysAgo: 3 },
  { category: "Sales Executive", title: "Regional Sales Executive", company: "Coca-Cola", location: "Nairobi, Kenya", salary: "90,000 + Comm", jobType: "Corporate", contractType: "Permanent", rating: 4.5, daysAgo: 2 },
];

const CONTRACT_TYPES = ["All", "Permanent", "Contractual", "Daily", "Hourly"] as const;
const LOCATIONS = ["All Locations", "Nairobi, Kenya", "Mombasa, Kenya", "Lagos, Nigeria"];
const SORT_OPTIONS = ["Newest", "Highest Rated", "Salary: High to Low"];

const Sel = ({ value, onChange, children }: React.SelectHTMLAttributes<HTMLSelectElement> & { children: React.ReactNode }) => (
  <select value={value} onChange={onChange} style={{ height: "36px", border: "1px solid #e5e7eb", backgroundColor: "#ffffff", padding: "0 12px", fontSize: "14px", color: "#374151", outline: "none", cursor: "pointer", borderRadius: "6px", fontFamily: "inherit" }}>
    {children}
  </select>
);

export default function FindJobsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [jobType, setJobType] = useState("All");
  const [contract, setContract] = useState("All");
  const [location, setLocation] = useState("All Locations");
  const [sort, setSort] = useState("Newest");

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
        (selectedCategory === null || j.category === selectedCategory || (selectedCategory === "Browse All" && true)) &&
        (jobType === "All" || j.jobType === jobType) &&
        (contract === "All" || j.contractType === contract) &&
        (location === "All Locations" || j.location === location) &&
        (!q || j.title.toLowerCase().includes(q) || j.company.toLowerCase().includes(q))
      );
    })
    .sort((a, b) =>
      sort === "Highest Rated" ? b.rating - a.rating :
      sort === "Salary: High to Low" ? b.salary.localeCompare(a.salary) :
      a.daysAgo - b.daysAgo
    ),
  [search, jobType, contract, location, sort, selectedCategory]);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB", fontFamily: "'DM Sans','Segoe UI',sans-serif", boxSizing: "border-box", color: "#111827" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500;600&display=swap');*{box-sizing:border-box}`}</style>

      {/* Top bar */}
      <div style={{ backgroundColor: "#ffffff", borderBottom: "1px solid #e5e7eb", padding: "20px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "700", margin: "0 0 4px 0", color: "#111827" }}>Find Jobs</h1>
          <p style={{ fontSize: "14px", color: "#4b5563", margin: "0", fontFamily: "'DM Mono', monospace" }}>{selectedCategory ? `Viewing category: ${selectedCategory}` : "Select a category to explore opportunities"}</p>
        </div>
        {/* Job type tabs */}
        {selectedCategory && (
          <div style={{ display: "flex", alignItems: "center", gap: "4px", backgroundColor: "#f3f4f6", padding: "4px", borderRadius: "8px" }}>
            {(["All", "Corporate", "Manual/Casual"] as const).map(t => (
              <button key={t} onClick={() => setJobType(t)}
                style={{ padding: "6px 12px", fontSize: "14px", fontWeight: "600", borderRadius: "6px", cursor: "pointer", border: jobType === t ? "1px solid #e5e7eb" : "none", backgroundColor: jobType === t ? "#ffffff" : "transparent", color: jobType === t ? "#111827" : "#6b7280" }}>
                {t} <span style={{ fontFamily: "'DM Mono', monospace", marginLeft: "4px", opacity: 0.6 }}>{t === "All" ? JOBS.filter(j => j.category === selectedCategory || selectedCategory === "Browse All").length : JOBS.filter(j => (j.category === selectedCategory || selectedCategory === "Browse All") && j.jobType === t).length}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {!selectedCategory ? (
        /* CATEGORY VIEW */
        <div style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "16px" }}>
            {CATEGORIES.map((cat, idx) => (
              <div 
                key={idx} 
                onClick={() => setSelectedCategory(cat.name)}
                style={{ backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #e5e7eb", padding: "24px", cursor: "pointer", display: "flex", flexDirection: "column", gap: "12px", transition: "box-shadow 0.2s ease" }}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)")}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
              >
                <h3 style={{ fontSize: "16px", fontWeight: "600", margin: "0", color: "#111827" }}>{cat.name}</h3>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", color: "#2563eb", fontWeight: "600", fontSize: "15px" }}>
                  <span>Average Salary {cat.salary} per year</span>
                  <ChevronRight size={18} />
                </div>
                <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px solid #f3f4f6" }}>
                  <span style={{ fontSize: "13px", color: "#6b7280", textDecoration: "underline" }}>Job Openings</span>
                </div>
              </div>
            ))}
            
            {/* Catch-All Category item for testing existing jobs without specific matched categories */}
            <div 
                onClick={() => setSelectedCategory("Browse All")}
                style={{ backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #e5e7eb", padding: "24px", cursor: "pointer", display: "flex", flexDirection: "column", gap: "12px", transition: "box-shadow 0.2s ease" }}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)")}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
              >
                <h3 style={{ fontSize: "16px", fontWeight: "600", margin: "0", color: "#111827" }}>Browse All Remote & Local</h3>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", color: "#2563eb", fontWeight: "600", fontSize: "15px" }}>
                  <span>View overall job openings</span>
                  <ChevronRight size={18} />
                </div>
                <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px solid #f3f4f6" }}>
                  <span style={{ fontSize: "13px", color: "#6b7280", textDecoration: "underline" }}>View All Jobs</span>
                </div>
              </div>
          </div>
        </div>
      ) : (
        /* JOBS LIST VIEW */
        <>
          <div style={{ backgroundColor: "#ffffff", borderBottom: "1px solid #e5e7eb", padding: "12px 40px", display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
            <button 
              onClick={() => setSelectedCategory(null)}
              style={{ display: "flex", alignItems: "center", gap: "6px", backgroundColor: "#f3f4f6", border: "none", padding: "8px 16px", borderRadius: "6px", fontFamily: "inherit", fontWeight: "600", color: "#374151", cursor: "pointer", marginRight: "16px" }}
            >
              <ChevronLeft size={16} />
              Back to Categories
            </button>
            
            <div style={{ position: "relative", flex: 1, minWidth: "180px", maxWidth: "320px" }}>
              <Search size={14} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search jobs or companies…"
                 style={{ width: "100%", height: "36px", border: "1px solid #e5e7eb", padding: "0 32px", fontSize: "14px", color: "#111827", outline: "none", borderRadius: "6px", fontFamily: "inherit", boxSizing: "border-box" }} />
              {search && <button onClick={() => setSearch("")} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#9ca3af", cursor: "pointer" }}><X size={14}/></button>}
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
            <span style={{ fontSize: "14px", color: "#9ca3af", fontFamily: "'DM Mono', monospace", marginLeft: "auto" }}>{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
          </div>

          {activeFilters.length > 0 && (
            <div style={{ padding: "10px 40px", display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", backgroundColor: "#ffffff", borderBottom: "1px solid #e5e7eb" }}>
              <span style={{ fontSize: "14px", color: "#9ca3af" }}>Active:</span>
              {activeFilters.map(f => (
                <span key={f} style={{ display: "flex", alignItems: "center", gap: "6px", backgroundColor: "#111827", color: "#ffffff", fontSize: "13px", padding: "4px 10px", borderRadius: "4px", fontFamily: "'DM Mono', monospace" }}>
                  {f} <button onClick={() => clearFilter(f)} style={{ opacity: 0.6, background: "none", border: "none", color: "#ffffff", cursor: "pointer", padding: "0" }}><X size={11}/></button>
                </span>
              ))}
              <button onClick={() => { setJobType("All"); setContract("All"); setLocation("All Locations"); }}
                style={{ fontSize: "13px", color: "#9ca3af", textDecoration: "underline", background: "none", border: "none", cursor: "pointer", marginLeft: "4px" }}>Clear all</button>
            </div>
          )}

          <div style={{ padding: "32px 40px", maxWidth: "1200px", margin: "0 auto" }}>
            {filtered.length === 0 ? (
              <div style={{ border: "1.5px dashed #e5e7eb", backgroundColor: "#ffffff", padding: "80px 20px", textAlign: "center", borderRadius: "12px" }}>
                <p style={{ fontSize: "16px", fontWeight: "600", color: "#111827", margin: "0 0 8px 0" }}>No jobs found in {selectedCategory}</p>
                <p style={{ fontSize: "14px", color: "#9ca3af", margin: "0" }}>Try adjusting your search or filters.</p>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "16px" }}>
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
        </>
      )}
    </div>
  );
}