import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabaseClient";

// ── Icons ──────────────────────────────────────────────────────────────────────
const I = (d: string, s = 14, fill = "none") => <svg width={s} height={s} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: d }} />;
const Ico = {
  edit:     I('<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>', 16),
  location: I('<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>', 14),
  industry: I('<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>', 14),
  users:    I('<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>', 14),
  mail:     I('<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>', 14),
  phone:    I('<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 17z"/>', 14),
  globe:    I('<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>', 14),
  check:    I('<path d="M20 6 9 17l-5-5"/>', 14),
};

const INDUSTRIES = ["Technology","Finance & Banking","Telecommunications","Construction","Hospitality","Healthcare","Media & Creative","Logistics","Agriculture","Education","Other"];
const COMPANY_SIZES = ["1–10","11–50","51–200","201–1,000","1,000+"];

interface CompanyData {
  companyName: string;
  industry: string;
  companySize: string;
  companyLocation: string;
  companyEmail: string;
  companyPhone: string;
  website: string;
}

interface ContactData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export default function EmployerProfile() {
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const [contact, setContact] = useState<ContactData>({ firstName: "", lastName: "", email: "", phone: "" });
  const [company, setCompany] = useState<CompanyData>({
    companyName: "", industry: "", companySize: "",
    companyLocation: "", companyEmail: "", companyPhone: "", website: "",
  });

