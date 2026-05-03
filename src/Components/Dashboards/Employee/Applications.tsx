import { useState, useEffect, useMemo } from "react";
import Pagination from "./Pagination";
import { supabase } from "../../../lib/supabaseClient";

const PAGE_SIZE = 8;

// ── Types & Config ─────────────────────────────────────────────────────────────
type Stage = "applied"|"screening"|"interview"|"assessment"|"offer"|"hired"|"rejected"|"withdrawn";
type SortKey = "lastUpdated"|"appliedDate"|"company";

interface Application {
  id: string; jobTitle: string; company: string; location: string;
  jobType: string; salary: string; appliedDate: string; lastUpdated: string;
  stage: Stage; logo: string; isBookmarked: boolean;
  nextAction?: string; nextActionDate?: string; notes?: string;
  recruiterName?: string; recruiterEmail?: string;
}

const SC: Record<Stage,{label:string;color:string;bg:string;step:number}> = {
  applied:    {label:"Applied",    color:"#6B7280", bg:"#F3F4F6", step:1},
  screening:  {label:"Screening",  color:"#D97706", bg:"#FEF3C7", step:2},
  interview:  {label:"Interview",  color:"#2563EB", bg:"#DBEAFE", step:3},
  assessment: {label:"Assessment", color:"#7C3AED", bg:"#EDE9FE", step:4},
  offer:      {label:"Offer",      color:"#059669", bg:"#D1FAE5", step:5},
  hired:      {label:"Hired",      color:"#FFFFFF", bg:"#111827", step:6},
  rejected:   {label:"Rejected",   color:"#FFFFFF", bg:"#DC2626", step:0},
  withdrawn:  {label:"Withdrawn",  color:"#FFFFFF", bg:"#9CA3AF", step:0},
};

const ACTIVE_STAGES: Stage[] = ["applied","screening","interview","assessment","offer","hired"];

// ── Helpers ────────────────────────────────────────────────────────────────────
const fmtDate = (d:string) => new Date(d).toLocaleDateString("en-KE",{day:"2-digit",month:"short",year:"numeric"});
const daysAgo = (d:string) => { const n=Math.floor((Date.now()-new Date(d).getTime())/86400000); return n===0?"Today":n===1?"Yesterday":`${n}d ago`; };
const daysUntil = (d:string) => { const n=Math.ceil((new Date(d).getTime()-Date.now())/86400000); return n<0?"Overdue":n===0?"Today":n===1?"Tomorrow":`In ${n} days`; };
const isTerminal = (s:Stage) => s==="rejected"||s==="withdrawn";

// ── Icons ──────────────────────────────────────────────────────────────────────
const I = (d:string,s=13,fill="none") => <svg width={s} height={s} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{__html:d}}/>;
const Ico = {
  search:   I('<circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>',14),
  bookmark: (f:boolean) => I('<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>',14,f?"currentColor":"none"),
  location: I('<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',12),
  calendar: I('<rect width="18" height="18" x="3" y="4" rx="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/>',12),
  mail:     I('<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>'),
  close:    I('<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',14),
  alert:    I('<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>'),
  check:    I('<path d="M20 6 9 17l-5-5"/>',10),
  withdraw: I('<path d="M9 9l-2 2 2 2"/><path d="M13 13l2-2-2-2"/><rect width="18" height="18" x="3" y="3" rx="2"/>'),
};

// ── Shared styles ──────────────────────────────────────────────────────────────
const sel = { fontFamily:"'DM Sans',sans-serif", padding:"7px 10px", border:"1px solid #E5E7EB", borderRadius:6, fontSize: 14, color:"#374151", background:"#F9FAFB", cursor:"pointer", outline:"none" };
const sectionLabel = { margin:"0 0 8px", fontSize: 13, fontWeight:700, textTransform:"uppercase" as const, letterSpacing:"0.1em", color:"#9CA3AF" };
const iconBtn = (color="#6B7280") => ({ background:"none", border:"1px solid #E5E7EB", borderRadius:6, padding:"6px 8px", cursor:"pointer", color, display:"flex", alignItems:"center" as const });

