import { Bell, LogOut, Menu, X, User } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import NotificationModal from "./NotificationModal";
import { useAuth } from "../../../contexts/AuthContext";

const TopBar = () => {
  const [open, setOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const { profile, signOut } = useAuth();

  // Detect current dashboard
  const isEmployer = location.pathname.includes("Employer");

  // Check if the user has both roles
  const hasBothRoles = profile?.role?.includes("seeker") && profile?.role?.includes("employer");

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const switchToEmployer = () => {
    navigate("/EmployerDashboard");
    setIsMobileMenuOpen(false);
  };

  const switchToJobSeeker = () => {
    navigate("/dashboard");
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

        {/* Dashboard Toggle - Only show if user has both roles */}
        {hasBothRoles && (
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
        )}

        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setOpen(!open)}
            className="relative text-gray-600 hover:text-black flex items-center"
          >
            <Bell size={24} />
            <span className="absolute top-0 right-0 h-2.5 w-2.5 bg-red-500 border-2 border-white rounded-full"></span>
          </button>
          {open && <NotificationModal />}
        </div>

        {/* Logout */}
        <button
          className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium"
          onClick={handleLogout}
        >
          <LogOut size={18} />
          Logout
        </button>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-600">
          <User size={18} />
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white border-b shadow-lg p-6 flex flex-col gap-6 md:hidden">
          
          {hasBothRoles && (
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
          )}

          <div className="flex items-center justify-between border-t pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-600">
                <User size={20} />
              </div>
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
              <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 border border-white rounded-full"></span>
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

    </div>
  );
};

export default TopBar;