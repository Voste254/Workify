import { useState } from "react";

// ── Icons ──────────────────────────────────────────────────────────────────────
const I = (d: string, s = 14, fill = "none") => <svg width={s} height={s} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: d }} />;
const Ico = {
  camera: I('<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>', 16),
  building: I('<rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/>', 16),
  mail: I('<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>', 16),
  phone: I('<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>', 16),
  globe: I('<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>', 16),
  pin: I('<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>', 16),
  check: I('<path d="M20 6 9 17l-5-5"/>', 16),
  lock: I('<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>', 16),
  bell: I('<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>', 16),
  creditCard: I('<rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/>', 16)
};

// ── Shared styles ──────────────────────────────────────────────────────────────
const labelStyle = { display: "block", fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 8, fontFamily: "'DM Sans',sans-serif" };
const inputOuter = { position: "relative" as const, display: "flex", alignItems: "center" };
const inputIcon = { position: "absolute" as const, left: 14, color: "#9CA3AF" };
const inputStyle = { width: "100%", padding: "12px 16px 12px 40px", border: "1.5px solid #E5E7EB", borderRadius: 8, fontSize: 14, color: "#111827", background: "#fff", outline: "none", fontFamily: "'DM Sans',sans-serif", transition: "border-color 0.15s" };

const menuBtn = (active: boolean) => ({ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "14px 18px", border: "none", borderRadius: 8, background: active ? "#F3F4F6" : "transparent", color: active ? "#111827" : "#6B7280", fontSize: 14, fontWeight: active ? 700 : 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", textAlign: "left" as const, transition: "background 0.15s" });

// ── Main ───────────────────────────────────────────────────────────────────────
export default function Settings() {
  const [activeTab, setActiveTab] = useState("Company Profile");
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
      <div style={{ background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#111827" }}>Account Settings</h1>
          <p style={{ margin: 0, fontSize: 13, color: "#9CA3AF", fontFamily: "'DM Mono',monospace" }}>Manage your employer account</p>
        </div>
        <div>
          {isSaved && <span style={{ marginRight: 16, fontSize: 14, color: "#059669", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 6 }}>{Ico.check} Saved Successfully</span>}
          <button onClick={handleSubmit} style={{ padding: "10px 20px", background: "#111827", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
            Save Changes
          </button>
        </div>
      </div>

      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "300px 1fr", gap: 24, padding: 24, maxWidth: 1200, margin: "0 auto", width: "100%" }}>
        
        {/* Left Navigation Menu */}
        <div style={{ background: "#fff", border: "1.5px solid #E5E7EB", borderRadius: 10, padding: 16, height: "fit-content" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <button style={menuBtn(activeTab === "Company Profile")} onClick={() => setActiveTab("Company Profile")}>{Ico.building} Company Profile</button>
            <button style={menuBtn(activeTab === "Security & Login")} onClick={() => setActiveTab("Security & Login")}>{Ico.lock} Security & Login</button>
            <button style={menuBtn(activeTab === "Notifications")} onClick={() => setActiveTab("Notifications")}>{Ico.bell} Notification Preferences</button>
            <button style={menuBtn(activeTab === "Billing & Plans")} onClick={() => setActiveTab("Billing & Plans")}>{Ico.creditCard} Billing & Plans</button>
          </div>
        </div>

        {/* Right Content Area */}
        <div style={{ background: "#fff", border: "1.5px solid #E5E7EB", borderRadius: 10, overflow: "hidden", outline: "none" }}>
          
          {activeTab === "Company Profile" && (
            <form onSubmit={handleSubmit}>
              <div style={{ height: 160, background: "#111827", position: "relative" as const }}>
                <button type="button" style={{ position: "absolute", right: 20, bottom: 20, background: "rgba(255,255,255,0.2)", color: "#fff", border: "none", borderRadius: 6, padding: "8px 12px", display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, cursor: "pointer", backdropFilter: "blur(4px)" }}>
                  {Ico.camera} Edit Cover
                </button>
              </div>

              <div style={{ padding: "0 32px 32px" }}>
                <div style={{ marginTop: -50, marginBottom: 30, display: "flex" }}>
                  <div style={{ width: 100, height: 100, background: "#fff", border: "4px solid #fff", borderRadius: 12, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", overflow: "hidden" }}>
                    <div style={{ width: "100%", height: "100%", background: "#F9FAFB", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#9CA3AF" }}>
                      {Ico.camera}
                      <span style={{ fontSize: 11, fontWeight: 700, marginTop: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>Logo</span>
                    </div>
                  </div>
                </div>

                <h3 style={{ margin: "0 0 24px", fontSize: 18, fontWeight: 700, color: "#111827", borderBottom: "1px solid #E5E7EB", paddingBottom: 12 }}>Company Details</h3>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
                  <div>
                    <label style={labelStyle}>Company Name</label>
                    <div style={inputOuter}>
                      <span style={inputIcon}>{Ico.building}</span>
                      <input type="text" defaultValue="TechNova Solutions" style={inputStyle} />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Industry Sector</label>
                    <select style={{ ...inputStyle, paddingLeft: 16, cursor: "pointer", appearance: "none" }}>
                      <option>Information Technology</option>
                      <option>Construction & Real Estate</option>
                      <option>Finance & Banking</option>
                      <option>Healthcare</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: 32 }}>
                  <label style={labelStyle}>Corporate Overview / "About Us"</label>
                  <textarea rows={5} defaultValue="TechNova is a leading provider of innovative cloud solutions and enterprise software dedicated to helping businesses scale seamlessly across East Africa and beyond."
                    style={{ ...inputStyle, paddingLeft: 16, resize: "vertical" }} />
                </div>

                <h3 style={{ margin: "0 0 24px", fontSize: 18, fontWeight: 700, color: "#111827", borderBottom: "1px solid #E5E7EB", paddingBottom: 12 }}>Contact Information</h3>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 20 }}>
                  <div>
                    <label style={labelStyle}>Corporate Email Address</label>
                    <div style={inputOuter}>
                      <span style={inputIcon}>{Ico.mail}</span>
                      <input type="email" defaultValue="contact@technova.com" style={inputStyle} />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Support / Office Phone</label>
                    <div style={inputOuter}>
                      <span style={inputIcon}>{Ico.phone}</span>
                      <input type="text" defaultValue="+254 700 123 456" style={inputStyle} />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Company Website</label>
                    <div style={inputOuter}>
                      <span style={inputIcon}>{Ico.globe}</span>
                      <input type="url" defaultValue="https://technova.co.ke" style={inputStyle} />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Primary Location</label>
                    <div style={inputOuter}>
                      <span style={inputIcon}>{Ico.pin}</span>
                      <input type="text" defaultValue="Westlands, Nairobi" style={inputStyle} />
                    </div>
                  </div>
                </div>
              </div>
            </form>
          )}

          {activeTab === "Security & Login" && (
            <div style={{ padding: 32 }}>
               <h3 style={{ margin: "0 0 24px", fontSize: 18, fontWeight: 700, color: "#111827", borderBottom: "1px solid #E5E7EB", paddingBottom: 12 }}>Password Settings</h3>
               <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 500 }}>
                 <div>
                   <label style={labelStyle}>Current Password</label>
                   <input type="password" placeholder="Enter current password" style={{ ...inputStyle, paddingLeft: 16 }} />
                 </div>
                 <div>
                   <label style={labelStyle}>New Password</label>
                   <input type="password" placeholder="Create a new password" style={{ ...inputStyle, paddingLeft: 16 }} />
                 </div>
                 <div>
                   <label style={labelStyle}>Confirm New Password</label>
                   <input type="password" placeholder="Verify new password" style={{ ...inputStyle, paddingLeft: 16 }} />
                 </div>
                 <button style={{ alignSelf: "flex-start", marginTop: 10, padding: "10px 20px", background: "#111827", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Update Password</button>
               </div>
            </div>
          )}

          {activeTab === "Notifications" && (
            <div style={{ padding: 32 }}>
               <h3 style={{ margin: "0 0 24px", fontSize: 18, fontWeight: 700, color: "#111827", borderBottom: "1px solid #E5E7EB", paddingBottom: 12 }}>Email & Push Notifications</h3>
               <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                 {[
                   { label: "New Application Alerts", desc: "Receive alerts immediately when a candidate applies." },
                   { label: "Direct Messages", desc: "Get notified when a candidate responds to your messages." },
                   { label: "Job Expiring Reminders", desc: "Alert me when a job posting is about to expire." },
                   { label: "Weekly Account Summary", desc: "A brief overview metric report sent to your email weekly." }
                 ].map((t, idx) => (
                   <div key={idx} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                     <input type="checkbox" defaultChecked={idx < 3} style={{ width: 18, height: 18, cursor: "pointer" }} />
                     <div>
                       <p style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 700, color: "#111827" }}>{t.label}</p>
                       <p style={{ margin: 0, fontSize: 13, color: "#6B7280" }}>{t.desc}</p>
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          )}

          {activeTab === "Billing & Plans" && (
            <div style={{ padding: 32 }}>
               <h3 style={{ margin: "0 0 24px", fontSize: 18, fontWeight: 700, color: "#111827", borderBottom: "1px solid #E5E7EB", paddingBottom: 12 }}>Subscription Plan</h3>
               
               <div style={{ padding: 24, border: "2px solid #111827", borderRadius: 10, background: "#F9FAFB", marginBottom: 30 }}>
                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                   <div>
                     <p style={{ margin: "0 0 8px", fontSize: 14, fontWeight: 700, color: "#2563EB", textTransform: "uppercase", letterSpacing: "0.05em" }}>Corporate Pro Plan</p>
                     <p style={{ margin: 0, fontSize: 24, fontWeight: 700, color: "#111827", fontFamily: "'DM Mono',monospace" }}>KES 15,000 / month</p>
                   </div>
                   <button style={{ padding: "10px 20px", background: "#fff", color: "#111827", border: "1.5px solid #111827", borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Change Plan</button>
                 </div>
               </div>

               <h3 style={{ margin: "0 0 20px", fontSize: 16, fontWeight: 700, color: "#111827" }}>Payment Methods</h3>
               <div style={{ padding: 20, border: "1.5px solid #E5E7EB", borderRadius: 10, display: "flex", alignItems: "center", gap: 16 }}>
                 <div style={{ width: 60, height: 40, background: "#111827", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 6, fontWeight: 700, fontSize: 12 }}>VISA</div>
                 <div style={{ flex: 1 }}>
                   <p style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 700, color: "#111827" }}>Visa ending in 4242</p>
                   <p style={{ margin: 0, fontSize: 13, color: "#6B7280" }}>Expires 12/26</p>
                 </div>
                 <button style={{ background: "none", border: "none", color: "#2563EB", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Edit</button>
               </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
