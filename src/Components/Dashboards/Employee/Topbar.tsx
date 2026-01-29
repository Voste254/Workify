import React, { useState } from 'react';
import { Bell, Menu, X, Briefcase, BookmarkIcon, User, Settings, LogOut } from 'lucide-react';

const Topbar: React.FC = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const notifications = [
    { id: 1, text: 'New job match: Senior Developer', time: '5 min ago', unread: true },
    { id: 2, text: 'Application viewed by TechCorp', time: '1 hour ago', unread: true },
    { id: 3, text: 'Interview scheduled', time: '2 hours ago', unread: false }
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-slate-200 shadow-sm">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Workify
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              <a href="#" className="text-slate-700 hover:text-indigo-600 font-medium transition-colors">
                Find Jobs
              </a>
              <a href="#" className="text-slate-700 hover:text-indigo-600 font-medium transition-colors">
                Companies
              </a>
              <a href="#" className="text-slate-700 hover:text-indigo-600 font-medium transition-colors">
                About
              </a>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                >
                  <Bell className="w-5 h-5 lg:w-6 lg:h-6" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
                    <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-indigo-50 to-purple-50">
                      <h3 className="font-semibold text-slate-900">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`p-4 hover:bg-slate-50 transition-colors border-b border-slate-100 ${
                            notif.unread ? 'bg-indigo-50/50' : ''
                          }`}
                        >
                          <p className="text-sm text-slate-900 mb-1">{notif.text}</p>
                          <p className="text-xs text-slate-500">{notif.time}</p>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 text-center border-t border-slate-200">
                      <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                        View All
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* User Profile */}
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-3 p-1.5 pr-3 rounded-full hover:bg-slate-100 transition-all"
                >
                  <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold shadow-lg">
                    JD
                  </div>
                  <span className="text-sm font-medium text-slate-700 hidden lg:block">John Doe</span>
                </button>

                {/* User Menu Dropdown */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
                    <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-indigo-50 to-purple-50">
                      <p className="font-semibold text-slate-900">John Doe</p>
                      <p className="text-xs text-slate-600">john@example.com</p>
                    </div>
                    <div className="py-2">
                      <a href="#" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors">
                        <User className="w-4 h-4 text-slate-600" />
                        <span className="text-sm text-slate-700">My Profile</span>
                      </a>
                      <a href="#" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors">
                        <BookmarkIcon className="w-4 h-4 text-slate-600" />
                        <span className="text-sm text-slate-700">Saved Jobs</span>
                      </a>
                      <a href="#" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors">
                        <Settings className="w-4 h-4 text-slate-600" />
                        <span className="text-sm text-slate-700">Settings</span>
                      </a>
                      <div className="border-t border-slate-200 my-2"></div>
                      <a href="#" className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors text-red-600">
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm font-medium">Log Out</span>
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="lg:hidden p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
              >
                {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="lg:hidden fixed inset-0 top-16 z-30 bg-white">
          <div className="container mx-auto px-4 py-6 space-y-1">
            <a href="#" className="block px-4 py-3 rounded-xl text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 font-medium transition-all">
              Find Jobs
            </a>
            <a href="#" className="block px-4 py-3 rounded-xl text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 font-medium transition-all">
              Companies
            </a>
            <a href="#" className="block px-4 py-3 rounded-xl text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 font-medium transition-all">
              About
            </a>
            <div className="border-t border-slate-200 my-4"></div>
            <a href="#" className="block px-4 py-3 rounded-xl text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 font-medium transition-all">
              My Profile
            </a>
            <a href="#" className="block px-4 py-3 rounded-xl text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 font-medium transition-all">
              Saved Jobs
            </a>
            <a href="#" className="block px-4 py-3 rounded-xl text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 font-medium transition-all">
              Settings
            </a>
            <a href="#" className="block px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 font-medium transition-all">
              Log Out
            </a>
          </div>
        </div>
      )}
    </>
  );
};

export default Topbar;