import { MapPin, Briefcase, TrendingUp, Clock, ChevronRight, Bell, CheckCircle, AlertCircle, FileText, Star } from "lucide-react";
import JobCard from "./JobCard";
import BlogPreview from "./BlogPreview";

// TODO: fetch all data from Supabase
const USER = { name: "Okutah Voste", profession: "Full Stack Developer", location: "Nairobi, Kenya", avatar: "https://randomuser.me/api/portraits/men/32.jpg", profileStrength: 72 };

const STATS = [
  { label: "Applications",  value: 12,   sub: "3 this week",      icon: <FileText size={15}/>,  dark: false },
  { label: "Profile Views", value: 84,   sub: "+12 from last week", icon: <TrendingUp size={15}/>, dark: false },
  { label: "Saved Jobs",    value: 7,    sub: "2 closing soon",    icon: <Star size={15}/>,       dark: false },
  { label: "Interviews",    value: 2,    sub: "Next: Thursday",    icon: <Briefcase size={15}/>,  dark: true  },
];

const APPLICATIONS = [
  { company: "Safaricom PLC",    title: "Senior Data Analyst",   stage: "Interview",  stageColor: "bg-blue-50 text-blue-700 border-blue-200",    days: "Updated 2d ago" },
  { company: "Andela",           title: "Backend Engineer",      stage: "Offer",      stageColor: "bg-green-50 text-green-700 border-green-200",  days: "Updated 1d ago" },
  { company: "Nation Media",     title: "Graphic Designer",      stage: "Assessment", stageColor: "bg-purple-50 text-purple-700 border-purple-200", days: "Updated 4d ago" },
  { company: "Equity Bank",      title: "Marketing Manager",     stage: "Applied",    stageColor: "bg-gray-100 text-gray-600 border-gray-200",    days: "Updated 6d ago" },
];

const ALERTS = [
  { icon: <AlertCircle size={14} className="text-amber-500 flex-shrink-0"/>, text: "Portfolio task due tomorrow — Nation Media Group" },
  { icon: <Bell size={14} className="text-blue-500 flex-shrink-0"/>,         text: "Interview confirmed: Safaricom PLC · Thu 10:00 AM" },
  { icon: <CheckCircle size={14} className="text-green-600 flex-shrink-0"/>, text: "Andela sent you an offer letter to review" },
];

const MISSING: { label: string; done: boolean }[] = [
  { label: "Upload your CV",              done: true  },
  { label: "Add a profile photo",         done: true  },
  { label: "List at least 3 skills",      done: true  },
  { label: "Set expected pay rate",       done: false },
  { label: "Write a bio",                 done: false },
  { label: "Add your available days",     done: false },
];

