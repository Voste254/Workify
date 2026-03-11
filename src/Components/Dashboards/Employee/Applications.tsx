import { useState, useMemo } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Stage =
  | "applied"
  | "screening"
  | "interview"
  | "assessment"
  | "offer"
  | "hired"
  | "rejected"
  | "withdrawn";

type JobType = "Corporate – Permanent" | "Corporate – Contract" | "Casual – Daily" | "Casual – Hourly";

interface Application {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  jobType: JobType;
  salary: string;
  appliedDate: string;
  lastUpdated: string;
  stage: Stage;
  nextAction?: string;
  nextActionDate?: string;
  notes?: string;
  logo: string;
  isBookmarked: boolean;
  recruiterName?: string;
  recruiterEmail?: string;
  interviewDate?: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_APPLICATIONS: Application[] = [
  {
    id: "1",
    jobTitle: "Senior Data Analyst",
    company: "Safaricom PLC",
    location: "Nairobi, Kenya",
    jobType: "Corporate – Permanent",
    salary: "KES 180,000 – 220,000",
    appliedDate: "2025-02-10",
    lastUpdated: "2025-03-08",
    stage: "interview",
    nextAction: "Technical interview scheduled",
    nextActionDate: "2025-03-14",
    notes: "Prepare SQL case study and Python portfolio",
    logo: "S",
    isBookmarked: true,
    recruiterName: "Amina Odhiambo",
    recruiterEmail: "a.odhiambo@safaricom.co.ke",
    interviewDate: "2025-03-14T10:00",
  },
  {
    id: "2",
    jobTitle: "Graphic Designer",
    company: "Nation Media Group",
    location: "Nairobi, Kenya",
    jobType: "Corporate – Contract",
    salary: "KES 85,000 – 110,000",
    appliedDate: "2025-02-18",
    lastUpdated: "2025-03-05",
    stage: "assessment",
    nextAction: "Submit design portfolio task",
    nextActionDate: "2025-03-12",
    logo: "N",
    isBookmarked: false,
    recruiterName: "Brian Mutua",
    recruiterEmail: "b.mutua@nation.co.ke",
  },
  {
    id: "3",
    jobTitle: "Construction Foreman",
    company: "Bamburi Cement",
    location: "Mombasa, Kenya",
    jobType: "Casual – Daily",
    salary: "KES 2,500/day",
    appliedDate: "2025-03-01",
    lastUpdated: "2025-03-01",
    stage: "applied",
    logo: "B",
    isBookmarked: false,
  },
  {
    id: "4",
    jobTitle: "Backend Engineer",
    company: "Andela",
    location: "Remote",
    jobType: "Corporate – Contract",
    salary: "$3,500 – $5,000/month",
    appliedDate: "2025-01-22",
    lastUpdated: "2025-02-28",
    stage: "offer",
    nextAction: "Review and sign offer letter",
    nextActionDate: "2025-03-15",
    notes: "Negotiate remote work policy and equipment allowance",
    logo: "A",
    isBookmarked: true,
    recruiterName: "Jade Thompson",
    recruiterEmail: "jade.t@andela.com",
  },
  {
    id: "5",
    jobTitle: "Electrician",
    company: "Kenya Power",
    location: "Kisumu, Kenya",
    jobType: "Corporate – Permanent",
    salary: "KES 65,000 – 80,000",
    appliedDate: "2025-01-15",
    lastUpdated: "2025-02-10",
    stage: "rejected",
    notes: "Lacked 5 years minimum experience. Re-apply in 2026.",
    logo: "K",
    isBookmarked: false,
  },
  {
    id: "6",
    jobTitle: "Photography – Event Coverage",
    company: "Fairmont Hotels",
    location: "Nairobi, Kenya",
    jobType: "Casual – Hourly",
    salary: "KES 3,000/hr",
    appliedDate: "2025-03-05",
    lastUpdated: "2025-03-09",
    stage: "screening",
    nextAction: "Phone screening call",
    nextActionDate: "2025-03-13",
    logo: "F",
    isBookmarked: true,
    recruiterName: "Grace Wambui",
    recruiterEmail: "g.wambui@fairmont.com",
  },
  {
    id: "7",
    jobTitle: "Plumber – Residential",
    company: "HomeServe Kenya",
    location: "Nakuru, Kenya",
    jobType: "Casual – Daily",
    salary: "KES 2,000/day",
    appliedDate: "2025-02-25",
    lastUpdated: "2025-03-06",
    stage: "hired",
    notes: "Starts 17th March. Bring own basic tools.",
    logo: "H",
    isBookmarked: false,
    recruiterName: "Samuel Kiptoo",
    recruiterEmail: "s.kiptoo@homeserve.co.ke",
  },
  {
    id: "8",
    jobTitle: "Marketing Manager",
    company: "Equity Bank",
    location: "Nairobi, Kenya",
    jobType: "Corporate – Permanent",
    salary: "KES 200,000 – 260,000",
    appliedDate: "2025-01-30",
    lastUpdated: "2025-02-20",
    stage: "withdrawn",
    notes: "Accepted a different offer before hearing back.",
    logo: "E",
    isBookmarked: false,
  },
];

// ─── Stage Config ─────────────────────────────────────────────────────────────
const STAGE_CONFIG: Record<Stage, { label: string; color: string; bg: string; step: number }> = {
  applied:    { label: "Applied",    color: "#6B7280", bg: "#F3F4F6", step: 1 },
  screening:  { label: "Screening",  color: "#D97706", bg: "#FEF3C7", step: 2 },
  interview:  { label: "Interview",  color: "#2563EB", bg: "#DBEAFE", step: 3 },
  assessment: { label: "Assessment", color: "#7C3AED", bg: "#EDE9FE", step: 4 },
  offer:      { label: "Offer",      color: "#059669", bg: "#D1FAE5", step: 5 },
  hired:      { label: "Hired",      color: "#FFFFFF", bg: "#111827", step: 6 },
  rejected:   { label: "Rejected",   color: "#FFFFFF", bg: "#DC2626", step: 0 },
  withdrawn:  { label: "Withdrawn",  color: "#FFFFFF", bg: "#9CA3AF", step: 0 },
};

const ACTIVE_STAGES: Stage[] = ["applied", "screening", "interview", "assessment", "offer", "hired"];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-KE", { day: "2-digit", month: "short", year: "numeric" });
}
function daysAgo(dateStr: string) {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  return `${diff}d ago`;
}
function daysUntil(dateStr: string) {
  const diff = Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
  if (diff < 0) return "Overdue";
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  return `In ${diff} days`;
}

