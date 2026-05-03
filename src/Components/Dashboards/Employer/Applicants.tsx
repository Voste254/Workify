import { useState, useMemo, useEffect } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { useAuth } from "../../../contexts/AuthContext";

// ── Types & Config ─────────────────────────────────────────────────────────────
type Stage = "applied" | "screening" | "interview" | "assessment" | "offer" | "hired" | "rejected" | "withdrawn" | string;

interface StageHistoryEntry {
  from_stage: Stage | null;
  to_stage: Stage;
  employer_note: string;
  changed_at: string;
}

interface Application {
  id: string; applicantName: string; jobTitle: string; jobCategory: "Corporate" | "Casual";
  appliedDate: string; lastUpdated: string; stage: Stage; avatar: string;
  phone: string; location: string; note?: string; rateRequest: string;
  stageHistory: StageHistoryEntry[];
}

const SC: Record<string, { label: string; textClass: string; bgClass: string; step: number }> = {
  applied: { label: "Applied", textClass: "text-gray-500", bgClass: "bg-gray-100", step: 1 },
  screening: { label: "Screening", textClass: "text-amber-600", bgClass: "bg-amber-50", step: 2 },
  interview: { label: "Interview", textClass: "text-blue-600", bgClass: "bg-blue-100", step: 3 },
  assessment: { label: "Assessment", textClass: "text-indigo-600", bgClass: "bg-indigo-100", step: 3.5 },
  offer: { label: "Offer", textClass: "text-purple-600", bgClass: "bg-purple-100", step: 4 },
  hired: { label: "Hired", textClass: "text-emerald-600", bgClass: "bg-emerald-100", step: 5 },
  rejected: { label: "Rejected", textClass: "text-white", bgClass: "bg-red-600", step: 0 },
  withdrawn: { label: "Withdrawn", textClass: "text-gray-500", bgClass: "bg-gray-200", step: 0 },
};

const STAGES_FLOW: Stage[] = ["applied", "screening", "interview", "offer", "hired"];
// MOCK_APPS removed as we're fetching from DB

// ── Helpers ────────────────────────────────────────────────────────────────────

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
const sel = "font-sans px-2.5 py-[7px] border border-gray-200 rounded-md text-sm text-gray-700 bg-gray-50 cursor-pointer outline-none";
const sectionLabel = "m-[0_0_8px] text-[13px] font-bold uppercase tracking-[0.1em] text-gray-400";

// ── Progress Bar ───────────────────────────────────────────────────────────────
function StageBar({ stage }: { stage: Stage }) {
  const cfg = SC[stage] || { label: stage, textClass: "text-gray-500", bgClass: "bg-gray-200", step: 0 };
  if (stage === "rejected" || stage === "withdrawn") return (
    <span className={`text-[13px] font-semibold tracking-[0.06em] uppercase px-2.5 py-[3px] rounded-[3px] ${cfg.textClass} ${cfg.bgClass}`}>{cfg.label}</span>
  );
  return (
    <div className="flex items-center gap-1">
      {STAGES_FLOW.map(s => {
        const active = s === stage, past = SC[s].step < cfg.step;
        return <div key={s} title={SC[s].label} className={`h-2 rounded bg-gray-900 transition-all duration-300 ${active ? "w-7" : "w-2"} ${!active && !past ? "bg-gray-200" : ""} ${past ? "opacity-30" : "opacity-100"}`} />;
      })}
      <span className="text-[13px] font-semibold tracking-[0.05em] uppercase text-gray-900 ml-1">{cfg.label}</span>
    </div>
  );
}

