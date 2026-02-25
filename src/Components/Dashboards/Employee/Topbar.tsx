import { Bell, LogOut } from "lucide-react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import NotificationModal from "./NotificationModal";

const TopBar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Detect current dashboard
  const isEmployer = location.pathname.includes("Employer");

  const handleLogout = () => {
    navigate("/");
  };

  const switchToEmployer = () => {
    navigate("/EmployerDashboard");
  };

  const switchToJobSeeker = () => {
    navigate("/jobs");
  };

  return (
    <div className="h-16 bg-white border-b flex items-center justify-between px-6 relative">
      
      {/* Title */}
      <h1 className="text-xl font-semibold">Dashboard</h1>

      <div className="flex items-center gap-6">

        {/* Dashboard Toggle */}
        <div className="flex bg-gray-200 rounded-full p-2">
          <button
            onClick={switchToJobSeeker}
            className={`px-4 py-1 rounded-full text-sm font-medium transition ${
              !isEmployer
                ? "bg-white shadow text-black"
                : "text-gray-500"
            }`}
          >
            Job Seeker
          </button>

          <button
            onClick={switchToEmployer}
            className={`px-4 py-1 rounded-full text-sm font-medium transition ${
              isEmployer
                ? "bg-white shadow text-black"
                : "text-gray-500"
            }`}
          >
            Employer
          </button>
        </div>

        {/* Notifications */}
        <button
          onClick={() => setOpen(!open)}
          className="relative"
        >
          <Bell />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
            3
          </span>
        </button>

        {/* Logout */}
        <button
          className="flex items-center gap-2 text-red-600 hover:text-red-700"
          onClick={handleLogout}
        >
          <LogOut size={18} />
          Logout
        </button>

        {/* Avatar */}
        <img
          src="https://i.pravatar.cc/40"
          className="w-9 h-9 rounded-full"
          alt="User"
        />
      </div>

      {open && <NotificationModal />}
    </div>
  );
};

export default TopBar;