import { useState } from "react";
import { CATEGORIES } from "../Employee/FindJobs";

// ── Icons ──────────────────────────────────────────────────────────────────────
const I = (d: string, s = 14, fill = "none") => <svg width={s} height={s} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: d }} />;
const Ico = {
  briefcase: I('<rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>', 14),
  pin: I('<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>', 14),
  coins: I('<circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/><path d="M7 6h1v4"/><path d="m16.71 13.88.7.71-2.82 2.82"/>', 14),
  clock: I('<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>', 14),
  check: I('<path d="M20 6 9 17l-5-5"/>', 14),
  tool: I('<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>', 14)
};

// ── Shared styles ──────────────────────────────────────────────────────────────
const labelStyle = { display: "block", fontSize: 15, fontWeight: 600, color: "#374151", marginBottom: 6, fontFamily: "'DM Sans',sans-serif" };
const inputOuter = { position: "relative" as const, display: "flex", alignItems: "center", width: "100%" };
const inputIcon = { position: "absolute" as const, left: 12, color: "#9CA3AF" };
const inputStyle = { width: "100%", padding: "10px 14px 10px 36px", border: "1.5px solid #E5E7EB", borderRadius: 8, fontSize: 16, color: "#111827", background: "#fff", outline: "none", fontFamily: "'DM Sans',sans-serif", transition: "border-color 0.15s" };

// ── Main ───────────────────────────────────────────────────────────────────────
export default function PostJobs() {
  const [isSaved, setIsSaved] = useState(false);
  const [jobCategory, setJobCategory] = useState(CATEGORIES[0]);
  const [jobType, setJobType] = useState("Permanent");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif", background: "#F9FAFB", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500;600&display=swap');*{box-sizing:border-box}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#E5E7EB;border-radius:4px}`}</style>

      {/* Top bar */}
      <div style={{ background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#111827" }}>Post a New Job</h1>
          <p style={{ margin: 0, fontSize: 14, color: "#9CA3AF", fontFamily: "'DM Mono',monospace" }}>Find Top Talent & Casual Labor in Kenya</p>
        </div>
        <div>
          {isSaved && <span style={{ marginRight: 16, fontSize: 15, color: "#059669", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 6 }}>{Ico.check} Job Posted Successfully</span>}
        </div>
      </div>

      <div style={{ padding: 24, maxWidth: 800, margin: "0 auto", width: "100%" }}>
        <div style={{ background: "#fff", border: "1.5px solid #E5E7EB", borderRadius: 10, overflow: "hidden" }}>
          
          <form onSubmit={handleSubmit} style={{ padding: 30 }}>
            <h3 style={{ margin: "0 0 20px", fontSize: 18, fontWeight: 700, color: "#111827", borderBottom: "1px solid #E5E7EB", paddingBottom: 10 }}>Job Category &amp; Type</h3>

            {/* Category Dropdown */}
            <div style={{ marginBottom: 24 }}>
              <label style={labelStyle}>Job Category</label>
              <div style={inputOuter}>
                <span style={inputIcon}>{Ico.briefcase}</span>
                <select
                  value={jobCategory}
                  onChange={e => setJobCategory(e.target.value)}
                  style={{ ...inputStyle, cursor: "pointer", appearance: "none" }}
                  required
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
              <div>
                 <label style={labelStyle}>Job Title</label>
                 <div style={inputOuter}>
                    <span style={inputIcon}>{Ico.briefcase}</span>
                    <input type="text" placeholder="e.g. Senior Data Analyst" style={inputStyle} required />
                 </div>

              </div>

              <div>
                 <label style={labelStyle}>Job Type</label>
                 <select
                   value={jobType}
                   onChange={e => setJobType(e.target.value)}
                   style={{ ...inputStyle, paddingLeft: 14, cursor: "pointer", appearance: "none" }}
                 >
                   <option value="Permanent">Permanent</option>
                   <option value="Contract">Contract</option>
                   <option value="Internship">Internship</option>
                   <option value="Daily / Day-Labor">Daily / Day-Labor</option>
                   <option value="Hourly / Shift">Hourly / Shift</option>
                   <option value="Gig / Project-Based">Gig / Project-Based</option>
                 </select>
              </div>
            </div>

            <h3 style={{ margin: "30px 0 20px", fontSize: 18, fontWeight: 700, color: "#111827", borderBottom: "1px solid #E5E7EB", paddingBottom: 10 }}>Location & Compensation</h3>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
              <div>
                 <label style={labelStyle}>Location (Kenya)</label>
                 <div style={inputOuter}>
                    <span style={inputIcon}>{Ico.pin}</span>
                    <input type="text" placeholder="e.g. Nairobi, Mombasa, Kisumu" style={inputStyle} required />
                 </div>
              </div>

              <div>
                 <label style={labelStyle}>Salary / Rate (KES)</label>
                 <div style={inputOuter}>
                    <span style={inputIcon}>{Ico.coins}</span>
                    <input type="text" placeholder={jobCategory === "Corporate" ? "e.g. KES 150,000/mo" : "e.g. KES 2,000/day"} style={inputStyle} required />
                 </div>
              </div>
            </div>

            <h3 style={{ margin: "30px 0 20px", fontSize: 18, fontWeight: 700, color: "#111827", borderBottom: "1px solid #E5E7EB", paddingBottom: 10 }}>Job Specifics</h3>

            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Description & Requirements</label>
              <textarea rows={6} placeholder={jobCategory === "Corporate" ? "Detail the required skills, degree, and exact corporate responsibilities..." : "Detail the physical requirements, required tools, and exact task location..."}
                style={{ ...inputStyle, paddingLeft: 14, resize: "vertical" }} required />
            </div>

            <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 30 }}>
               <input type="checkbox" id="urgent" style={{ width: 16, height: 16, cursor: "pointer" }} />
               <label htmlFor="urgent" style={{ fontSize: 15, color: "#111827", fontWeight: 600, cursor: "pointer", userSelect: "none" }}>Mark as urgent (Immediate start required)</label>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, borderTop: "1px solid #E5E7EB", paddingTop: 20 }}>
               <button type="button" style={{ padding: "10px 20px", background: "#fff", color: "#6B7280", border: "1.5px solid #E5E7EB", borderRadius: 8, fontSize: 16, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
                 Save as Draft
               </button>
               <button type="submit" style={{ padding: "10px 20px", background: "#111827", color: "#fff", border: "none", borderRadius: 8, fontSize: 16, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
                 Publish Job
               </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}