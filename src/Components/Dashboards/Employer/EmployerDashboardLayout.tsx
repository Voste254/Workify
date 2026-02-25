import { useState } from "react";
import EmployerSidebar from "./Sidebar";
import TopBar from "../Employee/Topbar";
import Home from "./EmployerDashboardHome";

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
  | "Settings";

const EmployerDashboardLayout = () => {
  const [activePage, setActivePage] =
    useState<ActivePage>("Dashboard");

  const renderContent = () => {
    switch (activePage) {
      case "Dashboard":
        return <Home/>;

      case "My Jobs":
        return <div className="p-6">My Jobs Page</div>;

      case "Post Job":
        return <div className="p-6">Post Job Page</div>;

      case "Applicants":
        return <div className="p-6">Applicants Management</div>;

      case "Find Talent":
        return <div className="p-6">Find Talent Page</div>;

      case "Reports":
        return <div className="p-6">Reports & Analytics</div>;

      case "Messages":
        return <div className="p-6">Messages Page</div>;

      case "Notifications":
        return <div className="p-6">Notifications Page</div>;

      case "Saved":
        return <div className="p-6">Saved Candidates</div>;

      case "Blog":
        return <div className="p-6">Blog & Education</div>;

      case "Settings":
        return <div className="p-6">Account Settings</div>;

      default:
        return <div className="p-6">Employer Dashboard</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <EmployerSidebar
        setActiveComponent={setActivePage}
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