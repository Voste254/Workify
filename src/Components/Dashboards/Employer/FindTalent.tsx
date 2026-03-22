import { useState, useMemo } from "react";

// ── Types & Config ─────────────────────────────────────────────────────────────
interface Candidate {
  id: string; name: string; role: string; location: string; rate: string;
  rating: number; reviews: number; skills: string[]; image: string; isSaved: boolean; available: string;
}

const MOCK_CANDIDATES: Candidate[] = [
  { id: "1", name: "Alex Johnson", role: "Senior Full Stack Engineer", location: "Remote", rate: "$55/hr", rating: 4.9, reviews: 124, skills: ["React", "Node.js", "TypeScript", "AWS"], image: "https://i.pravatar.cc/150?img=11", isSaved: true, available: "Immediate" },
  { id: "2", name: "Maria Garcia", role: "UX/UI Designer", location: "New York, USA", rate: "$45/hr", rating: 4.8, reviews: 89, skills: ["Figma", "Prototyping", "User Research"], image: "https://i.pravatar.cc/150?img=5", isSaved: false, available: "2 Weeks" },
  { id: "3", name: "David Smith", role: "Backend Python Developer", location: "London, UK", rate: "$50/hr", rating: 4.7, reviews: 67, skills: ["Python", "Django", "PostgreSQL", "Docker"], image: "https://i.pravatar.cc/150?img=12", isSaved: false, available: "Immediate" },
  { id: "4", name: "Emily Chen", role: "Mobile App Developer", location: "Toronto, Canada", rate: "$60/hr", rating: 5.0, reviews: 210, skills: ["Flutter", "React Native", "iOS", "Android"], image: "https://i.pravatar.cc/150?img=9", isSaved: true, available: "1 Month" },
  { id: "5", name: "Samuel Osei", role: "DevOps Engineer", location: "Remote", rate: "$70/hr", rating: 4.9, reviews: 156, skills: ["Kubernetes", "AWS", "CI/CD", "Terraform"], image: "https://i.pravatar.cc/150?img=14", isSaved: false, available: "Immediate" },
  { id: "6", name: "Sophia Martinez", role: "Frontend Specialist", location: "Madrid, Spain", rate: "$40/hr", rating: 4.6, reviews: 45, skills: ["Vue.js", "JavaScript", "Tailwind CSS"], image: "https://i.pravatar.cc/150?img=20", isSaved: false, available: "Immediate" },
];

// ── Icons ──────────────────────────────────────────────────────────────────────
const I = (d: string, s = 14, fill = "none") => <svg width={s} height={s} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: d }} />;
const Ico = {
  search: I('<circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>', 14),
  bookmark: (f: boolean) => I('<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>', 14, f ? "currentColor" : "none"),
  location: I('<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>', 12),
  star: I('<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>', 12, "currentColor"),
  mail: I('<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>', 12),
  close: I('<path d="M18 6 6 18"/><path d="m6 6 12 12"/>', 14),
};

// ── Shared styles ──────────────────────────────────────────────────────────────
const sel = { fontFamily: "'DM Sans',sans-serif", padding: "7px 10px", border: "1px solid #E5E7EB", borderRadius: 6, fontSize: 12, color: "#374151", background: "#F9FAFB", cursor: "pointer", outline: "none" };
const sectionLabel = { margin: "0 0 8px", fontSize: 11, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.1em", color: "#9CA3AF" };
const iconBtn = (color = "#6B7280") => ({ background: "none", border: "1px solid #E5E7EB", borderRadius: 6, padding: "6px 8px", cursor: "pointer", color, display: "flex", alignItems: "center" as const });

// ── Candidate Card ─────────────────────────────────────────────────────────────
function CandidateCard({ cand, selected, onSelect, onBookmark }: { cand: Candidate; selected: boolean; onSelect: () => void; onBookmark: () => void }) {
  return (
    <div onClick={onSelect} style={{ background: "#fff", border: `1.5px solid ${selected ? "#111827" : "#E5E7EB"}`, borderRadius: 8, padding: "16px 18px", cursor: "pointer", transition: "border-color 0.15s", position: "relative" as const }}>
      <div style={{ display: "flex", gap: 12 }}>
        <img src={cand.image} alt={cand.name} style={{ width: 44, height: 44, borderRadius: 10, border: "1.5px solid #E5E7EB", objectFit: "cover" }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#111827" }}>{cand.name}</p>
            <button onClick={e => { e.stopPropagation(); onBookmark(); }} style={{ background: "none", border: "none", cursor: "pointer", padding: 2, color: cand.isSaved ? "#D97706" : "#9CA3AF" }}>{Ico.bookmark(cand.isSaved)}</button>
          </div>
          <p style={{ margin: 0, fontSize: 12, color: "#6B7280" }}>{cand.role}</p>
          <div style={{ display: "flex", gap: 10, marginTop: 8, flexWrap: "wrap" as const }}>
            <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, color: "#9CA3AF" }}>{Ico.location} {cand.location}</span>
            <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, color: "#D97706", fontWeight: 600 }}>{Ico.star} {cand.rating} <span style={{ color: "#9CA3AF", fontWeight: 400 }}>({cand.reviews})</span></span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
            {cand.skills.map(s => <span key={s} style={{ fontSize: 10, color: "#374151", background: "#F3F4F6", padding: "2px 6px", borderRadius: 4, fontWeight: 500 }}>{s}</span>)}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
             <span style={{ fontSize: 12, fontWeight: 600, color: "#111827" }}>{cand.rate}</span>
             <span style={{ fontSize: 10, color: "#059669", background: "#D1FAE5", padding: "2px 6px", borderRadius: 4, fontWeight: 600, textTransform: "uppercase" as const }}>{cand.available}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Detail Panel ───────────────────────────────────────────────────────────────