// ─── Icons (inline SVG) ───────────────────────────────────────────────────────
const Icons = {
  search: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
    </svg>
  ),
  filter: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
    </svg>
  ),
  bookmark: (filled: boolean) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
    </svg>
  ),
  mail: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
    </svg>
  ),
  location: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  ),
  calendar: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/>
    </svg>
  ),
  close: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
    </svg>
  ),
  withdraw: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 9l-2 2 2 2"/><path d="M13 13l2-2-2-2"/><rect width="18" height="18" x="3" y="3" rx="2"/>
    </svg>
  ),
  eye: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  note: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/>
    </svg>
  ),
  chevronRight: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6"/>
    </svg>
  ),
  briefcase: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
    </svg>
  ),
  alert: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>
    </svg>
  ),
  trash: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
    </svg>
  ),
};

// ─── Stage Progress Bar ───────────────────────────────────────────────────────
function StageProgressBar({ stage }: { stage: Stage }) {
  const cfg = STAGE_CONFIG[stage];
  const isTerminal = stage === "rejected" || stage === "withdrawn";

  if (isTerminal) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{
          fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase",
          padding: "3px 10px", borderRadius: 3,
          color: cfg.color, background: cfg.bg,
        }}>{cfg.label}</span>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      {ACTIVE_STAGES.map((s, i) => {
        const sCfg = STAGE_CONFIG[s];
        const isActive = s === stage;
        const isPast = STAGE_CONFIG[s].step < cfg.step;
        return (
          <div key={s} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div
              title={sCfg.label}
              style={{
                width: isActive ? 28 : 8,
                height: 8,
                borderRadius: 4,
                background: isActive ? "#111827" : isPast ? "#111827" : "#E5E7EB",
                opacity: isPast ? 0.3 : 1,
                transition: "width 0.3s ease",
              }}
            />
          </div>
        );
      })}
      <span style={{
        fontSize: 11, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase",
        color: "#111827", marginLeft: 4,
      }}>{cfg.label}</span>
    </div>
  );
}

