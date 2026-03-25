import { Bell, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import NotificationModal from "./NotificationModal";

const TopBar = () => {
  const [open, setOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Detect current dashboard
  const isEmployer = location.pathname.includes("Employer");

  const handleLogout = () => {
    navigate("/");
  };

  const switchToEmployer = () => {
    navigate("/EmployerDashboard");
    setIsMobileMenuOpen(false);
  };

  const switchToJobSeeker = () => {
    navigate("/jobs");
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="h-16 bg-white border-b flex items-center justify-between px-6 relative z-50">
      
      {/* Title */}
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      {/* Mobile Hamburger Button */}
      <button 
        className="md:hidden p-2 text-gray-600 hover:text-black"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Desktop items */}
      <div className="hidden md:flex items-center gap-6">

        {/* Dashboard Toggle */}
        <div className="flex bg-gray-200 rounded-full p-2">
          <button
            onClick={switchToJobSeeker}
            className={`px-4 py-1 rounded-full text-base font-medium transition ${
              !isEmployer
                ? "bg-white shadow text-black"
                : "text-gray-500"
            }`}
          >
            Job Seeker
          </button>

          <button
            onClick={switchToEmployer}
            className={`px-4 py-1 rounded-full text-base font-medium transition ${
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
          className="relative text-gray-600 hover:text-black"
        >
          <Bell />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-sm px-1 rounded-full">
            3
          </span>
        </button>

        {/* Logout */}
        <button
          className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium"
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

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white border-b shadow-lg p-6 flex flex-col gap-6 md:hidden">
          
          <div className="flex bg-gray-200 rounded-full p-1 justify-center">
            <button
              onClick={switchToJobSeeker}
              className={`flex-1 px-4 py-2 rounded-full text-base font-medium transition ${
                !isEmployer
                  ? "bg-white shadow text-black"
                  : "text-gray-500"
              }`}
            >
              Job Seeker
            </button>
            <button
              onClick={switchToEmployer}
              className={`flex-1 px-4 py-2 rounded-full text-base font-medium transition ${
                isEmployer
                  ? "bg-white shadow text-black"
                  : "text-gray-500"
              }`}
            >
              Employer
            </button>
          </div>

          <div className="flex items-center justify-between border-t pt-4">
            <div className="flex items-center gap-3">
              <img
                src="https://i.pravatar.cc/40"
                className="w-10 h-10 rounded-full"
                alt="User"
              />
              <span className="font-medium text-gray-800">My Profile</span>
            </div>
            <button
              onClick={() => {
                setOpen(!open);
                setIsMobileMenuOpen(false);
              }}
              className="relative p-2 bg-gray-100 rounded-full text-gray-600"
            >
              <Bell size={20} />
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1.5 rounded-full">
                3
              </span>
            </button>
          </div>

          <button
            className="flex items-center justify-center gap-2 text-red-600 border border-red-200 bg-red-50 py-3 rounded-lg hover:bg-red-100 font-medium"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      )}

      {open && <NotificationModal />}
    </div>
  );
};

export default TopBar;