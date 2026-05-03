import { useState, useMemo, useEffect } from "react";
import Pagination from "./Pagination";
import { supabase } from "../../../lib/supabaseClient";
import { useAuth } from "../../../contexts/AuthContext";

const PAGE_SIZE = 9;

interface SavedJob {
  id: string; savedItemId: string; title: string; company: string; location: string;
  salary: string; jobType: string; savedDaysAgo: number; logo: string; tags: string[];
}
interface SavedEmployer {
  id: string; savedItemId: string; name: string; industry: string; location: string;
  rating: number; openRoles: number; size: string; logo: string;
}

// ── Shared styles ──────────────────────────────────────────────────────────────
const S = {
  card: { background:"#fff", border:"1.5px solid #E5E7EB", borderRadius:10, padding:"18px 20px", display:"flex" as const, flexDirection:"column" as const, transition:"border-color 0.15s ease" },
  logo: (dark=false) => ({ width:44, height:44, borderRadius:10, flexShrink:0 as const, background:dark?"#111827":"#F9FAFB", border:"1.5px solid #E5E7EB", display:"flex" as const, alignItems:"center" as const, justifyContent:"center" as const, fontSize: 19, fontWeight:700, color:dark?"#fff":"#111827", fontFamily:"'DM Mono',monospace" }),
  badge: (bg="#F3F4F6", color="#374151", border="#E5E7EB") => ({ fontSize: 13, padding:"3px 9px", borderRadius:4, background:bg, color, fontWeight:500 as const, border:`1px solid ${border}` }),
  btn: { display:"flex" as const, alignItems:"center" as const, gap:5, fontSize: 15, fontWeight:600 as const, padding:"7px 14px", background:"#111827", color:"#fff", border:"none", borderRadius:7, cursor:"pointer" as const, fontFamily:"'DM Sans',sans-serif" },
  meta: { display:"flex" as const, alignItems:"center" as const, gap:4, fontSize: 14, color:"#9CA3AF" },
  footer: { paddingTop:12, borderTop:"1px solid #F3F4F6", marginTop:"auto" as const, display:"flex" as const, alignItems:"center" as const, justifyContent:"space-between" as const },
};

// ── Icons ──────────────────────────────────────────────────────────────────────
const Svg = ({ d, size=13, fill="none" }: { d:string; size?:number; fill?:string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{__html:d}}/>
);
const Ico = {
  search:    <Svg size={15} d='<circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>'/>,
  bookmark:  <Svg size={15} fill="currentColor" d='<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>'/>,
  location:  <Svg d='<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>'/>,
  briefcase: <Svg d='<rect width="20" height="14" x="2" y="7" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>'/>,
  star:      <Svg fill="currentColor" d='<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>'/>,
  users:     <Svg d='<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>'/>,
  arrow:     <Svg size={14} d='<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>'/>,
  close:     <Svg d='<path d="M18 6 6 18"/><path d="m6 6 12 12"/>'/>,
};

const HoverBtn = ({ label }: { label: string }) => (
  <button style={S.btn}
    onMouseEnter={e=>(e.currentTarget.style.background="#1F2937")}
    onMouseLeave={e=>(e.currentTarget.style.background="#111827")}
  >{label} {Ico.arrow}</button>
);

const UnsaveBtn = ({ onUnsave }: { onUnsave: () => void }) => (
  <button onClick={onUnsave} style={{ background:"none", border:"none", cursor:"pointer", color:"#D97706", padding:2, flexShrink:0 }}>{Ico.bookmark}</button>
);