// ─── Application Card ─────────────────────────────────────────────────────────
function ApplicationCard({
  app,
  onSelect,
  onBookmark,
  onWithdraw,
  selected,
}: {
  app: Application;
  onSelect: () => void;
  onBookmark: () => void;
  onWithdraw: () => void;
  selected: boolean;
}) {
  const cfg = STAGE_CONFIG[app.stage];
  const isTerminal = app.stage === "rejected" || app.stage === "withdrawn";
  const isUrgent = app.nextActionDate && daysUntil(app.nextActionDate) === "Today" || app.nextActionDate && daysUntil(app.nextActionDate) === "Tomorrow";

  return (
    <div
      onClick={onSelect}
      style={{
        background: "#FFFFFF",
        border: selected ? "1.5px solid #111827" : "1.5px solid #E5E7EB",
        borderRadius: 8,
        padding: "16px 18px",
        cursor: "pointer",
        opacity: isTerminal ? 0.7 : 1,
        transition: "border-color 0.15s ease",
        position: "relative",
      }}
    >
      {/* Urgent indicator */}
      {isUrgent && !isTerminal && (
        <div style={{
          position: "absolute", top: 12, right: 12,
          width: 7, height: 7, borderRadius: "50%", background: "#EF4444"
        }} />
      )}

      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        {/* Logo */}
        <div style={{
          width: 40, height: 40, borderRadius: 8,
          background: "#F9FAFB", border: "1.5px solid #E5E7EB",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 16, fontWeight: 700, color: "#111827", flexShrink: 0,
          fontFamily: "'DM Mono', monospace",
        }}>
          {app.logo}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Title & company */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 2 }}>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#111827", fontFamily: "'DM Sans', sans-serif" }}>
              {app.jobTitle}
            </p>
            <button
              onClick={(e) => { e.stopPropagation(); onBookmark(); }}
              style={{
                background: "none", border: "none", cursor: "pointer", padding: 2,
                color: app.isBookmarked ? "#D97706" : "#9CA3AF",
              }}
            >
              {Icons.bookmark(app.isBookmarked)}
            </button>
          </div>
          <p style={{ margin: 0, fontSize: 12, color: "#6B7280", fontFamily: "'DM Sans', sans-serif" }}>
            {app.company}
          </p>

          {/* Meta row */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8, flexWrap: "wrap" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, color: "#9CA3AF" }}>
              {Icons.location} {app.location}
            </span>
            <span style={{
              fontSize: 11, color: "#6B7280", padding: "2px 7px",
              background: "#F3F4F6", borderRadius: 3, fontWeight: 500,
            }}>
              {app.jobType}
            </span>
          </div>

          {/* Stage bar */}
          <div style={{ marginTop: 10 }}>
            <StageProgressBar stage={app.stage} />
          </div>

          {/* Next action */}
          {app.nextAction && !isTerminal && (
            <div style={{
              marginTop: 10, padding: "7px 10px",
              background: isUrgent ? "#FEF2F2" : "#F9FAFB",
              border: `1px solid ${isUrgent ? "#FECACA" : "#E5E7EB"}`,
              borderRadius: 6, display: "flex", alignItems: "center", gap: 6,
            }}>
              <span style={{ color: isUrgent ? "#DC2626" : "#D97706" }}>{Icons.alert}</span>
              <span style={{ fontSize: 11, color: isUrgent ? "#DC2626" : "#6B7280", fontFamily: "'DM Sans', sans-serif" }}>
                {app.nextAction}
                {app.nextActionDate && (
                  <strong style={{ marginLeft: 4, color: isUrgent ? "#DC2626" : "#111827" }}>
                    — {daysUntil(app.nextActionDate)}
                  </strong>
                )}
              </span>
            </div>
          )}

          {/* Footer */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10 }}>
            <span style={{ fontSize: 11, color: "#9CA3AF", fontFamily: "'DM Mono', monospace" }}>
              Updated {daysAgo(app.lastUpdated)}
            </span>
            {!isTerminal && app.stage !== "hired" && (
              <button
                onClick={(e) => { e.stopPropagation(); onWithdraw(); }}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  fontSize: 11, color: "#9CA3AF", display: "flex", alignItems: "center", gap: 3,
                  padding: "2px 0", fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {Icons.withdraw} Withdraw
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Detail Panel ─────────────────────────────────────────────────────────────
function DetailPanel({ app, onClose, onBookmark }: { app: Application; onClose: () => void; onBookmark: () => void }) {
  const cfg = STAGE_CONFIG[app.stage];
  const isTerminal = app.stage === "rejected" || app.stage === "withdrawn";

  const timeline: { label: string; date?: string; done: boolean; active: boolean }[] = ACTIVE_STAGES.map(s => ({
    label: STAGE_CONFIG[s].label,
    done: STAGE_CONFIG[s].step < STAGE_CONFIG[app.stage].step,
    active: s === app.stage && !isTerminal,
  }));

  return (
    <div style={{
      background: "#FFFFFF",
      border: "1.5px solid #E5E7EB",
      borderRadius: 10,
      height: "100%",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{ padding: "18px 20px", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 10,
              background: "#F9FAFB", border: "1.5px solid #E5E7EB",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, fontWeight: 700, color: "#111827",
              fontFamily: "'DM Mono', monospace",
            }}>
              {app.logo}
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#111827", fontFamily: "'DM Sans', sans-serif" }}>
                {app.jobTitle}
              </p>
              <p style={{ margin: 0, fontSize: 12, color: "#6B7280", fontFamily: "'DM Sans', sans-serif" }}>
                {app.company} · {app.location}
              </p>
            </div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={onBookmark} style={{
              background: "none", border: "1px solid #E5E7EB", borderRadius: 6, padding: "6px 8px",
              cursor: "pointer", color: app.isBookmarked ? "#D97706" : "#9CA3AF", display: "flex", alignItems: "center",
            }}>
              {Icons.bookmark(app.isBookmarked)}
            </button>
            <button onClick={onClose} style={{
              background: "none", border: "1px solid #E5E7EB", borderRadius: 6, padding: "6px 8px",
              cursor: "pointer", color: "#6B7280", display: "flex", alignItems: "center",
            }}>
              {Icons.close}
            </button>
          </div>
        </div>

        {/* Badges */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <span style={{
            fontSize: 11, fontWeight: 600, letterSpacing: "0.05em",
            padding: "4px 10px", borderRadius: 4, textTransform: "uppercase",
            color: cfg.color, background: cfg.bg,
          }}>{cfg.label}</span>
          <span style={{
            fontSize: 11, padding: "4px 10px", borderRadius: 4,
            color: "#374151", background: "#F3F4F6", fontWeight: 500,
          }}>{app.jobType}</span>
          <span style={{
            fontSize: 11, padding: "4px 10px", borderRadius: 4,
            color: "#374151", background: "#F3F4F6", fontFamily: "'DM Mono', monospace",
          }}>{app.salary}</span>
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: "auto", padding: "18px 20px" }}>
        {/* Application timeline */}
        <p style={{ margin: "0 0 12px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#9CA3AF" }}>
          Progress
        </p>
        {!isTerminal ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 0, marginBottom: 20 }}>
            {timeline.map(({ label, done, active }, i) => (
              <div key={label} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
                    background: done ? "#111827" : active ? "#111827" : "#F3F4F6",
                    border: `2px solid ${done || active ? "#111827" : "#E5E7EB"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {done && (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6 9 17l-5-5"/>
                      </svg>
                    )}
                    {active && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "white" }} />}
                  </div>
                  {i < timeline.length - 1 && (
                    <div style={{ width: 2, height: 20, background: done ? "#111827" : "#E5E7EB", opacity: done ? 0.3 : 1 }} />
                  )}
                </div>
                <p style={{
                  margin: "2px 0 14px",
                  fontSize: 12, fontWeight: active ? 700 : 500,
                  color: done || active ? "#111827" : "#9CA3AF",
                  fontFamily: "'DM Sans', sans-serif",
                }}>
                  {label} {active && <span style={{ color: "#D97706", fontWeight: 400 }}>← current</span>}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            padding: "10px 14px", borderRadius: 6,
            background: cfg.bg, marginBottom: 20,
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: cfg.color }}>{cfg.label}</span>
            <span style={{ fontSize: 12, color: "#6B7280" }}>
              {app.stage === "rejected" ? "This application was not successful." : "You withdrew this application."}
            </span>
          </div>
        )}

        {/* Next Action */}
        {app.nextAction && (
          <>
            <p style={{ margin: "0 0 8px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#9CA3AF" }}>
              Next Action
            </p>
            <div style={{
              padding: "12px 14px", borderRadius: 6, border: "1px solid #E5E7EB",
              marginBottom: 20, background: "#FAFAFA",
            }}>
              <p style={{ margin: 0, fontSize: 13, color: "#111827", fontWeight: 500, fontFamily: "'DM Sans', sans-serif" }}>
                {app.nextAction}
              </p>
              {app.nextActionDate && (
                <p style={{ margin: "4px 0 0", fontSize: 11, color: "#6B7280", display: "flex", alignItems: "center", gap: 4 }}>
                  {Icons.calendar} {formatDate(app.nextActionDate)} — <strong style={{ color: "#111827" }}>{daysUntil(app.nextActionDate)}</strong>
                </p>
              )}
            </div>
          </>
        )}

        {/* Recruiter */}
        {app.recruiterName && (
          <>
            <p style={{ margin: "0 0 8px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#9CA3AF" }}>
              Recruiter Contact
            </p>
            <div style={{
              padding: "12px 14px", borderRadius: 6, border: "1px solid #E5E7EB",
              marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <div>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#111827", fontFamily: "'DM Sans', sans-serif" }}>
                  {app.recruiterName}
                </p>
                <p style={{ margin: "2px 0 0", fontSize: 11, color: "#6B7280" }}>{app.recruiterEmail}</p>
              </div>
              <a href={`mailto:${app.recruiterEmail}`} style={{
                display: "flex", alignItems: "center", gap: 4,
                fontSize: 11, color: "#111827", fontWeight: 600,
                padding: "6px 12px", border: "1px solid #E5E7EB", borderRadius: 6,
                textDecoration: "none", background: "#F9FAFB",
              }}>
                {Icons.mail} Email
              </a>
            </div>
          </>
        )}

        {/* Notes */}
        {app.notes && (
          <>
            <p style={{ margin: "0 0 8px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#9CA3AF" }}>
              Notes
            </p>
            <div style={{
              padding: "12px 14px", borderRadius: 6,
              background: "#FFFBEB", border: "1px solid #FDE68A",
              marginBottom: 20,
            }}>
              <p style={{ margin: 0, fontSize: 12, color: "#78350F", lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif" }}>
                {app.notes}
              </p>
            </div>
          </>
        )}

        {/* Dates */}
        <p style={{ margin: "0 0 8px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#9CA3AF" }}>
          Timeline
        </p>
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 20,
        }}>
          {[
            { label: "Applied", value: formatDate(app.appliedDate) },
            { label: "Last Update", value: formatDate(app.lastUpdated) },
          ].map(({ label, value }) => (
            <div key={label} style={{ padding: "10px 12px", borderRadius: 6, background: "#F9FAFB", border: "1px solid #E5E7EB" }}>
              <p style={{ margin: "0 0 2px", fontSize: 10, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</p>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: "#111827", fontFamily: "'DM Mono', monospace" }}>{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ApplicationsTracker() {
  const [apps, setApps] = useState<Application[]>(MOCK_APPLICATIONS);
  const [selectedId, setSelectedId] = useState<string | null>("1");
  const [search, setSearch] = useState("");
  const [filterStage, setFilterStage] = useState<Stage | "all">("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"lastUpdated" | "appliedDate" | "company">("lastUpdated");

  const filtered = useMemo(() => {
    return apps
      .filter(a => {
        const q = search.toLowerCase();
        const matchSearch = !q || a.jobTitle.toLowerCase().includes(q) || a.company.toLowerCase().includes(q);
        const matchStage = filterStage === "all" || a.stage === filterStage;
        const matchType = filterType === "all" || a.jobType === filterType;
        return matchSearch && matchStage && matchType;
      })
      .sort((a, b) => {
        if (sortBy === "company") return a.company.localeCompare(b.company);
        return new Date(b[sortBy]).getTime() - new Date(a[sortBy]).getTime();
      });
  }, [apps, search, filterStage, filterType, sortBy]);

  const selected = apps.find(a => a.id === selectedId) || null;

  const toggleBookmark = (id: string) =>
    setApps(prev => prev.map(a => a.id === id ? { ...a, isBookmarked: !a.isBookmarked } : a));

  const withdraw = (id: string) =>
    setApps(prev => prev.map(a => a.id === id ? { ...a, stage: "withdrawn" as Stage } : a));

  // Stats
  const stats = {
    total: apps.length,
    active: apps.filter(a => !["rejected", "withdrawn", "hired"].includes(a.stage)).length,
    hired: apps.filter(a => a.stage === "hired").length,
    interviews: apps.filter(a => a.stage === "interview").length,
    offers: apps.filter(a => a.stage === "offer").length,
  };

  return (
    <div style={{
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      background: "#F9FAFB",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 4px; }
      `}</style>

      {/* Top bar */}
      <div style={{
        background: "#FFFFFF", borderBottom: "1px solid #E5E7EB",
        padding: "14px 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#111827" }}>My Applications</h1>
          <p style={{ margin: 0, fontSize: 12, color: "#9CA3AF", fontFamily: "'DM Mono', monospace" }}>
            {stats.active} active · {stats.total} total
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {[
            { label: "Active", value: stats.active, color: "#111827" },
            { label: "Interviews", value: stats.interviews, color: "#2563EB" },
            { label: "Offers", value: stats.offers, color: "#059669" },
            { label: "Hired", value: stats.hired, color: "#FFFFFF", bg: "#111827" },
          ].map(({ label, value, color, bg }) => (
            <div key={label} style={{
              padding: "6px 14px", borderRadius: 6,
              background: bg || "#F3F4F6",
              border: bg ? "none" : "1px solid #E5E7EB",
              textAlign: "center",
            }}>
              <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color, fontFamily: "'DM Mono', monospace" }}>{value}</p>
              <p style={{ margin: 0, fontSize: 10, color: bg ? "#9CA3AF" : "#6B7280", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div style={{
        background: "#FFFFFF", borderBottom: "1px solid #E5E7EB",
        padding: "10px 24px",
        display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap",
      }}>
        {/* Search */}
        <div style={{ position: "relative", flex: "1", maxWidth: 260 }}>
          <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }}>
            {Icons.search}
          </span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search jobs or companies…"
            style={{
              width: "100%", padding: "7px 10px 7px 32px",
              border: "1px solid #E5E7EB", borderRadius: 6,
              fontSize: 12, color: "#111827", background: "#F9FAFB",
              outline: "none", fontFamily: "'DM Sans', sans-serif",
            }}
          />
        </div>

        {/* Stage filter */}
        <select
          value={filterStage}
          onChange={e => setFilterStage(e.target.value as Stage | "all")}
          style={{
            padding: "7px 10px", border: "1px solid #E5E7EB", borderRadius: 6,
            fontSize: 12, color: "#374151", background: "#F9FAFB",
            cursor: "pointer", outline: "none", fontFamily: "'DM Sans', sans-serif",
          }}
        >
          <option value="all">All Stages</option>
          {(Object.keys(STAGE_CONFIG) as Stage[]).map(s => (
            <option key={s} value={s}>{STAGE_CONFIG[s].label}</option>
          ))}
        </select>

        {/* Type filter */}
        <select
          value={filterType}
          onChange={e => setFilterType(e.target.value)}
          style={{
            padding: "7px 10px", border: "1px solid #E5E7EB", borderRadius: 6,
            fontSize: 12, color: "#374151", background: "#F9FAFB",
            cursor: "pointer", outline: "none", fontFamily: "'DM Sans', sans-serif",
          }}
        >
          <option value="all">All Types</option>
          <option value="Corporate – Permanent">Corporate – Permanent</option>
          <option value="Corporate – Contract">Corporate – Contract</option>
          <option value="Casual – Daily">Casual – Daily</option>
          <option value="Casual – Hourly">Casual – Hourly</option>
        </select>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value as typeof sortBy)}
          style={{
            padding: "7px 10px", border: "1px solid #E5E7EB", borderRadius: 6,
            fontSize: 12, color: "#374151", background: "#F9FAFB",
            cursor: "pointer", outline: "none", fontFamily: "'DM Sans', sans-serif",
          }}
        >
          <option value="lastUpdated">Sort: Last Updated</option>
          <option value="appliedDate">Sort: Date Applied</option>
          <option value="company">Sort: Company A–Z</option>
        </select>

        <span style={{ fontSize: 12, color: "#9CA3AF", marginLeft: "auto", fontFamily: "'DM Mono', monospace" }}>
          {filtered.length} result{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Main content */}
      <div style={{
        flex: 1, display: "grid",
        gridTemplateColumns: selected ? "1fr 380px" : "1fr",
        gap: 16, padding: 20, alignItems: "start",
        maxHeight: "calc(100vh - 130px)", overflow: "hidden",
      }}>
        {/* Left: card list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, overflowY: "auto", height: "100%" }}>
          {filtered.length === 0 ? (
            <div style={{
              padding: 48, textAlign: "center", border: "1.5px dashed #E5E7EB",
              borderRadius: 10, background: "#FFFFFF",
            }}>
              <p style={{ margin: 0, fontSize: 14, color: "#9CA3AF" }}>No applications match your filters.</p>
            </div>
          ) : (
            filtered.map(app => (
              <ApplicationCard
                key={app.id}
                app={app}
                selected={selectedId === app.id}
                onSelect={() => setSelectedId(prev => prev === app.id ? null : app.id)}
                onBookmark={() => toggleBookmark(app.id)}
                onWithdraw={() => withdraw(app.id)}
              />
            ))
          )}
        </div>

        {/* Right: detail panel */}
        {selected && (
          <div style={{ position: "sticky", top: 0, height: "calc(100vh - 155px)" }}>
            <DetailPanel
              app={selected}
              onClose={() => setSelectedId(null)}
              onBookmark={() => toggleBookmark(selected.id)}
            />
          </div>
        )}
      </div>
    </div>
  );
}