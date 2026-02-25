import { useState } from "react";
import Sidebar from "../Employee/Sidebar";
import TopBar from "../Employee/Topbar";


const EmployerDashboardLayout = () => {
  const [activePage, setActivePage] = useState("dashboard");

  const renderContent = () => {
    switch (activePage) {
      case "dashboard":
        return <div className="p-6">Applications Page</div>;
      case "jobs":
        return <div className="p-6">Applications Page</div>;
      case "applications":
        return <div className="p-6">Applications Page</div>;
      case "profile":
        return <div className="p-6">Applications Page</div>;
      case "saved":
        return <div className="p-6">Applications Page</div>;
      case "blog":
        return <div className="p-6">Applications Page</div>;
      default:
        return <div className="p-6">Applications Page</div>;
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

export default EmployerDashboardLayout;
