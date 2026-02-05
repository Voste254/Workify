import { useState } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./Topbar";
import DashboardHome from "./DashboardHome";
import BlogsPage from "./BlogsPage";
import FindJobsPage from "./FindJobs";

const DashboardLayout = () => {
  const [activePage, setActivePage] = useState("dashboard");

  const renderContent = () => {
    switch (activePage) {
      case "dashboard":
        return <DashboardHome />;
      case "jobs":
        return <FindJobsPage/>;
      case "applications":
        return <div className="p-6">Applications Page</div>;
      case "profile":
        return <div className="p-6">Profile Page</div>;
      case "saved":
        return <div className="p-6">Saved Items Page</div>;
      case "blog":
        return <BlogsPage/>;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <div className="flex-1 flex flex-col">
        <TopBar />
        <div className="overflow-y-auto flex-1">{renderContent()}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
