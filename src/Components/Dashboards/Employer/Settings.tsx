import { useState } from "react";

// ── Icons ──────────────────────────────────────────────────────────────────────
const I = (d: string, s = 14, fill = "none") => <svg width={s} height={s} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: d }} />;
const Ico = {
  camera: I('<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>', 14),
  building: I('<rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/>', 14),
  mail: I('<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>', 14),
  phone: I('<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>', 14),
  globe: I('<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>', 14),
  pin: I('<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>', 14),
  check: I('<path d="M20 6 9 17l-5-5"/>', 14)
};

// ── Shared styles ──────────────────────────────────────────────────────────────
const labelStyle = { display: "block", fontSize: 15, fontWeight: 600, color: "#374151", marginBottom: 6, fontFamily: "'DM Sans',sans-serif" };
const inputOuter = { position: "relative" as const, display: "flex", alignItems: "center" };
const inputIcon = { position: "absolute" as const, left: 12, color: "#9CA3AF" };
const inputStyle = { width: "100%", padding: "10px 14px 10px 36px", border: "1.5px solid #E5E7EB", borderRadius: 8, fontSize: 16, color: "#111827", background: "#fff", outline: "none", fontFamily: "'DM Sans',sans-serif", transition: "border-color 0.15s" };

// ── Main ───────────────────────────────────────────────────────────────────────
export default function Settings() {
  const [isSaved, setIsSaved] = useState(false);

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
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#111827" }}>Account Settings</h1>
          <p style={{ margin: 0, fontSize: 14, color: "#9CA3AF", fontFamily: "'DM Mono',monospace" }}>Company Profile</p>
        </div>
        <div>
          {isSaved && <span style={{ marginRight: 16, fontSize: 15, color: "#059669", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 6 }}>{Ico.check} Saved Successfully</span>}
          <button onClick={handleSubmit} style={{ padding: "8px 16px", background: "#111827", color: "#fff", border: "none", borderRadius: 6, fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
            Save Changes
          </button>
        </div>
      </div>

      <div style={{ padding: 24, maxWidth: 900, margin: "0 auto", width: "100%" }}>
        <div style={{ background: "#fff", border: "1.5px solid #E5E7EB", borderRadius: 10, overflow: "hidden" }}>
          
          {/* Cover Photo */}
          <div style={{ height: 140, background: "#111827", position: "relative" as const }}>
            <button style={{ position: "absolute", right: 20, bottom: 20, background: "rgba(255,255,255,0.2)", color: "#fff", border: "none", borderRadius: 6, padding: "8px 12px", display: "flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 600, cursor: "pointer", backdropFilter: "blur(4px)" }}>
              {Ico.camera} Edit Cover
            </button>
          </div>

          <form onSubmit={handleSubmit} style={{ padding: 30 }}>
            
            {/* Logo */}
            <div style={{ marginTop: -70, marginBottom: 30, display: "flex", alignItems: "flex-end" }}>
              <div style={{ width: 100, height: 100, background: "#fff", border: "4px solid #fff", borderRadius: 12, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" as const, cursor: "pointer", overflow: "hidden" }}>
                <div style={{ width: "100%", height: "100%", background: "#F9FAFB", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#9CA3AF" }}>
                  {Ico.camera}
                  <span style={{ fontSize: 12, fontWeight: 600, marginTop: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>Logo</span>
                </div>
              </div>
            </div>

            <h3 style={{ margin: "0 0 20px", fontSize: 18, fontWeight: 700, color: "#111827", borderBottom: "1px solid #E5E7EB", paddingBottom: 10 }}>Company Details</h3>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
              <div>
                <label style={labelStyle}>Company Name</label>
                <div style={inputOuter}>
                  <span style={inputIcon}>{Ico.building}</span>
                  <input type="text" defaultValue="TechNova Solutions" style={inputStyle} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Industry</label>
                <select style={{ ...inputStyle, paddingLeft: 14, cursor: "pointer", appearance: "none" }}>
                  <option>Information Technology</option>
                  <option>Finance</option>
                  <option>Healthcare</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: 30 }}>
              <label style={labelStyle}>Company Description</label>
              <textarea rows={4} defaultValue="TechNova is a leading provider of innovative cloud solutions and enterprise software dedicated to helping businesses scale seamlessly."
                style={{ ...inputStyle, paddingLeft: 14, resize: "vertical" }} />
            </div>

            <h3 style={{ margin: "0 0 20px", fontSize: 18, fontWeight: 700, color: "#111827", borderBottom: "1px solid #E5E7EB", paddingBottom: 10 }}>Contact Information</h3>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
              <div>
                <label style={labelStyle}>Email Address</label>
                <div style={inputOuter}>
                  <span style={inputIcon}>{Ico.mail}</span>
                  <input type="email" defaultValue="contact@technova.com" style={inputStyle} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Phone Number</label>
                <div style={inputOuter}>
                  <span style={inputIcon}>{Ico.phone}</span>
                  <input type="text" defaultValue="+1 (555) 123-4567" style={inputStyle} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Website</label>
                <div style={inputOuter}>
                  <span style={inputIcon}>{Ico.globe}</span>
                  <input type="url" defaultValue="https://technova.com" style={inputStyle} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Location</label>
                <div style={inputOuter}>
                  <span style={inputIcon}>{Ico.pin}</span>
                  <input type="text" defaultValue="San Francisco, CA" style={inputStyle} />
                </div>
              </div>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
