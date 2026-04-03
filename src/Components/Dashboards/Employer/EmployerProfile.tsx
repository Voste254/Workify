import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabaseClient";

// ── Icons ──────────────────────────────────────────────────────────────────────
const I = (d: string, s = 14, fill = "none") => <svg width={s} height={s} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: d }} />;
const Ico = {
  edit:     I('<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>', 16),
  building: I('<rect width="16" height="20" x="4" y="2" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/>', 64, "none"),
  location: I('<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>', 14),
  industry: I('<path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7-6H4a2 2 0 0 0-2 2v16Z"/><path d="M14 2v6h6"/>', 14),
  users:    I('<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>', 14),
};

const INDUSTRIES = ["Technology","Finance & Banking","Telecommunications","Construction","Hospitality","Healthcare","Media & Creative","Logistics","Agriculture","Education","Other"];
const COMPANY_SIZES = ["1–10","11–50","51–200","201–1,000","1,000+"];
const LOCATIONS = ["Nairobi","Mombasa","Kisumu","Nakuru","Nationwide"];

export default function EmployerProfile() {
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    companyName: "",
    industry: "",
    companySize: "",
    companyLocation: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUserId(session.user.id);
        const { data } = await supabase
          .from("profiles")
          .select("first_name, last_name, email, phone, company_name, industry, company_size, company_location")
          .eq("id", session.user.id)
          .single();

        if (data) {
          setProfile({
            firstName:       data.first_name       || "",
            lastName:        data.last_name        || "",
            email:           data.email            || session.user.email || "",
            phone:           data.phone            || "",
            companyName:     data.company_name     || "",
            industry:        data.industry         || "",
            companySize:     data.company_size     || "",
            companyLocation: data.company_location || "",
          });
        }
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    if (!userId) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        first_name:       profile.firstName,
        last_name:        profile.lastName,
        phone:            profile.phone,
        company_name:     profile.companyName,
        industry:         profile.industry,
        company_size:     profile.companySize,
        company_location: profile.companyLocation,
      })
      .eq("id", userId);

    setSaving(false);
    if (!error) {
      setEditMode(false);
    } else {
      alert("Error saving profile: " + error.message);
    }
  };

  // ── Shared Styles ────────────────────────────────────────────────────────────
  const inputStyle = { width: "100%", padding: "12px 16px", border: "1.5px solid #E5E7EB", borderRadius: 8, fontSize: 14, color: "#111827", background: editMode ? "#fff" : "#F9FAFB", outline: "none", fontFamily: "'DM Sans',sans-serif", marginBottom: 16, transition: "border-color 0.15s, background 0.15s", opacity: editMode ? 1 : 0.85 };
  const labelStyle = { display: "block", fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 6, fontFamily: "'DM Sans',sans-serif" } as const;

  const initials = loading ? "..." : `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`.toUpperCase() || "EM";

  return (
    <div style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif", background: "#F9FAFB", minHeight: "100vh", padding: "32px", display: "flex", flexDirection: "column" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500;600&display=swap');*{box-sizing:border-box}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#E5E7EB;border-radius:4px}`}</style>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: "#111827" }}>Company Profile</h2>
        <button
          onClick={() => editMode ? setEditMode(false) : setEditMode(true)}
          style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", background: editMode ? "#F3F4F6" : "#fff", border: "1.5px solid #111827", color: "#111827", borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: "pointer", transition: "all 0.1s" }}
        >
          {Ico.edit} {editMode ? "Cancel Editing" : "Edit Profile"}
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 32, alignItems: "start" }}>

        {/* LEFT PANEL */}
        <div style={{ background: "#fff", border: "1.5px solid #E5E7EB", borderRadius: 12, padding: 32, display: "flex", flexDirection: "column", alignItems: "center" }}>

          {/* Company Avatar / Initials */}
          <div style={{ width: 120, height: 120, borderRadius: 16, border: "4px solid #F9FAFB", background: "#111827", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, fontWeight: 700, fontFamily: "'DM Mono',monospace", marginBottom: 16, letterSpacing: 2 }}>
            {initials}
          </div>

          <h3 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 700, color: "#111827", textAlign: "center" }}>
            {loading ? "..." : profile.companyName || "Your Company"}
          </h3>
          <p style={{ margin: "0 0 6px", fontSize: 14, color: "#6B7280", textAlign: "center" }}>
            {profile.industry || "Industry not set"}
          </p>
          <p style={{ margin: "0 0 24px", fontSize: 13, color: "#9CA3AF", display: "flex", alignItems: "center", gap: 4, textAlign: "center" as const }}>
            {Ico.location} {profile.companyLocation || "Location not set"}
          </p>

          {/* Company Stats */}
          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { icon: Ico.users,    label: "Company Size", value: profile.companySize ? `${profile.companySize} employees` : "—" },
              { icon: Ico.industry, label: "Industry",     value: profile.industry     || "—" },
              { icon: Ico.location, label: "Location",     value: profile.companyLocation || "—" },
            ].map(({ icon, label, value }) => (
              <div key={label} style={{ padding: "12px 14px", background: "#F9FAFB", border: "1.5px solid #E5E7EB", borderRadius: 8, display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ color: "#6B7280" }}>{icon}</span>
                <div>
                  <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</p>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#111827" }}>{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div style={{ background: "#fff", border: "1.5px solid #E5E7EB", borderRadius: 12, padding: 32 }}>

          {/* Contact Details */}
          <h3 style={{ margin: "0 0 24px", fontSize: 18, fontWeight: 700, color: "#111827", borderBottom: "1.5px solid #F3F4F6", paddingBottom: 16 }}>Contact Details</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={labelStyle}>First Name</label>
              <input disabled={!editMode || loading} value={profile.firstName} onChange={e => setProfile(p => ({ ...p, firstName: e.target.value }))} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Last Name</label>
              <input disabled={!editMode || loading} value={profile.lastName} onChange={e => setProfile(p => ({ ...p, lastName: e.target.value }))} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Phone Number</label>
              <input disabled={!editMode || loading} value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} style={{ ...inputStyle, fontFamily: "'DM Mono',monospace" }} />
            </div>
            <div>
              <label style={labelStyle}>Email Address (Read Only)</label>
              <input disabled value={profile.email} style={inputStyle} />
            </div>
          </div>

          {/* Company Details */}
          <h3 style={{ margin: "32px 0 24px", fontSize: 18, fontWeight: 700, color: "#111827", borderBottom: "1.5px solid #F3F4F6", paddingBottom: 16 }}>Company Details</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Company Name</label>
              <input disabled={!editMode || loading} value={profile.companyName} onChange={e => setProfile(p => ({ ...p, companyName: e.target.value }))} placeholder="e.g. Safaricom PLC" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Industry</label>
              <select
                disabled={!editMode || loading}
                value={profile.industry}
                onChange={e => setProfile(p => ({ ...p, industry: e.target.value }))}
                style={{ ...inputStyle, cursor: editMode ? "pointer" : "default", appearance: "none" }}
              >
                <option value="">Select industry</option>
                {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Company Location</label>
              <select
                disabled={!editMode || loading}
                value={profile.companyLocation}
                onChange={e => setProfile(p => ({ ...p, companyLocation: e.target.value }))}
                style={{ ...inputStyle, cursor: editMode ? "pointer" : "default", appearance: "none" }}
              >
                <option value="">Select location</option>
                {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Company Size</label>
              <select
                disabled={!editMode || loading}
                value={profile.companySize}
                onChange={e => setProfile(p => ({ ...p, companySize: e.target.value }))}
                style={{ ...inputStyle, cursor: editMode ? "pointer" : "default", appearance: "none" }}
              >
                <option value="">Select size</option>
                {COMPANY_SIZES.map(s => <option key={s} value={s}>{s} employees</option>)}
              </select>
            </div>
          </div>

          {editMode && (
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
              <button
                disabled={saving}
                onClick={handleSave}
                style={{ padding: "12px 24px", background: "#111827", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: saving ? "not-allowed" : "pointer", fontFamily: "'DM Sans',sans-serif", opacity: saving ? 0.7 : 1 }}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
