import { useState } from "react";
import Services from "./Services";

// ── Icons ──────────────────────────────────────────────────────────────────────
const I = (d: string, s = 14, fill = "none") => <svg width={s} height={s} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: d }} />;
const Ico = {
  edit: I('<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>', 16),
  upload: I('<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>', 16),
  star: I('<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>', 16, "currentColor"),
  starHalf: I('<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>', 16)
};

export default function MyProfile() {
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState({
    name: "Okutah Voste",
    email: "okutah.voste@example.ke",
    phone: "0712 345 678",
    bio: "Experienced data professional and logistics coordinator."
  });

  // ── Shared Styles ────────────────────────────────────────────────────────────
  const inputStyle = { width: "100%", padding: "12px 16px", border: "1.5px solid #E5E7EB", borderRadius: 8, fontSize: 14, color: "#111827", background: editMode ? "#fff" : "#F9FAFB", outline: "none", fontFamily: "'DM Sans',sans-serif", marginBottom: 16, transition: "border-color 0.15s, background 0.15s", opacity: editMode ? 1 : 0.8 };
  const labelStyle = { display: "block", fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 6, fontFamily: "'DM Sans',sans-serif" };

  return (
    <div style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif", background: "#F9FAFB", minHeight: "100vh", padding: "32px", display: "flex", flexDirection: "column" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500;600&display=swap');*{box-sizing:border-box}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#E5E7EB;border-radius:4px}`}</style>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: "#111827" }}>My Profile</h2>
        <button onClick={() => setEditMode(!editMode)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", background: editMode ? "#F3F4F6" : "#fff", border: "1.5px solid #111827", color: "#111827", borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: "pointer", transition: "all 0.1s" }}>
          {Ico.edit} {editMode ? "Cancel Editing" : "Edit Profile"}
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 32, alignItems: "start" }}>
        
        {/* LEFT PANEL */}
        <div style={{ background: "#fff", border: "1.5px solid #E5E7EB", borderRadius: 12, padding: 32, display: "flex", flexDirection: "column", alignItems: "center" }}>
          
          <div style={{ position: "relative", marginBottom: 16 }}>
             <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="avatar" style={{ width: 120, height: 120, borderRadius: 60, objectFit: "cover", border: "4px solid #F9FAFB" }} />
             {editMode && (
               <button style={{ position: "absolute", bottom: 0, right: 0, width: 36, height: 36, borderRadius: 18, background: "#111827", color: "#fff", border: "2px solid #fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                 {Ico.upload}
               </button>
             )}
          </div>

          <h3 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 700, color: "#111827" }}>{profile.name}</h3>
          <p style={{ margin: "0 0 24px", fontSize: 14, color: "#6B7280" }}>Job Seeker Dashboard</p>

          {/* Rating */}
          <div style={{ width: "100%", background: "#F9FAFB", border: "1.5px solid #E5E7EB", borderRadius: 8, padding: 16, textAlign: "center", marginBottom: 24 }}>
            <p style={{ margin: "0 0 8px", fontSize: 12, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>Employer Rating</p>
            <div style={{ display: "flex", justifyContent: "center", color: "#F59E0B", gap: 2, marginBottom: 8 }}>
              {Ico.star}{Ico.star}{Ico.star}{Ico.star}{Ico.starHalf}
            </div>
            <p style={{ margin: 0, fontSize: 24, fontWeight: 700, color: "#111827", fontFamily: "'DM Mono',monospace" }}>4.2 <span style={{ fontSize: 14, color: "#9CA3AF" }}>/ 5</span></p>
          </div>

          {/* CV */}
          <div style={{ width: "100%" }}>
            <p style={{ margin: "0 0 12px", fontSize: 14, fontWeight: 700, color: "#111827" }}>Primary Resume</p>
            <button style={{ width: "100%", padding: "12px", background: "#fff", border: "1.5px solid #111827", color: "#111827", borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              {Ico.upload} Upload New CV
            </button>
            <p style={{ margin: "12px 0 0", fontSize: 12, color: "#6B7280", textAlign: "center" }}>Last uploaded: 2 weeks ago</p>
          </div>

        </div>

        {/* RIGHT PANEL */}
        <div style={{ background: "#fff", border: "1.5px solid #E5E7EB", borderRadius: 12, padding: 32 }}>
          <h3 style={{ margin: "0 0 24px", fontSize: 18, fontWeight: 700, color: "#111827", borderBottom: "1.5px solid #F3F4F6", paddingBottom: 16 }}>Personal Details</h3>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={labelStyle}>Full Name</label>
              <input disabled={!editMode} value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} style={inputStyle} />
            </div>
            <div>
               <label style={labelStyle}>Phone Number (M-PESA)</label>
               <input disabled={!editMode} value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })} style={{ ...inputStyle, fontFamily: "'DM Mono',monospace" }} />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
               <label style={labelStyle}>Email Address</label>
               <input disabled={!editMode} value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} style={inputStyle} />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
               <label style={labelStyle}>Bio summary</label>
               <textarea disabled={!editMode} value={profile.bio} onChange={e => setProfile({ ...profile, bio: e.target.value })} style={{ ...inputStyle, minHeight: 80, resize: "vertical" }} />
            </div>
          </div>

          {editMode && (
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
              <button onClick={() => setEditMode(false)} style={{ padding: "12px 24px", background: "#111827", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
                Save Changes
              </button>
            </div>
          )}

          <div style={{ borderTop: "1.5px solid #F3F4F6", marginTop: 32 }}>
            <Services />
          </div>

        </div>

      </div>
    </div>
  );
}
