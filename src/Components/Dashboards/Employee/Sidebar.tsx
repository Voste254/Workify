import {
  LayoutDashboard,
  Search,
  FileText,
  User,
  Bookmark,
  BookOpen,
  Settings,
  Sparkles,
  PanelLeftClose,
  PanelLeft
} from "lucide-react";
import { useState } from "react";

interface Props {
  activePage: string;
  setActivePage: (page: string) => void;
}

const Sidebar = ({ activePage, setActivePage }: Props) => {
  const [collapsed, setCollapsed] = useState(false);

  const menu = [
    { name: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { name: "jobs", icon: Search, label: "Find Jobs" },
    { name: "applications", icon: FileText, label: "Applications" },
    { name: "profile", icon: User, label: "My Profile" },
    { name: "saved", icon: Bookmark, label: "Saved" },
    { name: "blog", icon: BookOpen, label: "Blogs" },
    { name: "workify-ai", icon: Sparkles, label: "Workify AI" },
  ];

  return (
    <div 
      className={`bg-slate-900 text-white hidden md:flex flex-col transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <div className={`p-6 flex items-center ${collapsed ? "justify-center flex-col gap-4" : "justify-between"}`}>
        {collapsed ? (
          <>
            <span className="text-3xl font-bold text-green-500">W</span>
            <button 
              onClick={() => setCollapsed(!collapsed)}
              className="text-gray-400 hover:text-white"
              title="Expand Sidebar"
            >
              <PanelLeft size={20} />
            </button>
          </>
        ) : (
          <>
            <span className="text-3xl font-bold">Workify</span>
            <button 
              onClick={() => setCollapsed(!collapsed)}
              className="text-gray-400 hover:text-white"
              title="Collapse Sidebar"
            >
              <PanelLeftClose size={20} />
            </button>
          </>
        )}
      </div>

      {/* Main Menu */}
      <div className="flex-1 px-4 mt-2">
        {menu.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.name}
              onClick={() => setActivePage(item.name)}
              title={collapsed ? item.label : undefined}
              className={`flex items-center gap-3 w-full p-3 rounded-lg text-left mb-2 transition-colors
              ${activePage === item.name ? "bg-slate-700" : "hover:bg-slate-800"}
              ${collapsed ? "justify-center" : ""}`}
            >
              <Icon size={20} className="shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}
      </div>

      {/* Settings + Footer */}
      <div className="px-4 pb-6 mt-auto">
        <button
          onClick={() => setActivePage("settings")}
          title={collapsed ? "Settings" : undefined}
          className={`flex items-center gap-3 w-full p-3 rounded-lg transition-colors hover:bg-slate-800
          ${activePage === "settings" ? "bg-slate-700" : ""}
          ${collapsed ? "justify-center" : ""}`}
        >
          <Settings size={20} className="shrink-0" />
          {!collapsed && <span>Settings</span>}
        </button>

        {!collapsed && (
          <div className="mt-6 text-base text-gray-400 text-center">
            Logged in as <span className="text-white block font-medium">Job Seeker</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
