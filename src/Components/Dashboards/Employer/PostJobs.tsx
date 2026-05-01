import { useState, useEffect, useRef } from "react";
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
  pin:       I('<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>', 14),
  coins:     I('<circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/><path d="M7 6h1v4"/><path d="m16.71 13.88.7.71-2.82 2.82"/>', 14),
  check:     I('<path d="M20 6 9 17l-5-5"/>', 14),
  plus:      I('<path d="M12 5v14M5 12h14"/>', 14),
  tag:       I('<path d="M12 2H2v10l9.29 9.29a1 1 0 0 0 1.41 0l7.3-7.3a1 1 0 0 0 0-1.41L10 2"/><circle cx="7" cy="7" r="1" fill="currentColor"/>', 14),
  list:      I('<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>', 14),
  x:         I('<path d="M18 6 6 18M6 6l12 12"/>', 10),
};

// ── Shared styles ──────────────────────────────────────────────────────────────
const labelStyle = "block text-[15px] font-semibold text-gray-700 mb-1.5";
const hintStyle  = "text-xs text-gray-400 mt-1 font-mono";
const inputOuter = "relative flex items-center w-full";
const inputIcon  = "absolute left-3 text-gray-400";
const inputStyle = "w-full py-2.5 pr-3.5 pl-9 border-[1.5px] border-gray-200 rounded-lg text-base text-gray-900 bg-white outline-none transition-colors duration-150 focus:border-gray-400";
const textareaStyle = "w-full py-2.5 px-3.5 border-[1.5px] border-gray-200 rounded-lg text-base text-gray-900 bg-white outline-none transition-colors duration-150 focus:border-gray-400 resize-y";
const errorInputStyle = "border-red-500 focus:border-red-500";

