import {
  LayoutDashboard,
  Briefcase,
  PlusCircle,
  Users,
  Search,
  BarChart3,
  MessageSquare,
  Bell,
  Bookmark,
  Settings,
  FileText,
} from "lucide-react";
import { useState } from "react";

type SidebarProps = {
  setActiveComponent: (name: string) => void;
};

const EmployerSidebar = ({ setActiveComponent }: SidebarProps) => {
  const [active, setActive] = useState<string>("Dashboard");

  const menu = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "My Jobs", icon: Briefcase },
    { name: "Post Job", icon: PlusCircle },
    { name: "Applicants", icon: Users },
    { name: "Find Talent", icon: Search },
    { divider: true, label: "Analytics" },
    { name: "Reports", icon: BarChart3 },
    { divider: true, label: "Communication" },
    { name: "Messages", icon: MessageSquare },
    { name: "Notifications", icon: Bell },
    { divider: true, label: "Other" },
    { name: "Saved", icon: Bookmark },
    { name: "Blog", icon: FileText },
    { name: "Settings", icon: Settings },
  ];

  const handleClick = (name: string) => {
    setActive(name);
    setActiveComponent(name);
  };

  return (
    <aside className="w-64 h-screen bg-white shadow-md flex flex-col border-r border-gray-200">
      {/* LOGO */}
      <div className="h-16 flex items-center px-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-800">Workify</h2>
      </div>

      {/* MENU */}
      <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
        {menu.map((item, index) =>
          item.divider ? (
            <div
              key={index}
              className="mt-4 mb-2 text-xs font-semibold text-gray-400 uppercase"
            >
              {item.label}
            </div>
          ) : (
            <button
              key={item.name}
              onClick={() => handleClick(item.name)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                active === item.name
                  ? "bg-green-50 text-green-600 shadow-sm"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <item.icon
                size={18}
                className={
                  active === item.name
                    ? "text-green-600"
                    : "text-gray-400"
                }
              />
              <span className="text-sm font-medium">
                {item.name}
              </span>
            </button>
          )
        )}
      </nav>

      {/* FOOTER */}
      <div className="p-4 text-xs text-gray-400 border-t border-gray-100">
        © {new Date().getFullYear()} Workify
      </div>
    </aside>
  );
};

export default EmployerSidebar;