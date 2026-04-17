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
const labelStyle = "block text-[13px] font-bold text-gray-700 mb-2 font-sans";
const inputOuter = "relative flex items-center";
const inputIcon = "absolute left-3.5 text-gray-400";
const inputStyle = "w-full py-3 pr-4 pl-10 border-[1.5px] border-gray-200 rounded-lg text-sm text-gray-900 bg-white outline-none font-sans transition-colors duration-150 focus:border-gray-300";

const menuBtn = (active: boolean) => `flex items-center gap-2.5 w-full px-[18px] py-3.5 border-none rounded-lg text-sm font-sans text-left transition-colors duration-150 cursor-pointer ${active ? "bg-gray-100 text-gray-900 font-bold" : "bg-transparent text-gray-500 font-semibold hover:bg-gray-50 hover:text-gray-700"}`;

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
    <div className="font-sans bg-gray-50 min-h-screen flex flex-col">

      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3.5 flex items-center justify-between shrink-0">
        <div>
          <h1 className="m-0 text-lg font-bold text-gray-900">Account Settings</h1>
          <p className="m-0 text-[13px] text-gray-400 font-mono">Manage your employer account</p>
        </div>
        <div className="flex items-center">
          {isSaved && <span className="mr-4 text-sm text-emerald-600 font-bold inline-flex items-center gap-1.5">{Ico.check} Saved Successfully</span>}
          <button onClick={handleSubmit} className="px-5 py-2.5 bg-gray-900 text-white border-none rounded-lg text-sm font-bold cursor-pointer font-sans hover:bg-gray-800 transition-colors">
            Save Changes
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 p-6 max-w-[1200px] mx-auto w-full items-start">
        
        {/* Left Navigation Menu */}
        <div className="bg-white border-[1.5px] border-gray-200 rounded-[10px] p-4 h-fit">
          <div className="flex flex-col gap-2">
            <button className={menuBtn(activeTab === "Company Profile")} onClick={() => setActiveTab("Company Profile")}>{Ico.building} Company Profile</button>
            <button className={menuBtn(activeTab === "Security & Login")} onClick={() => setActiveTab("Security & Login")}>{Ico.lock} Security & Login</button>
            <button className={menuBtn(activeTab === "Notifications")} onClick={() => setActiveTab("Notifications")}>{Ico.bell} Notification Preferences</button>
            <button className={menuBtn(activeTab === "Billing & Plans")} onClick={() => setActiveTab("Billing & Plans")}>{Ico.creditCard} Billing & Plans</button>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="bg-white border-[1.5px] border-gray-200 rounded-[10px] overflow-hidden outline-none">
          
          {activeTab === "Company Profile" && (
            <form onSubmit={handleSubmit}>
              <div className="h-40 bg-gray-900 relative">
                <button type="button" className="absolute right-5 bottom-5 bg-white/20 text-white border-none rounded-md px-3 py-2 flex items-center gap-1.5 text-[13px] font-bold cursor-pointer backdrop-blur-sm hover:bg-white/30 transition-colors">
                  {Ico.camera} Edit Cover
                </button>
              </div>

              <div className="px-8 pb-8">
                <div className="mt-[-50px] mb-[30px] flex">
                  <div className="w-[100px] h-[100px] bg-white border-4 border-white rounded-xl shadow-md flex items-center justify-center cursor-pointer overflow-hidden group">
                    <div className="w-full h-full bg-gray-50 flex flex-col items-center justify-center text-gray-400 group-hover:bg-gray-100 transition-colors">
                      {Ico.camera}
                      <span className="text-[11px] font-bold mt-1 uppercase tracking-[0.05em]">Logo</span>
                    </div>
                  </div>
                </div>

                <h3 className="m-[0_0_24px] text-lg font-bold text-gray-900 border-b border-gray-200 pb-3">Company Details</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className={labelStyle}>Company Name</label>
                    <div className={inputOuter}>
                      <span className={inputIcon}>{Ico.building}</span>
                      <input type="text" defaultValue="TechNova Solutions" className={inputStyle} />
                    </div>
                  </div>
                  <div>
                    <label className={labelStyle}>Industry Sector</label>
                    <select className={`${inputStyle} pl-4 cursor-pointer appearance-auto`}>
                      <option>Information Technology</option>
                      <option>Construction & Real Estate</option>
                      <option>Finance & Banking</option>
                      <option>Healthcare</option>
                    </select>
                  </div>
                </div>

                <div className="mb-8">
                  <label className={labelStyle}>Corporate Overview / "About Us"</label>
                  <textarea rows={5} defaultValue='TechNova is a leading provider of innovative cloud solutions and enterprise software dedicated to helping businesses scale seamlessly across East Africa and beyond.'
                    className={`${inputStyle} pl-4 resize-y leading-relaxed`} />
                </div>

                <h3 className="m-[0_0_24px] text-lg font-bold text-gray-900 border-b border-gray-200 pb-3">Contact Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
                  <div>
                    <label className={labelStyle}>Corporate Email Address</label>
                    <div className={inputOuter}>
                      <span className={inputIcon}>{Ico.mail}</span>
                      <input type="email" defaultValue="contact@technova.com" className={inputStyle} />
                    </div>
                  </div>
                  <div>
                    <label className={labelStyle}>Support / Office Phone</label>
                    <div className={inputOuter}>
                      <span className={inputIcon}>{Ico.phone}</span>
                      <input type="text" defaultValue="+254 700 123 456" className={`${inputStyle} font-mono`} />
                    </div>
                  </div>
                  <div>
                    <label className={labelStyle}>Company Website</label>
                    <div className={inputOuter}>
                      <span className={inputIcon}>{Ico.globe}</span>
                      <input type="url" defaultValue="https://technova.co.ke" className={inputStyle} />
                    </div>
                  </div>
                  <div>
                    <label className={labelStyle}>Primary Location</label>
                    <div className={inputOuter}>
                      <span className={inputIcon}>{Ico.pin}</span>
                      <input type="text" defaultValue="Westlands, Nairobi" className={inputStyle} />
                    </div>
                  </div>
                </div>
              </div>
            </form>
          )}

          {activeTab === "Security & Login" && (
            <div className="p-8">
               <h3 className="m-[0_0_24px] text-lg font-bold text-gray-900 border-b border-gray-200 pb-3">Password Settings</h3>
               <div className="flex flex-col gap-5 max-w-[500px]">
                 <div>
                   <label className={labelStyle}>Current Password</label>
                   <input type="password" placeholder="Enter current password" className={`${inputStyle} pl-4`} />
                 </div>
                 <div>
                   <label className={labelStyle}>New Password</label>
                   <input type="password" placeholder="Create a new password" className={`${inputStyle} pl-4`} />
                 </div>
                 <div>
                   <label className={labelStyle}>Confirm New Password</label>
                   <input type="password" placeholder="Verify new password" className={`${inputStyle} pl-4`} />
                 </div>
                 <button className="self-start mt-2.5 px-5 py-2.5 bg-gray-900 text-white border-none rounded-lg text-sm font-bold cursor-pointer hover:bg-gray-800 transition-colors">Update Password</button>
               </div>
            </div>
          )}

          {activeTab === "Notifications" && (
            <div className="p-8">
               <h3 className="m-[0_0_24px] text-lg font-bold text-gray-900 border-b border-gray-200 pb-3">Email & Push Notifications</h3>
               <div className="flex flex-col gap-5">
                 {[
                   { label: "New Application Alerts", desc: "Receive alerts immediately when a candidate applies." },
                   { label: "Direct Messages", desc: "Get notified when a candidate responds to your messages." },
                   { label: "Job Expiring Reminders", desc: "Alert me when a job posting is about to expire." },
                   { label: "Weekly Account Summary", desc: "A brief overview metric report sent to your email weekly." }
                 ].map((t, idx) => (
                   <div key={idx} className="flex items-center gap-4">
                     <input type="checkbox" defaultChecked={idx < 3} className="w-[18px] h-[18px] cursor-pointer accent-gray-900" />
                     <div>
                       <p className="m-[0_0_4px] text-[15px] font-bold text-gray-900">{t.label}</p>
                       <p className="m-0 text-[13px] text-gray-500">{t.desc}</p>
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          )}

          {activeTab === "Billing & Plans" && (
            <div className="p-8">
               <h3 className="m-[0_0_24px] text-lg font-bold text-gray-900 border-b border-gray-200 pb-3">Subscription Plan</h3>
               
               <div className="p-6 border-2 border-gray-900 rounded-[10px] bg-gray-50 mb-[30px]">
                 <div className="flex justify-between items-center flex-wrap gap-4">
                  <div>
                     <p className="m-[0_0_8px] text-sm font-bold text-blue-600 uppercase tracking-[0.05em]">Corporate Pro Plan</p>
                     <p className="m-0 text-2xl font-bold text-gray-900 font-mono">KES 15,000 / month</p>
                  </div>
                   <button className="px-5 py-2.5 bg-white text-gray-900 border-[1.5px] border-gray-900 rounded-lg text-sm font-bold cursor-pointer hover:bg-gray-50 transition-colors">Change Plan</button>
                </div>
              </div>

               <h3 className="m-[0_0_20px] text-base font-bold text-gray-900">Payment Methods</h3>
              <div className="p-5 border-[1.5px] border-gray-200 rounded-[10px] flex items-center gap-4">
                <div className="w-[60px] h-10 bg-gray-900 text-white flex items-center justify-center rounded-md font-bold text-xs uppercase">VISA</div>
                <div className="flex-1">
                  <p className="m-[0_0_4px] text-[15px] font-bold text-gray-900">Visa ending in 4242</p>
                  <p className="m-0 text-[13px] text-gray-500">Expires 12/26</p>
                </div>
                <button className="bg-transparent border-none text-blue-600 text-sm font-bold cursor-pointer hover:text-blue-700 transition-colors">Edit</button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