// ── Cards ──────────────────────────────────────────────────────────────────────
function JobCard({ job, onUnsave }: { job:SavedJob; onUnsave:()=>void }) {
  return (
    <div style={S.card} onMouseEnter={e=>(e.currentTarget.style.borderColor="#D1D5DB")} onMouseLeave={e=>(e.currentTarget.style.borderColor="#E5E7EB")}>
      <div style={{ display:"flex", gap:12, marginBottom:12 }}>
        <div style={S.logo()}>{job.logo}</div>
        <div style={{ flex:1 }}>
          <div style={{ display:"flex", justifyContent:"space-between" }}>
            <div>
              <p style={{ margin:0, fontSize: 17, fontWeight:700, color:"#111827" }}>{job.title}</p>
              <p style={{ margin:"2px 0 0", fontSize: 15, color:"#6B7280" }}>{job.company}</p>
            </div>
            <UnsaveBtn onUnsave={onUnsave}/>
          </div>
        </div>
      </div>
      <div style={{ display:"flex", gap:10, flexWrap:"wrap" as const, marginBottom:10 }}>
        <span style={S.meta}>{Ico.location} {job.location}</span>
        <span style={S.meta}>{Ico.briefcase} {job.jobType}</span>
      </div>
      <p style={{ margin:"0 0 10px", fontSize: 16, fontWeight:600, color:"#111827", fontFamily:"'DM Mono',monospace" }}>{job.salary}</p>
      <div style={{ display:"flex", gap:6, flexWrap:"wrap" as const, marginBottom:14 }}>
        {job.tags.map(t=><span key={t} style={S.badge()}>{t}</span>)}
      </div>
      <div style={S.footer}>
        <span style={{ fontSize: 14, color:"#9CA3AF", fontFamily:"'DM Mono',monospace" }}>Saved {job.savedDaysAgo}d ago</span>
        <HoverBtn label="View Job"/>
      </div>
    </div>
  );
}

