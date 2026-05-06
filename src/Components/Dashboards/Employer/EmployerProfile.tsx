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

// ── Validation helpers ─────────────────────────────────────────────────────
const hasDigit = (s: string) => /\d/.test(s);
const isValidEmail = (s: string) => !s || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
const isValidPhone = (s: string) => !s || /^[+\d\s()-]{7,20}$/.test(s);
const isValidUrl = (s: string) => !s || /^https?:\/\/.+/.test(s);

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

  // Real-time validation errors
  const errors = {
    firstName: contact.firstName && hasDigit(contact.firstName) ? "Numbers not allowed" : "",
    lastName: contact.lastName && hasDigit(contact.lastName) ? "Numbers not allowed" : "",
    contactPhone: contact.phone && !isValidPhone(contact.phone) ? "Invalid phone format" : "",
    companyName: company.companyName && company.companyName.length < 2 ? "Name too short" : "",
    companyLocation: company.companyLocation && hasDigit(company.companyLocation) ? "Numbers not allowed in location" : "",
    companyEmail: company.companyEmail && !isValidEmail(company.companyEmail) ? "Invalid email format" : "",
    companyPhone: company.companyPhone && !isValidPhone(company.companyPhone) ? "Invalid phone format" : "",
    website: company.website && !isValidUrl(company.website) ? "Must start with http:// or https://" : "",
  };
  const hasErrors = Object.values(errors).some(e => !!e);

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
    if (hasErrors) return;
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
  const inp = (editable = true, extraClasses = "", error = "") => `w-full px-3.5 py-2.5 border-[1.5px] rounded-lg text-sm text-gray-900 outline-none font-sans transition-colors duration-150 mb-0 ${error ? "border-red-400 focus:border-red-500" : "border-gray-200"} ${editMode && editable ? "bg-white opacity-100 cursor-text" : "bg-gray-50 opacity-80 cursor-default"} ${extraClasses}`;
  const lbl = "block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-[0.06em] font-sans";
  const errText = (msg: string) => msg ? <p className="text-xs text-red-500 mt-1 m-0 font-medium">{msg}</p> : null;
  const field = (label: string, node: React.ReactNode, error = "") => (
    <div>
      <label className={lbl}>{label}</label>
      {node}
      {errText(error)}
    </div>
  );

  const initials = loading ? "…" : `${contact.firstName.charAt(0)}${contact.lastName.charAt(0)}`.toUpperCase() || "EM";

  return (
    <div className="font-sans bg-gray-50 min-h-screen p-8">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="m-[0_0_4px] text-2xl font-bold text-gray-900">Company Profile</h2>
          <p className="m-0 text-sm text-gray-400 font-mono">Manage your company and contact information</p>
        </div>
        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="flex items-center gap-1.5 text-sm text-emerald-600 font-semibold">
              {Ico.check} Saved successfully
            </span>
          )}
          <button
            onClick={() => { editMode ? setEditMode(false) : setEditMode(true); }}
            className={`flex items-center gap-2 px-[18px] py-2.5 border-[1.5px] border-gray-900 text-gray-900 rounded-lg text-sm font-bold cursor-pointer transition-colors ${editMode ? "bg-gray-100" : "bg-white"}`}
          >
            {Ico.edit} {editMode ? "Cancel" : "Edit Profile"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-7 items-start">

        {/* ── LEFT PANEL ── */}
        <div className="bg-white border-[1.5px] border-gray-200 rounded-xl p-7 flex flex-col items-center gap-0">

          {/* Initials Avatar */}
          <div className="w-[100px] h-[100px] rounded-2xl bg-gray-900 text-white flex items-center justify-center text-[30px] font-bold font-mono mb-4 tracking-[2px]">
            {initials}
          </div>

          <h3 className="m-[0_0_4px] text-lg font-bold text-gray-900 text-center">
            {loading ? "Loading..." : company.companyName || "Your Company"}
          </h3>
          <p className="m-[0_0_20px] text-[13px] text-gray-500 text-center">
            {contact.firstName} {contact.lastName}
          </p>

          {/* Quick info list */}
          <div className="w-full flex flex-col gap-2.5">
            {[
              { icon: Ico.industry, label: company.industry        || "Industry not set" },
              { icon: Ico.location, label: company.companyLocation || "Location not set" },
              { icon: Ico.users,    label: company.companySize ? `${company.companySize} employees` : "Size not set" },
              { icon: Ico.mail,     label: company.companyEmail    || "Company email not set" },
              { icon: Ico.phone,    label: company.companyPhone    || "Company phone not set" },
              { icon: Ico.globe,    label: company.website         || "Website not set" },
            ].map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-2.5 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg">
                <span className="text-gray-500 shrink-0">{icon}</span>
                <span className="text-[13px] text-gray-700 font-medium overflow-hidden text-ellipsis whitespace-nowrap">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="flex flex-col gap-6">

          {/* Contact Details */}
          <div className="bg-white border-[1.5px] border-gray-200 rounded-xl p-7">
            <h3 className="m-[0_0_20px] text-base font-bold text-gray-900 border-b-[1.5px] border-gray-100 pb-3.5">Contact Person</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {field("First Name", <input disabled={!editMode} value={contact.firstName} onChange={e => setContact(p => ({ ...p, firstName: e.target.value }))} className={inp(true, "", errors.firstName)} />, errors.firstName)}
              {field("Last Name",  <input disabled={!editMode} value={contact.lastName}  onChange={e => setContact(p => ({ ...p, lastName: e.target.value }))}  className={inp(true, "", errors.lastName)} />, errors.lastName)}
              {field("Personal Phone", <input disabled={!editMode} value={contact.phone} onChange={e => setContact(p => ({ ...p, phone: e.target.value }))} className={inp(true, "font-mono", errors.contactPhone)} />, errors.contactPhone)}
              {field("Email (Read Only)", <input disabled value={contact.email} className={inp(false)} />)}
            </div>
          </div>

          {/* Company Details */}
          <div className="bg-white border-[1.5px] border-gray-200 rounded-xl p-7">
            <h3 className="m-[0_0_20px] text-base font-bold text-gray-900 border-b-[1.5px] border-gray-100 pb-3.5">Company Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {field("Company Name",
                <input disabled={!editMode} value={company.companyName} onChange={e => setCompany(p => ({ ...p, companyName: e.target.value }))} placeholder="e.g. Safaricom PLC" className={inp(true, "", errors.companyName)} />,
                errors.companyName
              )}

              {field("Industry",
                <select disabled={!editMode} value={company.industry} onChange={e => setCompany(p => ({ ...p, industry: e.target.value }))} className={inp(true, editMode ? "cursor-pointer appearance-auto" : "appearance-none")}>
                  <option value="">Select industry</option>
                  {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              )}

              {field("Company Location",
                <input disabled={!editMode} value={company.companyLocation} onChange={e => setCompany(p => ({ ...p, companyLocation: e.target.value }))} placeholder="e.g. Nairobi, Kenya or Remote" className={inp(true, "", errors.companyLocation)} />,
                errors.companyLocation
              )}

              {field("Company Size",
                <select disabled={!editMode} value={company.companySize} onChange={e => setCompany(p => ({ ...p, companySize: e.target.value }))} className={inp(true, editMode ? "cursor-pointer appearance-auto" : "appearance-none")}>
                  <option value="">Select size</option>
                  {COMPANY_SIZES.map(s => <option key={s} value={s}>{s} employees</option>)}
                </select>
              )}

              {field("Company Email",
                <input type="email" disabled={!editMode} value={company.companyEmail} onChange={e => setCompany(p => ({ ...p, companyEmail: e.target.value }))} placeholder="e.g. info@company.com" className={inp(true, "", errors.companyEmail)} />,
                errors.companyEmail
              )}

              {field("Company Phone",
                <input type="tel" disabled={!editMode} value={company.companyPhone} onChange={e => setCompany(p => ({ ...p, companyPhone: e.target.value }))} placeholder="e.g. +254 700 000 000" className={inp(true, "font-mono", errors.companyPhone)} />,
                errors.companyPhone
              )}

              {field("Website",
                <input type="url" disabled={!editMode} value={company.website} onChange={e => setCompany(p => ({ ...p, website: e.target.value }))} placeholder="e.g. https://company.com" className={inp(true, "", errors.website)} />,
                errors.website
              )}

            </div>
          </div>

          {/* Save Button */}
          {editMode && (
            <div className="flex items-center justify-end gap-4">
              {hasErrors && <span className="text-xs text-red-500 font-medium">Fix errors above before saving</span>}
              <button
                disabled={saving || loading || hasErrors}
                onClick={handleSave}
                className={`px-7 py-3 bg-gray-900 text-white border-none rounded-lg text-[15px] font-bold font-sans transition-opacity ${(saving || hasErrors) ? "cursor-not-allowed opacity-70" : "cursor-pointer opacity-100"}`}
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
