import { useState, useEffect } from "react";
import { supabase } from "../../../../lib/supabaseClient";
import { useAuth } from "../../../../contexts/AuthContext";

// ── Icons ──────────────────────────────────────────────────────────────────────
const I = (d: string, s = 14, fill = "none") => <svg width={s} height={s} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: d }} />;
const Ico = {
  lock:        I('<rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>', 16),
  bell:        I('<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>', 16),
  trash:       I('<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>', 16),
  check:       I('<path d="M20 6 9 17l-5-5"/>', 16),
  eye:         I('<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>', 14),
  eyeOff:      I('<path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/>', 14),
  warning:     I('<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>', 16),
  user:        I('<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>', 16),
};

// ── Shared styles ──────────────────────────────────────────────────────────────
const labelStyle = "block text-[13px] font-bold text-gray-700 mb-2 font-sans";
const inputStyle = "w-full py-2.5 px-3.5 border-[1.5px] border-gray-200 rounded-lg text-sm text-gray-900 bg-white outline-none font-sans transition-colors duration-150 focus:border-gray-400";
const menuBtn = (active: boolean) =>
  `flex items-center gap-2.5 w-full px-[18px] py-3.5 border-none rounded-lg text-sm font-sans text-left transition-colors duration-150 cursor-pointer ${
    active ? "bg-gray-100 text-gray-900 font-bold" : "bg-transparent text-gray-500 font-semibold hover:bg-gray-50 hover:text-gray-700"
  }`;
const sectionHead = "m-0 mb-6 text-lg font-bold text-gray-900 border-b border-gray-200 pb-3";
const dangerBtn = "px-5 py-2.5 border-none rounded-lg text-sm font-bold cursor-pointer font-sans transition-colors";

// ── Password eye toggle ──────────────────────────────────────────────────────
function PwdInput({ placeholder, value, onChange }: { placeholder: string; value: string; onChange: (v: string) => void }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative flex items-center">
      <input
        type={show ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        className={`${inputStyle} pr-10`}
      />
      <button type="button" onClick={() => setShow(p => !p)} className="absolute right-3 text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer p-0">
        {show ? Ico.eyeOff : Ico.eye}
      </button>
    </div>
  );
}

// ── Toggle switch ────────────────────────────────────────────────────────────
function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 border-none cursor-pointer flex-shrink-0 ${checked ? "bg-gray-900" : "bg-gray-200"}`}
    >
      <span className={`absolute top-[3px] left-[3px] w-[18px] h-[18px] bg-white rounded-full shadow transition-transform duration-200 ${checked ? "translate-x-5" : "translate-x-0"}`} />
    </button>
  );
}

// ── Toast notification ───────────────────────────────────────────────────────
function Toast({ message, type }: { message: string; type: "success" | "error" }) {
  return (
    <div className={`fixed bottom-6 right-6 z-[9999] flex items-center gap-2.5 px-5 py-3.5 rounded-xl shadow-2xl text-sm font-semibold font-sans transition-all ${type === "success" ? "bg-gray-900 text-white" : "bg-red-500 text-white"}`}>
      {type === "success" ? Ico.check : Ico.warning}
      {message}
    </div>
  );
}

// ── Notification preference rows ─────────────────────────────────────────────
const NOTIF_KEYS = [
  { key: "job_matches",          label: "Job Matches",          desc: "Get alerted when a job matches your skills." },
  { key: "application_updates",  label: "Application Updates",  desc: "Get alerted when employers review or update your application." },
  { key: "direct_messages",      label: "Direct Messages",      desc: "Get alerted when employers send you a direct message." },
] as const;

type NotifKey = typeof NOTIF_KEYS[number]["key"];
type NotifPrefs = Record<NotifKey, boolean>;

const DEFAULT_NOTIF: NotifPrefs = {
  job_matches: true,
  application_updates: true,
  direct_messages: true,
};

// ── Main Component ─────────────────────────────────────────────────────────────
export default function JobSeekerSettings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("Notifications");

  // ── Toast state ────────────────────────────────────────────────────────────
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Profile Data ───────────────────────────────────────────────────────────
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileData, setProfileData] = useState<{ first_name: string; last_name: string; phone: string; email: string }>({
    first_name: "", last_name: "", phone: "", email: ""
  });

  useEffect(() => {
    if (!user) return;
    (async () => {
      setProfileLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("first_name, last_name, phone, email")
        .eq("id", user.id)
        .single();
      
      if (!error && data) {
        setProfileData({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          phone: data.phone || "",
          email: data.email || user.email || ""
        });
      } else {
        // Fallback or use user.email
        setProfileData((prev) => ({ ...prev, email: user.email || "" }));
      }
      setProfileLoading(false);
    })();
  }, [user]);

  // ── Notification preferences ────────────────────────────────────────────────
  const [notifPrefs, setNotifPrefs] = useState<NotifPrefs>(DEFAULT_NOTIF);
  const [notifLoading, setNotifLoading] = useState(true);
  const [notifSaving, setNotifSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      setNotifLoading(true);
      const { data, error } = await supabase
        .from("job_seeker_settings")
        .select("*")
        .eq("user_id", user.id)
        .single();
      if (!error && data) {
        setNotifPrefs({
          job_matches:         data.job_matches         ?? DEFAULT_NOTIF.job_matches,
          application_updates: data.application_updates ?? DEFAULT_NOTIF.application_updates,
          direct_messages:     data.direct_messages     ?? DEFAULT_NOTIF.direct_messages,
        });
      }
      setNotifLoading(false);
    })();
  }, [user]);

  const saveNotifPrefs = async () => {
    if (!user) return;
    setNotifSaving(true);
    const { error } = await supabase
      .from("job_seeker_settings")
      .upsert({ user_id: user.id, ...notifPrefs, updated_at: new Date().toISOString() }, { onConflict: "user_id" });
    setNotifSaving(false);
    if (error) showToast("Failed to save preferences: " + error.message, "error");
    else showToast("Notification preferences saved!");
  };

  // ── Security / Password ─────────────────────────────────────────────────────
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd,     setNewPwd]     = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [pwdSaving,  setPwdSaving]  = useState(false);

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPwd !== confirmPwd) { showToast("New passwords do not match.", "error"); return; }
    if (newPwd.length < 8)    { showToast("Password must be at least 8 characters.", "error"); return; }
    setPwdSaving(true);
    const { error } = await supabase.auth.updateUser({ password: newPwd });
    setPwdSaving(false);
    if (error) showToast(error.message, "error");
    else {
      showToast("Password updated successfully!");
      setCurrentPwd(""); setNewPwd(""); setConfirmPwd("");
    }
  };

  // ── Deactivate account ───────────────────────────────────────────────────────
  const [deactivateModal, setDeactivateModal] = useState(false);
  const [deactivating, setDeactivating] = useState(false);

  const handleDeactivate = async () => {
    if (!user) return;
    setDeactivating(true);
    const deactivatedUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    const { error } = await supabase
      .from("profiles")
      .update({ deactivated_until: deactivatedUntil })
      .eq("id", user.id);
    setDeactivating(false);
    if (error) { showToast("Failed to deactivate: " + error.message, "error"); return; }
    await supabase.auth.signOut();
  };

  // ── Delete account ───────────────────────────────────────────────────────────
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") { showToast("Type DELETE to confirm.", "error"); return; }
    if (!user) return;
    setDeleting(true);

    // Delete profile (which cascades up to user data as per schema)
    const { error: profileErr } = await supabase.from("profiles").delete().eq("id", user.id);
    if (profileErr) { showToast("Error deleting profile: " + profileErr.message, "error"); setDeleting(false); return; }

    await supabase.auth.signOut();
  };

  // ── Sidebar tabs ─────────────────────────────────────────────────────────────
  const TABS = [
    { id: "Notifications", label: "Notification Preferences", icon: Ico.bell },
    { id: "Security",      label: "Security & Password",      icon: Ico.lock },
    { id: "Account",       label: "Account & Privacy",        icon: Ico.user },
  ];

  return (
    <div className="font-sans bg-gray-50 min-h-screen flex flex-col">

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} />}

      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3.5 flex items-center justify-between shrink-0">
        <div>
          <h1 className="m-0 text-xl font-bold text-gray-900">Settings</h1>
          <p className="m-0 text-[13px] text-gray-400 font-mono">Manage your account preferences</p>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6 p-6 max-w-[1100px] mx-auto w-full items-start">

        {/* ── Sidebar ───────────────────────────────────────────────────────── */}
        <div className="bg-white border-[1.5px] border-gray-200 rounded-[10px] p-3 h-fit sticky top-6">
          <div className="flex flex-col gap-1">
            {TABS.map(tab => (
              <button key={tab.id} className={menuBtn(activeTab === tab.id)} onClick={() => setActiveTab(tab.id)}>
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Content ───────────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-5">

          {/* ── Notifications ──────────────────────────────────────────────── */}
          {activeTab === "Notifications" && (
            <div className="bg-white border-[1.5px] border-gray-200 rounded-[10px] p-7">
              <h3 className={sectionHead}>Email &amp; Push Notifications</h3>
              {notifLoading ? (
                <div className="flex items-center gap-2 text-gray-400 text-sm"><div className="w-4 h-4 border-2 border-gray-200 border-t-gray-500 rounded-full animate-spin" /> Loading preferences…</div>
              ) : (
                <div className="flex flex-col gap-5">
                  {NOTIF_KEYS.map(({ key, label, desc }) => (
                    <div key={key} className="flex items-start gap-4 py-3 border-b border-gray-100 last:border-0">
                      <Toggle checked={notifPrefs[key]} onChange={v => setNotifPrefs(p => ({ ...p, [key]: v }))} />
                      <div>
                        <p className="m-[0_0_3px] text-[15px] font-bold text-gray-900">{label}</p>
                        <p className="m-0 text-[13px] text-gray-500 leading-relaxed">{desc}</p>
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-end pt-2">
                    <button onClick={saveNotifPrefs} disabled={notifSaving} className={`px-6 py-2.5 bg-gray-900 text-white border-none rounded-lg text-sm font-bold font-sans transition-opacity ${notifSaving ? "opacity-60 cursor-not-allowed" : "cursor-pointer hover:bg-gray-800"}`}>
                      {notifSaving ? "Saving…" : "Save Preferences"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Security ───────────────────────────────────────────────────── */}
          {activeTab === "Security" && (
            <div className="bg-white border-[1.5px] border-gray-200 rounded-[10px] p-7">
              <h3 className={sectionHead}>Change Password</h3>
              <form onSubmit={handlePasswordUpdate} className="flex flex-col gap-5 max-w-[480px]">
                <div>
                  <label className={labelStyle}>Current Password</label>
                  <PwdInput placeholder="Enter your current password" value={currentPwd} onChange={setCurrentPwd} />
                </div>
                <div>
                  <label className={labelStyle}>New Password <span className="text-gray-400 font-normal">(min. 8 characters)</span></label>
                  <PwdInput placeholder="Create a strong new password" value={newPwd} onChange={setNewPwd} />
                </div>
                <div>
                  <label className={labelStyle}>Confirm New Password</label>
                  <PwdInput placeholder="Repeat your new password" value={confirmPwd} onChange={setConfirmPwd} />
                </div>

                {/* Strength indicator */}
                {newPwd.length > 0 && (
                  <div>
                    <div className="flex gap-1 mb-1">
                      {[1,2,3,4].map(i => {
                        const strength = newPwd.length >= 12 && /[A-Z]/.test(newPwd) && /[0-9]/.test(newPwd) && /[^a-zA-Z0-9]/.test(newPwd) ? 4
                          : newPwd.length >= 10 && /[A-Z]/.test(newPwd) ? 3
                          : newPwd.length >= 8 ? 2 : 1;
                        return <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= strength ? (strength >= 3 ? "bg-emerald-500" : strength === 2 ? "bg-amber-400" : "bg-red-400") : "bg-gray-200"}`} />;
                      })}
                    </div>
                    <p className="text-[12px] text-gray-400 m-0">
                      {newPwd.length < 8 ? "Too short" : /[A-Z]/.test(newPwd) && /[0-9]/.test(newPwd) && /[^a-zA-Z0-9]/.test(newPwd) ? "Strong password" : "Add uppercase, numbers & symbols for a stronger password"}
                    </p>
                  </div>
                )}

                <div className="flex justify-start pt-1">
                  <button type="submit" disabled={pwdSaving} className={`px-6 py-2.5 bg-gray-900 text-white border-none rounded-lg text-sm font-bold font-sans transition-opacity ${pwdSaving ? "opacity-60 cursor-not-allowed" : "cursor-pointer hover:bg-gray-800"}`}>
                    {pwdSaving ? "Updating…" : "Update Password"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ── Account & Privacy ──────────────────────────────────────────── */}
          {activeTab === "Account" && (
            <>
              {/* Account Info (read-only) */}
              <div className="bg-white border-[1.5px] border-gray-200 rounded-[10px] p-7">
                <h3 className={sectionHead}>Account Information</h3>
                {profileLoading ? (
                  <div className="flex gap-2 text-sm text-gray-400"><div className="w-4 h-4 rounded-full border-2 border-gray-200 border-t-gray-500 animate-spin"/> Loading data...</div>
                ) : (
                  <div className="flex flex-col gap-4 max-w-[480px]">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelStyle}>Full Name</label>
                        <input value={`${profileData.first_name} ${profileData.last_name}`.trim() || "—"} disabled className={`${inputStyle} bg-gray-50 text-gray-500 cursor-default`} />
                      </div>
                      <div>
                        <label className={labelStyle}>Phone Number</label>
                        <input value={profileData.phone || "—"} disabled className={`${inputStyle} bg-gray-50 text-gray-500 font-mono text-[13px] cursor-default`} />
                      </div>
                    </div>
                    <div>
                      <label className={labelStyle}>Registered Email</label>
                      <input value={profileData.email} disabled className={`${inputStyle} bg-gray-50 text-gray-500 cursor-default`} />
                      <p className="text-[12px] text-gray-400 mt-1 m-0 font-mono">To change your email, contact support.</p>
                    </div>
                    <div>
                      <label className={labelStyle}>Account ID</label>
                      <input value={user?.id ?? "—"} disabled className={`${inputStyle} bg-gray-50 text-gray-400 cursor-default font-mono text-[13px]`} />
                      <p className="text-[12px] text-gray-400 mt-1 m-0 font-mono">Role: Job Seeker</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Deactivate */}
              <div className="bg-white border-[1.5px] border-amber-200 rounded-[10px] p-7">
                <h3 className="m-0 mb-2 text-lg font-bold text-amber-700">Deactivate Account</h3>
                <p className="m-[0_0_20px] text-sm text-gray-600 leading-relaxed max-w-lg">
                  Deactivating temporarily disables your account for <strong>30 days</strong> and hides your profile from employers. Your account and data are fully preserved and will automatically reactivate after 30 days. You can also reactivate early by contacting support.
                </p>
                <button
                  onClick={() => setDeactivateModal(true)}
                  className={`${dangerBtn} bg-amber-50 text-amber-700 border-[1.5px] border-amber-300 hover:bg-amber-100`}
                >
                  Deactivate My Account
                </button>
              </div>

              {/* Delete */}
              <div className="bg-white border-[1.5px] border-red-200 rounded-[10px] p-7">
                <h3 className="m-0 mb-2 text-lg font-bold text-red-600">Delete Account</h3>
                <p className="m-[0_0_20px] text-sm text-gray-600 leading-relaxed max-w-lg">
                  Permanently deletes your account, applied jobs, resume, and profile. <strong>This action is irreversible.</strong> You will be immediately signed out and all data will be purged.
                </p>
                <button
                  onClick={() => setDeleteModal(true)}
                  className={`${dangerBtn} bg-red-50 text-red-600 border-[1.5px] border-red-300 hover:bg-red-100 inline-flex items-center gap-2`}
                >
                  {Ico.trash} Delete My Account Permanently
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Deactivate Confirmation Modal ───────────────────────────────────── */}
      {deactivateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-5">
          <div className="bg-white w-full max-w-[420px] rounded-2xl p-7 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mb-4">
              {Ico.warning}
            </div>
            <h3 className="m-[0_0_10px] text-xl font-bold text-gray-900">Deactivate for 30 days?</h3>
            <p className="m-[0_0_6px] text-sm text-gray-600 leading-relaxed">
              Your account will be paused for <strong>30 days</strong>. Your profile will be hidden from employers during this period.
            </p>
            <p className="m-[0_0_24px] text-sm text-gray-600 leading-relaxed">
              Your account and all data are preserved and will <strong>automatically reactivate</strong> after 30 days. You can also contact support to reactivate it earlier.
            </p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeactivateModal(false)} className="px-5 py-2.5 bg-white border-[1.5px] border-gray-200 rounded-lg text-sm font-bold text-gray-700 cursor-pointer font-sans hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button
                onClick={handleDeactivate}
                disabled={deactivating}
                className={`px-5 py-2.5 bg-amber-500 border-none rounded-lg text-sm font-bold text-white font-sans transition-opacity ${deactivating ? "opacity-60 cursor-not-allowed" : "cursor-pointer hover:bg-amber-600"}`}
              >
                {deactivating ? "Processing…" : "Yes, Deactivate"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation Modal ───────────────────────────────────────── */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-5">
          <div className="bg-white w-full max-w-[440px] rounded-2xl p-7 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-4">
              {Ico.trash}
            </div>
            <h3 className="m-[0_0_10px] text-xl font-bold text-gray-900">Delete account permanently?</h3>
            <p className="m-[0_0_20px] text-sm text-gray-600 leading-relaxed">
              This will <strong>permanently erase</strong> all your applications, saved jobs, resumes, and profile. There is no undo.
            </p>

            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <label className="block text-xs font-bold text-red-600 mb-2 uppercase tracking-[0.05em]">
                Type <span className="font-mono bg-red-100 px-1 rounded">DELETE</span> to confirm
              </label>
              <input
                value={deleteConfirmText}
                onChange={e => setDeleteConfirmText(e.target.value)}
                placeholder="DELETE"
                className={`${inputStyle} border-red-200 focus:border-red-400 font-mono font-bold tracking-widest`}
                autoComplete="off"
              />
            </div>

            <div className="flex gap-3 justify-end">
              <button onClick={() => { setDeleteModal(false); setDeleteConfirmText(""); }} className="px-5 py-2.5 bg-white border-[1.5px] border-gray-200 rounded-lg text-sm font-bold text-gray-700 cursor-pointer font-sans hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleting || deleteConfirmText !== "DELETE"}
                className={`px-5 py-2.5 bg-red-500 border-none rounded-lg text-sm font-bold text-white font-sans transition-opacity inline-flex items-center gap-2 ${(deleting || deleteConfirmText !== "DELETE") ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-red-600"}`}
              >
                {Ico.trash} {deleting ? "Deleting…" : "Delete Forever"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}