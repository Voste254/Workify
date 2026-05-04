import { useState, useEffect, useMemo, useRef } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { useAuth } from "../../../contexts/AuthContext";
import DashboardCharts from "./Charts/DashboardCharts";
// @ts-ignore
import html2pdf from "html2pdf.js";

// ── Icons ──────────────────────────────────────────────────────────────────────
const I = (d: string, s = 14, fill = "none") => <svg width={s} height={s} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: d }} />;
const Ico = {
  briefcase: I('<rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>', 16),
  users: I('<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>', 16),
  calendar: I('<rect width="18" height="18" x="3" y="4" rx="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/>', 16),
  trending: I('<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>', 16),
  download: I('<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>', 14)
};

// ── Shared styles ──────────────────────────────────────────────────────────────
const selClass = "font-sans px-2.5 py-[7px] border border-gray-200 rounded-md text-sm text-gray-700 bg-gray-50 cursor-pointer outline-none focus:bg-white focus:border-gray-300 transition-colors";

type ReportType = "overview" | "applications" | "jobs";

export default function Reports() {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState("30d");
  const [reportType, setReportType] = useState<ReportType>("overview");
  
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      setLoading(true);
      const [jobsRes, appsRes] = await Promise.all([
        supabase.from("jobs").select("*").eq("employer_id", user.id),
        supabase.from("applications").select("*").eq("employer_id", user.id)
      ]);
      if (jobsRes.data) setJobs(jobsRes.data);
      if (appsRes.data) setApplications(appsRes.data);
      setLoading(false);
    };
    fetchData();
  }, [user]);

  // Determine cutoff date based on timeRange
  const cutoffDate = useMemo(() => {
    const d = new Date();
    if (timeRange === "7d") d.setDate(d.getDate() - 7);
    else if (timeRange === "30d") d.setDate(d.getDate() - 30);
    else if (timeRange === "90d") d.setDate(d.getDate() - 90);
    else if (timeRange === "1y") d.setFullYear(d.getFullYear() - 1);
    return d;
  }, [timeRange]);

  // Aggregate stats
  const { stats, topJobs, lineData, barData, pieData } = useMemo(() => {
    const validApps = applications.filter(a => new Date(a.created_at) >= cutoffDate);
    const validJobs = jobs.filter(j => new Date(j.created_at) >= cutoffDate);

    // Basic Stats
    const activeJobsCount = jobs.filter(j => j.status === "active").length; // Active jobs isn't strictly time-bound but good for overview
    const totalApplicants = validApps.length;
    const interviewsCount = validApps.filter(a => a.stage === "interview").length;
    
    const aggregatedStats = [
      { title: "Active Jobs", value: activeJobsCount.toString(), change: "", trend: "up", icon: Ico.briefcase, bgClass: "bg-gray-100", textClass: "text-gray-900" },
      { title: "New Applicants", value: totalApplicants.toString(), change: `in ${timeRange}`, trend: "up", icon: Ico.users, bgClass: "bg-amber-100", textClass: "text-amber-600" },
      { title: "Interviews", value: interviewsCount.toString(), change: `in ${timeRange}`, trend: "up", icon: Ico.calendar, bgClass: "bg-blue-100", textClass: "text-blue-600" },
      { title: "Jobs Posted", value: validJobs.length.toString(), change: `in ${timeRange}`, trend: "up", icon: Ico.trending, bgClass: "bg-purple-100", textClass: "text-purple-600" },
    ];

    // Top Jobs by applications
    const jobAppCounts: Record<string, { role: string, apps: number }> = {};
    jobs.forEach(j => { jobAppCounts[j.id] = { role: j.title, apps: 0 }; });
    validApps.forEach(a => {
      if (a.job_title) {
        // Fallback matching if job_id isn't reliable
        const matchedJob = Object.values(jobAppCounts).find(j => j.role === a.job_title);
        if (matchedJob) matchedJob.apps += 1;
        else jobAppCounts[a.id] = { role: a.job_title, apps: 1 };
      }
    });

    const topJobsSorted = Object.values(jobAppCounts)
      .sort((a, b) => b.apps - a.apps)
      .slice(0, 5);

    // Charts Data
    // Line Chart: Apps over time (grouped by day if 7d/30d, by month if 90d/1y)
    const lineDataMap: Record<string, number> = {};
    validApps.forEach(a => {
      const date = new Date(a.created_at);
      const key = timeRange === "1y" || timeRange === "90d" 
        ? date.toLocaleDateString('default', { month: 'short' })
        : date.toLocaleDateString('default', { month: 'short', day: 'numeric' });
      lineDataMap[key] = (lineDataMap[key] || 0) + 1;
    });
    const lineDataArr = Object.keys(lineDataMap).map(k => ({ name: k, applications: lineDataMap[k] }));

    // Bar Chart: Applications by Job
    const barDataArr = topJobsSorted.map(j => ({ name: j.role.substring(0, 15) + (j.role.length > 15 ? '...' : ''), applications: j.apps }));

    // Pie Chart: Funnel
    const stages = { applied: 0, screening: 0, interview: 0, offer: 0, hired: 0, rejected: 0 };
    validApps.forEach(a => {
      const s = a.stage as keyof typeof stages;
      if (stages[s] !== undefined) stages[s]++;
    });
    const pieDataArr = [
      { name: "Applied", value: stages.applied },
      { name: "Screening", value: stages.screening },
      { name: "Interview", value: stages.interview },
      { name: "Offer", value: stages.offer },
      { name: "Hired", value: stages.hired },
      { name: "Rejected", value: stages.rejected },
    ].filter(d => d.value > 0);

    return { stats: aggregatedStats, topJobs: topJobsSorted, lineData: lineDataArr, barData: barDataArr, pieData: pieDataArr };
  }, [jobs, applications, cutoffDate, timeRange]);

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;
    setIsGeneratingPDF(true);
    
    const element = reportRef.current;
    
    // Add a class temporarily to force better print rendering
    element.classList.add("printing-pdf");
    
    const opt = {
      margin:       0.3,
      filename:     `workify_report_${reportType}_${timeRange}.pdf`,
      image:        { type: 'jpeg' as const, quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, logging: false },
      jsPDF:        { unit: 'in', format: 'a4' as const, orientation: 'landscape' as const }
    };

    try {
      await html2pdf().set(opt).from(element).save();
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      element.classList.remove("printing-pdf");
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="font-sans bg-gray-50 min-h-screen flex flex-col">

      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3.5 flex items-center justify-between z-10 sticky top-0">
        <div>
          <h1 className="m-0 text-xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="m-0 text-sm text-gray-400 font-mono">Track hiring performance</p>
        </div>
        <div className="flex gap-2.5">
          <select value={reportType} onChange={e => setReportType(e.target.value as ReportType)} className={selClass}>
            <option value="overview">Overview Report</option>
            <option value="applications">Applications Report</option>
            <option value="jobs">Job Performance Report</option>
          </select>
          <select value={timeRange} onChange={e => setTimeRange(e.target.value)} className={selClass}>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 3 Months</option>
            <option value="1y">This Year</option>
          </select>
          <button 
            onClick={handleDownloadPDF} 
            disabled={isGeneratingPDF || loading}
            className={`${selClass} bg-gray-900 text-white border-none flex items-center gap-1.5 font-semibold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {Ico.download} {isGeneratingPDF ? "Generating..." : "Download PDF"}
          </button>
        </div>
      </div>

      {/* Content to be printed */}
      <div className="p-6 flex flex-col gap-6" ref={reportRef}>
        
        {loading ? (
          <div className="flex items-center justify-center min-h-[300px]">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {/* Header only visible in PDF or for context within the component */}
            <div className="mb-4 pb-4 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 capitalize">{reportType} Report</h2>
              <p className="text-gray-500">Generated on {new Date().toLocaleDateString()} for the {timeRange === '1y' ? 'past year' : `past ${timeRange}`}</p>
            </div>

            {/* Overview Stats - Show in Overview and Applications */}
            {(reportType === "overview" || reportType === "applications") && (
              <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
                {stats.map((stat, i) => (
                  <div key={i} className="bg-white border-[1.5px] border-gray-200 rounded-[10px] p-5 break-inside-avoid">
                    <div className="flex justify-between items-start mb-4">
                      <div className={`${stat.bgClass} ${stat.textClass} p-2 rounded-lg flex items-center justify-center`}>
                        {stat.icon}
                      </div>
                    </div>
                    <p className="m-[0_0_4px] text-sm font-semibold text-gray-500">{stat.title}</p>
                    <p className="m-[0_0_8px] text-[26px] font-bold text-gray-900 font-mono">{stat.value}</p>
                    <p className={`m-0 text-[13px] font-semibold text-gray-500`}>{stat.change}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Charts & Tables */}
            <div className={`grid gap-6 ${reportType === "overview" ? "grid-cols-1 lg:grid-cols-[2fr_1fr]" : "grid-cols-1"}`}>
              
              {/* Charts Section */}
              <div className="break-inside-avoid w-full">
                <DashboardCharts 
                  lineData={reportType !== "jobs" ? lineData : []} 
                  barData={reportType !== "applications" ? barData : []} 
                  pieData={reportType !== "jobs" ? pieData : []} 
                />
              </div>

              {/* Top Jobs Table - Show in Overview and Jobs */}
              {(reportType === "overview" || reportType === "jobs") && (
                <div className="bg-white border-[1.5px] border-gray-200 rounded-[10px] p-5 break-inside-avoid h-fit mt-6 lg:mt-0">
                  <h3 className="m-[0_0_20px] text-base font-bold text-gray-900 uppercase tracking-[0.05em]">Top Job Postings</h3>
                  {topJobs.length === 0 ? (
                    <p className="text-sm text-gray-500 italic text-center py-4">No jobs data for this period.</p>
                  ) : (
                    <div className="flex flex-col gap-4">
                      {topJobs.map((job, idx) => (
                        <div key={idx} className={`flex justify-between items-center pb-4 ${idx < topJobs.length - 1 ? "border-b border-gray-200" : "border-none"}`}>
                          <div>
                            <p className="m-[0_0_4px] text-[15px] font-semibold text-gray-900">{job.role}</p>
                            <p className="m-0 text-[13px] text-gray-500 font-mono">{job.apps > 0 ? "Receiving steady applications" : "No recent applications"}</p>
                          </div>
                          <div className="text-right">
                            <p className="m-[0_0_2px] text-base font-bold text-gray-900 font-mono">{job.apps}</p>
                            <p className="m-0 text-xs text-gray-400 uppercase">Applicants</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>
          </>
        )}
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .printing-pdf {
          background: white !important;
          width: 1100px !important;
          padding: 40px !important;
        }
      `}} />
    </div>
  );
}