function DetailPanel({ cand, onClose, onBookmark }: { cand: Candidate; onClose: () => void; onBookmark: () => void }) {
  return (
    <div style={{ background: "#fff", border: "1.5px solid #E5E7EB", borderRadius: 10, height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Header */}
      <div style={{ padding: "18px 20px", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img src={cand.image} alt={cand.name} style={{ width: 44, height: 44, borderRadius: 10, border: "1.5px solid #E5E7EB", objectFit: "cover" }} />
            <div>
              <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#111827" }}>{cand.name}</p>
              <p style={{ margin: 0, fontSize: 12, color: "#6B7280" }}>{cand.role}</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={onBookmark} style={iconBtn(cand.isSaved ? "#D97706" : "#9CA3AF")}>{Ico.bookmark(cand.isSaved)}</button>
            <button onClick={onClose} style={iconBtn()}>{Ico.close}</button>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" as const }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 4, color: "#D97706", background: "#FEF3C7" }}>
            {Ico.star} {cand.rating} ({cand.reviews} reviews)
          </span>
          <span style={{ fontSize: 11, padding: "4px 10px", borderRadius: 4, color: "#374151", background: "#F3F4F6", fontWeight: 500 }}>{cand.location}</span>
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: "auto", padding: "18px 20px" }}>
        
        <p style={sectionLabel}>Quick Actions</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 20 }}>
          <button style={{ padding: "8px", background: "#111827", color: "#fff", border: "none", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            {Ico.mail} Message
          </button>
          <button style={{ padding: "8px", background: "#fff", color: "#111827", border: "1px solid #E5E7EB", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>Invite to Apply</button>
        </div>

        <p style={sectionLabel}>About</p>
        <p style={{ margin: "0 0 20px", fontSize: 12, color: "#374151", lineHeight: 1.6 }}>
          {cand.name} is a highly experienced {cand.role.toLowerCase()} with a proven track record of delivering scalable solutions. Available {cand.available.toLowerCase()} for new opportunities.
        </p>

        <p style={sectionLabel}>Skills</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
          {cand.skills.map(s => <span key={s} style={{ fontSize: 11, color: "#374151", border: "1px solid #E5E7EB", padding: "4px 8px", borderRadius: 4, fontWeight: 500 }}>{s}</span>)}
        </div>

        <p style={sectionLabel}>Details</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {[["Hourly Rate", cand.rate], ["Availability", cand.available]].map(([label, value]) => (
            <div key={label} style={{ padding: "10px 12px", borderRadius: 6, background: "#F9FAFB", border: "1px solid #E5E7EB" }}>
              <p style={{ margin: "0 0 2px", fontSize: 10, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</p>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: "#111827", fontFamily: "'DM Mono',monospace" }}>{value}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────────
export default function FindTalent() {
  const [candidates, setCandidates] = useState(MOCK_CANDIDATES);
  const [selectedId, setSelectedId] = useState<string | null>("1");
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  const q = search.toLowerCase();
  const filtered = useMemo(() => candidates
    .filter(c => (!q || [c.name, c.role, ...c.skills].some(s => s.toLowerCase().includes(q))) && (filterRole === "all" || c.role.includes(filterRole))),
    [candidates, q, filterRole]);

  const selected = candidates.find(c => c.id === selectedId) || null;
  const toggleBookmark = (id: string) => setCandidates(p => p.map(c => c.id === id ? { ...c, isSaved: !c.isSaved } : c));

  const stats = {
    total: candidates.length,
    saved: candidates.filter(c => c.isSaved).length,
    available: candidates.filter(c => c.available === "Immediate").length,
  };

  return (
    <div style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif", background: "#F9FAFB", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500;600&display=swap');*{box-sizing:border-box}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#E5E7EB;border-radius:4px}`}</style>

      {/* Top bar */}
      <div style={{ background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#111827" }}>Find Talent</h1>
          <p style={{ margin: 0, fontSize: 12, color: "#9CA3AF", fontFamily: "'DM Mono',monospace" }}>Discover top professionals</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {([["Total", stats.total, false], ["Immediate", stats.available, false], ["Saved", stats.saved, true]] as [string, number, boolean][]).map(([label, value, dark]) => (
            <div key={label} style={{ padding: "6px 14px", borderRadius: 6, background: dark ? "#111827" : "#F3F4F6", border: dark ? "none" : "1px solid #E5E7EB", textAlign: "center" as const }}>
              <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: dark ? "#fff" : "#111827", fontFamily: "'DM Mono',monospace" }}>{value}</p>
              <p style={{ margin: 0, fontSize: 10, color: dark ? "#9CA3AF" : "#6B7280", textTransform: "uppercase" as const, letterSpacing: "0.06em" }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div style={{ background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "10px 24px", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" as const }}>
        <div style={{ position: "relative" as const, flex: 1, maxWidth: 300 }}>
          <span style={{ position: "absolute" as const, left: 10, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }}>{Ico.search}</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search skills, roles or names…"
            style={{ width: "100%", padding: "7px 10px 7px 32px", border: "1px solid #E5E7EB", borderRadius: 6, fontSize: 12, color: "#111827", background: "#F9FAFB", outline: "none" }} />
        </div>
        <select value={filterRole} onChange={e => setFilterRole(e.target.value)} style={sel}>
          <option value="all">Any Role Category</option>
          <option value="Engineer">Engineering</option>
          <option value="Designer">Design & UI/UX</option>
        </select>
        <span style={{ fontSize: 12, color: "#9CA3AF", marginLeft: "auto", fontFamily: "'DM Mono',monospace" }}>{filtered.length} candidates</span>
      </div>

      {/* Content */}
      <div style={{ flex: 1, display: "grid", gridTemplateColumns: selected ? "1fr 380px" : "1fr", gap: 16, padding: 20, alignItems: "start" }}>
        <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr" : "repeat(auto-fill, minmax(320px, 1fr))", gap: 12 }}>
          {filtered.length === 0
            ? <div style={{ padding: 48, textAlign: "center" as const, border: "1.5px dashed #E5E7EB", borderRadius: 10, background: "#fff", gridColumn: "1/-1" }}><p style={{ margin: 0, fontSize: 14, color: "#9CA3AF" }}>No talent matches your search.</p></div>
            : filtered.map(cand => <CandidateCard key={cand.id} cand={cand} selected={selectedId === cand.id} onSelect={() => setSelectedId(p => p === cand.id ? null : cand.id)} onBookmark={() => toggleBookmark(cand.id)} />)
          }
        </div>
        {selected && (
          <div style={{ position: "sticky" as const, top: 20, height: "calc(100vh - 175px)", overflow: "hidden" }}>
            <DetailPanel cand={selected} onClose={() => setSelectedId(null)} onBookmark={() => toggleBookmark(selected.id)} />
          </div>
        )}
      </div>
    </div>
  );
}
