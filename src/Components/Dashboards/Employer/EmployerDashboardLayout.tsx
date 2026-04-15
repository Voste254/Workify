import { useState } from "react";
import EmployerSidebar from "./Sidebar";
import TopBar from "../Employee/Topbar";
import Home from "./EmployerDashboardHome";
import PostJobs from "./PostJobs";
import MyJobs from "./MyJobs";
import type { Job } from "./MyJobs";
import FindTalent from "./FindTalent";
import Reports from "./Reports";
import Messages from "./Messages";
import Settings from "./Settings";
import Applicants from "./Applicants";
import Notifications from "./Notifications";
import EmployerSaved from "./EmployerSaved";
import EmployerBlog from "./EmployerBlog";
import EmployerProfile from "./EmployerProfile";

/* match sidebar types */
type ActivePage =
  | "Dashboard"
  | "My Jobs"
  | "Post Job"
  | "Applicants"
  | "Find Talent"
  | "Reports"
  | "Messages"
  | "Notifications"
  | "Saved"
  | "Blog"
  | "Profile"
  | "Settings";

const EmployerDashboardLayout = () => {
  const [activePage, setActivePage] = useState<ActivePage>("Dashboard");
  const [editingJob, setEditingJob] = useState<Job | null>(null);

  const navigate = (page: ActivePage) => {
    // Clear editingJob when going anywhere other than Post Job
    if (page !== "Post Job") setEditingJob(null);
    setActivePage(page);
  };

  const renderContent = () => {
    switch (activePage) {
      case "Dashboard":
        return <Home setActivePage={(page) => navigate(page as ActivePage)} />;

      case "My Jobs":
        return (
          <MyJobs
            setActivePage={(page) => navigate(page as ActivePage)}
            onEditJob={(job) => { setEditingJob(job); }}
          />
        );

      case "Post Job":
        return <PostJobs editingJob={editingJob} onSaved={() => { setEditingJob(null); navigate("My Jobs"); }} />;

      case "Applicants":
        return <Applicants/> ;

      case "Find Talent":
        return <FindTalent/>;

      case "Reports":
        return <Reports/>;

      case "Messages":
        return <Messages/>;

      case "Notifications":
        return <Notifications/>;

      case "Saved":
        return <EmployerSaved/>;

      case "Blog":
        return <EmployerBlog/>;

      case "Profile":
        return <EmployerProfile/>;

      case "Settings":
        return <Settings/>;

      default:
        return <div className="p-6">Employer Dashboard</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <EmployerSidebar
        activeComponent={activePage}
        setActiveComponent={navigate}
      />

      <div className="flex-1 flex flex-col">
        <TopBar />
        <div className="overflow-y-auto flex-1">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboardLayout;