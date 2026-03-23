// 
import { useState } from "react";
import { User, Bell, Shield, Clock, Eye } from "lucide-react";

import AccountSettings from "./AccountSetting";
import SecuritySettings from "./SecuritySettings";
import NotificationSettings from "./NotificationSettings";
import ActivityLog from "./ActivityLog";
import PrivacySettings from "./PrivacySettings";

type Tab = "account" | "security" | "notifications" | "activity" | "privacy";

const JobSeekerSettings = () => {
  const [tab, setTab] = useState<Tab>("account");

  const menu = [
    { key: "account", icon: User, title: "Account", desc: "Profile & preferences" },
    { key: "security", icon: Shield, title: "Security", desc: "Password & protection" },
    { key: "notifications", icon: Bell, title: "Notifications", desc: "Alerts & emails" },
    { key: "activity", icon: Clock, title: "Activity Log", desc: "Recent actions" },
    { key: "privacy", icon: Eye, title: "Privacy", desc: "Profile visibility" },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-semibold text-gray-800 mb-6">Settings</h1>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-1/4 bg-white rounded-2xl shadow-sm p-4">
            {menu.map(({ key, icon: Icon, title, desc }) => (
              <button
                key={key}
                onClick={() => setTab(key as Tab)}
                className={`w-full flex gap-3 p-3 rounded-xl mb-2 text-left transition ${
                  tab === key
                    ? "bg-green-100 text-green-600"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <Icon size={18} />
                <div>
                  <p className="font-medium">{title}</p>
                  <p className="text-base text-gray-500">{desc}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 bg-white rounded-2xl shadow-sm p-8">
            {tab === "account" && <AccountSettings />}
            {tab === "security" && <SecuritySettings />}
            {tab === "notifications" && <NotificationSettings />}
            {tab === "activity" && <ActivityLog />}
            {tab === "privacy" && <PrivacySettings />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSeekerSettings;