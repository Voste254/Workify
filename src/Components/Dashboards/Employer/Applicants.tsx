import { useState, useMemo } from "react";

// ── Types & Config ─────────────────────────────────────────────────────────────
type Stage = "applied" | "screening" | "interview" | "offer" | "hired" | "rejected";

interface Application {
  id: string; applicantName: string; jobTitle: string; jobCategory: "Corporate" | "Casual";
  appliedDate: string; lastUpdated: string; stage: Stage; avatar: string;
  phone: string; location: string; note?: string; rateRequest: string;
}

const SC: Record<Stage, { label: string; color: string; bg: string; step: number }> = {
  applied:    { label: "Applied",    color: "#6B7280", bg: "#F3F4F6", step: 1 },
  screening:  { label: "Screening",  color: "#D97706", bg: "#FEF3C7", step: 2 },
  interview:  { label: "Interview",  color: "#2563EB", bg: "#DBEAFE", step: 3 },
  offer:      { label: "Offer",      color: "#7C3AED", bg: "#EDE9FE", step: 4 },
  hired:      { label: "Hired",      color: "#059669", bg: "#D1FAE5", step: 5 },
  rejected:   { label: "Rejected",   color: "#FFFFFF", bg: "#DC2626", step: 0 },
};

const STAGES_FLOW: Stage[] = ["applied", "screening", "interview", "offer", "hired"];

const MOCK_APPS: Application[] = [
  { id: "1", applicantName: "John Omondi", jobTitle: "Construction Foreman", jobCategory: "Casual", appliedDate: "2025-03-20", lastUpdated: "2025-03-22", stage: "screening", avatar: "https://i.pravatar.cc/150?img=11", phone: "0712 345 678", location: "Nairobi, Kenya", note: "Has 5 years site experience in Westlands.", rateRequest: "KES 2,500/day" },
  { id: "2", applicantName: "Sarah Wanjiku", jobTitle: "Senior DevOps Engineer", jobCategory: "Corporate", appliedDate: "2025-03-15", lastUpdated: "2025-03-21", stage: "interview", avatar: "https://i.pravatar.cc/150?img=5", phone: "0723 456 789", location: "Remote", note: "Scheduled for technical round on Friday.", rateRequest: "KES 250,000/mo" },
  { id: "3", applicantName: "Brian Mutisya", jobTitle: "Electrician", jobCategory: "Casual", appliedDate: "2025-03-21", lastUpdated: "2025-03-21", stage: "applied", avatar: "https://i.pravatar.cc/150?img=12", phone: "0734 567 890", location: "Mombasa, Kenya", rateRequest: "KES 1,800/day" },
  { id: "4", applicantName: "Mercy Kiprotich", jobTitle: "Marketing Manager", jobCategory: "Corporate", appliedDate: "2025-03-10", lastUpdated: "2025-03-18", stage: "offer", avatar: "https://i.pravatar.cc/150?img=9", phone: "0745 678 901", location: "Nairobi, Kenya", note: "Negotiating final bonus structure.", rateRequest: "KES 180,000/mo" },
  { id: "5", applicantName: "Peter Kamau", jobTitle: "Plumber", jobCategory: "Casual", appliedDate: "2025-03-16", lastUpdated: "2025-03-17", stage: "rejected", avatar: "https://i.pravatar.cc/150?img=14", phone: "0700 111 222", location: "Nakuru, Kenya", note: "Did not have the necessary pipe-threading tools.", rateRequest: "KES 1,500/day" },
];

// ── Helpers ────────────────────────────────────────────────────────────────────
const fmtDate = (d: string) => new Date(d).toLocaleDateString("en-KE", { day: "2-digit", month: "short", year: "numeric" });
const daysAgo = (d: string) => { const n = Math.floor((Date.now() - new Date(d).getTime()) / 86400000); return n === 0 ? "Today" : n === 1 ? "Yesterday" : `${n}d ago`; };

// ── Icons ──────────────────────────────────────────────────────────────────────
const I = (d: string, s = 14, fill = "none") => <svg width={s} height={s} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: d }} />;
const Ico = {
  search: I('<circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>', 14),
  pin: I('<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>', 12),
  briefcase: I('<rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>', 12),
  tool: I('<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>', 12),
  close: I('<path d="M18 6 6 18"/><path d="m6 6 12 12"/>', 14),
  check: I('<path d="M20 6 9 17l-5-5"/>', 14),
  phone: I('<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>', 12),
  download: I('<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>', 12),
  chevronR: I('<polyline points="9 18 15 12 9 6"/>', 12)
};

// ── Shared styles ──────────────────────────────────────────────────────────────
const sel = { fontFamily: "'DM Sans',sans-serif", padding: "7px 10px", border: "1px solid #E5E7EB", borderRadius: 6, fontSize: 14, color: "#374151", background: "#F9FAFB", cursor: "pointer", outline: "none" };
const sectionLabel = { margin: "0 0 8px", fontSize: 13, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.1em", color: "#9CA3AF" };

// ── Progress Bar ───────────────────────────────────────────────────────────────
function StageBar({ stage }: { stage: Stage }) {
  const cfg = SC[stage];
  if (stage === "rejected") return (
    <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", padding: "3px 10px", borderRadius: 3, color: cfg.color, background: cfg.bg }}>{cfg.label}</span>
  );
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      {STAGES_FLOW.map(s => {
        const active = s === stage, past = SC[s].step < cfg.step;
        return <div key={s} title={SC[s].label} style={{ width: active ? 28 : 8, height: 8, borderRadius: 4, background: active || past ? "#111827" : "#E5E7EB", opacity: past ? 0.3 : 1, transition: "width 0.3s ease" }} />;
      })}
      <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", color: "#111827", marginLeft: 4 }}>{cfg.label}</span>
    </div>
  );
}

// ── Detail Panel ───────────────────────────────────────────────────────────────
function DetailPanel({ app, onClose, onAdvance, onReject }: { app: Application; onClose: () => void; onAdvance: () => void; onReject: () => void }) {
  const cfg = SC[app.stage];
  const activeIdx = STAGES_FLOW.indexOf(app.stage);
  const nextStage = activeIdx >= 0 && activeIdx < STAGES_FLOW.length - 1 ? STAGES_FLOW[activeIdx + 1] : null;

  return (
    <div style={{ background: "#fff", border: "1.5px solid #E5E7EB", borderRadius: 10, height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Header */}
      <div style={{ padding: "18px 20px", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img src={app.avatar} alt="PFP" style={{ width: 44, height: 44, borderRadius: 10, objectFit: "cover", border: "1.5px solid #E5E7EB" }} />
            <div>
              <p style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#111827" }}>{app.applicantName}</p>
              <p style={{ margin: 0, fontSize: 14, color: "#6B7280" }}>{app.phone} · {app.location}</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "1px solid #E5E7EB", borderRadius: 6, padding: "6px 8px", cursor: "pointer", color: "#6B7280" }}>{Ico.close}</button>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.05em", padding: "4px 10px", borderRadius: 4, textTransform: "uppercase" as const, color: cfg.color, background: cfg.bg }}>{cfg.label}</span>
          <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, padding: "4px 10px", borderRadius: 4, color: "#374151", background: "#F3F4F6", fontWeight: 500 }}>
             {app.jobCategory === "Corporate" ? Ico.briefcase : Ico.tool} {app.jobCategory}
          </span>
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: "auto", padding: "18px 20px" }}>
        
        {/* Pipeline Actions */}
        <p style={sectionLabel}>Pipeline Actions</p>
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {nextStage && app.stage !== "rejected" && (
            <button onClick={onAdvance} style={{ flex: 1, padding: "8px", background: "#111827", color: "#fff", border: "none", borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", display: "flex", justifyContent: "center", gap: 4, alignItems: "center" }}>
              Move to {SC[nextStage].label} {Ico.chevronR}
            </button>
          )}
          {app.stage !== "hired" && app.stage !== "rejected" && (
            <button onClick={onReject} style={{ padding: "8px 14px", background: "#FEE2E2", color: "#DC2626", border: "none", borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
              Reject
            </button>
          )}
        </div>

        {/* Applied For */}
        <p style={sectionLabel}>Applied For</p>
        <div style={{ padding: "12px 14px", borderRadius: 6, border: "1px solid #E5E7EB", marginBottom: 20, background: "#FAFAFA" }}>
          <p style={{ margin: 0, fontSize: 15, color: "#111827", fontWeight: 600 }}>{app.jobTitle}</p>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
            <span style={{ fontSize: 13, color: "#6B7280" }}>Expectation: <span style={{ color: "#111827", fontWeight: 600 }}>{app.rateRequest}</span></span>
            <span style={{ fontSize: 13, color: "#9CA3AF", fontFamily: "'DM Mono',monospace" }}>{daysAgo(app.appliedDate)}</span>
          </div>
        </div>

        {/* Notes */}
        {app.note && <>
          <p style={sectionLabel}>Manager Note</p>
          <div style={{ padding: "12px 14px", borderRadius: 6, background: "#FFFBEB", border: "1px solid #FDE68A", marginBottom: 20 }}>
            <p style={{ margin: 0, fontSize: 14, color: "#78350F", lineHeight: 1.6 }}>{app.note}</p>
          </div>
        </>}

        {/* Resources */}
        <p style={sectionLabel}>Documents</p>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={{ flex: 1, padding: "8px", background: "#fff", color: "#374151", border: "1px solid #E5E7EB", borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", display: "flex", gap: 6, alignItems: "center", justifyContent: "center" }}>
            {Ico.download} View Resume
          </button>
        </div>

      </div>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────────
export default function Applicants() {
  const [apps, setApps] = useState<Application[]>(MOCK_APPS);
  const [selectedId, setSelectedId] = useState<string | null>("1");
  const [search, setSearch] = useState("");
  const [filterStage, setFilterStage] = useState<Stage | "all">("all");
  const [filterType, setFilterType] = useState("all");

  const q = search.toLowerCase();
  const filtered = useMemo(() => apps.filter(a => 
    (!q || [a.applicantName, a.jobTitle].some(s => s.toLowerCase().includes(q))) && 
    (filterStage === "all" || a.stage === filterStage) &&
    (filterType === "all" || a.jobCategory === filterType)
  ).sort((a,b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()), [apps, q, filterStage, filterType]);

  const selected = apps.find(a => a.id === selectedId) || null;

  const handleAdvance = () => {
    if (!selected) return;
    const currIdx = STAGES_FLOW.indexOf(selected.stage);
    if (currIdx >= 0 && currIdx < STAGES_FLOW.length - 1) {
       const nextStatus = STAGES_FLOW[currIdx + 1];
       setApps(prev => prev.map(a => a.id === selectedId ? { ...a, stage: nextStatus } : a));
    }
  };

  const handleReject = () => {
    if (!selected) return;
    setApps(prev => prev.map(a => a.id === selectedId ? { ...a, stage: "rejected" } : a));
  };

  return (
    <div style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif", background: "#F9FAFB", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
       {/* Top bar */}
       <div style={{ background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#111827" }}>Manage Applications</h1>
          <p style={{ margin: 0, fontSize: 14, color: "#9CA3AF", fontFamily: "'DM Mono',monospace" }}>{apps.filter(x => x.stage !== "rejected").length} active pipeline</p>
        </div>
      </div>

      {/* Filters */}
      <div style={{ background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "10px 24px", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" as const }}>
        <div style={{ position: "relative" as const, flex: 1, maxWidth: 260 }}>
          <span style={{ position: "absolute" as const, left: 10, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }}>{Ico.search}</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search applicant or role…"
            style={{ width: "100%", padding: "7px 10px 7px 32px", border: "1px solid #E5E7EB", borderRadius: 6, fontSize: 14, color: "#111827", background: "#F9FAFB", outline: "none" }} />
        </div>
        <select value={filterStage} onChange={e => setFilterStage(e.target.value as Stage | "all")} style={sel}>
          <option value="all">All Stages</option>
          {(Object.keys(SC) as Stage[]).map(s => <option key={s} value={s}>{SC[s].label}</option>)}
        </select>
        <select value={filterType} onChange={e => setFilterType(e.target.value)} style={sel}>
          <option value="all">Corporate & Casual</option>
          <option value="Corporate">Corporate Only</option>
          <option value="Casual">Casual Only</option>
        </select>
        <span style={{ fontSize: 14, color: "#9CA3AF", marginLeft: "auto", fontFamily: "'DM Mono',monospace" }}>{filtered.length} candidate{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Content */}
      <div style={{ flex: 1, display: "grid", gridTemplateColumns: selected ? "1fr 380px" : "1fr", gap: 16, padding: 20, alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.length === 0
            ? <div style={{ padding: 48, textAlign: "center" as const, border: "1.5px dashed #E5E7EB", borderRadius: 10, background: "#fff" }}><p style={{ margin: 0, fontSize: 16, color: "#9CA3AF" }}>No applications match your filters.</p></div>
            : filtered.map(app => (
               <div key={app.id} onClick={() => setSelectedId(p => p === app.id ? null : app.id)} style={{ background: "#fff", border: `1.5px solid ${selectedId === app.id ? "#111827" : "#E5E7EB"}`, borderRadius: 8, padding: "16px 18px", cursor: "pointer", opacity: app.stage === "rejected" ? 0.7 : 1, transition: "border-color 0.15s" }}>
                 <div style={{ display: "flex", gap: 12 }}>
                   <img src={app.avatar} alt="A" style={{ width: 40, height: 40, borderRadius: 8, objectFit: "cover", border: "1.5px solid #E5E7EB" }} />
                   <div style={{ flex: 1, minWidth: 0 }}>
                     <p style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "#111827" }}>{app.applicantName}</p>
                     <p style={{ margin: "2px 0 0", fontSize: 14, color: "#6B7280" }}>{app.jobTitle}</p>
                     <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                       <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 13, color: "#9CA3AF" }}>{Ico.pin} {app.location}</span>
                       <span style={{ fontSize: 13, color: "#6B7280", padding: "2px 7px", background: "#F3F4F6", borderRadius: 3, fontWeight: 500, display: "flex", alignItems: "center", gap: 4 }}>
                         {app.jobCategory === "Corporate" ? Ico.briefcase : Ico.tool} {app.jobCategory}
                       </span>
                     </div>
                     <div style={{ marginTop: 12 }}><StageBar stage={app.stage} /></div>
                     <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
                       <span style={{ fontSize: 13, color: "#9CA3AF", fontFamily: "'DM Mono',monospace" }}>Updated {daysAgo(app.lastUpdated)}</span>
                     </div>
                   </div>
                 </div>
               </div>
            ))
          }
        </div>
        
        {selected && (
          <div style={{ position: "sticky" as const, top: 20, height: "calc(100vh - 175px)", overflow: "hidden" }}>
            <DetailPanel app={selected} onClose={() => setSelectedId(null)} onAdvance={handleAdvance} onReject={handleReject} />
          </div>
        )}
      </div>

    </div>
  );
}