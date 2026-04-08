import { useState } from "react";
import { CATEGORIES } from "../Employee/FindJobs";
import { supabase } from "../../../lib/supabaseClient";
import { useAuth } from "../../../contexts/AuthContext";


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
  const { user } = useAuth();

  const [isSaved, setIsSaved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [jobCategory, setJobCategory] = useState(CATEGORIES[0]);
  const [jobType, setJobType] = useState("Permanent");
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [description, setDescription] = useState("");

  const submitJob = async (status: "active" | "draft") => {
    if (!title || !location || !salary || !description) {
      setError("Please fill out all required fields.");
      return;
    }

    if (!user) {
      setError("You must be logged in to post a job.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const { error: dbError } = await supabase.from("jobs").insert([
        {
          employer_id: user.id,
          title,
          category: jobCategory,
          job_type: jobType,
          location,
          salary_rate: salary,
          description,
          status,
        }
      ]);

      if (dbError) throw dbError;

      setIsSaved(true);
      setTimeout(() => {
        setIsSaved(false);
      }, 2500);
      
      // Reset form
      setTitle("");
      setLocation("");
      setSalary("");
      setDescription("");
      setJobCategory(CATEGORIES[0]);
      setJobType("Permanent");
      
    } catch (err: any) {
      console.error("Error posting job:", err);
      setError(err.message || "Failed to post job. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitJob("active");
  };

  return (
    <div style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif", background: "#F9FAFB", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500;600&display=swap');
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-thumb{background:#E5E7EB;border-radius:4px}
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes pop { 0% { transform: scale(0.5); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
      `}</style>
      
      {/* Modal */}
      {(isSubmitting || isSaved) && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", transition: "opacity 0.2s" }}>
          <div style={{ background: "#fff", padding: "40px", borderRadius: "16px", display: "flex", flexDirection: "column", alignItems: "center", width: "300px", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)" }}>
            {isSubmitting ? (
              <>
                <div style={{ width: 44, height: 44, border: "4px solid #F3F4F6", borderTop: "4px solid #111827", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                <p style={{ marginTop: 24, fontSize: 16, fontWeight: 600, color: "#111827", fontFamily: "'DM Sans',sans-serif" }}>Publishing Job...</p>
                <p style={{ marginTop: 4, fontSize: 13, color: "#6B7280", fontFamily: "'DM Sans',sans-serif" }}>Please wait a moment</p>
              </>
            ) : isSaved ? (
              <>
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#D1FAE5", display: "flex", alignItems: "center", justifyContent: "center", color: "#059669", animation: "pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards" }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                </div>
                <p style={{ marginTop: 20, fontSize: 18, fontWeight: 700, color: "#111827", fontFamily: "'DM Sans',sans-serif", textAlign: "center" }}>Job Posted!</p>
                <p style={{ marginTop: 6, fontSize: 14, color: "#4B5563", fontFamily: "'DM Sans',sans-serif", textAlign: "center" }}>Your job is now live on the platform.</p>
              </>
            ) : null}
          </div>
        </div>
      )}

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
            {error && (
              <div style={{ marginBottom: 20, padding: 12, borderRadius: 8, background: "#FEF2F2", border: "1px solid #FCA5A5", color: "#EF4444", fontSize: 14 }}>
                {error}
              </div>
            )}
            
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
                    <input type="text" placeholder="e.g. Senior Data Analyst" style={inputStyle} value={title} onChange={e => setTitle(e.target.value)} required />
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
                 <label style={labelStyle}>Location</label>
                 <div style={inputOuter}>
                    <span style={inputIcon}>{Ico.pin}</span>
                    <input type="text" placeholder="e.g. Nairobi, Moscow, Cairo" style={inputStyle} value={location} onChange={e => setLocation(e.target.value)} required />
                 </div>
              </div>

              <div>
                 <label style={labelStyle}>Salary / Rate (KES)</label>
                 <div style={inputOuter}>
                    <span style={inputIcon}>{Ico.coins}</span>
                    <input type="text" placeholder={jobCategory === "Corporate" ? "e.g. KES 150,000/mo" : "e.g. KES 2,000/day"} style={inputStyle} value={salary} onChange={e => setSalary(e.target.value)} required />
                 </div>
              </div>
            </div>

            <h3 style={{ margin: "30px 0 20px", fontSize: 18, fontWeight: 700, color: "#111827", borderBottom: "1px solid #E5E7EB", paddingBottom: 10 }}>Job Specifics</h3>

            <div style={{ marginBottom: 30 }}>
              <label style={labelStyle}>Description & Requirements</label>
              <textarea rows={6} placeholder={jobCategory === "Corporate" ? "Detail the required skills, degree, and exact corporate responsibilities..." : "Detail the required skills, qualificatons and expected roles..."}
                style={{ ...inputStyle, paddingLeft: 14, resize: "vertical" }} value={description} onChange={e => setDescription(e.target.value)} required />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, borderTop: "1px solid #E5E7EB", paddingTop: 20 }}>
               <button type="button" onClick={() => submitJob("draft")} disabled={isSubmitting} style={{ padding: "10px 20px", background: "#fff", color: "#6B7280", border: "1.5px solid #E5E7EB", borderRadius: 8, fontSize: 16, fontWeight: 600, cursor: isSubmitting ? "not-allowed" : "pointer", opacity: isSubmitting ? 0.7 : 1, fontFamily: "'DM Sans',sans-serif" }}>
                 Save as Draft
               </button>
               <button type="submit" disabled={isSubmitting} style={{ padding: "10px 20px", background: "#111827", color: "#fff", border: "none", borderRadius: 8, fontSize: 16, fontWeight: 600, cursor: isSubmitting ? "not-allowed" : "pointer", opacity: isSubmitting ? 0.7 : 1, fontFamily: "'DM Sans',sans-serif" }}>
                 {isSubmitting ? "Publishing..." : "Publish Job"}
               </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}