// ── Primitives ────────────────────────────────────────────────────────────────
const SectionHeader = ({ title, action, href = "#" }: { title: string; action?: string; href?: string }) => (
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-base font-bold text-gray-900 uppercase tracking-widest">{title}</h2>
    {action && <a href={href} className="text-sm font-semibold text-gray-500 hover:text-gray-900 flex items-center gap-0.5 transition">{action} <ChevronRight size={12}/></a>}
  </div>
);

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white border-[1.5px] border-gray-200 ${className}`}>{children}</div>
);

// ── Dashboard ─────────────────────────────────────────────────────────────────
export default function Dashboard() {
  return (
    <div className="bg-gray-50 min-h-screen">

      {/* ── Top bar ── */}
      <div className="bg-white border-b border-gray-200 px-6 lg:px-10 py-5 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <img src={USER.avatar} alt="avatar" className="w-10 h-10 object-cover border-[1.5px] border-gray-200 flex-shrink-0"/>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Good morning, {USER.name.split(" ")[0]} 👋</h1>
            <p className="text-sm text-gray-400 font-mono mt-0.5">{USER.profession} · {USER.location}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {ALERTS.length > 0 && (
            <div className="relative">
              <button className="h-9 w-9 flex items-center justify-center border border-gray-200 bg-white hover:border-gray-400 transition">
                <Bell size={15} className="text-gray-600"/>
              </button>
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white text-[11px] font-bold flex items-center justify-center rounded-full">{ALERTS.length}</span>
            </div>
          )}
          <a href="#" className="h-9 px-4 text-sm font-semibold bg-gray-900 text-white hover:bg-gray-700 transition flex items-center gap-1.5">
            Browse jobs <ChevronRight size={12}/>
          </a>
        </div>
      </div>

      <div className="px-6 lg:px-10 py-6 space-y-7">

        {/* ── Stat tiles ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map(({ label, value, sub, icon, dark }) => (
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
            <SectionHeader title="Action required"/>
            <Card>
              {ALERTS.map((a, i) => (
                <div key={i} className="flex items-start gap-3 px-4 py-3.5 border-b border-gray-100 last:border-0">
                  {a.icon}
                  <p className="text-base text-gray-700 leading-snug">{a.text}</p>
                  <ChevronRight size={14} className="ml-auto text-gray-300 flex-shrink-0 mt-0.5"/>
                </div>
              ))}
            </Card>
          </div>

          {/* Profile strength */}
          <div>
            <SectionHeader title="Profile strength" action="Edit profile" href="#"/>
            <Card className="p-4">
              <div className="flex items-end justify-between mb-2">
                <p className="text-4xl font-bold text-gray-900 font-mono">{USER.profileStrength}%</p>
                <p className="text-sm text-gray-400 mb-1">{MISSING.filter(m => m.done).length}/{MISSING.length} complete</p>
              </div>
              <div className="w-full h-1.5 bg-gray-100 mb-4">
                <div className="h-full bg-gray-900 transition-all" style={{ width: `${USER.profileStrength}%` }}/>
              </div>
              <div className="space-y-2">
                {MISSING.map(({ label, done }) => (
                  <div key={label} className={`flex items-center gap-2 text-sm ${done ? "text-gray-400 line-through" : "text-gray-700"}`}>
                    <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0 ${done ? "bg-green-600" : "border border-gray-300"}`}>
                      {done && <svg width="8" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5"/></svg>}
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
          <SectionHeader title="Recent applications" action="View all" href="#"/>
          <Card>
            {APPLICATIONS.map((a, i) => (
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
                  <Clock size={11}/> {a.days}
                </div>
                <ChevronRight size={14} className="text-gray-300 flex-shrink-0"/>
              </div>
            ))}
          </Card>
        </div>

        {/* ── Job market snapshot ── */}
        <div>
          <SectionHeader title="Job market snapshot" />
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { label: "Corporate roles open",   value: "3,200+", icon: <Briefcase size={13}/>, change: "+8% this week" },
              { label: "Casual roles near you",  value: "1,080+", icon: <MapPin size={13}/>,    change: "+15% this week" },
              { label: "Avg. salary for your role", value: "KES 185K", icon: <TrendingUp size={13}/>, change: "↑ from last month" },
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
          <SectionHeader title="Jobs you might like" action="Browse all" href="#"/>
          <div className="grid md:grid-cols-2 gap-4">
            <JobCard title="Frontend Developer"  company="Nairobi Tech Ltd"    location="Nairobi County"     salary="120,000–180,000" type="Permanent"   rating={4.5} daysAgo={2}/>
            <JobCard title="Data Analyst Intern" company="Mombasa Analytics"   location="Mombasa County"     salary="30,000–50,000"   type="Internship"  rating={4.2} daysAgo={5}/>
            <JobCard title="Plumber"             company="Kisumu Contractors"   location="Kisumu County"      salary="2,500/day"       type="Contractual" rating={4.7} daysAgo={1}/>
            <JobCard title="Backend Engineer"    company="Eldoret Systems"      location="Uasin Gishu County" salary="150,000–220,000" type="Permanent"   rating={4.8} daysAgo={3}/>
          </div>
        </div>

        {/* ── Blog preview ── */}
        <div>
          <SectionHeader title="From the blog" action="Read all articles" href="#"/>
          <BlogPreview/>
        </div>

      </div>
    </div>
  );
}