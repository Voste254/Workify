import { useMemo } from "react";
import DashboardCharts from "./Charts/DashboardCharts";
import { useAuth } from "../../../contexts/AuthContext";

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

export default function EmployerDashboardHome({ setActivePage }: EmployerDashboardHomeProps) {
  const { profile } = useAuth();

  // Mock Data Definition
  const STATS = [
    { title: "Active Jobs", value: "3", icon: Ico.briefcase, bg: "#EFF6FF", text: "#2563EB" },
    { title: "New Applications", value: "128", icon: Ico.users, bg: "#FEF3C7", text: "#D97706" },
    { title: "Interviews Scheduled", value: "14", icon: Ico.calendar, bg: "#ECFCCB", text: "#65A30D" },
    { title: "Profile Views", value: "2.4k", icon: Ico.trending, bg: "#EDE9FE", text: "#7C3AED" },
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

  const recentCandidates = [
    { id: 1, name: "Alice Johnson", role: "Frontend Developer", appliedAt: "2 hours ago", status: "New", avatar: "https://i.pravatar.cc/150?u=alice" },
    { id: 2, name: "Bob Smith", role: "UX Designer", appliedAt: "4 hours ago", status: "Reviewing", avatar: "https://i.pravatar.cc/150?u=bob" },
    { id: 3, name: "Charlie Davis", role: "Product Manager", appliedAt: "Yesterday", status: "Interview", avatar: "https://i.pravatar.cc/150?u=charlie" },
    { id: 4, name: "Diana Prince", role: "Backend Engineer", appliedAt: "2 days ago", status: "Rejected", avatar: "https://i.pravatar.cc/150?u=diana" },
  ];

  return (
    <div className="font-sans min-h-screen bg-gray-50 flex flex-col p-6 gap-8">
      {/* ── Welcome Header ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6" style={{ border: "1.5px solid #E5E7EB", borderRadius: 10 }}>
        <div>
           <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
             Good morning, {profile?.first_name || "Employer"}! 👋
           </h1>
           <p className="text-sm text-gray-500 mt-1">Here is what's happening with your job postings today.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button 
            onClick={() => setActivePage?.("Find Talent")}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white text-gray-700 px-4 py-2.5 font-medium text-sm hover:bg-gray-50 transition"
            style={{ border: "1px solid #E5E7EB", borderRadius: 6 }}
          >
            {Ico.search} Browse Talent
          </button>
          <button 
            onClick={() => setActivePage?.("Post Job")}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-gray-900 text-white px-4 py-2.5 font-medium text-sm hover:bg-gray-800 transition"
            style={{ border: "none", borderRadius: 6 }}
          >
            {Ico.plus} Post a Job
          </button>
        </div>
      </div>

      {/* ── Key Metrics (KPIs) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat, i) => (
          <div key={i} className="bg-white p-5 cursor-pointer" style={{ border: "1.5px solid #E5E7EB", borderRadius: 10 }}>
            <div className="flex justify-between items-start mb-4">
              <div style={{ backgroundColor: stat.bg, color: stat.text }} className="p-3 rounded-xl flex items-center justify-center">
                {stat.icon}
              </div>
            </div>
            <p style={{ margin: "0 0 4px", fontSize: 13, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.1em" }}>{stat.title}</p>
            <p style={{ margin: 0, fontSize: 24, fontWeight: 700, color: "#111827", fontFamily: "'DM Mono', monospace" }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* ── Analytics Charts ── */}
      <div>
         <DashboardCharts lineData={lineData} barData={barData} pieData={pieData} />
      </div>

      {/* ── Recent Activity / Candidates Pipeline ── */}
      <div className="bg-white overflow-hidden mb-6" style={{ border: "1.5px solid #E5E7EB", borderRadius: 10 }}>
         <div className="px-6 py-5 flex justify-between items-center bg-white" style={{ borderBottom: "1px solid #E5E7EB" }}>
            <h3 className="text-lg font-bold text-gray-900">Recent Applications</h3>
            <button 
               onClick={() => setActivePage?.("Applicants")}
               className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition"
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
                  {recentCandidates.map((candidate) => (
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
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}