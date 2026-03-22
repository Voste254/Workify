import { useState, useMemo } from "react";

// ── Types & Config ─────────────────────────────────────────────────────────────
type ApplicantStatus = "Applied" | "Shortlisted" | "Approved" | "Rejected";

interface Applicant {
  id: number;
  name: string;
  role: string;
  rating: number;
  reviews: number;
  applied: string;
  status: ApplicantStatus;
  avatar: string;
}

const STATUS_CONFIG: Record<ApplicantStatus, { label: string; color: string; bg: string }> = {
  Applied: { label: "Applied", color: "#6B7280", bg: "#F3F4F6" },
  Shortlisted: { label: "Shortlisted", color: "#D97706", bg: "#FEF3C7" },
  Approved: { label: "Approved", color: "#059669", bg: "#D1FAE5" },
  Rejected: { label: "Rejected", color: "#FFFFFF", bg: "#DC2626" },
};

const MOCK_APPLICANTS: Applicant[] = [
  { id: 1, name: "Sarah Chen", role: "Full Stack Developer", rating: 4.9, reviews: 47, applied: "2d ago", status: "Shortlisted", avatar: "https://i.pravatar.cc/150?img=47" },
  { id: 2, name: "Michael Ochieng", role: "Backend Engineer", rating: 4.6, reviews: 23, applied: "3d ago", status: "Applied", avatar: "https://i.pravatar.cc/150?img=11" },
  { id: 3, name: "Jessica Kama", role: "Product Designer", rating: 5.0, reviews: 89, applied: "1w ago", status: "Approved", avatar: "https://i.pravatar.cc/150?img=5" },
];

// ── Icons ──────────────────────────────────────────────────────────────────────
const I = (d: string, s = 14, fill = "none") => <svg width={s} height={s} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: d }} />;
const Ico = {
  search: I('<circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>', 14),
  star: I('<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>', 12, "currentColor"),
  more: I('<circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/>', 16),
  eye: I('<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>', 14),
  check: I('<path d="M20 6 9 17l-5-5"/>', 14),
  x: I('<line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/>', 14)
};

// ── Shared styles ──────────────────────────────────────────────────────────────
const sel = { fontFamily: "'DM Sans',sans-serif", padding: "7px 10px", border: "1px solid #E5E7EB", borderRadius: 6, fontSize: 12, color: "#374151", background: "#F9FAFB", cursor: "pointer", outline: "none" };

// ── Main ───────────────────────────────────────────────────────────────────────
export default function Applicants() {
  const [applicants, setApplicants] = useState<Applicant[]>(MOCK_APPLICANTS);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<ApplicantStatus | "all">("all");

  const q = search.toLowerCase();
  const filtered = useMemo(() => applicants.filter(a => (!q || a.name.toLowerCase().includes(q) || a.role.toLowerCase().includes(q)) && (filterStatus === "all" || a.status === filterStatus)), [applicants, q, filterStatus]);

  const changeStatus = (id: number, status: ApplicantStatus) => {
    setApplicants(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  return (
    <div style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif", background: "#F9FAFB", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500;600&display=swap');*{box-sizing:border-box}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#E5E7EB;border-radius:4px}`}</style>

      {/* Top bar */}
      <div style={{ background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#111827" }}>Applicants</h1>
          <p style={{ margin: 0, fontSize: 12, color: "#9CA3AF", fontFamily: "'DM Mono',monospace" }}>{filtered.length} total candidates</p>
        </div>
      </div>

      {/* Filters */}
      <div style={{ background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "10px 24px", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" as const }}>
        <div style={{ position: "relative" as const, flex: 1, maxWidth: 300 }}>
          <span style={{ position: "absolute" as const, left: 10, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }}>{Ico.search}</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or role…"
            style={{ width: "100%", padding: "7px 10px 7px 32px", border: "1px solid #E5E7EB", borderRadius: 6, fontSize: 12, color: "#111827", background: "#F9FAFB", outline: "none", fontFamily: "'DM Sans',sans-serif" }} />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as ApplicantStatus | "all")} style={sel}>
          <option value="all">Any Status</option>
          {(Object.keys(STATUS_CONFIG) as ApplicantStatus[]).map(s => <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>)}
        </select>
      </div>

      {/* Content */}
      <div style={{ padding: 24 }}>
        <div style={{ background: "#fff", border: "1.5px solid #E5E7EB", borderRadius: 10, overflow: "hidden" }}>
          
          <div style={{ display: "grid", gridTemplateColumns: "3fr 1fr 1fr 1fr 1.5fr", gap: 16, padding: "12px 20px", background: "#F9FAFB", borderBottom: "1px solid #E5E7EB", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#9CA3AF" }}>
            <div>Candidate</div>
            <div>Rating</div>
            <div>Applied</div>
            <div>Status</div>
            <div style={{ textAlign: "right" }}>Actions</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {filtered.map((app, idx) => {
              const cfg = STATUS_CONFIG[app.status];
              return (
                <div key={app.id} style={{ display: "grid", gridTemplateColumns: "3fr 1fr 1fr 1fr 1.5fr", gap: 16, padding: "16px 20px", alignItems: "center", borderBottom: idx < filtered.length - 1 ? "1px solid #E5E7EB" : "none", opacity: app.status === "Rejected" ? 0.7 : 1 }}>
                  
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <img src={app.avatar} alt={app.name} style={{ width: 40, height: 40, borderRadius: 8, border: "1px solid #E5E7EB", objectFit: "cover" }} />
                    <div>
                      <p style={{ margin: "0 0 2px", fontSize: 14, fontWeight: 700, color: "#111827" }}>{app.name}</p>
                      <p style={{ margin: 0, fontSize: 12, color: "#6B7280" }}>{app.role}</p>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600, color: "#111827" }}>
                    <span style={{ color: "#D97706" }}>{Ico.star}</span> {app.rating} <span style={{ color: "#9CA3AF", fontWeight: 400 }}>({app.reviews})</span>
                  </div>

                  <div style={{ fontSize: 12, color: "#6B7280", fontFamily: "'DM Mono',monospace" }}>{app.applied}</div>

                  <div>
                    <span style={{ display: "inline-block", fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 4, textTransform: "uppercase" as const, color: cfg.color, background: cfg.bg }}>{cfg.label}</span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8 }}>
                    <button style={{ background: "none", border: "1px solid #E5E7EB", borderRadius: 6, padding: "6px 10px", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: "#374151" }}>
                      {Ico.eye} View
                    </button>
                    
                    {app.status === "Applied" && (
                       <>
                         <button onClick={() => changeStatus(app.id, "Shortlisted")} style={{ background: "#FEF3C7", border: "none", color: "#D97706", borderRadius: 6, padding: "6px 10px", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>Shortlist</button>
                         <button onClick={() => changeStatus(app.id, "Rejected")} style={{ background: "#FEE2E2", border: "none", color: "#EF4444", borderRadius: 6, padding: "6px 10px", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>Reject</button>
                       </>
                    )}
                    {app.status === "Shortlisted" && (
                       <button onClick={() => changeStatus(app.id, "Approved")} style={{ background: "#D1FAE5", border: "none", color: "#059669", borderRadius: 6, padding: "6px 10px", cursor: "pointer", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                         {Ico.check} Approve
                       </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}