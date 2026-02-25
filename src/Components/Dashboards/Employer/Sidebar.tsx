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

type SidebarProps = {
  setActiveComponent: (page: ActivePage) => void;
};

type MenuItem = {
  name: ActivePage;
  icon: React.ElementType;
};

const mainMenu: MenuItem[] = [
  { name: "Dashboard", icon: LayoutDashboard },
  { name: "My Jobs", icon: Briefcase },
  { name: "Post Job", icon: PlusCircle },
  { name: "Applicants", icon: Users },
  { name: "Find Talent", icon: Search },
];

const analyticsMenu: MenuItem[] = [
  { name: "Reports", icon: BarChart3 },
];

const communicationMenu: MenuItem[] = [
  { name: "Messages", icon: MessageSquare },
  { name: "Notifications", icon: Bell },
];

const otherMenu: MenuItem[] = [
  { name: "Saved", icon: Bookmark },
  { name: "Blog", icon: FileText },
  { name: "Settings", icon: Settings },
];

const EmployerSidebar = ({ setActiveComponent }: SidebarProps) => {
  const [active, setActive] = useState<ActivePage>("Dashboard");

  const handleClick = (page: ActivePage) => {
    setActive(page);
    setActiveComponent(page);
  };

  const renderMenu = (menu: MenuItem[]) =>
    menu.map((item) => (
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
        <span className="text-sm font-medium">{item.name}</span>
      </button>
    ));

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 shadow-sm flex flex-col">
      
      {/* LOGO */}
      <div className="h-16 flex items-center px-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-800">Workify</h2>
      </div>

      {/* MENU */}
      <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
        
        {/* MAIN */}
        <div className="space-y-1">{renderMenu(mainMenu)}</div>

        {/* ANALYTICS */}
        <div>
          <p className="text-xs text-gray-400 uppercase mb-2 font-semibold">
            Analytics
          </p>
          <div className="space-y-1">{renderMenu(analyticsMenu)}</div>
        </div>

        {/* COMMUNICATION */}
        <div>
          <p className="text-xs text-gray-400 uppercase mb-2 font-semibold">
            Communication
          </p>
          <div className="space-y-1">{renderMenu(communicationMenu)}</div>
        </div>

        {/* OTHER */}
        <div>
          <p className="text-xs text-gray-400 uppercase mb-2 font-semibold">
            Other
          </p>
          <div className="space-y-1">{renderMenu(otherMenu)}</div>
        </div>
      </nav>

      {/* FOOTER */}
      <div className="p-4 text-xs text-gray-400 border-t border-gray-100">
        © {new Date().getFullYear()} Workify
      </div>
    </aside>
  );
};

export default EmployerSidebar;