// ── Detail Panel ───────────────────────────────────────────────────────────────
function DetailPanel({ app, onClose, onAdvance, onReject }: { app: Application; onClose: () => void; onAdvance: (note: string) => void; onReject: (note: string) => void }) {
  const cfg = SC[app.stage] || { label: app.stage, textClass: "text-gray-500", bgClass: "bg-gray-200", step: 0 };
  const activeIdx = STAGES_FLOW.indexOf(app.stage);
  const nextStage = activeIdx >= 0 && activeIdx < STAGES_FLOW.length - 1 ? STAGES_FLOW[activeIdx + 1] : null;
  const [managerNote, setManagerNote] = useState("");
  const [noteError, setNoteError] = useState(false);

  const handleAction = (action: "advance" | "reject") => {
    if (!managerNote.trim()) { setNoteError(true); return; }
    setNoteError(false);
    if (action === "advance") onAdvance(managerNote.trim());
    else onReject(managerNote.trim());
    setManagerNote("");
  };

  return (
    <div className="bg-white border-[1.5px] border-gray-200 rounded-[10px] h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-5 py-[18px] border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <img src={app.avatar} alt="PFP" className="w-11 h-11 rounded-[10px] object-cover border-[1.5px] border-gray-200" />
            <div>
              <p className="m-0 text-[17px] font-bold text-gray-900">{app.applicantName}</p>
              <p className="m-0 text-sm text-gray-500">{app.phone} · {app.location}</p>
            </div>
          </div>
          <button onClick={onClose} className="bg-transparent border border-gray-200 rounded-md px-2 py-1.5 cursor-pointer text-gray-500">{Ico.close}</button>
        </div>
        <div className="flex gap-1.5">
          <span className={`text-[13px] font-semibold tracking-[0.05em] px-2.5 py-1 rounded uppercase ${cfg.textClass} ${cfg.bgClass}`}>{cfg.label}</span>
          <span className="flex items-center gap-1 text-[13px] px-2.5 py-1 rounded text-gray-700 bg-gray-100 font-medium">
            {app.jobCategory === "Corporate" ? Ico.briefcase : Ico.tool} {app.jobCategory}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-5 py-[18px]">

        {/* Pipeline Actions */}
        <p className={sectionLabel}>Pipeline Actions</p>

        {/* Manager Note Input */}
        {app.stage !== "hired" && app.stage !== "rejected" && (
          <div className="mb-4">
            <label className="block text-[12px] font-bold uppercase tracking-[0.08em] text-gray-400 mb-1.5">
              Note to Candidate <span className="text-red-500">*</span>
            </label>
            <textarea
              value={managerNote}
              onChange={e => { setManagerNote(e.target.value); if (e.target.value.trim()) setNoteError(false); }}
              rows={3}
              placeholder={`Add a message for the candidate when moving to the next stage or rejecting...`}
              className={`w-full text-sm p-3 rounded-md border resize-none outline-none transition-colors ${noteError
                  ? "border-red-400 bg-red-50 placeholder:text-red-300"
                  : "border-gray-200 bg-gray-50 focus:border-gray-400 placeholder:text-gray-400"
                }`}
            />
            {noteError && (
              <p className="text-[12px] text-red-500 mt-1">A note is required before advancing or rejecting.</p>
            )}
          </div>
        )}

        <div className="flex gap-2 mb-5">
          {nextStage && app.stage !== "rejected" && (
            <button onClick={() => handleAction("advance")} className="flex-1 p-2 bg-gray-900 text-white border-none rounded-md text-sm font-semibold cursor-pointer font-sans flex justify-center gap-1 items-center">
              Move to {SC[nextStage].label} {Ico.chevronR}
            </button>
          )}
          {app.stage !== "hired" && app.stage !== "rejected" && (
            <button onClick={() => handleAction("reject")} className="px-3.5 py-2 bg-red-100 text-red-600 border-none rounded-md text-sm font-semibold cursor-pointer font-sans">
              Reject
            </button>
          )}
        </div>

        {/* Applied For */}
        <p className={sectionLabel}>Applied For</p>
        <div className="px-3.5 py-3 rounded-md border border-gray-200 mb-5 bg-gray-50">
          <p className="m-0 text-[15px] text-gray-900 font-semibold">{app.jobTitle}</p>
          <div className="flex justify-between mt-2">
            <span className="text-[13px] text-gray-500">Expectation: <span className="text-gray-900 font-semibold">{app.rateRequest}</span></span>
            <span className="text-[13px] text-gray-400 font-mono">{daysAgo(app.appliedDate)}</span>
          </div>
        </div>

        {/* Stage History / Notes Timeline */}
        {app.stageHistory.length > 0 && (
          <>
            <p className={sectionLabel}>Stage History & Notes</p>
            <div className="space-y-3 mb-5">
              {[...app.stageHistory].reverse().map((entry, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-gray-900 mt-1.5 flex-shrink-0" />
                    {i < app.stageHistory.length - 1 && <div className="w-px flex-1 bg-gray-200 mt-1" />}
                  </div>
                  <div className="pb-3">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`text-[11px] font-bold uppercase tracking-wide px-2 py-0.5 rounded ${SC[entry.to_stage].bgClass} ${SC[entry.to_stage].textClass}`}>
                        {SC[entry.to_stage].label}
                      </span>
                      <span className="text-[11px] text-gray-400 font-mono">{entry.changed_at}</span>
                    </div>
                    <p className="text-[13px] text-gray-700 leading-relaxed mt-1">{entry.employer_note}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Resources */}
        <p className={sectionLabel}>Documents</p>
        <div className="flex gap-2">
          <button className="flex-1 p-2 bg-white text-gray-700 border border-gray-200 rounded-md text-sm font-semibold cursor-pointer font-sans flex gap-1.5 items-center justify-center">
            {Ico.download} View Resume
          </button>
        </div>

      </div>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────────
export default function Applicants() {
  const { user } = useAuth();
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterStage, setFilterStage] = useState<Stage | "all">("all");
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    async function fetchApplicants() {
      if (!user?.id) return;
      setLoading(true);
      const { data, error } = await supabase
        .from("applications")
        .select("*")
        .eq("employer_id", user.id);

      if (!error && data) {
        const mapped: Application[] = data.map(app => ({
          id: app.id,
          applicantName: app.applicant_name || "Unknown Applicant",
          jobTitle: app.job_title || "Unknown Job",
          jobCategory: app.job_category || "Corporate",
          appliedDate: app.applied_date || new Date().toISOString(),
          lastUpdated: app.last_updated || new Date().toISOString(),
          stage: app.stage as Stage,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(app.applicant_name || "A")}&background=random`,
          phone: app.applicant_phone || "Not provided",
          location: app.applicant_location || "Not specified",
          note: app.employer_notes || "",
          rateRequest: app.salary || "Not specified",
          stageHistory: app.stage_history || []
        }));
        setApps(mapped);
        if (mapped.length > 0) setSelectedId(mapped[0].id);
      }
      setLoading(false);
    }
    fetchApplicants();
  }, [user?.id]);

  const q = search.toLowerCase();
  const filtered = useMemo(() => apps.filter(a =>
    (!q || [a.applicantName, a.jobTitle].some(s => s.toLowerCase().includes(q))) &&
    (filterStage === "all" || a.stage === filterStage) &&
    (filterType === "all" || a.jobCategory === filterType)
  ).sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()), [apps, q, filterStage, filterType]);

  const selected = apps.find(a => a.id === selectedId) || null;

  const updateApplicationDb = async (appId: string, newStage: Stage, note: string) => {
    const { error } = await supabase.from("applications").update({
      stage: newStage,
      last_updated: new Date().toISOString(),
      employer_notes: note
    }).eq("id", appId);
    
    if (error) {
      console.error("Failed to update application:", error);
    }
  };

  const handleAdvance = async (note: string) => {
    if (!selected) return;
    const currIdx = STAGES_FLOW.indexOf(selected.stage);
    if (currIdx >= 0 && currIdx < STAGES_FLOW.length - 1) {
      const nextStatus = STAGES_FLOW[currIdx + 1];
      const historyEntry: StageHistoryEntry = {
        from_stage: selected.stage,
        to_stage: nextStatus,
        employer_note: note,
        changed_at: new Date().toISOString().split("T")[0],
      };
      const newHistory = [...selected.stageHistory, historyEntry];
      setApps(prev => prev.map(a => a.id === selectedId
        ? { ...a, stage: nextStatus, stageHistory: newHistory, lastUpdated: new Date().toISOString() }
        : a
      ));
      await updateApplicationDb(selected.id, nextStatus, note);
    }
  };

  const handleReject = async (note: string) => {
    if (!selected) return;
    const historyEntry: StageHistoryEntry = {
      from_stage: selected.stage,
      to_stage: "rejected",
      employer_note: note,
      changed_at: new Date().toISOString().split("T")[0],
    };
    const newHistory = [...selected.stageHistory, historyEntry];
    setApps(prev => prev.map(a => a.id === selectedId
      ? { ...a, stage: "rejected", stageHistory: newHistory, lastUpdated: new Date().toISOString() }
      : a
    ));
    await updateApplicationDb(selected.id, "rejected", note);
  };

  return (
    <div className="font-sans bg-gray-50 min-h-screen flex flex-col">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3.5 flex items-center justify-between">
        <div>
          <h1 className="m-0 text-xl font-bold text-gray-900">Manage Applications</h1>
          <p className="m-0 text-sm text-gray-400 font-mono">{apps.filter(x => x.stage !== "rejected").length} active pipeline</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200 px-6 py-2.5 flex items-center gap-2.5 flex-wrap">
        <div className="relative flex-1 max-w-[260px]">
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400">{Ico.search}</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search applicant or role…"
            className="w-full py-[7px] pr-2.5 pl-8 border border-gray-200 rounded-md text-sm text-gray-900 bg-gray-50 outline-none" />
        </div>
        <select value={filterStage} onChange={e => setFilterStage(e.target.value as Stage | "all")} className={sel}>
          <option value="all">All Stages</option>
          {Object.keys(SC).map(s => <option key={s} value={s}>{SC[s].label}</option>)}
        </select>
        <select value={filterType} onChange={e => setFilterType(e.target.value)} className={sel}>
          <option value="all">Corporate & Casual</option>
          <option value="Corporate">Corporate Only</option>
          <option value="Casual">Casual Only</option>
        </select>
        <span className="text-sm text-gray-400 ml-auto font-mono">{filtered.length} candidate{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Content */}
      <div className={`flex-1 grid gap-4 p-5 items-start ${selected ? "grid-cols-[1fr_380px]" : "grid-cols-1"}`}>
        <div className="flex flex-col gap-2.5">
          {loading 
            ? <div className="p-12 text-center border-[1.5px] border-dashed border-gray-200 rounded-[10px] bg-white"><p className="m-0 text-base text-gray-400">Loading applications...</p></div>
            : filtered.length === 0
            ? <div className="p-12 text-center border-[1.5px] border-dashed border-gray-200 rounded-[10px] bg-white"><p className="m-0 text-base text-gray-400">No applications match your filters.</p></div>
            : filtered.map(app => (
              <div key={app.id} onClick={() => setSelectedId(p => p === app.id ? null : app.id)} className={`bg-white border-[1.5px] rounded-lg px-[18px] py-4 cursor-pointer transition-colors duration-150 ${selectedId === app.id ? "border-gray-900" : "border-gray-200"} ${app.stage === "rejected" ? "opacity-70" : "opacity-100"}`}>
                <div className="flex gap-3">
                  <img src={app.avatar} alt="A" className="w-10 h-10 rounded-lg object-cover border-[1.5px] border-gray-200" />
                  <div className="flex-1 min-w-0">
                    <p className="m-0 text-base font-semibold text-gray-900">{app.applicantName}</p>
                    <p className="m-[2px_0_0] text-sm text-gray-500">{app.jobTitle}</p>
                    <div className="flex gap-2.5 mt-2">
                       <span className="flex items-center gap-[3px] text-[13px] text-gray-400">{Ico.pin} {app.location}</span>
                      <span className="flex items-center gap-1 text-[13px] text-gray-500 px-[7px] py-[2px] bg-gray-100 rounded-[3px] font-medium">
                        {app.jobCategory === "Corporate" ? Ico.briefcase : Ico.tool} {app.jobCategory}
                      </span>
                    </div>
                    <div className="mt-3"><StageBar stage={app.stage} /></div>
                    <div className="flex justify-between mt-3">
                      <span className="text-[13px] text-gray-400 font-mono">Updated {daysAgo(app.lastUpdated)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          }
        </div>

        {selected && (
          <div className="sticky top-5 h-[calc(100vh-175px)] overflow-hidden">
            <DetailPanel app={selected} onClose={() => setSelectedId(null)} onAdvance={handleAdvance} onReject={handleReject} />
          </div>
        )}
      </div>

    </div>
  );
}