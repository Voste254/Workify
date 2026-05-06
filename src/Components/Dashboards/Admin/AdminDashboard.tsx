import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { useAuth } from "../../../contexts/AuthContext";
import { 
  Users, Briefcase, FileText, ShieldAlert, Search, 
  Trash2, UserPlus, Power, CheckCircle, XCircle,
  LayoutDashboard, Settings, LogOut,
  TrendingUp, Activity
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// ── Types ──────────────────────────────────────────────────────────────────────
type AdminTab = "overview" | "users" | "jobs" | "support" | "create-account";

interface Stats {
  totalUsers: number;
  totalJobs: number;
  totalApplications: number;
  activeUsers: number;
}

// ── Components ─────────────────────────────────────────────────────────────────

const StatCard = ({ icon: Icon, label, value, color }: { icon: any, label: string, value: number | string, color: string }) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
      <Icon size={24} className="text-white" />
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{label}</p>
      <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
    </div>
  </div>
);

export default function AdminDashboard() {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [stats, setStats] = useState<Stats>({ totalUsers: 0, totalJobs: 0, totalApplications: 0, activeUsers: 0 });
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [supportRequests, setSupportRequests] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Create account form state
  const [newAccount, setNewAccount] = useState({ firstName: "", lastName: "", email: "", password: "", role: "seeker" as "seeker" | "employer" });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [
        { count: userCount, error: userErr },
        { count: jobCount, error: jobErr },
        { count: appCount, error: appErr },
        { data: usersData, error: usersErr },
        { data: jobsData, error: jobsErr },
        { data: supportData, error: supportErr }
      ] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("jobs").select("*", { count: "exact", head: true }),
        supabase.from("applications").select("*", { count: "exact", head: true }),
        supabase.from("profiles").select("*").order("created_at", { ascending: false }),
        supabase.from("jobs").select("*").order("created_at", { ascending: false }),
        supabase.from("support_requests").select("*").order("created_at", { ascending: false })
      ]);

      if (userErr) console.error("User Fetch Error:", userErr.message);
      if (jobErr) console.error("Job Fetch Error:", jobErr.message);
      if (supportErr) console.error("Support Fetch Error:", supportErr.message);

      setStats({
        totalUsers: userCount || 0,
        totalJobs: jobCount || 0,
        totalApplications: appCount || 0,
        activeUsers: usersData?.filter(u => u.status !== "deactivated").length || 0
      });
      setUsers(usersData || []);
      setJobs(jobsData || []);
      setSupportRequests(supportData || []);
    } catch (err) {
      console.error("Admin Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === "deactivated" ? "active" : "deactivated";
    const { error } = await supabase.from("profiles").update({ status: newStatus }).eq("id", userId);
    if (!error) {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: newStatus } : u));
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm("Are you sure you want to delete this job posting?")) return;
    const { error } = await supabase.from("jobs").delete().eq("id", jobId);
    if (!error) {
      setJobs(prev => prev.filter(j => j.id !== jobId));
    }
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    const { error } = await supabase.auth.signUp({
      email: newAccount.email,
      password: newAccount.password,
      options: {
        data: {
          first_name: newAccount.firstName,
          last_name: newAccount.lastName,
          role: [newAccount.role]
        }
      }
    });

    if (error) {
      alert("Error: " + error.message);
    } else {
      alert("Account created! Verification email sent.");
      setNewAccount({ firstName: "", lastName: "", email: "", password: "", role: "seeker" });
    }
    setCreating(false);
  };

  const filteredUsers = users.filter(u => 
    `${u.first_name} ${u.last_name} ${u.email}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredJobs = jobs.filter(j => 
    `${j.title} ${j.company_name || ""}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSupport = supportRequests.filter(s => 
    `${s.subject} ${s.email} ${s.message}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!profile?.is_admin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md w-full">
          <ShieldAlert size={64} className="mx-auto text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-500 mb-6">You do not have the necessary permissions to view this dashboard.</p>
          
          <div className="bg-gray-50 p-4 rounded-xl text-left mb-6 border border-gray-100">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Current Session Info</p>
            <p className="text-xs text-gray-600 truncate"><strong>Email:</strong> {profile?.email || "Unknown"}</p>
            <p className="text-xs text-gray-600 truncate mt-1"><strong>User ID:</strong> {profile?.id || "Unknown"}</p>
            <p className="text-xs text-gray-600 mt-1"><strong>Admin Status:</strong> <span className="text-red-500 font-bold">{String(profile?.is_admin)}</span></p>
          </div>

          <div className="space-y-3">
            <button onClick={() => window.location.reload()} className="w-full py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors">
              Refresh Permissions
            </button>
            <button onClick={() => navigate("/")} className="w-full py-3 bg-white text-gray-700 border border-gray-200 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
              Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-8 border-b border-gray-100 flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
            <span className="text-white font-black text-xl italic">W</span>
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">Workify Admin</span>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {[
            { id: "overview", icon: LayoutDashboard, label: "Overview" },
            { id: "users", icon: Users, label: "User Management" },
            { id: "jobs", icon: Briefcase, label: "Job Management" },
            { id: "support", icon: ShieldAlert, label: "Support Requests" },
            { id: "create-account", icon: UserPlus, label: "Create Account" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as AdminTab)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === item.id 
                  ? "bg-gray-900 text-white shadow-lg shadow-gray-200" 
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all">
            <Settings size={20} />
            System Settings
          </button>
          <button 
            onClick={signOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {activeTab === "overview" && "System Overview"}
              {activeTab === "users" && "User Management"}
              {activeTab === "jobs" && "Job Management"}
              {activeTab === "support" && "Support Requests"}
              {activeTab === "create-account" && "Create New Account"}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">Welcome back, {profile?.first_name || "Admin"}</p>
          </div>
          
          {(activeTab === "users" || activeTab === "jobs" || activeTab === "support") && (
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-gray-900 transition-all"
              />
            </div>
          )}
        </header>

        <div className="p-8">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={Users} label="Total Users" value={stats.totalUsers} color="bg-blue-600" />
                <StatCard icon={Briefcase} label="Active Jobs" value={stats.totalJobs} color="bg-emerald-600" />
                <StatCard icon={FileText} label="Applications" value={stats.totalApplications} color="bg-amber-600" />
                <StatCard icon={Activity} label="Active Sessions" value={stats.activeUsers} color="bg-indigo-600" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <TrendingUp className="text-emerald-500" size={20} />
                    Platform Activity
                  </h3>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <p className="text-gray-400 text-sm italic">Activity chart coming soon</p>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">Recent Applications</h3>
                  <div className="space-y-4">
                    {stats.totalApplications === 0 ? (
                      <p className="text-gray-400 text-center py-8 text-sm italic">No applications yet</p>
                    ) : (
                      <p className="text-gray-400 text-center py-8 text-sm italic">Application feed loading...</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* User Management Tab */}
          {activeTab === "users" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Roles</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-900 border border-gray-200">
                            {u.first_name?.[0]}{u.last_name?.[0]}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900">{u.first_name} {u.last_name}</p>
                            <p className="text-xs text-gray-500">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1.5">
                          {u.role?.map((r: string) => (
                            <span key={r} className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-100">
                              {r}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600">{u.seeker_location || u.company_location || "—"}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                          u.status === "deactivated" 
                            ? "bg-red-50 text-red-600 border border-red-100" 
                            : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                        }`}>
                          {u.status === "deactivated" ? <XCircle size={14} /> : <CheckCircle size={14} />}
                          {u.status === "deactivated" ? "Deactivated" : "Active"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleDeactivate(u.id, u.status)}
                          className={`p-2 rounded-lg transition-colors ${
                            u.status === "deactivated" 
                              ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100" 
                              : "bg-red-50 text-red-600 hover:bg-red-100"
                          }`}
                          title={u.status === "deactivated" ? "Reactivate" : "Deactivate"}
                        >
                          <Power size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Job Management Tab */}
          {activeTab === "jobs" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Job Title</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Company</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredJobs.map((j) => (
                    <tr key={j.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-gray-900">{j.title}</p>
                        <p className="text-xs text-gray-500">{new Date(j.created_at).toLocaleDateString()}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{j.company_name || "—"}</td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-gray-100 text-gray-600 border border-gray-200">
                          {j.job_type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleDeleteJob(j.id)}
                          className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                          title="Delete Posting"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Support Requests Tab */}
          {activeTab === "support" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">User / Email</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Subject</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Message</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredSupport.length === 0 ? (
                    <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-400 text-sm italic">No support requests found.</td></tr>
                  ) : filteredSupport.map((s) => (
                    <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-gray-900">{s.name || "Anonymous"}</p>
                        <p className="text-xs text-gray-500">{s.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-100">
                          {s.subject}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600 line-clamp-2 max-w-xs">{s.message}</p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <p className="text-xs text-gray-400 font-mono">{new Date(s.created_at).toLocaleDateString()}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Create Account Tab */}
          {activeTab === "create-account" && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Manually Create User</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Fill out the details below to create a new user account. A verification email will be sent to the user's email address.
                  </p>
                </div>

                <form onSubmit={handleCreateAccount} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">First Name</label>
                      <input 
                        required
                        type="text" 
                        value={newAccount.firstName}
                        onChange={e => setNewAccount({...newAccount, firstName: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-gray-900 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Last Name</label>
                      <input 
                        required
                        type="text" 
                        value={newAccount.lastName}
                        onChange={e => setNewAccount({...newAccount, lastName: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-gray-900 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email Address</label>
                    <input 
                      required
                      type="email" 
                      value={newAccount.email}
                      onChange={e => setNewAccount({...newAccount, email: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-gray-900 outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Initial Password</label>
                    <input 
                      required
                      type="password" 
                      value={newAccount.password}
                      onChange={e => setNewAccount({...newAccount, password: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-gray-900 outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Initial Role</label>
                    <div className="flex gap-4">
                      {["seeker", "employer"].map(r => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setNewAccount({...newAccount, role: r as any})}
                          className={`flex-1 py-3 rounded-xl text-sm font-bold border transition-all ${
                            newAccount.role === r 
                              ? "bg-gray-900 text-white border-gray-900" 
                              : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
                          }`}
                        >
                          {r.charAt(0).toUpperCase() + r.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button 
                    disabled={creating}
                    type="submit" 
                    className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 disabled:bg-gray-400 transition-all shadow-lg shadow-gray-200 flex items-center justify-center gap-2"
                  >
                    {creating && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                    {creating ? "Creating..." : "Create Account"}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