// ── Stage Progress Bar ─────────────────────────────────────────────────────────
function StageBar({ stage }: { stage: Stage }) {
  const cfg = SC[stage];
  if (isTerminal(stage)) return (
    <span style={{ fontSize: 13, fontWeight:600, letterSpacing:"0.06em", textTransform:"uppercase", padding:"3px 10px", borderRadius:3, color:cfg.color, background:cfg.bg }}>{cfg.label}</span>
  );
  return (
    <div style={{ display:"flex", alignItems:"center", gap:4 }}>
      {ACTIVE_STAGES.map(s => {
        const active = s===stage, past = SC[s].step < cfg.step;
        return <div key={s} title={SC[s].label} style={{ width:active?28:8, height:8, borderRadius:4, background:active||past?"#111827":"#E5E7EB", opacity:past?0.3:1, transition:"width 0.3s ease" }}/>;
      })}
      <span style={{ fontSize: 13, fontWeight:600, letterSpacing:"0.05em", textTransform:"uppercase", color:"#111827", marginLeft:4 }}>{cfg.label}</span>
    </div>
  );
}

// ── Application Card ───────────────────────────────────────────────────────────
function AppCard({ app, selected, onSelect, onBookmark, onWithdraw, onDelete }: { app:Application; selected:boolean; onSelect:()=>void; onBookmark:()=>void; onWithdraw:()=>void; onDelete:()=>void }) {
  const terminal = isTerminal(app.stage);
  const urgent = app.nextActionDate && ["Today","Tomorrow"].includes(daysUntil(app.nextActionDate));
  return (
    <div onClick={onSelect} style={{ background:"#fff", border:`1.5px solid ${selected?"#111827":"#E5E7EB"}`, borderRadius:8, padding:"16px 18px", cursor:"pointer", opacity:terminal?0.7:1, transition:"border-color 0.15s", position:"relative" as const }}>
      {urgent && !terminal && <div style={{ position:"absolute", top:12, right:12, width:7, height:7, borderRadius:"50%", background:"#EF4444" }}/>}
      <div style={{ display:"flex", gap:12 }}>
        <div style={{ width:40, height:40, borderRadius:8, background:"#F9FAFB", border:"1.5px solid #E5E7EB", display:"flex", alignItems:"center", justifyContent:"center", fontSize: 18, fontWeight:700, color:"#111827", flexShrink:0, fontFamily:"'DM Mono',monospace" }}>{app.logo}</div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:2 }}>
            <p style={{ margin:0, fontSize: 16, fontWeight:600, color:"#111827" }}>{app.jobTitle}</p>
            <button onClick={e=>{e.stopPropagation();onBookmark();}} style={{ background:"none", border:"none", cursor:"pointer", padding:2, color:app.isBookmarked?"#D97706":"#9CA3AF" }}>{Ico.bookmark(app.isBookmarked)}</button>
          </div>
          <p style={{ margin:0, fontSize: 14, color:"#6B7280" }}>{app.company}</p>
          <div style={{ display:"flex", gap:10, marginTop:8, flexWrap:"wrap" as const }}>
            <span style={{ display:"flex", alignItems:"center", gap:3, fontSize: 13, color:"#9CA3AF" }}>{Ico.location} {app.location}</span>
            <span style={{ fontSize: 13, color:"#6B7280", padding:"2px 7px", background:"#F3F4F6", borderRadius:3, fontWeight:500 }}>{app.jobType}</span>
          </div>
          <div style={{ marginTop:10 }}><StageBar stage={app.stage}/></div>
          {app.nextAction && !terminal && (
            <div style={{ marginTop:10, padding:"7px 10px", background:urgent?"#FEF2F2":"#F9FAFB", border:`1px solid ${urgent?"#FECACA":"#E5E7EB"}`, borderRadius:6, display:"flex", alignItems:"center", gap:6 }}>
              <span style={{ color:urgent?"#DC2626":"#D97706" }}>{Ico.alert}</span>
              <span style={{ fontSize: 13, color:urgent?"#DC2626":"#6B7280" }}>
                {app.nextAction}{app.nextActionDate && <strong style={{ marginLeft:4, color:urgent?"#DC2626":"#111827" }}> — {daysUntil(app.nextActionDate)}</strong>}
              </span>
            </div>
          )}
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:10 }}>
            <span style={{ fontSize: 13, color:"#9CA3AF", fontFamily:"'DM Mono',monospace" }}>Updated {daysAgo(app.lastUpdated)}</span>
            {!terminal && app.stage!=="hired" && (
              <button onClick={e=>{e.stopPropagation();onWithdraw();}} style={{ background:"none", border:"none", cursor:"pointer", fontSize: 13, color:"#9CA3AF", display:"flex", alignItems:"center", gap:3 }}>
                {Ico.withdraw} Withdraw
              </button>
            )}
            {app.stage === "withdrawn" && (
              <button onClick={e=>{e.stopPropagation();onDelete();}} style={{ background:"none", border:"none", cursor:"pointer", fontSize: 13, color:"#DC2626", display:"flex", alignItems:"center", gap:3 }}>
                {Ico.close} Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Detail Panel ───────────────────────────────────────────────────────────────
function DetailPanel({ app, onClose, onBookmark }: { app:Application; onClose:()=>void; onBookmark:()=>void }) {
  const cfg = SC[app.stage];
  const terminal = isTerminal(app.stage);
  const timeline = ACTIVE_STAGES.map(s => ({ label:SC[s].label, done:SC[s].step<cfg.step, active:s===app.stage&&!terminal }));
  return (
    <div style={{ background:"#fff", border:"1.5px solid #E5E7EB", borderRadius:10, height:"100%", display:"flex", flexDirection:"column", overflow:"hidden" }}>
      {/* Header */}
      <div style={{ padding:"18px 20px", borderBottom:"1px solid #E5E7EB" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:44, height:44, borderRadius:10, background:"#F9FAFB", border:"1.5px solid #E5E7EB", display:"flex", alignItems:"center", justifyContent:"center", fontSize: 20, fontWeight:700, fontFamily:"'DM Mono',monospace" }}>{app.logo}</div>
            <div>
              <p style={{ margin:0, fontSize: 17, fontWeight:700, color:"#111827" }}>{app.jobTitle}</p>
              <p style={{ margin:0, fontSize: 14, color:"#6B7280" }}>{app.company} · {app.location}</p>
            </div>
          </div>
          <div style={{ display:"flex", gap:6 }}>
            <button onClick={onBookmark} style={iconBtn(app.isBookmarked?"#D97706":"#9CA3AF")}>{Ico.bookmark(app.isBookmarked)}</button>
            <button onClick={onClose} style={iconBtn()}>{Ico.close}</button>
          </div>
        </div>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap" as const }}>
          <span style={{ fontSize: 13, fontWeight:600, letterSpacing:"0.05em", padding:"4px 10px", borderRadius:4, textTransform:"uppercase" as const, color:cfg.color, background:cfg.bg }}>{cfg.label}</span>
          {[app.jobType, app.salary].map(t => <span key={t} style={{ fontSize: 13, padding:"4px 10px", borderRadius:4, color:"#374151", background:"#F3F4F6", fontWeight:500 }}>{t}</span>)}
        </div>
      </div>

      {/* Body */}
      <div style={{ flex:1, overflowY:"auto", padding:"18px 20px" }}>

        {/* Progress */}
        <p style={sectionLabel}>Progress</p>
        {!terminal ? (
          <div style={{ marginBottom:20 }}>
            {timeline.map(({ label, done, active }, i) => (
              <div key={label} style={{ display:"flex", alignItems:"flex-start", gap:10 }}>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
                  <div style={{ width:20, height:20, borderRadius:"50%", background:done||active?"#111827":"#F3F4F6", border:`2px solid ${done||active?"#111827":"#E5E7EB"}`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                    {done && Ico.check}
                    {active && <div style={{ width:6, height:6, borderRadius:"50%", background:"white" }}/>}
                  </div>
                  {i<timeline.length-1 && <div style={{ width:2, height:20, background:done?"#111827":"#E5E7EB", opacity:done?0.3:1 }}/>}
                </div>
                <p style={{ margin:"2px 0 14px", fontSize: 14, fontWeight:active?700:500, color:done||active?"#111827":"#9CA3AF" }}>
                  {label} {active && <span style={{ color:"#D97706", fontWeight:400 }}>← current</span>}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding:"10px 14px", borderRadius:6, background:cfg.bg, marginBottom:20, display:"flex", gap:8 }}>
            <span style={{ fontSize: 14, fontWeight:600, color:cfg.color }}>{cfg.label}</span>
            <span style={{ fontSize: 14, color:"#6B7280" }}>{app.stage==="rejected"?"This application was not successful.":"You withdrew this application."}</span>
          </div>
        )}

        {/* Next Action */}
        {app.nextAction && <>
          <p style={sectionLabel}>Next Action</p>
          <div style={{ padding:"12px 14px", borderRadius:6, border:"1px solid #E5E7EB", marginBottom:20, background:"#FAFAFA" }}>
            <p style={{ margin:0, fontSize: 15, color:"#111827", fontWeight:500 }}>{app.nextAction}</p>
            {app.nextActionDate && <p style={{ margin:"4px 0 0", fontSize: 13, color:"#6B7280", display:"flex", alignItems:"center", gap:4 }}>{Ico.calendar} {fmtDate(app.nextActionDate)} — <strong style={{ color:"#111827" }}>{daysUntil(app.nextActionDate)}</strong></p>}
          </div>
        </>}

        {/* Recruiter */}
        {app.recruiterName && <>
          <p style={sectionLabel}>Recruiter Contact</p>
          <div style={{ padding:"12px 14px", borderRadius:6, border:"1px solid #E5E7EB", marginBottom:20, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div>
              <p style={{ margin:0, fontSize: 15, fontWeight:600, color:"#111827" }}>{app.recruiterName}</p>
              <p style={{ margin:"2px 0 0", fontSize: 13, color:"#6B7280" }}>{app.recruiterEmail}</p>
            </div>
            <a href={`mailto:${app.recruiterEmail}`} style={{ display:"flex", alignItems:"center", gap:4, fontSize: 13, color:"#111827", fontWeight:600, padding:"6px 12px", border:"1px solid #E5E7EB", borderRadius:6, textDecoration:"none", background:"#F9FAFB" }}>
              {Ico.mail} Email
            </a>
          </div>
        </>}

        {/* Notes */}
        {app.notes && <>
          <p style={sectionLabel}>Notes</p>
          <div style={{ padding:"12px 14px", borderRadius:6, background:"#FFFBEB", border:"1px solid #FDE68A", marginBottom:20 }}>
            <p style={{ margin:0, fontSize: 14, color:"#78350F", lineHeight:1.6 }}>{app.notes}</p>
          </div>
        </>}

        {/* Dates */}
        <p style={sectionLabel}>Timeline</p>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
          {[["Applied",fmtDate(app.appliedDate)],["Last Update",fmtDate(app.lastUpdated)]].map(([label,value]) => (
            <div key={label} style={{ padding:"10px 12px", borderRadius:6, background:"#F9FAFB", border:"1px solid #E5E7EB" }}>
              <p style={{ margin:"0 0 2px", fontSize: 12, color:"#9CA3AF", textTransform:"uppercase", letterSpacing:"0.08em" }}>{label}</p>
              <p style={{ margin:0, fontSize: 14, fontWeight:600, color:"#111827", fontFamily:"'DM Mono',monospace" }}>{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────────
export default function ApplicationsTracker() {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string|null>(null);
  const [search, setSearch] = useState("");
  const [filterStage, setFilterStage] = useState<Stage|"all">("all");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState<SortKey>("lastUpdated");
  const [page, setPage] = useState(1);

  // ── Fetch from Supabase ──
  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) { setLoading(false); return; }

      const { data, error } = await supabase
        .from("applications")
        .select(`
          id, job_title, company, location, job_type, salary,
          applied_date, last_updated, stage, company_logo_letter,
          is_bookmarked, next_action, next_action_date,
          seeker_notes, recruiter_name, recruiter_email
        `)
        .eq("seeker_id", session.user.id)
        .order("last_updated", { ascending: false });

      if (!error && data) {
        setApps(data.map((r: any): Application => ({
          id:             r.id,
          jobTitle:       r.job_title,
          company:        r.company,
          location:       r.location ?? "",
          jobType:        r.job_type ?? "",
          salary:         r.salary ?? "",
          appliedDate:    r.applied_date,
          lastUpdated:    r.last_updated,
          stage:          r.stage as Stage,
          logo:           r.company_logo_letter ?? (r.company?.[0] ?? "?"),
          isBookmarked:   r.is_bookmarked ?? false,
          nextAction:     r.next_action     ?? undefined,
          nextActionDate: r.next_action_date ?? undefined,
          notes:          r.seeker_notes     ?? undefined,
          recruiterName:  r.recruiter_name   ?? undefined,
          recruiterEmail: r.recruiter_email  ?? undefined,
        })));
        if (data.length > 0) setSelectedId(data[0].id);
      }
      setLoading(false);
    })();
  }, []);

  const q = search.toLowerCase();
  const filtered = useMemo(() => apps
    .filter(a => (!q||[a.jobTitle,a.company].some(s=>s.toLowerCase().includes(q))) && (filterStage==="all"||a.stage===filterStage) && (filterType==="all"||a.jobType===filterType))
    .sort((a,b) => sortBy==="company" ? a.company.localeCompare(b.company) : new Date(b[sortBy]).getTime()-new Date(a[sortBy]).getTime()),
  [apps,q,filterStage,filterType,sortBy]);

  // Reset page when filters change
  useMemo(() => { setPage(1); }, [q, filterStage, filterType, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const selected = apps.find(a=>a.id===selectedId)||null;

  // ── Persist bookmark toggle ──
  const toggleBookmark = async (id: string) => {
    const app = apps.find(a => a.id === id);
    if (!app) return;
    const next = !app.isBookmarked;
    setApps(p => p.map(a => a.id === id ? { ...a, isBookmarked: next } : a));
    await supabase.from("applications").update({ is_bookmarked: next }).eq("id", id);
  };

  // ── Persist withdraw ──
  const withdraw = async (id: string) => {
    setApps(p => p.map(a => a.id === id ? { ...a, stage: "withdrawn" as Stage } : a));
    await supabase.from("applications").update({ stage: "withdrawn" }).eq("id", id);
  };

  // ── Persist delete ──
  const deleteApp = async (id: string) => {
    setApps(p => p.filter(a => a.id !== id));
    if (selectedId === id) setSelectedId(null);
    await supabase.from("applications").delete().eq("id", id);
  };

  const stats = {
    active: apps.filter(a=>!["rejected","withdrawn","hired"].includes(a.stage)).length,
    interviews: apps.filter(a=>a.stage==="interview").length,
    offers: apps.filter(a=>a.stage==="offer").length,
    hired: apps.filter(a=>a.stage==="hired").length,
  };

  return (
    <div style={{ fontFamily:"'DM Sans','Segoe UI',sans-serif", background:"#F9FAFB", minHeight:"100vh", display:"flex", flexDirection:"column" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500;600&display=swap');*{box-sizing:border-box}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#E5E7EB;border-radius:4px}`}</style>

      {/* Top bar */}
      <div style={{ background:"#fff", borderBottom:"1px solid #E5E7EB", padding:"14px 24px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div>
          <h1 style={{ margin:0, fontSize: 20, fontWeight:700, color:"#111827" }}>My Applications</h1>
          <p style={{ margin:0, fontSize: 14, color:"#9CA3AF", fontFamily:"'DM Mono',monospace" }}>{stats.active} active · {apps.length} total</p>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          {([["Active",stats.active,false],["Interviews",stats.interviews,false],["Offers",stats.offers,false],["Hired",stats.hired,true]] as [string,number,boolean][]).map(([label,value,dark])=>(
            <div key={label} style={{ padding:"6px 14px", borderRadius:6, background:dark?"#111827":"#F3F4F6", border:dark?"none":"1px solid #E5E7EB", textAlign:"center" as const }}>
              <p style={{ margin:0, fontSize: 18, fontWeight:700, color:dark?"#fff":"#111827", fontFamily:"'DM Mono',monospace" }}>{value}</p>
              <p style={{ margin:0, fontSize: 12, color:dark?"#9CA3AF":"#6B7280", textTransform:"uppercase" as const, letterSpacing:"0.06em" }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div style={{ background:"#fff", borderBottom:"1px solid #E5E7EB", padding:"10px 24px", display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" as const }}>
        <div style={{ position:"relative" as const, flex:1, maxWidth:260 }}>
          <span style={{ position:"absolute" as const, left:10, top:"50%", transform:"translateY(-50%)", color:"#9CA3AF" }}>{Ico.search}</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search jobs or companies…"
            style={{ width:"100%", padding:"7px 10px 7px 32px", border:"1px solid #E5E7EB", borderRadius:6, fontSize: 14, color:"#111827", background:"#F9FAFB", outline:"none" }}/>
        </div>
        <select value={filterStage} onChange={e=>setFilterStage(e.target.value as Stage|"all")} style={sel}>
          <option value="all">All Stages</option>
          {(Object.keys(SC) as Stage[]).map(s=><option key={s} value={s}>{SC[s].label}</option>)}
        </select>
        <select value={filterType} onChange={e=>setFilterType(e.target.value)} style={sel}>
          <option value="all">All Types</option>
          {["Corporate – Permanent","Corporate – Contract","Casual – Daily","Casual – Hourly"].map(t=><option key={t}>{t}</option>)}
        </select>
        <select value={sortBy} onChange={e=>setSortBy(e.target.value as SortKey)} style={sel}>
          <option value="lastUpdated">Sort: Last Updated</option>
          <option value="appliedDate">Sort: Date Applied</option>
          <option value="company">Sort: Company A–Z</option>
        </select>
        <span style={{ fontSize: 14, color:"#9CA3AF", marginLeft:"auto", fontFamily:"'DM Mono',monospace" }}>{filtered.length} result{filtered.length!==1?"s":""}</span>
      </div>

      {/* Content */}
      <div style={{ flex:1, display:"grid", gridTemplateColumns:selected?"1fr 380px":"1fr", gap:16, padding:20, alignItems:"start" }}>
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {loading ? (
            <div style={{ padding:48, textAlign:"center" as const, color:"#6B7280" }}>Loading applications…</div>
          ) : apps.length === 0 ? (
            <div style={{ padding:48, textAlign:"center" as const, border:"1.5px dashed #E5E7EB", borderRadius:10, background:"#fff" }}>
              <p style={{ margin:0, fontSize: 16, color:"#111827", fontWeight: 600, marginBottom: 8 }}>No applications found.</p>
              <p style={{ margin:0, fontSize: 14, color:"#6B7280" }}>Head over to Find Jobs to start applying.</p>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding:48, textAlign:"center" as const, border:"1.5px dashed #E5E7EB", borderRadius:10, background:"#fff" }}><p style={{ margin:0, fontSize: 16, color:"#9CA3AF" }}>No applications match your filters.</p></div>
          ) : (
            <>
              {paginated.map(app=><AppCard key={app.id} app={app} selected={selectedId===app.id} onSelect={()=>setSelectedId(p=>p===app.id?null:app.id)} onBookmark={()=>toggleBookmark(app.id)} onWithdraw={()=>withdraw(app.id)} onDelete={()=>deleteApp(app.id)}/>)}
              <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            </>
          )}
        </div>
        {!loading && selected && (
          <div style={{ position:"sticky" as const, top:20, height:"calc(100vh - 175px)", overflow:"hidden" }}>
            <DetailPanel app={selected} onClose={()=>setSelectedId(null)} onBookmark={()=>toggleBookmark(selected.id)}/>
          </div>
        )}
      </div>
    </div>
  );
}