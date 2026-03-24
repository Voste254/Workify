import { useState } from "react";

// ── Icons ──────────────────────────────────────────────────────────────────────
const I = (d: string, s = 14, fill = "none") => <svg width={s} height={s} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: d }} />;
const Ico = {
  user: I('<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>', 20),
  shield: I('<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>', 20),
  bell: I('<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>', 20),
  clock: I('<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>', 20),
  eye: I('<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>', 20),
};

type Tab = "account" | "security" | "notifications" | "activity" | "privacy";

// ── Shared UI Components ───────────────────────────────────────────────────────
const labelStyle = { display: "block", fontSize: 15, fontWeight: 700, color: "#374151", marginBottom: 6, fontFamily: "'DM Sans',sans-serif" };
const inputStyle = { width: "100%", padding: "14px 18px", border: "1.5px solid #E5E7EB", borderRadius: 8, fontSize: 16, color: "#111827", background: "#fff", outline: "none", fontFamily: "'DM Sans',sans-serif", transition: "border-color 0.15s" };
const btnPrimary = { padding: "14px 28px", background: "#111827", color: "#fff", border: "none", borderRadius: 8, fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" };
const rowOuter = { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px 0", borderBottom: "1.5px solid #F3F4F6" };

const Toggle = ({ active, onToggle }: { active: boolean; onToggle: () => void }) => (
  <button onClick={onToggle} style={{ width: 50, height: 28, borderRadius: 14, background: active ? "#111827" : "#E5E7EB", border: "none", position: "relative", cursor: "pointer", transition: "background 0.2s" }}>
    <div style={{ width: 22, height: 22, borderRadius: 11, background: "#fff", position: "absolute", top: 3, left: active ? 25 : 3, transition: "left 0.2s" }} />
  </button>
);

export default function JobSeekerSettings() {
  const [tab, setTab] = useState<Tab>("account");

  const [toggles, setToggles] = useState({
    twoFA: false,
    notifJobs: true,
    notifApps: true,
    notifMsg: true,
    publicProfile: true,
    showSalary: false
  });

  const handleToggle = (key: keyof typeof toggles) => setToggles(p => ({ ...p, [key]: !p[key] }));

  const menu = [
    { key: "account", icon: Ico.user, title: "Account", desc: "Profile & preferences" },
    { key: "security", icon: Ico.shield, title: "Security", desc: "Password & protection" },
    { key: "notifications", icon: Ico.bell, title: "Notifications", desc: "Alerts & emails" },
    { key: "privacy", icon: Ico.eye, title: "Privacy", desc: "Profile visibility" },
    { key: "activity", icon: Ico.clock, title: "Activity Log", desc: "Recent actions" },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif", background: "#F9FAFB", minHeight: "100vh", padding: "40px", display: "flex", flexDirection: "column" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500;600&display=swap');*{box-sizing:border-box}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#E5E7EB;border-radius:4px}`}</style>

      <div style={{ maxWidth: 1200, width: "100%", margin: "0 auto" }}>
        <h1 style={{ margin: "0 0 40px", fontSize: 32, fontWeight: 700, color: "#111827" }}>Settings</h1>

        <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: 40, alignItems: "start" }}>
          
          {/* Sidebar Navigation */}
          <div style={{ background: "#fff", border: "1.5px solid #E5E7EB", borderRadius: 12, padding: 20 }}>
            {menu.map((item) => {
              const isActive = tab === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => setTab(item.key as Tab)}
                  style={{ width: "100%", display: "flex", alignItems: "flex-start", gap: 16, padding: 18, background: isActive ? "#F3F4F6" : "transparent", border: "none", borderRadius: 10, cursor: "pointer", textAlign: "left", transition: "background 0.1s", marginBottom: 6 }}
                >
                  <div style={{ color: isActive ? "#111827" : "#6B7280", marginTop: 2 }}>{item.icon}</div>
                  <div>
                    <h4 style={{ margin: "0 0 6px", fontSize: 16, fontWeight: 700, color: isActive ? "#111827" : "#374151" }}>{item.title}</h4>
                    <p style={{ margin: 0, fontSize: 14, color: isActive ? "#4B5563" : "#6B7280" }}>{item.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Main Content Area */}
          <div style={{ background: "#fff", border: "1.5px solid #E5E7EB", borderRadius: 12, padding: 40, minHeight: 450 }}>
            
            {/* 1. Account Settings */}
            {tab === "account" && (
              <div>
                <h2 style={{ margin: "0 0 32px", fontSize: 22, fontWeight: 700, color: "#111827" }}>Account Information</h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                  <div>
                    <label style={labelStyle}>Full Name</label>
                    <input defaultValue="Okutah Voste" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Email Address</label>
                    <input defaultValue="okutah.voste@example.ke" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Phone Number</label>
                    <input defaultValue="0712 345 678" style={{ ...inputStyle, fontFamily: "'DM Mono',monospace" }} />
                  </div>
                  <div>
                    <label style={labelStyle}>Account Setup</label>
                    <input defaultValue="Job Seeker" disabled style={{ ...inputStyle, background: "#F3F4F6", color: "#6B7280" }} />
                  </div>
                </div>
                <div style={{ marginTop: 40, display: "flex", justifyItems: "flex-end", justifyContent: "flex-end" }}>
                  <button style={btnPrimary}>Save Account Changes</button>
                </div>
              </div>
            )}

            {/* 2. Security Settings */}
            {tab === "security" && (
              <div>
                <h2 style={{ margin: "0 0 32px", fontSize: 22, fontWeight: 700, color: "#111827" }}>Security Settings</h2>
                
                <div style={rowOuter}>
                  <div>
                    <h4 style={{ margin: "0 0 6px", fontSize: 17, fontWeight: 700, color: "#111827" }}>Change Password</h4>
                    <p style={{ margin: 0, fontSize: 15, color: "#6B7280" }}>Ensure your account stays secure.</p>
                  </div>
                  <button style={{ padding: "10px 20px", background: "#fff", border: "1.5px solid #E5E7EB", borderRadius: 8, fontSize: 15, fontWeight: 700, color: "#111827", cursor: "pointer" }}>Update</button>
                </div>

                <div style={rowOuter}>
                  <div>
                    <h4 style={{ margin: "0 0 6px", fontSize: 17, fontWeight: 700, color: "#111827" }}>Two-Factor Authentication</h4>
                    <p style={{ margin: 0, fontSize: 15, color: "#6B7280" }}>Add extra security using your phone.</p>
                  </div>
                  <Toggle active={toggles.twoFA} onToggle={() => handleToggle("twoFA")} />
                </div>

                <div style={{ ...rowOuter, borderBottom: "none", paddingBottom: 0 }}>
                  <div style={{ width: "100%" }}>
                    <h4 style={{ margin: "0 0 20px", fontSize: 17, fontWeight: 700, color: "#111827" }}>Device Management</h4>
                    <div style={{ border: "1.5px solid #E5E7EB", borderRadius: 10, padding: 20, width: "100%" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                        <div>
                          <p style={{ margin: "0 0 6px", fontSize: 16, fontWeight: 700, color: "#111827" }}>Chrome - Windows</p>
                          <p style={{ margin: 0, fontSize: 14, color: "#6B7280" }}>Nairobi, Kenya • Active Now</p>
                        </div>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <div>
                          <p style={{ margin: "0 0 6px", fontSize: 16, fontWeight: 700, color: "#111827" }}>Safari - iPhone</p>
                          <p style={{ margin: 0, fontSize: 14, color: "#6B7280" }}>Mombasa, Kenya • 2 days ago</p>
                        </div>
                        <button style={{ background: "none", border: "none", color: "#EF4444", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>Revoke</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3. Notifications */}
            {tab === "notifications" && (
              <div>
                <h2 style={{ margin: "0 0 32px", fontSize: 22, fontWeight: 700, color: "#111827" }}>Notification Preferences</h2>
                <div style={rowOuter}>
                  <div>
                    <h4 style={{ margin: "0 0 6px", fontSize: 17, fontWeight: 700, color: "#111827" }}>Job Matches</h4>
                    <p style={{ margin: 0, fontSize: 15, color: "#6B7280" }}>Get alerted when a job matches your skills.</p>
                  </div>
                  <Toggle active={toggles.notifJobs} onToggle={() => handleToggle("notifJobs")} />
                </div>
                <div style={rowOuter}>
                  <div>
                    <h4 style={{ margin: "0 0 6px", fontSize: 17, fontWeight: 700, color: "#111827" }}>Application Updates</h4>
                    <p style={{ margin: 0, fontSize: 15, color: "#6B7280" }}>When employers review or update your application.</p>
                  </div>
                  <Toggle active={toggles.notifApps} onToggle={() => handleToggle("notifApps")} />
                </div>
                <div style={{ ...rowOuter, borderBottom: "none" }}>
                  <div>
                    <h4 style={{ margin: "0 0 6px", fontSize: 17, fontWeight: 700, color: "#111827" }}>Direct Messages</h4>
                    <p style={{ margin: 0, fontSize: 15, color: "#6B7280" }}>When employers send you a direct message.</p>
                  </div>
                  <Toggle active={toggles.notifMsg} onToggle={() => handleToggle("notifMsg")} />
                </div>
              </div>
            )}

            {/* 4. Privacy */}
            {tab === "privacy" && (
              <div>
                <h2 style={{ margin: "0 0 32px", fontSize: 22, fontWeight: 700, color: "#111827" }}>Privacy & Visibility</h2>
                <div style={rowOuter}>
                  <div>
                    <h4 style={{ margin: "0 0 6px", fontSize: 17, fontWeight: 700, color: "#111827" }}>Public Profile</h4>
                    <p style={{ margin: 0, fontSize: 15, color: "#6B7280" }}>Employers can find you in search results.</p>
                  </div>
                  <Toggle active={toggles.publicProfile} onToggle={() => handleToggle("publicProfile")} />
                </div>
                <div style={{ ...rowOuter, borderBottom: "none" }}>
                  <div>
                    <h4 style={{ margin: "0 0 6px", fontSize: 17, fontWeight: 700, color: "#111827" }}>Show Expected Salary</h4>
                    <p style={{ margin: 0, fontSize: 15, color: "#6B7280" }}>Display your daily rate request to employers upfront.</p>
                  </div>
                  <Toggle active={toggles.showSalary} onToggle={() => handleToggle("showSalary")} />
                </div>
              </div>
            )}

            {/* 5. Activity Log */}
            {tab === "activity" && (
              <div>
                <h2 style={{ margin: "0 0 32px", fontSize: 22, fontWeight: 700, color: "#111827" }}>Recent Activity</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                  {[
                    { text: "Applied for 'Site Foreman' at BuildCorp Ltd", time: "2 hours ago" },
                    { text: "Updated Primary Resume upload", time: "Yesterday" },
                    { text: "Viewed 'Data Analyst - Remote' job details", time: "3 days ago" },
                    { text: "Bookmarked 'Heavy Machinery Operator' position", time: "1 week ago" }
                  ].map((act, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                      <div style={{ marginTop: 6, width: 10, height: 10, borderRadius: 5, background: "#E5E7EB" }} />
                      <div>
                        <p style={{ margin: "0 0 6px", fontSize: 16, fontWeight: 600, color: "#111827" }}>{act.text}</p>
                        <p style={{ margin: 0, fontSize: 14, color: "#6B7280" }}>{act.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}