function EmployerCard({ employer, onUnsave }: { employer:SavedEmployer; onUnsave:()=>void }) {
  const hiring = employer.openRoles > 0;
  const meta = [
    { icon: Ico.location,  text: employer.location },
    { icon: Ico.users,     text: employer.size },
    { icon: <span style={{color:"#D97706",display:"flex"}}>{Ico.star}</span>, text: `${employer.rating} rating` },
    { icon: Ico.briefcase, text: `${employer.openRoles} open roles` },
  ];
  return (
    <div style={S.card} onMouseEnter={e=>(e.currentTarget.style.borderColor="#D1D5DB")} onMouseLeave={e=>(e.currentTarget.style.borderColor="#E5E7EB")}>
      <div style={{ display:"flex", gap:12, marginBottom:14 }}>
        <div style={S.logo(true)}>{employer.logo}</div>
        <div style={{ flex:1 }}>
          <div style={{ display:"flex", justifyContent:"space-between" }}>
            <div>
              <p style={{ margin:0, fontSize: 17, fontWeight:700, color:"#111827" }}>{employer.name}</p>
              <p style={{ margin:"2px 0 0", fontSize: 15, color:"#6B7280" }}>{employer.industry}</p>
            </div>
            <UnsaveBtn onUnsave={onUnsave}/>
          </div>
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:14 }}>
        {meta.map(({ icon, text }, i) => (
          <div key={i} style={{ display:"flex", alignItems:"center", gap:5, fontSize: 14, color:"#6B7280", padding:"7px 10px", background:"#F9FAFB", border:"1px solid #E5E7EB", borderRadius:6 }}>
            <span style={{ color:"#9CA3AF", display:"flex" }}>{icon}</span>
            <span style={{ overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" as const }}>{text}</span>
          </div>
        ))}
      </div>
      <div style={S.footer}>
        <span style={S.badge(hiring?"#D1FAE5":"#F3F4F6", hiring?"#065F46":"#6B7280", hiring?"#A7F3D0":"#E5E7EB")}>
          {hiring ? `${employer.openRoles} hiring` : "No openings"}
        </span>
        <HoverBtn label="View Company"/>
      </div>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────────
export default function SavedPage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<SavedJob[]>([]);
  const [employers, setEmployers] = useState<SavedEmployer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"jobs"|"employers">("jobs");
  const [jobPage, setJobPage] = useState(1);
  const [empPage, setEmpPage] = useState(1);

  useEffect(() => {
    if (!user) return;
    
    async function fetchData() {
      setLoading(true);
      const { data: savedItems, error: savedError } = await supabase
        .from("saved_items")
        .select("*")
        .eq("user_id", user?.id);
        
      if (savedError || !savedItems) {
        console.error("Error fetching saved items:", savedError);
        setLoading(false);
        return;
      }
      
      const jobSaves = savedItems.filter((s: any) => s.job_id);
      const empSaves = savedItems.filter((s: any) => s.employer_id);
      
      let fetchedJobs: SavedJob[] = [];
      if (jobSaves.length > 0) {
        const jobIds = jobSaves.map((s: any) => s.job_id);
        const { data: jobsData } = await supabase.from("jobs").select("*").in("id", jobIds);
        
        if (jobsData) {
          const employerIds = [...new Set(jobsData.map(j => j.employer_id).filter(Boolean))];
          let companyMap: Record<string, string> = {};
          if (employerIds.length > 0) {
             const { data: companiesData } = await supabase.from("companies").select("owner_id, company_name").in("owner_id", employerIds);
             companyMap = Object.fromEntries((companiesData || []).map(c => [c.owner_id, c.company_name]));
          }
          
          fetchedJobs = jobSaves.map((save: any) => {
            const job = jobsData.find(j => j.id === save.job_id);
            if (!job) return null;
            const companyName = companyMap[job.employer_id] || "Unknown Company";
            const daysAgo = Math.max(0, Math.floor((Date.now() - new Date(save.created_at || Date.now()).getTime()) / 86400000));
            
            return {
              id: job.id,
              savedItemId: save.id,
              title: job.title,
              company: companyName,
              location: job.location,
              salary: job.salary_rate || "N/A",
              jobType: job.job_type,
              savedDaysAgo: daysAgo,
              logo: companyName.charAt(0).toUpperCase(),
              tags: job.required_skills ? job.required_skills.slice(0, 3) : [job.category].filter(Boolean)
            };
          }).filter(Boolean) as SavedJob[];
        }
      }
      
      let fetchedEmps: SavedEmployer[] = [];
      if (empSaves.length > 0) {
        const empIds = empSaves.map((s: any) => s.employer_id);
        const { data: compsData } = await supabase.from("companies").select("*").in("owner_id", empIds);
        
        if (compsData) {
          const { data: jobsCountData } = await supabase.from("jobs").select("employer_id").in("employer_id", empIds).eq("status", "active");
          
          const roleCounts = (jobsCountData || []).reduce((acc: any, j: any) => {
             acc[j.employer_id] = (acc[j.employer_id] || 0) + 1;
             return acc;
          }, {});
          
          fetchedEmps = empSaves.map((save: any) => {
            const comp = compsData.find(c => c.owner_id === save.employer_id);
            if (!comp) return null;
            
            return {
              id: comp.owner_id,
              savedItemId: save.id,
              name: comp.company_name,
              industry: comp.industry || "Not specified",
              location: comp.company_location || "Not specified",
              rating: 4.5,
              openRoles: roleCounts[comp.owner_id] || 0,
              size: comp.company_size || "Not specified",
              logo: comp.company_name.charAt(0).toUpperCase()
            };
          }).filter(Boolean) as SavedEmployer[];
        }
      }
      
      setJobs(fetchedJobs);
      setEmployers(fetchedEmps);
      setLoading(false);
    }
    
    fetchData();
  }, [user]);

  const handleUnsaveJob = async (job: SavedJob) => {
    setJobs(p => p.filter(x => x.savedItemId !== job.savedItemId));
    await supabase.from("saved_items").delete().eq("id", job.savedItemId);
  };
  
  const handleUnsaveEmployer = async (employer: SavedEmployer) => {
    setEmployers(p => p.filter(x => x.savedItemId !== employer.savedItemId));
    await supabase.from("saved_items").delete().eq("id", employer.savedItemId);
  };

  const q = search.toLowerCase();
  const fJobs = useMemo(() => jobs.filter(j=>[j.title,j.company,...j.tags].some(s=>s.toLowerCase().includes(q))), [jobs,q]);
  const fEmps = useMemo(() => employers.filter(e=>[e.name,e.industry].some(s=>s.toLowerCase().includes(q))), [employers,q]);
  const count = tab==="jobs" ? fJobs.length : fEmps.length;

  // Reset pages on search or tab change
  useMemo(() => { setJobPage(1); setEmpPage(1); }, [q, tab]);

  const jobTotalPages = Math.max(1, Math.ceil(fJobs.length / PAGE_SIZE));
  const empTotalPages = Math.max(1, Math.ceil(fEmps.length / PAGE_SIZE));
  const pJobs = fJobs.slice((jobPage - 1) * PAGE_SIZE, jobPage * PAGE_SIZE);
  const pEmps = fEmps.slice((empPage - 1) * PAGE_SIZE, empPage * PAGE_SIZE);

  return (
    <div style={{ fontFamily:"'DM Sans','Segoe UI',sans-serif", background:"#F9FAFB", minHeight:"100vh" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500;600&display=swap');*{box-sizing:border-box}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#E5E7EB;border-radius:4px}`}</style>

      {/* Top bar */}
      <div style={{ background:"#fff", borderBottom:"1px solid #E5E7EB", padding:"16px 26px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div>
          <h1 style={{ margin:0, fontSize: 22, fontWeight:700, color:"#111827" }}>Saved</h1>
          <p style={{ margin:0, fontSize: 15, color:"#9CA3AF", fontFamily:"'DM Mono',monospace" }}>{jobs.length} jobs · {employers.length} employers</p>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          {[{label:"Jobs",value:jobs.length,dark:false},{label:"Employers",value:employers.length,dark:true}].map(({label,value,dark})=>(
            <div key={label} style={{ padding:"7px 16px", borderRadius:6, textAlign:"center" as const, background:dark?"#111827":"#F3F4F6", border:dark?"none":"1px solid #E5E7EB" }}>
              <p style={{ margin:0, fontSize: 19, fontWeight:700, color:dark?"#fff":"#111827", fontFamily:"'DM Mono',monospace" }}>{value}</p>
              <p style={{ margin:0, fontSize: 13, color:dark?"#9CA3AF":"#6B7280", textTransform:"uppercase" as const, letterSpacing:"0.06em" }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Filter bar */}
      <div style={{ background:"#fff", borderBottom:"1px solid #E5E7EB", padding:"10px 26px", display:"flex", alignItems:"center", gap:10 }}>
        <div style={{ position:"relative" as const, flex:1, maxWidth:300 }}>
          <span style={{ position:"absolute" as const, left:10, top:"50%", transform:"translateY(-50%)", color:"#9CA3AF", display:"flex" }}>{Ico.search}</span>
          <input value={search} onChange={e=>setSearch(e.target.value)}
            placeholder={tab==="jobs"?"Search jobs, companies, skills…":"Search employers or industry…"}
            style={{ width:"100%", padding:"8px 32px", border:"1px solid #E5E7EB", borderRadius:7, fontSize: 15, color:"#111827", background:"#F9FAFB", outline:"none", fontFamily:"'DM Sans',sans-serif" }}
          />
          {search && <button onClick={()=>setSearch("")} style={{ position:"absolute" as const, right:8, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"#9CA3AF", display:"flex" }}>{Ico.close}</button>}
        </div>
        <div style={{ display:"flex", gap:4, background:"#F3F4F6", padding:4, borderRadius:8 }}>
          {(["jobs","employers"] as const).map(t=>(
            <button key={t} onClick={()=>setTab(t)} style={{ padding:"7px 16px", borderRadius:6, cursor:"pointer", fontSize: 15, fontWeight:600, fontFamily:"'DM Sans',sans-serif", background:tab===t?"#fff":"transparent", color:tab===t?"#111827":"#6B7280", border:tab===t?"1px solid #E5E7EB":"1px solid transparent", transition:"all 0.15s ease" }}>
              {t==="jobs"?"Saved Jobs":"Saved Employers"}
            </button>
          ))}
        </div>
        <span style={{ fontSize: 15, color:"#9CA3AF", marginLeft:"auto", fontFamily:"'DM Mono',monospace" }}>{count} result{count!==1?"s":""}</span>
      </div>

      {/* Grid */}
      <div style={{ padding:"22px 26px" }}>
        {loading ? (
          <div style={{ padding:56, textAlign:"center" as const, borderRadius:10, background:"#fff" }}>
            <p style={{ margin:0, fontSize: 17, color:"#9CA3AF" }}>Loading saved items...</p>
          </div>
        ) : count===0 ? (
          <div style={{ padding:56, textAlign:"center" as const, border:"1.5px dashed #E5E7EB", borderRadius:10, background:"#fff" }}>
            <p style={{ margin:0, fontSize: 17, color:"#9CA3AF" }}>{search?`No saved ${tab} match your search.`:`You have no saved ${tab} yet.`}</p>
          </div>
        ) : (
          <>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:14 }}>
              {tab==="jobs"
                ? pJobs.map(j=><JobCard key={j.savedItemId} job={j} onUnsave={()=>handleUnsaveJob(j)}/>)
                : pEmps.map(e=><EmployerCard key={e.savedItemId} employer={e} onUnsave={()=>handleUnsaveEmployer(e)}/>)
              }
            </div>
            <Pagination
              page={tab==="jobs" ? jobPage : empPage}
              totalPages={tab==="jobs" ? jobTotalPages : empTotalPages}
              onPageChange={tab==="jobs" ? setJobPage : setEmpPage}
            />
          </>
        )}
      </div>
    </div>
  );
}