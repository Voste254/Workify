import { useMemo, useState, useEffect } from "react";
import DashboardCharts from "./Charts/DashboardCharts";
import { useAuth } from "../../../contexts/AuthContext";
import { supabase } from "../../../lib/supabaseClient";

// ── Icons ──────────────────────────────────────────────────────────────────────
const I = (d: string, s = 20, fill = "none") => <svg width={s} height={s} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: d }} />;
const Ico = {
  briefcase: I('<rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>'),
  users: I('<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>'),
  trending: I('<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>'),
  calendar: I('<rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line>'),
  plus: I('<line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line>'),
  search: I('<circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>'),
};

interface EmployerDashboardHomeProps {
  setActivePage?: (page: string) => void;
}

const daysAgo = (d: string) => { 
  const n = Math.floor((Date.now() - new Date(d).getTime()) / 86400000); 
  if (n === 0) return "Today";
  if (n === 1) return "Yesterday";
  return `${n}d ago`; 
};

const mapStageToStatus = (stage: string) => {
  const s = stage?.toLowerCase() || "";
  if (s === "applied") return "New";
  if (s === "screening") return "Reviewing";
  if (s === "interview") return "Interview";
  if (s === "rejected") return "Rejected";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export default function EmployerDashboardHome({ setActivePage }: EmployerDashboardHomeProps) {
  const { profile, user } = useAuth();
  const [recentCandidates, setRecentCandidates] = useState<any[]>([]);
  const [loadingApps, setLoadingApps] = useState(true);
  const [stats, setStats] = useState({
    activeJobs: 0,
    newApps: 0,
    interviews: 0,
    shortlisted: 0
  });

  // Fetch actual stats from supabase
  useEffect(() => {
    async function fetchStats() {
      if (!user?.id) return;
      const [
        { count: activeJobs },
        { count: newApps },
        { count: interviews },
        { count: shortlisted }
      ] = await Promise.all([
        supabase.from("jobs").select("*", { count: "exact", head: true }).eq("employer_id", user.id).eq("status", "active"),
        supabase.from("applications").select("*", { count: "exact", head: true }).eq("employer_id", user.id),
        supabase.from("applications").select("*", { count: "exact", head: true }).eq("employer_id", user.id).eq("stage", "interview"),
        supabase.from("saved_items").select("*", { count: "exact", head: true }).eq("user_id", user.id)
      ]);

      setStats({
        activeJobs: activeJobs || 0,
        newApps: newApps || 0,
        interviews: interviews || 0,
        shortlisted: shortlisted || 0
      });
    }
    fetchStats();
  }, [user?.id]);

  // Fetch actual recent applications from supabase
  useEffect(() => {
    async function fetchRecentApps() {
      if (!user?.id) return;
      setLoadingApps(true);
      const { data, error } = await supabase
        .from("applications")
        .select("*")
        .eq("employer_id", user.id)
        .order("created_at", { ascending: false })
        .limit(4);

      if (!error && data) {
        const mapped = data.map((app: any) => ({
          id: app.id,
          name: app.applicant_name || "Unknown Applicant",
          role: app.job_title || "Unknown Role",
          appliedAt: daysAgo(app.created_at || app.applied_date || new Date().toISOString()),
          status: mapStageToStatus(app.stage),
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(app.applicant_name || "A")}&background=random`
        }));
        setRecentCandidates(mapped);
      }
      setLoadingApps(false);
    }
    fetchRecentApps();
  }, [user?.id]);

  // Stats Data Definition
  const STAT_CARDS = [
    { title: "Active Jobs", value: stats.activeJobs, icon: Ico.briefcase, bgClass: "bg-blue-50", textClass: "text-blue-600" },
    { title: "Total Applications", value: stats.newApps, icon: Ico.users, bgClass: "bg-amber-50", textClass: "text-amber-600" },
    { title: "Interviews", value: stats.interviews, icon: Ico.calendar, bgClass: "bg-lime-100", textClass: "text-lime-600" },
    { title: "Shortlisted", value: stats.shortlisted, icon: Ico.trending, bgClass: "bg-purple-100", textClass: "text-purple-600" },
  ];

  const lineData = useMemo(() => [
    { name: "Mon", applications: 12 },
    { name: "Tue", applications: 19 },
    { name: "Wed", applications: 14 },
    { name: "Thu", applications: 25 },
    { name: "Fri", applications: 32 },
    { name: "Sat", applications: 15 },
    { name: "Sun", applications: 20 },
  ], []);

  const barData = useMemo(() => [
    { name: "Frontend Dev", applications: 45 },
    { name: "UX Designer", applications: 32 },
    { name: "Product Mgr", applications: 28 },
    { name: "Backend Eng", applications: 23 },
  ], []);

  const pieData = useMemo(() => [
    { name: "Under Review", value: 65 },
    { name: "Interviewing", value: 25 },
    { name: "Offered", value: 5 },
    { name: "Rejected", value: 33 },
  ], []);

  return (
    <div className="font-sans min-h-screen bg-gray-50 flex flex-col p-6 gap-8">
      {/* ── Welcome Header ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 border-[1.5px] border-gray-200 rounded-[10px]">
        <div>
           <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
             Good morning, {profile?.first_name || "Employer"}! 👋
           </h1>
           <p className="text-sm text-gray-500 mt-1">Here is what's happening with your job postings today.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button 
            onClick={() => setActivePage?.("Find Talent")}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white text-gray-700 px-4 py-2.5 font-medium text-sm hover:bg-gray-50 transition border border-gray-200 rounded-md cursor-pointer"
          >
            {Ico.search} Browse Talent
          </button>
          <button 
            onClick={() => setActivePage?.("Post Job")}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-gray-900 text-white px-4 py-2.5 font-medium text-sm hover:bg-gray-800 transition border-none rounded-md cursor-pointer"
          >
            {Ico.plus} Post a Job
          </button>
        </div>
      </div>

      {/* ── Key Metrics (KPIs) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map((stat, i) => (
          <div key={i} className="bg-white p-5 cursor-pointer border-[1.5px] border-gray-200 rounded-[10px]">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl flex items-center justify-center ${stat.bgClass} ${stat.textClass}`}>
                {stat.icon}
              </div>
            </div>
            <p className="m-[0_0_4px] text-[13px] font-bold text-gray-400 uppercase tracking-[0.1em]">{stat.title}</p>
            <p className="m-0 text-2xl font-bold text-gray-900 font-mono">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* ── Analytics Charts ── */}
      <div>
         <DashboardCharts lineData={lineData} barData={barData} pieData={pieData} />
      </div>

      {/* ── Recent Activity / Candidates Pipeline ── */}
      <div className="bg-white overflow-hidden mb-6 border-[1.5px] border-gray-200 rounded-[10px]">
         <div className="px-6 py-5 flex justify-between items-center bg-white border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 m-0">Recent Applications</h3>
            <button 
               onClick={() => setActivePage?.("Applicants")}
               className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition cursor-pointer bg-transparent border-none p-0"
            >
               View All →
            </button>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                     <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Candidate</th>
                     <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Applied Role</th>
                     <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Applied Date</th>
                     <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-100">
                  {loadingApps ? (
                     <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500">
                           <div className="flex justify-center items-center gap-2">
                              <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                              Loading applications...
                           </div>
                        </td>
                     </tr>
                  ) : recentCandidates.length === 0 ? (
                     <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500">
                           No recent applications found.
                        </td>
                     </tr>
                  ) : (
                     recentCandidates.map((candidate) => (
                     <tr key={candidate.id} className="hover:bg-gray-50/50 transition">
                        <td className="px-6 py-4 whitespace-nowrap">
                           <div className="flex items-center gap-3">
                              <img src={candidate.avatar} alt={candidate.name} className="w-10 h-10 rounded-full bg-gray-100 object-cover" />
                              <span className="text-sm font-medium text-gray-900">{candidate.name}</span>
                           </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                           <span className="text-sm text-gray-600">{candidate.role}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                           <span className="text-sm text-gray-500">{candidate.appliedAt}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                           <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                              ${candidate.status === 'New' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                candidate.status === 'Reviewing' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                candidate.status === 'Interview' ? 'bg-green-50 text-green-700 border-green-200' :
                                'bg-gray-100 text-gray-700 border-gray-200'}
                           `}>
                              {candidate.status}
                           </span>
                        </td>
                     </tr>
                  )))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}