  useEffect(() => {
    const fetchAll = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) { setLoading(false); return; }
      const uid = session.user.id;
      setUserId(uid);

      // Fetch personal contact info from profiles
      const { data: profileData } = await supabase
        .from("profiles")
        .select("first_name, last_name, email, phone")
        .eq("id", uid)
        .single();

      if (profileData) {
        setContact({
          firstName: profileData.first_name      || "",
          lastName:  profileData.last_name       || "",
          email:     profileData.email           || session.user.email || "",
          phone:     profileData.phone           || "",
        });
      }

      // Fetch company data from companies table
      const { data: companyData } = await supabase
        .from("companies")
        .select("*")
        .eq("owner_id", uid)
        .single();

      if (companyData) {
        setCompany({
          companyName:     companyData.company_name     || "",
          industry:        companyData.industry         || "",
          companySize:     companyData.company_size     || "",
          companyLocation: companyData.company_location || "",
          companyEmail:    companyData.company_email    || "",
          companyPhone:    companyData.company_phone    || "",
          website:         companyData.website          || "",
        });
      }

      setLoading(false);
    };
    fetchAll();
  }, []);

  const handleSave = async () => {
    if (!userId) return;
    setSaving(true);

    // Update personal info in profiles
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ first_name: contact.firstName, last_name: contact.lastName, phone: contact.phone })
      .eq("id", userId);

    // Upsert company info into companies table
    const { error: companyError } = await supabase
      .from("companies")
      .upsert({
        owner_id:         userId,
        company_name:     company.companyName,
        industry:         company.industry,
        company_size:     company.companySize,
        company_location: company.companyLocation,
        company_email:    company.companyEmail,
        company_phone:    company.companyPhone,
        website:          company.website,
      }, { onConflict: "owner_id" });

    setSaving(false);

    if (profileError || companyError) {
      alert("Error saving: " + (profileError?.message || companyError?.message));
    } else {
      setSaveSuccess(true);
      setEditMode(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  // ── Shared Styles ────────────────────────────────────────────────────────────
  const inp = (editable = true) => ({
    width: "100%", padding: "10px 14px", border: "1.5px solid #E5E7EB", borderRadius: 8,
    fontSize: 14, color: "#111827", background: (editMode && editable) ? "#fff" : "#F9FAFB",
    outline: "none", fontFamily: "'DM Sans',sans-serif", marginBottom: 0,
    transition: "border-color 0.15s, background 0.15s",
    opacity: (editMode && editable) ? 1 : 0.8,
    cursor: (editMode && editable) ? "text" : "default",
  });
  const lbl: React.CSSProperties = { display: "block", fontSize: 12, fontWeight: 700, color: "#9CA3AF", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: "'DM Sans',sans-serif" };
  const field = (label: string, node: React.ReactNode) => (
    <div>
      <label style={lbl}>{label}</label>
      {node}
    </div>
  );

  const initials = loading ? "…" : `${contact.firstName.charAt(0)}${contact.lastName.charAt(0)}`.toUpperCase() || "EM";

  return (
    <div style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif", background: "#F9FAFB", minHeight: "100vh", padding: "32px" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500;600&display=swap');*{box-sizing:border-box}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#E5E7EB;border-radius:4px}`}</style>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <h2 style={{ margin: "0 0 4px", fontSize: 24, fontWeight: 700, color: "#111827" }}>Company Profile</h2>
          <p style={{ margin: 0, fontSize: 14, color: "#9CA3AF", fontFamily: "'DM Mono',monospace" }}>Manage your company and contact information</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {saveSuccess && (
            <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, color: "#059669", fontWeight: 600 }}>
              {Ico.check} Saved successfully
            </span>
          )}
          <button
            onClick={() => { editMode ? setEditMode(false) : setEditMode(true); }}
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", background: editMode ? "#F3F4F6" : "#fff", border: "1.5px solid #111827", color: "#111827", borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: "pointer" }}
          >
            {Ico.edit} {editMode ? "Cancel" : "Edit Profile"}
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 28, alignItems: "start" }}>

        {/* ── LEFT PANEL ── */}
        <div style={{ background: "#fff", border: "1.5px solid #E5E7EB", borderRadius: 12, padding: 28, display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>

          {/* Initials Avatar */}
          <div style={{ width: 100, height: 100, borderRadius: 14, background: "#111827", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, fontWeight: 700, fontFamily: "'DM Mono',monospace", marginBottom: 16, letterSpacing: 2 }}>
            {initials}
          </div>

          <h3 style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 700, color: "#111827", textAlign: "center" }}>
            {loading ? "Loading..." : company.companyName || "Your Company"}
          </h3>
          <p style={{ margin: "0 0 20px", fontSize: 13, color: "#6B7280", textAlign: "center" }}>
            {contact.firstName} {contact.lastName}
          </p>

          {/* Quick info list */}
          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { icon: Ico.industry, label: company.industry        || "Industry not set" },
              { icon: Ico.location, label: company.companyLocation || "Location not set" },
              { icon: Ico.users,    label: company.companySize ? `${company.companySize} employees` : "Size not set" },
              { icon: Ico.mail,     label: company.companyEmail    || "Company email not set" },
              { icon: Ico.phone,    label: company.companyPhone    || "Company phone not set" },
              { icon: Ico.globe,    label: company.website         || "Website not set" },
            ].map(({ icon, label }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 8 }}>
                <span style={{ color: "#6B7280", flexShrink: 0 }}>{icon}</span>
                <span style={{ fontSize: 13, color: "#374151", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

          {/* Contact Details */}
          <div style={{ background: "#fff", border: "1.5px solid #E5E7EB", borderRadius: 12, padding: 28 }}>
            <h3 style={{ margin: "0 0 20px", fontSize: 16, fontWeight: 700, color: "#111827", borderBottom: "1.5px solid #F3F4F6", paddingBottom: 14 }}>Contact Person</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {field("First Name", <input disabled={!editMode} value={contact.firstName} onChange={e => setContact(p => ({ ...p, firstName: e.target.value }))} style={inp()} />)}
              {field("Last Name",  <input disabled={!editMode} value={contact.lastName}  onChange={e => setContact(p => ({ ...p, lastName: e.target.value }))}  style={inp()} />)}
              {field("Personal Phone", <input disabled={!editMode} value={contact.phone} onChange={e => setContact(p => ({ ...p, phone: e.target.value }))} style={{ ...inp(), fontFamily: "'DM Mono',monospace" }} />)}
              {field("Email (Read Only)", <input disabled value={contact.email} style={inp(false)} />)}
            </div>
          </div>

          {/* Company Details */}
          <div style={{ background: "#fff", border: "1.5px solid #E5E7EB", borderRadius: 12, padding: 28 }}>
            <h3 style={{ margin: "0 0 20px", fontSize: 16, fontWeight: 700, color: "#111827", borderBottom: "1.5px solid #F3F4F6", paddingBottom: 14 }}>Company Details</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

              {field("Company Name",
                <input disabled={!editMode} value={company.companyName} onChange={e => setCompany(p => ({ ...p, companyName: e.target.value }))} placeholder="e.g. Safaricom PLC" style={inp()} />
              )}

              {field("Industry",
                <select disabled={!editMode} value={company.industry} onChange={e => setCompany(p => ({ ...p, industry: e.target.value }))} style={{ ...inp(), cursor: editMode ? "pointer" : "default", appearance: "none" }}>
                  <option value="">Select industry</option>
                  {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              )}

              {field("Company Location",
                <input disabled={!editMode} value={company.companyLocation} onChange={e => setCompany(p => ({ ...p, companyLocation: e.target.value }))} placeholder="e.g. Nairobi, Kenya or Remote" style={inp()} />
              )}

              {field("Company Size",
                <select disabled={!editMode} value={company.companySize} onChange={e => setCompany(p => ({ ...p, companySize: e.target.value }))} style={{ ...inp(), cursor: editMode ? "pointer" : "default", appearance: "none" }}>
                  <option value="">Select size</option>
                  {COMPANY_SIZES.map(s => <option key={s} value={s}>{s} employees</option>)}
                </select>
              )}

              {field("Company Email",
                <input type="email" disabled={!editMode} value={company.companyEmail} onChange={e => setCompany(p => ({ ...p, companyEmail: e.target.value }))} placeholder="e.g. info@company.com" style={inp()} />
              )}

              {field("Company Phone",
                <input type="tel" disabled={!editMode} value={company.companyPhone} onChange={e => setCompany(p => ({ ...p, companyPhone: e.target.value }))} placeholder="e.g. +254 700 000 000" style={{ ...inp(), fontFamily: "'DM Mono',monospace" }} />
              )}

              {field("Website",
                <input type="url" disabled={!editMode} value={company.website} onChange={e => setCompany(p => ({ ...p, website: e.target.value }))} placeholder="e.g. https://company.com" style={inp()} />
              )}

            </div>
          </div>

          {/* Save Button */}
          {editMode && (
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                disabled={saving || loading}
                onClick={handleSave}
                style={{ padding: "12px 28px", background: "#111827", color: "#fff", border: "none", borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: saving ? "not-allowed" : "pointer", fontFamily: "'DM Sans',sans-serif", opacity: saving ? 0.7 : 1, transition: "opacity 0.15s" }}
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
