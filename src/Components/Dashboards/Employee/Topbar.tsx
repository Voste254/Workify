import { Bell } from "lucide-react";
import { useState } from "react";
import NotificationModal from "./NotificationModal";

const TopBar = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="h-16 bg-white border-b flex items-center justify-between px-6 relative">
      <h1 className="text-xl font-semibold">Dashboard</h1>

      <div className="flex items-center gap-6">
        <button onClick={() => setOpen(!open)} className="relative">
          <Bell />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
            3
          </span>
        </button>

        <img
          src="https://i.pravatar.cc/40"
          className="w-9 h-9 rounded-full cursor-pointer"
        />
      </div>

      {open && <NotificationModal />}
    </div>
  );
};

export default TopBar;
