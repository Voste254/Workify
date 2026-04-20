import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { useAuth } from "../../../contexts/AuthContext";
import type { Job } from "./MyJobs";

const CATEGORIES = [
  "Technology & IT",
  "Healthcare & Medical",
  "Finance & Accounting",
  "Sales & Marketing",
  "Manual & Casual Labor",
  "Customer Support",
  "Administration",
  "Engineering & Design",
];
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
const labelStyle = "block text-[15px] font-semibold text-gray-700 mb-1.5";
const inputOuter = "relative flex items-center w-full";
const inputIcon = "absolute left-3 text-gray-400";
const inputStyle = "w-full py-2.5 pr-3.5 pl-9 border-[1.5px] border-gray-200 rounded-lg text-base text-gray-900 bg-white outline-none transition-colors duration-150 focus:border-gray-300";

// ── Main ───────────────────────────────────────────────────────────────────────
export default function PostJobs({ editingJob, onSaved }: { editingJob?: Job | null; onSaved?: () => void } = {}) {
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

  // Pre-fill form when an editingJob is provided
  useEffect(() => {
    if (editingJob) {
      setTitle(editingJob.title);
      setLocation(editingJob.location);
      setJobType(editingJob.type || "Permanent");
      setJobCategory(editingJob.department || CATEGORIES[0]);
      setSalary(editingJob.salaryRate ?? "");
      setDescription(editingJob.description ?? "");
    } else {
      // Reset form for a fresh post
      setTitle("");
      setLocation("");
      setSalary("");
      setDescription("");
      setJobCategory(CATEGORIES[0]);
      setJobType("Permanent");
    }
  }, [editingJob]);

  const submitJob = async (status: "active" | "draft") => {
    const isEdit = !!editingJob;
    if (!title || !location || (!isEdit && (!salary || !description))) {
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
      if (editingJob) {
        // UPDATE existing job
        const { error: dbError } = await supabase
          .from("jobs")
          .update({
            title,
            category: jobCategory,
            job_type: jobType,
            location,
            ...(salary ? { salary_rate: salary } : {}),
            ...(description ? { description } : {}),
            status,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingJob.id);

        if (dbError) throw dbError;
      } else {
        // INSERT new job
        if (!user) { setError("You must be logged in to post a job."); setIsSubmitting(false); return; }

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
      }

      setIsSaved(true);
      
      if (!editingJob) {
        // Reset form only for new posts
        setTitle("");
        setLocation("");
        setSalary("");
        setDescription("");
        setJobCategory(CATEGORIES[0]);
        setJobType("Permanent");
      }
      
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
    <div className="bg-gray-50 min-h-screen flex flex-col font-sans">
      
      {/* Modal */}
      {(isSubmitting || isSaved) && (
        <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center transition-opacity duration-200">
          <div className="bg-white p-10 rounded-2xl flex flex-col items-center w-[300px] shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)]">
            {isSubmitting ? (
              <>
                <div className="w-11 h-11 border-4 border-gray-100 border-t-gray-900 rounded-full animate-spin" />
                <p className="mt-6 text-base font-semibold text-gray-900">Publishing Job...</p>
                <p className="mt-1 text-[13px] text-gray-500">Please wait a moment</p>
              </>
            ) : isSaved ? (
              <>
                <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 animate-[pop_0.3s_cubic-bezier(0.175,0.885,0.32,1.275)_forwards]">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                </div>
                <p className="mt-5 text-lg font-bold text-gray-900 text-center">{editingJob ? "Job Updated!" : "Job Posted!"}</p>
                <p className="mt-1.5 text-sm text-gray-600 text-center mb-5">{editingJob ? "Your changes have been saved." : "Your job is now live on the platform."}</p>
                <button type="button" onClick={() => { setIsSaved(false); onSaved?.(); }} className="w-full p-2.5 bg-emerald-600 text-white border-none rounded-lg text-base font-semibold cursor-pointer hover:bg-emerald-700 transition">
                  OK
                </button>
              </>
            ) : null}
          </div>
        </div>
      )}

      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3.5 flex items-center justify-between">
        <div>
          <h1 className="m-0 text-xl font-bold text-gray-900">{editingJob ? "Edit Job" : "Post a New Job"}</h1>
          <p className="m-0 text-sm text-gray-400 font-mono">{editingJob ? `Editing: ${editingJob.title}` : "Find Top Talent & Casual Labor in Kenya"}</p>
        </div>
        <div>
          {isSaved && <span className="mr-4 text-[15px] text-emerald-600 font-semibold inline-flex items-center gap-1.5">{Ico.check} Job Posted Successfully</span>}
        </div>
      </div>

      <div className="p-6 max-w-[800px] mx-auto w-full">
        <div className="bg-white border-[1.5px] border-gray-200 rounded-[10px] overflow-hidden">
          
          <form onSubmit={handleSubmit} className="p-[30px]">
            {error && (
              <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-300 text-red-500 text-sm">
                {error}
              </div>
            )}
            
            <h3 className="m-0 mb-5 text-lg font-bold text-gray-900 border-b border-gray-200 pb-2.5">Job Category &amp; Type</h3>

            {/* Category Dropdown */}
            <div className="mb-6">
              <label className={labelStyle}>Job Category</label>
              <div className={inputOuter}>
                <span className={inputIcon}>{Ico.briefcase}</span>
                <select
                  value={jobCategory}
                  onChange={e => setJobCategory(e.target.value)}
                  className={`${inputStyle} cursor-pointer appearance-none`}
                  required
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5 mb-6">
              <div>
                 <label className={labelStyle}>Job Title</label>
                 <div className={inputOuter}>
                    <span className={inputIcon}>{Ico.briefcase}</span>
                    <input type="text" placeholder="e.g. Senior Data Analyst" className={inputStyle} value={title} onChange={e => setTitle(e.target.value)} required />
                 </div>

              </div>

              <div>
                 <label className={labelStyle}>Job Type</label>
                 <select
                   value={jobType}
                   onChange={e => setJobType(e.target.value)}
                   className={`${inputStyle} pl-3.5 cursor-pointer appearance-none`}
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

            <h3 className="m-[30px_0_20px] text-lg font-bold text-gray-900 border-b border-gray-200 pb-2.5">Location & Compensation</h3>

            <div className="grid grid-cols-2 gap-5 mb-6">
              <div>
                 <label className={labelStyle}>Location</label>
                 <div className={inputOuter}>
                    <span className={inputIcon}>{Ico.pin}</span>
                    <input type="text" placeholder="e.g. Nairobi, Moscow, Cairo" className={inputStyle} value={location} onChange={e => setLocation(e.target.value)} required />
                 </div>
              </div>

              <div>
                 <label className={labelStyle}>Salary / Rate (KES)</label>
                 <div className={inputOuter}>
                    <span className={inputIcon}>{Ico.coins}</span>
                    <input type="text" placeholder={jobCategory === "Corporate" ? "e.g. KES 150,000/mo" : "e.g. KES 2,000/day"} className={inputStyle} value={salary} onChange={e => setSalary(e.target.value)} required />
                 </div>
              </div>
            </div>

            <h3 className="m-[30px_0_20px] text-lg font-bold text-gray-900 border-b border-gray-200 pb-2.5">Job Specifics</h3>

            <div className="mb-[30px]">
              <label className={labelStyle}>Description & Requirements</label>
              <textarea rows={6} placeholder={jobCategory === "Corporate" ? "Detail the required skills, degree, and exact corporate responsibilities..." : "Detail the required skills, qualificatons and expected roles..."}
                className={`${inputStyle} pl-3.5 resize-y`} value={description} onChange={e => setDescription(e.target.value)} required />
            </div>

            <div className="flex justify-end gap-3 border-t border-gray-200 pt-5">
               <button type="button" onClick={() => submitJob("draft")} disabled={isSubmitting} className={`px-5 py-2.5 bg-white text-gray-500 border-[1.5px] border-gray-200 rounded-lg text-base font-semibold transition-opacity ${isSubmitting ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}>
                 Save as Draft
               </button>
               <button type="submit" disabled={isSubmitting} className={`px-5 py-2.5 bg-gray-900 text-white border-none rounded-lg text-base font-semibold transition-opacity ${isSubmitting ? "cursor-not-allowed opacity-70" : "cursor-pointer hover:bg-gray-800"}`}>
                 {isSubmitting ? (editingJob ? "Saving..." : "Publishing...") : (editingJob ? "Save Changes" : "Publish Job")}
               </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}