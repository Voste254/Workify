import React from 'react';
import { Bell } from 'lucide-react';

const Topbar: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900">Workify</h1>
          </div>

          {/* Right side - Notifications and Profile */}
          <div className="flex items-center space-x-4">
            {/* Notification Bell */}
            <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Profile Picture */}
            <button className="flex items-center space-x-2 hover:bg-gray-100 rounded-full p-1 transition-colors">
              <img
                src="https://ui-avatars.com/api/?name=User&background=10b981&color=fff"
                alt="User Profile"
                className="w-10 h-10 rounded-full border-2 border-gray-200"
              />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;