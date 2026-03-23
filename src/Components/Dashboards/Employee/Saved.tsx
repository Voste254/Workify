import { useState, useMemo } from "react";

interface SavedJob {
  id: string; title: string; company: string; location: string;
  salary: string; jobType: string; savedDaysAgo: number; logo: string; tags: string[];
}
interface SavedEmployer {
  id: string; name: string; industry: string; location: string;
  rating: number; openRoles: number; size: string; logo: string;
}

const JOBS: SavedJob[] = [
  { id:"1", title:"Frontend Developer", company:"TechCorp Kenya", location:"Nairobi, Kenya", salary:"KES 180,000–220,000", jobType:"Corporate – Permanent", savedDaysAgo:2, logo:"T", tags:["React","TypeScript","Tailwind"] },
  { id:"2", title:"Data Analyst", company:"KCB Group", location:"Nairobi, Kenya", salary:"KES 150,000–200,000", jobType:"Corporate – Contract", savedDaysAgo:5, logo:"K", tags:["SQL","Python","Power BI"] },
  { id:"3", title:"Graphic Designer", company:"Nation Media Group", location:"Nairobi, Kenya", salary:"KES 85,000–110,000", jobType:"Corporate – Contract", savedDaysAgo:1, logo:"N", tags:["Figma","Adobe XD","Illustrator"] },
  { id:"4", title:"Electrician – Site Work", company:"PowerGrid Kenya", location:"Kisumu, Kenya", salary:"KES 2,800/day", jobType:"Casual – Daily", savedDaysAgo:3, logo:"P", tags:["Wiring","Industrial","Safety"] },
];
const EMPLOYERS: SavedEmployer[] = [
  { id:"1", name:"Safaricom PLC", industry:"Telecommunications", location:"Nairobi, Kenya", rating:4.7, openRoles:12, size:"5,000+ employees", logo:"S" },
  { id:"2", name:"Africa Fintech", industry:"Financial Technology", location:"Lagos, Nigeria", rating:4.5, openRoles:6, size:"200–500 employees", logo:"A" },
  { id:"3", name:"Andela", industry:"Technology Staffing", location:"Remote / Pan-Africa", rating:4.8, openRoles:34, size:"1,000–5,000 employees", logo:"A" },
];

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
  const [jobs, setJobs] = useState(JOBS);
  const [employers, setEmployers] = useState(EMPLOYERS);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"jobs"|"employers">("jobs");

  const q = search.toLowerCase();
  const fJobs = useMemo(() => jobs.filter(j=>[j.title,j.company,...j.tags].some(s=>s.toLowerCase().includes(q))), [jobs,q]);
  const fEmps = useMemo(() => employers.filter(e=>[e.name,e.industry].some(s=>s.toLowerCase().includes(q))), [employers,q]);
  const count = tab==="jobs" ? fJobs.length : fEmps.length;

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
        {count===0 ? (
          <div style={{ padding:56, textAlign:"center" as const, border:"1.5px dashed #E5E7EB", borderRadius:10, background:"#fff" }}>
            <p style={{ margin:0, fontSize: 17, color:"#9CA3AF" }}>{search?`No saved ${tab} match your search.`:`You have no saved ${tab} yet.`}</p>
          </div>
        ) : (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:14 }}>
            {tab==="jobs"
              ? fJobs.map(j=><JobCard key={j.id} job={j} onUnsave={()=>setJobs(p=>p.filter(x=>x.id!==j.id))}/>)
              : fEmps.map(e=><EmployerCard key={e.id} employer={e} onUnsave={()=>setEmployers(p=>p.filter(x=>x.id!==e.id))}/>)
            }
          </div>
        )}
      </div>
    </div>
  );
}