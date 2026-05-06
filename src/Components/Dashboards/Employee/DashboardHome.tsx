import { useState, useEffect, type JSX } from "react";
import { MapPin, Briefcase, TrendingUp, Clock, ChevronRight, Bell, CheckCircle, AlertCircle, FileText, Star, Award, UserCheck } from "lucide-react";
import JobCard from "./JobCard";
import BlogPreview from "./BlogPreview";
import { useAuth } from "../../../contexts/AuthContext";
import { supabase } from "../../../lib/supabaseClient";

const daysAgo = (d: string) => {
  const n = Math.floor((Date.now() - new Date(d).getTime()) / 86400000);
  if (n === 0) return "Today";
  if (n === 1) return "Yesterday";
  return `${n}d ago`;
};

const stageColorMap: Record<string, string> = {
  applied: "bg-gray-100 text-gray-600 border-gray-200",
  screening: "bg-amber-50 text-amber-700 border-amber-200",
  interview: "bg-blue-50 text-blue-700 border-blue-200",
  assessment: "bg-purple-50 text-purple-700 border-purple-200",
  offer: "bg-green-50 text-green-700 border-green-200",
  hired: "bg-gray-900 text-white border-gray-900",
  rejected: "bg-red-50 text-red-700 border-red-200",
  withdrawn: "bg-gray-100 text-gray-500 border-gray-200",
};

// Logic moved inside the component to use live profile data