// ── Skills Tag Input ───────────────────────────────────────────────────────────
function SkillsInput({ skills, onChange }: { skills: string[]; onChange: (s: string[]) => void }) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const add = () => {
    const trimmed = input.trim();
    if (trimmed && !skills.includes(trimmed)) {
      onChange([...skills, trimmed]);
    }
    setInput("");
  };

  const remove = (skill: string) => onChange(skills.filter(s => s !== skill));

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") { e.preventDefault(); add(); }
    if (e.key === "Backspace" && input === "" && skills.length > 0) {
      remove(skills[skills.length - 1]);
    }
  };

  return (
    <div
      className="min-h-[44px] flex flex-wrap gap-1.5 items-center px-3 py-2 border-[1.5px] border-gray-200 rounded-lg bg-white cursor-text focus-within:border-gray-400 transition-colors"
      onClick={() => inputRef.current?.focus()}
    >
      {skills.map(skill => (
        <span key={skill} className="flex items-center gap-1 text-[13px] font-medium bg-gray-900 text-white px-2.5 py-1 rounded-md">
          {skill}
          <button type="button" onClick={() => remove(skill)} className="bg-transparent border-none text-gray-400 hover:text-white cursor-pointer p-0 flex items-center">
            {Ico.x}
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleKey}
        onBlur={add}
        placeholder={skills.length === 0 ? "e.g. React, Teamwork, Excel — press Enter to add" : ""}
        className="flex-1 min-w-[160px] border-none outline-none text-sm text-gray-900 bg-transparent placeholder:text-gray-400"
      />
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────────
export default function PostJobs({ editingJob, onSaved }: { editingJob?: Job | null; onSaved?: () => void } = {}) {
  const { user } = useAuth();

  const [isSaved, setIsSaved]         = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError]             = useState<string | null>(null);

  // Validation error states
  const [titleError, setTitleError]   = useState("");
  const [descError, setDescError]     = useState("");
  const [salaryError, setSalaryError] = useState("");

  const [jobCategory,    setJobCategory]    = useState(CATEGORIES[0]);
  const [jobType,        setJobType]        = useState("Permanent");
  const [title,          setTitle]          = useState("");
  const [location,       setLocation]       = useState("");
  const [salary,         setSalary]         = useState("");
  const [description,    setDescription]    = useState("");
  const [expectedRoles,  setExpectedRoles]  = useState("");
  const [requiredSkills, setRequiredSkills] = useState<string[]>([]);

  // Pre-fill form when an editingJob is provided
  useEffect(() => {
    if (editingJob) {
      setTitle(editingJob.title);
      setLocation(editingJob.location);
      setJobType(editingJob.type || "Permanent");
      setJobCategory(editingJob.department || CATEGORIES[0]);
      setSalary(editingJob.salaryRate ?? "");
      setDescription(editingJob.description ?? "");
      setExpectedRoles(editingJob.expectedRoles ?? "");
      setRequiredSkills(editingJob.requiredSkills ?? []);
      // Clear errors on pre-fill
      setTitleError("");
      setDescError("");
      setSalaryError("");
    } else {
      setTitle(""); setLocation(""); setSalary(""); setDescription("");
      setExpectedRoles(""); setRequiredSkills([]);
      setJobCategory(CATEGORIES[0]); setJobType("Permanent");
      setTitleError(""); setDescError(""); setSalaryError("");
    }
  }, [editingJob]);

  // ── Validation Handlers ─────────────────────────────────────────────────────
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const filtered = raw.replace(/[0-9]/g, ""); // Remove digits
    setTitle(filtered);
    if (raw !== filtered) {
      setTitleError("Job title should not contain numbers");
    } else {
      setTitleError("");
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const raw = e.target.value;
    const filtered = raw.replace(/[0-9]/g, "");
    setDescription(filtered);
    if (raw !== filtered) {
      setDescError("Description should not contain numbers");
    } else {
      setDescError("");
    }
  };

  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const filtered = raw.replace(/[^0-9]/g, ""); // Only digits allowed
    setSalary(filtered);
    if (raw !== filtered) {
      setSalaryError("Salary must contain only numbers (e.g., 150000)");
    } else {
      setSalaryError("");
    }
  };

  const submitJob = async (status: "active" | "draft") => {
    const isEdit = !!editingJob;

    // Basic required fields
    if (!title || !location || (!isEdit && (!salary || !description))) {
      setError("Please fill out all required fields.");
      return;
    }

    // Check validation errors
    if (titleError || descError || salaryError) {
      setError("Please fix the highlighted validation errors before proceeding.");
      return;
    }

    // Ensure no digits remain (extra safety)
    if (/\d/.test(title)) {
      setTitleError("Job title must not contain numbers");
      setError("Job title contains numbers. Please remove them.");
      return;
    }
    if (/\d/.test(description)) {
      setDescError("Description must not contain numbers");
      setError("Description contains numbers. Please remove them.");
      return;
    }
    if (salary && !/^\d+$/.test(salary)) {
      setSalaryError("Salary must be numeric only");
      setError("Salary must be numeric only.");
      return;
    }

    if (!user) { setError("You must be logged in to post a job."); return; }

    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        title,
        category:        jobCategory,
        job_type:        jobType,
        location,
        salary_rate:     salary,
        description,
        expected_roles:  expectedRoles,
        required_skills: requiredSkills,
        status,
        updated_at:      new Date().toISOString(),
      };

      if (isEdit) {
        const { error: dbError } = await supabase
          .from("jobs")
          .update(payload)
          .eq("id", editingJob!.id);
        if (dbError) throw dbError;
      } else {
        const { error: dbError } = await supabase
          .from("jobs")
          .insert([{ employer_id: user.id, ...payload }]);
        if (dbError) throw dbError;
      }

      setIsSaved(true);
      if (!isEdit) {
        setTitle(""); setLocation(""); setSalary(""); setDescription("");
        setExpectedRoles(""); setRequiredSkills([]);
        setJobCategory(CATEGORIES[0]); setJobType("Permanent");
        setTitleError(""); setDescError(""); setSalaryError(""); // clear errors
      }
    } catch (err: any) {
      console.error("Error posting job:", err);
      setError(err.message || "Failed to post job. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); submitJob("active"); };

  // Check if form has any validation errors (for disabling buttons)
  const hasValidationErrors = !!titleError || !!descError || !!salaryError;

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col font-sans">

      {/* Modal */}
      {(isSubmitting || isSaved) && (
        <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center">
          <div className="bg-white p-10 rounded-2xl flex flex-col items-center w-[300px] shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1)]">
            {isSubmitting ? (
              <>
                <div className="w-11 h-11 border-4 border-gray-100 border-t-gray-900 rounded-full animate-spin" />
                <p className="mt-6 text-base font-semibold text-gray-900">Publishing Job...</p>
                <p className="mt-1 text-[13px] text-gray-500">Please wait a moment</p>
              </>
            ) : isSaved ? (
              <>
                <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                </div>
                <p className="mt-5 text-lg font-bold text-gray-900 text-center">{editingJob ? "Job Updated!" : "Job Posted!"}</p>
                <p className="mt-1.5 text-sm text-gray-600 text-center mb-5">{editingJob ? "Your changes have been saved." : "Your job is now live on the platform."}</p>
                <button type="button" onClick={() => { setIsSaved(false); onSaved?.(); }} className="w-full p-2.5 bg-emerald-600 text-white border-none rounded-lg text-base font-semibold cursor-pointer hover:bg-emerald-700 transition">OK</button>
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
              <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-300 text-red-500 text-sm">{error}</div>
            )}

            {/* ── Section 1: Category & Type ────────────────────────────── */}
            <h3 className="m-0 mb-5 text-lg font-bold text-gray-900 border-b border-gray-200 pb-2.5">Job Category &amp; Type</h3>

            <div className="mb-6">
              <label className={labelStyle}>Job Category</label>
              <div className={inputOuter}>
                <span className={inputIcon}>{Ico.briefcase}</span>
                <select value={jobCategory} onChange={e => setJobCategory(e.target.value)} className={`${inputStyle} cursor-pointer appearance-none`} required>
                  {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5 mb-6">
              <div>
                <label className={labelStyle}>Job Title <span className="text-red-400">*</span></label>
                <div className={inputOuter}>
                  <span className={inputIcon}>{Ico.briefcase}</span>
                  <input
                    type="text"
                    placeholder="e.g. Senior Data Analyst"
                    className={`${inputStyle} ${titleError ? errorInputStyle : ""}`}
                    value={title}
                    onChange={handleTitleChange}
                    required
                  />
                </div>
                {titleError && <p className="text-xs text-red-500 mt-1">{titleError}</p>}
              </div>
              <div>
                <label className={labelStyle}>Job Type</label>
                <select value={jobType} onChange={e => setJobType(e.target.value)} className={`${inputStyle} pl-3.5 cursor-pointer appearance-none`}>
                  <option value="Permanent">Permanent</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                  <option value="Daily / Day-Labor">Daily / Day-Labor</option>
                  <option value="Hourly / Shift">Hourly / Shift</option>
                  <option value="Gig / Project-Based">Gig / Project-Based</option>
                </select>
              </div>
            </div>

            {/* ── Section 2: Location & Compensation ───────────────────── */}
            <h3 className="m-[30px_0_20px] text-lg font-bold text-gray-900 border-b border-gray-200 pb-2.5">Location &amp; Compensation</h3>

            <div className="grid grid-cols-2 gap-5 mb-6">
              <div>
                <label className={labelStyle}>Location <span className="text-red-400">*</span></label>
                <div className={inputOuter}>
                  <span className={inputIcon}>{Ico.pin}</span>
                  <input type="text" placeholder="e.g. Nairobi, Moscow, Cairo" className={inputStyle} value={location} onChange={e => setLocation(e.target.value)} required />
                </div>
              </div>
              <div>
                <label className={labelStyle}>Salary / Rate (KES) <span className="text-red-400">*</span></label>
                <div className={inputOuter}>
                  <span className={inputIcon}>{Ico.coins}</span>
                  <input
                    type="text"
                    placeholder="e.g. 150000"
                    className={`${inputStyle} ${salaryError ? errorInputStyle : ""}`}
                    value={salary}
                    onChange={handleSalaryChange}
                    required
                  />
                </div>
                {salaryError && <p className="text-xs text-red-500 mt-1">{salaryError}</p>}
              </div>
            </div>

            {/* ── Section 3: Job Details ─────────────────────────────────── */}
            <h3 className="m-[30px_0_20px] text-lg font-bold text-gray-900 border-b border-gray-200 pb-2.5">Job Details</h3>

            {/* Description */}
            <div className="mb-6">
              <label className={labelStyle}>
                <span className="inline-flex items-center gap-1.5">{Ico.list} Job Description <span className="text-red-400">*</span></span>
              </label>
              <textarea
                rows={5}
                placeholder="Give a clear overview of the role, the company, what the candidate will be working on, and what makes this opportunity exciting..."
                className={`${textareaStyle} ${descError ? errorInputStyle : ""}`}
                value={description}
                onChange={handleDescriptionChange}
                required
              />
              {descError && <p className="text-xs text-red-500 mt-1">{descError}</p>}
              <p className={hintStyle}>A compelling description attracts higher-quality applicants. Numbers are not allowed.</p>
            </div>

            {/* Expected Roles / Responsibilities */}
            <div className="mb-6">
              <label className={labelStyle}>
                <span className="inline-flex items-center gap-1.5">{Ico.list} Expected Roles &amp; Responsibilities</span>
              </label>
              <textarea
                rows={5}
                className={textareaStyle}
                value={expectedRoles}
                onChange={e => setExpectedRoles(e.target.value)}
              />
              <p className={hintStyle}>List each responsibility on its own line. Use dashes (-) for readability.</p>
            </div>

            {/* Required Skills */}
            <div className="mb-8">
              <label className={labelStyle}>
                <span className="inline-flex items-center gap-1.5">{Ico.tag} Required Skills</span>
              </label>
              <SkillsInput skills={requiredSkills} onChange={setRequiredSkills} />
              <p className={hintStyle}>Type a skill and press <kbd className="px-1 py-0.5 bg-gray-100 border border-gray-300 rounded text-[11px]">Enter</kbd> or <kbd className="px-1 py-0.5 bg-gray-100 border border-gray-300 rounded text-[11px]">,</kbd> to add. Backspace removes the last tag.</p>
            </div>

            {/* ── Action Buttons ─────────────────────────────────────────── */}
            <div className="flex justify-end gap-3 border-t border-gray-200 pt-5">
              <button
                type="button"
                onClick={() => submitJob("draft")}
                disabled={isSubmitting || hasValidationErrors}
                className={`px-5 py-2.5 bg-white text-gray-500 border-[1.5px] border-gray-200 rounded-lg text-base font-semibold transition-opacity ${
                  isSubmitting || hasValidationErrors ? "cursor-not-allowed opacity-70" : "cursor-pointer hover:bg-gray-50"
                }`}
              >
                Save as Draft
              </button>
              <button
                type="submit"
                disabled={isSubmitting || hasValidationErrors}
                className={`px-5 py-2.5 bg-gray-900 text-white border-none rounded-lg text-base font-semibold transition-opacity ${
                  isSubmitting || hasValidationErrors ? "cursor-not-allowed opacity-70" : "cursor-pointer hover:bg-gray-800"
                }`}
              >
                {isSubmitting ? (editingJob ? "Saving..." : "Publishing...") : (editingJob ? "Save Changes" : "Publish Job")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}