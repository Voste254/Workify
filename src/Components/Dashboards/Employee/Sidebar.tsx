import {
  LayoutDashboard,
  Search,
  FileText,
  User,
  Bookmark,
  BookOpen,
  Settings
} from "lucide-react";

interface Props {
  activePage: string;
  setActivePage: (page: string) => void;
}

const Sidebar = ({ activePage, setActivePage }: Props) => {
  const menu = [
    { name: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { name: "jobs", icon: Search, label: "Find Jobs" },
    { name: "applications", icon: FileText, label: "Applications" },
    { name: "profile", icon: User, label: "My Profile" },
    { name: "saved", icon: Bookmark, label: "Saved" },
    { name: "blog", icon: BookOpen, label: "Blogs" },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white hidden md:flex flex-col">
      <div className="p-6 text-2xl font-bold">Workify</div>

      {/* Main Menu */}
      <div className="flex-1 px-4">
        {menu.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.name}
              onClick={() => setActivePage(item.name)}
              className={`flex items-center gap-3 w-full p-3 rounded-lg text-left mb-2 
              ${activePage === item.name ? "bg-slate-700" : "hover:bg-slate-800"}`}
            >
              <Icon size={18} />
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Settings + Footer */}
      <div className="px-4 pb-6">
        <button
          onClick={() => setActivePage("settings")}
          className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-slate-800"
        >
          <Settings size={18} />
          Settings
        </button>

        <div className="mt-6 text-sm text-gray-400">
          Logged in as <span className="text-white">Job Seeker</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
