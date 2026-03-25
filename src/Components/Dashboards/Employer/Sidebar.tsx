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
  PanelLeftClose,
  PanelLeft
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
  const [collapsed, setCollapsed] = useState(false);

  const handleClick = (page: ActivePage) => {
    setActive(page);
    setActiveComponent(page);
  };

  const renderMenu = (menu: MenuItem[]) =>
    menu.map((item) => (
      <button
        key={item.name}
        onClick={() => handleClick(item.name)}
        title={collapsed ? item.name : undefined}
        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition ${
          active === item.name
            ? "bg-green-50 text-green-600 shadow-sm"
            : "text-gray-600 hover:bg-gray-100"
        } ${collapsed ? "justify-center px-0" : ""}`}
      >
        <item.icon
          size={20}
          className={`shrink-0 ${
            active === item.name
              ? "text-green-600"
              : "text-gray-400"
          }`}
        />
        {!collapsed && <span className="text-base font-medium truncate">{item.name}</span>}
      </button>
    ));

  return (
    <aside className={`h-screen bg-white border-r border-gray-200 shadow-sm flex flex-col transition-all duration-300 ${
      collapsed ? "w-20" : "w-64"
    } hidden md:flex`}>
      
      {/* LOGO */}
      <div className={`h-16 flex items-center border-b border-gray-100 ${
        collapsed ? "justify-center flex-col gap-2 py-2" : "justify-between px-6"
      }`}>
        {collapsed ? (
          <>
            <h2 className="text-2xl font-bold text-green-600 leading-none">W</h2>
            <button 
              onClick={() => setCollapsed(!collapsed)}
              className="text-gray-400 hover:text-green-600 transition-colors"
              title="Expand Sidebar"
            >
              <PanelLeft size={20} />
            </button>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-gray-800">Workify</h2>
            <button 
              onClick={() => setCollapsed(!collapsed)}
              className="text-gray-400 hover:text-green-600 transition-colors"
              title="Collapse Sidebar"
            >
              <PanelLeftClose size={20} />
            </button>
          </>
        )}
      </div>

      {/* MENU */}
      <nav className={`flex-1 overflow-y-auto ${collapsed ? "px-2" : "px-4"} py-4 space-y-6`}>
        
        {/* MAIN */}
        <div className="space-y-1">{renderMenu(mainMenu)}</div>

        {/* ANALYTICS */}
        <div>
          {!collapsed ? (
            <p className="text-sm text-gray-400 uppercase mb-2 font-semibold">
              Analytics
            </p>
          ) : (
            <div className="my-4 border-t border-gray-100 mx-2"></div>
          )}
          <div className="space-y-1">{renderMenu(analyticsMenu)}</div>
        </div>

        {/* COMMUNICATION */}
        <div>
          {!collapsed ? (
            <p className="text-sm text-gray-400 uppercase mb-2 font-semibold">
              Communication
            </p>
          ) : (
            <div className="my-4 border-t border-gray-100 mx-2"></div>
          )}
          <div className="space-y-1">{renderMenu(communicationMenu)}</div>
        </div>

        {/* OTHER */}
        <div>
          {!collapsed ? (
            <p className="text-sm text-gray-400 uppercase mb-2 font-semibold">
              Other
            </p>
          ) : (
            <div className="my-4 border-t border-gray-100 mx-2"></div>
          )}
          <div className="space-y-1">{renderMenu(otherMenu)}</div>
        </div>
      </nav>

      {/* FOOTER */}
      <div className={`p-4 text-sm text-gray-400 border-t border-gray-100 ${
        collapsed ? "text-center text-xs" : ""
      }`}>
        {collapsed ? "©" : `© ${new Date().getFullYear()} Workify`}
      </div>
    </aside>
  );
};

export default EmployerSidebar;