// ── Primitives ────────────────────────────────────────────────────────────────
const SectionHeader = ({ title, action, onActionClick }: { title: string; action?: string; onActionClick?: () => void }) => (
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-base font-bold text-gray-900 uppercase tracking-widest">{title}</h2>
    {action && <button onClick={onActionClick} className="text-sm font-semibold text-gray-500 hover:text-gray-900 flex items-center gap-0.5 transition">{action} <ChevronRight size={12} /></button>}
  </div>
);

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white border-[1.5px] border-gray-200 ${className}`}>{children}</div>
);

// ── Dashboard ─────────────────────────────────────────────────────────────────
export default function Dashboard({ setActivePage }: { setActivePage: (page: string) => void }) {
  const { user, profile } = useAuth();
  const [recommendedJobs, setRecommendedJobs] = useState<any[]>([]);
  const [savedJobIds, setSavedJobIds] = useState<Set<string>>(new Set());
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [recentApps, setRecentApps] = useState<any[]>([]);
  const [loadingApps, setLoadingApps] = useState(true);
  const [stats, setStats] = useState({ applications: 0, weekApps: 0, savedJobs: 0, offers: 0, hired: 0 });

  const firstName = profile?.first_name;
  const profession = profile?.profession;
  const location = profile?.seeker_location;

  // Derive Profile Strength & Action Items
  const missingItems = [
    { label: "Add a professional bio", done: !!profile?.bio },
    { label: "List at least 3 skills", done: (profile?.skills?.length || 0) >= 3 },
    { label: "Set your location", done: !!profile?.seeker_location },
    { label: "Specify your profession", done: !!profile?.profession },
    { label: "Add your contact phone", done: !!profile?.phone },
  ];

  const profileStrength = Math.round((missingItems.filter(m => m.done).length / missingItems.length) * 100);

  const dynamicAlerts = [
    !profile?.bio && { icon: <AlertCircle size={14} className="text-amber-500 flex-shrink-0" />, text: "Your profile is missing a bio. Add one to stand out to employers." },
    (profile?.skills?.length || 0) < 3 && { icon: <Award size={14} className="text-blue-500 flex-shrink-0" />, text: "Add more skills to your profile to improve job matching." },
    stats.offers > 0 && { icon: <CheckCircle size={14} className="text-green-600 flex-shrink-0" />, text: `You have ${stats.offers} pending job offer(s) to review!` },
  ].filter(Boolean) as { icon: JSX.Element, text: string }[];

  // Fetch stats + recent applications + recommended jobs
  useEffect(() => {
    if (!user?.id) return;

    async function fetchDashboardData() {
      // 1. Fetch all seeker applications for stats
      const { data: allApps } = await supabase
        .from("applications")
        .select("id, stage, last_updated, created_at")
        .eq("seeker_id", user!.id);

      if (allApps) {
        const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7);
        setStats({
          applications: allApps.length,
          weekApps: allApps.filter(a => new Date(a.created_at) >= weekAgo).length,
          savedJobs: 0, // will be set below
          offers: allApps.filter(a => a.stage === "offer").length,
          hired: allApps.filter(a => a.stage === "hired").length,
        });
      }

      // 2. Fetch recent applications (last 4)
      setLoadingApps(true);
      const { data: recent } = await supabase
        .from("applications")
        .select("id, job_title, company, stage, last_updated")
        .eq("seeker_id", user!.id)
        .order("last_updated", { ascending: false })
        .limit(4);
      if (recent) {
        setRecentApps(recent.map((a: any) => ({
          company: a.company || "Unknown",
          title: a.job_title || "Unknown Role",
          stage: (a.stage || "applied").charAt(0).toUpperCase() + (a.stage || "applied").slice(1),
          stageColor: stageColorMap[a.stage] || stageColorMap.applied,
          days: `Updated ${daysAgo(a.last_updated || a.created_at)}`,
        })));
      }
      setLoadingApps(false);

      // 3. Fetch saved jobs
      const { data: savedItems } = await supabase
        .from("saved_items")
        .select("job_id")
        .eq("user_id", user!.id)
        .not("job_id", "is", null);
      if (savedItems) {
        setSavedJobIds(new Set(savedItems.map(s => s.job_id).filter(Boolean)));
        setStats(prev => ({ ...prev, savedJobs: savedItems.length }));
      }

      // 4. Fetch recommended jobs
      setLoadingJobs(true);
      const { data } = await supabase
        .from("jobs")
        .select(`id, title, location, salary_rate, job_type, created_at, employer_id`)
        .eq("status", "active")
        .limit(20);

      if (data && data.length > 0) {
        const shuffled = [...data].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 4);

        const empIds = [...new Set(selected.map(j => j.employer_id).filter(Boolean))];
        let companyMap: Record<string, string> = {};
        if (empIds.length > 0) {
          const { data: companiesData } = await supabase.from("companies").select("owner_id, company_name").in("owner_id", empIds);
          companyMap = Object.fromEntries((companiesData || []).map(c => [c.owner_id, c.company_name]));
        }

        const mapped = selected.map(job => {
          let cType = "Contractual";
          if (job.job_type === "Permanent") cType = "Permanent";
          else if (job.job_type === "Internship") cType = "Internship";
          return {
            ...job,
            type: cType,
            company: companyMap[job.employer_id] || "Unknown Company",
            daysAgo: Math.max(0, Math.floor((Date.now() - new Date(job.created_at).getTime()) / 86400000))
          };
        });
        setRecommendedJobs(mapped);
      }
      setLoadingJobs(false);
    }
    fetchDashboardData();
  }, [user?.id]);

  const toggleSaveJob = async (jobId: string) => {
    if (!user?.id) return;
    const isSaved = savedJobIds.has(jobId);
    if (isSaved) {
      setSavedJobIds(prev => { const n = new Set(prev); n.delete(jobId); return n; });
      const { error } = await supabase.from("saved_items").delete().eq("user_id", user.id).eq("job_id", jobId);
      if (error) console.error("Error unsaving job from dashboard:", error);
    } else {
      setSavedJobIds(prev => new Set(prev).add(jobId));
      const { error } = await supabase.from("saved_items").insert({ user_id: user.id, job_id: jobId });
      if (error) console.error("Error saving job from dashboard:", error);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* ── Top bar ── */}
      <div className="bg-white border-b border-gray-200 px-6 lg:px-10 py-5 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-100 border-[1.5px] border-gray-200 flex items-center justify-center flex-shrink-0 text-gray-600">
            <UserCheck size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Hello, {firstName} 👋</h1>
            <p className="text-sm text-gray-400 font-mono mt-0.5">{profession} · {location}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">

          <button onClick={() => setActivePage("jobs")} className="h-9 px-4 text-sm font-semibold bg-gray-900 text-white hover:bg-gray-700 transition flex items-center gap-1.5">
            Browse jobs <ChevronRight size={12} />
          </button>
        </div>
      </div>

      <div className="px-6 lg:px-10 py-6 space-y-7">

        {/* ── Stat tiles ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Applications", value: stats.applications, sub: `${stats.weekApps} this week`, icon: <FileText size={15} />, dark: false },
            { label: "Saved Jobs", value: stats.savedJobs, sub: "Bookmarked", icon: <Star size={15} />, dark: false },
            { label: "Offers", value: stats.offers, sub: "Received", icon: <Award size={15} />, dark: false },
            { label: "Hired", value: stats.hired, sub: "Accepted", icon: <UserCheck size={15} />, dark: true },
          ].map(({ label, value, sub, icon, dark }) => (
            <Card key={label} className={`p-4 ${dark ? "bg-gray-900 border-gray-900" : ""}`}>
              <div className={`flex items-center justify-between mb-3 ${dark ? "text-gray-400" : "text-gray-400"}`}>
                <span className="text-sm font-semibold uppercase tracking-widest">{label}</span>
                {icon}
              </div>
              <p className={`text-4xl font-bold font-mono ${dark ? "text-white" : "text-gray-900"}`}>{value}</p>
              <p className={`text-sm mt-1 ${dark ? "text-gray-400" : "text-gray-400"}`}>{sub}</p>
            </Card>
          ))}
        </div>

        {/* ── Alerts + Profile strength ── */}
        <div className="grid lg:grid-cols-3 gap-4">

          {/* Alerts */}
          <div className="lg:col-span-2">
            <SectionHeader title="Action required" />
            <Card>
              {dynamicAlerts.length === 0 ? (
                <div className="flex items-center gap-3 px-4 py-8 text-center justify-center text-sm text-gray-500 italic">
                  <CheckCircle size={18} className="text-green-500" />
                  You're all caught up! No urgent actions required.
                </div>
              ) : dynamicAlerts.map((a, i) => (
                <div key={i} className="flex items-start gap-3 px-4 py-3.5 border-b border-gray-100 last:border-0">
                  {a.icon}
                  <p className="text-base text-gray-700 leading-snug">{a.text}</p>
                  <ChevronRight size={14} className="ml-auto text-gray-300 flex-shrink-0 mt-0.5" />
                </div>
              ))}
            </Card>
          </div>

          {/* Profile strength */}
          <div>
            <SectionHeader title="Profile strength" action="Edit profile" onActionClick={() => setActivePage("profile")} />
            <Card className="p-4">
              <div className="flex items-end justify-between mb-2">
                <p className="text-4xl font-bold text-gray-900 font-mono">{profileStrength}%</p>
                <p className="text-sm text-gray-400 mb-1">{missingItems.filter(m => m.done).length}/{missingItems.length} complete</p>
              </div>
              <div className="w-full h-1.5 bg-gray-100 mb-4">
                <div className="h-full bg-gray-900 transition-all" style={{ width: `${profileStrength}%` }} />
              </div>
              <div className="space-y-2">
                {missingItems.map(({ label, done }) => (
                  <div key={label} className={`flex items-center gap-2 text-sm ${done ? "text-gray-400 line-through" : "text-gray-700"}`}>
                    <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0 ${done ? "bg-green-600" : "border border-gray-300"}`}>
                      {done && <svg width="8" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" /></svg>}
                    </div>
                    {label}
                  </div>
                ))}
              </div>
            </Card>
          </div>

        </div>

        {/* ── Application tracker ── */}
        <div>
          <SectionHeader title="Recent applications" action="View all" onActionClick={() => setActivePage("applications")} />
          <Card>
            {loadingApps ? (
              <div className="flex items-center justify-center gap-2 px-4 py-8 text-sm text-gray-500">
                <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                Loading applications...
              </div>
            ) : recentApps.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-gray-500">No applications yet.</div>
            ) : (
              recentApps.map((a, i) => (
                <div key={i} className="flex items-center gap-4 px-4 py-3.5 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition cursor-pointer">
                  <div className="w-9 h-9 bg-gray-50 border border-gray-200 flex items-center justify-center text-base font-bold text-gray-900 font-mono flex-shrink-0">
                    {a.company.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-semibold text-gray-900 truncate">{a.title}</p>
                    <p className="text-sm text-gray-400 mt-0.5">{a.company}</p>
                  </div>
                  <span className={`text-sm font-semibold px-2.5 py-1 border flex-shrink-0 ${a.stageColor}`}>{a.stage}</span>
                  <div className="flex items-center gap-1 text-sm text-gray-400 flex-shrink-0 sm:flex">
                    <Clock size={11} /> {a.days}
                  </div>
                  <ChevronRight size={14} className="text-gray-300 flex-shrink-0" />
                </div>
              ))
            )}
          </Card>
        </div>

        {/* ── Job market snapshot ── */}
        <div>
          <SectionHeader title="Job market snapshot" />
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { label: "Corporate roles open", value: "50+", icon: <Briefcase size={13} />, change: "+8% this week" },
              { label: "Casual roles near you", value: "80+", icon: <MapPin size={13} />, change: "+15% this week" },
              { label: "Avg. salary for your role", value: "KES 185K", icon: <TrendingUp size={13} />, change: "↑ from last month" },
            ].map(({ label, value, icon, change }) => (
              <Card key={label} className="p-4 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-gray-400 text-sm">{icon} {label}</div>
                <p className="text-3xl font-bold text-gray-900 font-mono">{value}</p>
                <p className="text-sm text-green-600 font-medium">{change}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* ── Recommended jobs ── */}
        <div>
          <SectionHeader title="Jobs you might like" action="Browse all" onActionClick={() => setActivePage("jobs")} />
          {loadingJobs ? (
            <div className="p-8 text-center text-gray-500 border-[1.5px] border-dashed border-gray-200 bg-white">Loading recommended jobs...</div>
          ) : recommendedJobs.length === 0 ? (
            <div className="p-8 text-center text-gray-500 border-[1.5px] border-dashed border-gray-200 bg-white">No active jobs found at the moment.</div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {recommendedJobs.map(job => (
                <JobCard 
                  key={job.id} 
                  title={job.title} 
                  company={job.company} 
                  location={job.location || "Location not specified"} 
                  salary={job.salary_rate || "N/A"} 
                  type={job.type} 
                  daysAgo={job.daysAgo} 
                  onView={() => setActivePage("jobs")} 
                  saved={savedJobIds.has(job.id)}
                  onToggleSave={() => toggleSaveJob(job.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── Blog preview ── */}
        <div>
          <SectionHeader title="From the blog" />
          <BlogPreview />
        </div>

      </div>
    </div>
  );
}