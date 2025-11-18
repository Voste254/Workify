import React, { useState } from "react";
import { Bell } from "lucide-react";

export const TopBar: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-end items-center h-14">
          <button
            aria-label="notifications"
            className="relative p-2 rounded-md hover:bg-gray-100"
          >
            <Bell className="text-gray-600" size={20} />
            <span className="absolute -top-0.5 -right-0.5 inline-block w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <div className="relative ml-4">
            <button
              onClick={() => setOpen((s) => !s)}
              className="flex items-center gap-2 p-1 rounded-md hover:bg-gray-100"
            >
              <img
                src="https://i.pravatar.cc/150?img=32"
                alt="avatar"
                className="w-10 h-10 rounded-full border border-gray-200"
              />
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-44 bg-white border rounded-md shadow-lg">
                <button className="block w-full text-left px-4 py-2 hover:bg-green-50">
                  Profile
                </button>
                <button className="block w-full text-left px-4 py-2 hover:bg-green-50">
                  Settings
                </button>
                <button className="block w-full text-left px-4 py-2 hover:bg-green-50">
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
